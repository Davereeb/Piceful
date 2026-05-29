# Piceful

**AI-powered photography coaching app — get the perfect shot, every time.**

Piceful helps you recreate any reference photo in real time. Upload a photo you love, point your camera, and get live pose-matching guidance powered by on-device AI and cloud vision coaching.

**Try it now:** [piceful.vercel.app](https://piceful.vercel.app/index.html)
**Learn more:** [piceful-website.vercel.app](https://piceful-website.vercel.app)

---

## Features

### Live AI-Guided Sessions
- **Ghost overlay** — semi-transparent reference image on your live camera feed with adjustable opacity
- **Real-time pose matching** — TensorFlow.js (MoveNet) computes body alignment using Intersection over Union (IoU), showing a live match percentage
- **Direction hints** — contextual guidance like "Move left", "Step back", "Step closer" based on pose offset
- **AI coaching** — Qwen-VL-Max vision-language model provides natural-language tips ("Tilt your chin down", "Shift weight to left foot")
- **Composition grid** — toggleable rule-of-thirds overlay for framing

### Smart Capture
- **Auto-crop** — captured photos are automatically cropped to match the reference image's aspect ratio
- **Side-by-side comparison** — compare your shot against the reference before saving
- **Haptic feedback** — phone vibrates when you hit a good pose match

### Skeleton Overlay
- **17-keypoint body tracking** — color-coded dots and bones show exactly where to adjust
- Green (close match), orange (getting there), red (needs work), gray (not detected)

### Collections (Cloud)
- **Organize reference photos** into named collections
- **Tag system** — label images (travel, couple, family) and filter
- **Cloud storage** — images stored in Supabase, accessible across devices

### Gallery
- **Local photo gallery** — all captured photos saved to your device
- **Lightbox viewer** — full-screen viewing with pinch-to-zoom
- **Share** — via Web Share API

### Authentication
- **Supabase Auth** — login, register, auto-session persistence
- **Freemium model** — 3 free sessions without account, 5/month with account
- **Subscription tiers** — 7-Day Pass ($2.99) and Annual Pro ($19.99/year)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML / CSS / JS (single-file, no build step) |
| Pose Detection | TensorFlow.js + MoveNet (17 keypoints, ~10fps) |
| Face Detection | BlazeFace |
| Camera | WebRTC getUserMedia |
| Cloud AI | Qwen-VL-Max via DashScope API |
| Auth & Database | Supabase (PostgreSQL + RLS) |
| Cloud Storage | Supabase Storage |
| Hosting | Vercel |

---

## Project Structure

```
├── web/
│   └── index.html          # The entire frontend app (~2600 lines)
├── backend/
│   ├── api/
│   │   └── analyze.js      # Vercel serverless function (vision API)
│   ├── lib/
│   │   ├── prompt.js        # AI prompt templates
│   │   └── validate.js      # Response validation
│   ├── vercel.json          # Vercel config (regions: hkg1, sin1)
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- A modern browser with camera access (Chrome, Safari recommended)
- HTTPS required for camera on iOS

### Run Locally
```bash
# Serve the frontend
cd web
npx serve .

# Backend (requires QWEN_API_KEY in .env)
cd backend
npm install
node server.js
```

### Environment Variables
```
QWEN_API_KEY=your_dashscope_api_key
```

---

## Design

Paper-cut illustration style with a warm, artisanal palette:
- **Cream** `#f3e5d3` — background
- **Peach** `#f1a679` — accents
- **Sage** `#7a8a6a` — success states
- **Terracotta** `#e8763a` — primary actions
- **Typography** — Cormorant Garamond (headings) + EB Garamond (body)

---

## License

All rights reserved.
