import { createRequire } from 'module';
import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import { validateInstructions } from '../lib/validate.js';
import { buildPrompt, buildStrictPrompt } from '../lib/prompt.js';

const FALLBACK = { photographer: 'Adjust camera', subject: 'Hold position', matchScore: 0 };
const EXTRACT_FALLBACK = {
  boundingBox: { x: 0.2, y: 0.1, width: 0.6, height: 0.8 },
  description: 'Subject detected',
};

const openai = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
});

function isValidBase64(str) {
  if (typeof str !== 'string' || str.length === 0) return false;
  return /^[A-Za-z0-9+/\n\r]+=*$/.test(str);
}

async function callVisionAnalyze(referenceImage, liveFrame, systemPrompt) {
  const response = await openai.chat.completions.create({
    model: 'qwen-vl-max',
    max_tokens: 150,
    timeout: 5000,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${referenceImage}` } },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${liveFrame}` } },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content.trim();
  return JSON.parse(text);
}

async function callVisionExtract(referenceImage) {
  const extractPrompt =
    "Analyze this image. Find the main subject. Return ONLY valid JSON: " +
    "{ \"boundingBox\": { \"x\": <0-1>, \"y\": <0-1>, \"width\": <0-1>, \"height\": <0-1> }, " +
    "\"description\": \"<10 words max describing subject position>\" } " +
    "x,y is top-left corner of subject. All values normalized 0-1.";

  const response = await openai.chat.completions.create({
    model: 'qwen-vl-max',
    max_tokens: 150,
    timeout: 5000,
    messages: [
      { role: 'system', content: extractPrompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${referenceImage}` } },
        ],
      },
    ],
  });

  const text = response.choices[0].message.content.trim();
  return JSON.parse(text);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.body || {};

  // --- Type A: extract ---
  if (type === 'extract') {
    const { referenceImage } = req.body;
    if (!referenceImage) {
      return res.status(400).json({ error: 'Missing referenceImage' });
    }
    if (!isValidBase64(referenceImage)) {
      return res.status(400).json({ error: 'Invalid image data' });
    }

    try {
      const parsed = await callVisionExtract(referenceImage);
      const box = parsed.boundingBox;
      if (
        box &&
        typeof box.x === 'number' &&
        typeof box.y === 'number' &&
        typeof box.width === 'number' &&
        typeof box.height === 'number'
      ) {
        return res.status(200).json({
          boundingBox: box,
          description: String(parsed.description || '').slice(0, 60),
        });
      }
      return res.status(200).json(EXTRACT_FALLBACK);
    } catch (error) {
      console.error('Extract error:', error.message);
      return res.status(200).json(EXTRACT_FALLBACK);
    }
  }

  // --- Type B: analyze (default) ---
  const { referenceImage, liveFrame, language } = req.body || {};

  if (!referenceImage || !liveFrame || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!isValidBase64(referenceImage) || !isValidBase64(liveFrame)) {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  try {
    // First attempt
    let parsed = await callVisionAnalyze(referenceImage, liveFrame, buildPrompt());
    let matchScore = Number.isInteger(parsed.matchScore) ? parsed.matchScore : 0;
    let result = validateInstructions(parsed.photographer, parsed.subject);

    if (result.valid) {
      return res.status(200).json({
        photographer: parsed.photographer.trim(),
        subject: parsed.subject.trim(),
        matchScore,
      });
    }

    // Retry with strict prompt
    parsed = await callVisionAnalyze(referenceImage, liveFrame, buildStrictPrompt());
    matchScore = Number.isInteger(parsed.matchScore) ? parsed.matchScore : 0;
    result = validateInstructions(parsed.photographer, parsed.subject);

    if (result.valid) {
      return res.status(200).json({
        photographer: parsed.photographer.trim(),
        subject: parsed.subject.trim(),
        matchScore,
      });
    }

    // Both attempts failed validation
    return res.status(200).json(FALLBACK);
  } catch (error) {
    if (
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNABORTED' ||
      error?.status === 408 ||
      error.message?.includes('timeout') ||
      error?.status === 400 ||
      error.message?.includes('image format')
    ) {
      return res.status(200).json(FALLBACK);
    }
    console.error('UNHANDLED ERROR:', error.message, error.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
