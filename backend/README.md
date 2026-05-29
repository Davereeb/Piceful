# FrameMatch Backend

## Local Development

```bash
cd backend
npm install
vercel dev
```

## Deploy

```bash
vercel --prod
```

## Test

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"referenceImage":"iVBORw0KGgo=","liveFrame":"iVBORw0KGgo=","language":"en"}'
```

## Environment Variables

Set `OPENAI_API_KEY` in the Vercel dashboard:

1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add `OPENAI_API_KEY` with your OpenAI API key
4. Redeploy for changes to take effect
