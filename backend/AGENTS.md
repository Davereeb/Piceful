# AGENTS.md — Branch 1: Backend
# Claude Code instructions for phase/backend branch only.

## Your Scope
You are responsible for the /backend directory only.
Do not generate any Swift, SwiftUI, or Xcode-related code.
Do not modify API_CONTRACT.md.

## What This Branch Delivers
A fully working, deployed Vercel backend that:
- Accepts POST /api/analyze with two base64 images
- Calls GPT-4o vision API
- Returns validated English instructions (<=18 chars each)
- Handles errors gracefully with fallback values

## Reference
Read API_CONTRACT.md (project root) before writing any code.
All request/response shapes must match it exactly.

## Tech Stack
- Node.js 18+, ES Modules ("type": "module")
- Vercel Serverless Functions
- openai npm package only
- No Express, no Fastify, no database, no auth

## Directory Structure to Create
```
/backend
  /api
    analyze.js
  /lib
    validate.js
    prompt.js
  package.json
  vercel.json
  .env.example
  README.md
```

---

## Task B1 — /backend/lib/validate.js

Export:
```javascript
export const BANNED_WORDS = [
  'focal length', 'aperture', 'rule of thirds', 'bokeh',
  'exposure', 'iso', 'shutter speed', 'depth of field', 'composition'
];

export function validateInstructions(photographer, subject) {
  // 1. Both fields present and non-empty
  // 2. Each field <= 18 characters (trim first)
  // 3. No banned words (case-insensitive)
  // Returns { valid: true } or { valid: false, reason: "..." }
}
```

## Task B2 — /backend/lib/prompt.js

Export:
```javascript
export function buildPrompt() {
  // System prompt for GPT-4o:
  // - Return ONLY valid JSON: { "photographer": "...", "subject": "..." }
  // - Each field: 18 English characters maximum
  // - No banned words (embed the list)
  // - photographer: how to move the camera
  // - subject: how the person should pose or move
}

export function buildStrictPrompt() {
  // Same as buildPrompt() plus:
  // "Your previous response was too long or contained a banned word.
  //  Use shorter, simpler words. Maximum 18 characters per field."
}
```

## Task B3 — /backend/api/analyze.js

Implement POST /api/analyze:
1. Validate fields present → 400 if missing
2. Build GPT-4o messages with two base64 image inputs
3. Call GPT-4o with buildPrompt()
4. Parse JSON response
5. Run validateInstructions()
6. If invalid: retry once with buildStrictPrompt()
7. If still invalid: return fallback
   { photographer: "Adjust camera", subject: "Hold position", matchScore: 0 }
8. Return validated result

Error handling:
- Timeout >5s → return fallback, no 500
- Invalid base64 → 400 { error: "Invalid image data" }
- Missing fields → 400 { error: "Missing required fields" }
- Other errors → 500 { error: "Internal server error" }

```javascript
export default async function handler(req, res) { ... }
```

## Task B4 — /backend/api/analyze.js — Retry Logic

Add inside analyze.js (after B3 is working):
- Max 2 GPT-4o calls per request
- First call: buildPrompt()
- If validateInstructions fails: second call with buildStrictPrompt()
- If second call also fails: return fallback

## Task B5 — Configuration Files

package.json:
```json
{
  "name": "framematch-backend",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=18" },
  "dependencies": { "openai": "latest" }
}
```

vercel.json:
```json
{
  "functions": {
    "api/analyze.js": { "maxDuration": 15 }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
      ]
    }
  ]
}
```

.env.example:
```
OPENAI_API_KEY=your_openai_api_key_here
```

README.md — include:
- Local dev: `vercel dev`
- Deploy: `vercel --prod`
- Test curl command
- How to set OPENAI_API_KEY in Vercel dashboard

---

## After Every Task
Tell me:
1. Which files were created or modified
2. The exact curl command to test locally
3. Whether any environment variables need to be set

## Branch Completion Criteria
This branch is ready to merge to main when:
- [ ] `vercel dev` runs without errors
- [ ] curl test returns 200 with photographer and subject fields
- [ ] Both fields are 18 characters or fewer
- [ ] Both fields contain no banned words
- [ ] `vercel --prod` deployed successfully
- [ ] You have the live Vercel URL ready to paste into iOS Constants.swift

## Do Not
- Generate any Swift code
- Implement user auth or sessions
- Add any npm packages other than openai
- Modify API_CONTRACT.md
