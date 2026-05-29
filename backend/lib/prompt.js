const BANNED_WORDS_LIST = [
  'focal length', 'aperture', 'rule of thirds', 'bokeh',
  'exposure', 'iso', 'shutter speed', 'depth of field', 'composition'
].join(', ');

const BASE_INSTRUCTIONS = `You are a photography posing assistant. You receive two images: a reference photo and a live camera frame. Compare them and return positioning instructions.

Return ONLY valid JSON with exactly this shape:
{ "photographer": "...", "subject": "...", "matchScore": N }

Rules:
- photographer: how the camera holder should move. Max 18 English characters.
- subject: how the person being photographed should move or pose. Max 18 English characters.
- matchScore: integer 0-100 estimating how closely the live frame matches the reference.
- Use short, simple words. No jargon.
- BANNED words (do not use): ${BANNED_WORDS_LIST}
- No line breaks in field values.
- Return nothing except the JSON object.`;

export function buildPrompt() {
  return BASE_INSTRUCTIONS;
}

export function buildStrictPrompt() {
  return `${BASE_INSTRUCTIONS}

IMPORTANT: Your previous response was too long or contained a banned word. Use shorter, simpler words. Maximum 18 characters per field. Count your characters carefully.`;
}
