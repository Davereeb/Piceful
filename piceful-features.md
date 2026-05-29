# Piceful — Complete Feature Inventory

## 1. Home Screen

- Hero illustration with animated camera graphic
- "New Session" button — starts a new AI-guided photo session
- "My Collections" button — opens saved reference photo collections (requires login)
- "Login / Register" button — toggles to auth screens
- Tagline: "AI Photography Assistant — Get the perfect shot, every time."

## 2. Reference Image Upload

- File picker — tap to select a photo from your device's gallery
- URL input — paste any image URL to use as a reference (fetches via proxy to handle CORS)
- Collections picker — choose a previously saved reference image from your cloud collections
- Image preview — shows the selected reference before entering the session
- Automatic pose detection — runs MoveNet on the reference image immediately after upload to extract 17 body keypoints and a bounding box

## 3. Live AI-Guided Session (Core Feature)

This is the heart of Piceful. Once a reference is loaded:

### Ghost Overlay

- Semi-transparent reference image overlaid on the live camera feed
- Adjustable opacity slider (0–100%) so the subject can see both the reference and themselves
- Properly aspect-ratio scaled — if the reference has a different aspect ratio than the camera, it is centered with letterboxing

### Real-Time Pose Matching (IoU)

- Computes Intersection over Union between the reference bounding box and the live detected body bounding box
- Boosted display score: uses a square-root curve so displayed percentages feel more achievable (e.g., raw 60% shows as approximately 77%)
- Three match zones:
    - Match (raw >= 65%) — vibrates the phone
    - Close (raw 30–65%)
    - Off (raw < 30%)
- Status bar shows "xx% Match" in real time

### Direction Hints

- Computed from bounding box offset comparison
- Guides like "Move left", "Step back", "Move right", "Step closer"
- Displayed contextually based on where the subject needs to adjust

### Composition Grid

- Toggle-able rule-of-thirds grid overlay on the camera feed
- Helps users frame shots with standard photography composition rules

### Camera Controls

- Flip camera — switches between front and rear cameras
- Capture button — takes a snapshot of the current frame for comparison
- Back button — exits the session

## 4. Premium Skeleton Overlay

- Color-coded keypoint dots drawn on the reference image positions (not the live feed)
- Uses MoveNet's 17 keypoints; face keypoints (0–4) are hidden to avoid visual clutter at the head
- Per-keypoint distance matching against live pose:
    - Green — within 5% of screen diagonal (close match)
    - Orange — within 12% (getting close)
    - Red — beyond 12% (needs adjustment)
    - Gray — keypoint not detected in live feed
- Skeleton bones connecting keypoints, colored by the worst-matching endpoint
- Rendered at 85% opacity with rounded line caps
- Toggle button in the session toolbar to enable/disable
- Trial-based access system with premium unlock

## 5. Side-by-Side Comparison

- After capturing a photo, shows reference image and your captured shot side by side
- Allows visual comparison to see how closely you matched
- Options to retake or save to gallery

## 6. Gallery and Lightbox

- Gallery screen showing all captured photos from sessions
- Lightbox viewer — tap any image to see it full-screen with pinch-to-zoom
- Delete individual photos
- Share functionality (via Web Share API where supported)

## 7. Subscription / Monetization (Freemium Model)

- Subscribe screen with three pricing tiers:
    - Free — 3 sessions without account, 5 per month with account
    - 7-Day Pass — $2.99, unlimited sessions for a week (targeted at travelers)
    - Annual — $19.99 per year, unlimited everything
- Session counter tracks remaining free sessions
- Paywall gate — when sessions run out, redirects to subscribe screen

## 8. Authentication

- Login screen with email and password
- Register screen with email, password, and confirmation
- Supabase Auth integration — handles JWT tokens, session persistence
- Auto-login on app load if session exists in localStorage
- Logout functionality with session cleanup
- Auth-gated features: Collections, cloud storage, extended free sessions

## 9. Collections (Cloud Storage)

Full CRUD for organizing reference photos:

### Collection Management

- Create collection — name a new folder for reference images
- Rename collection — long-press or context menu to rename
- Delete collection — removes collection and all images within it
- List collections — grid view of all user collections with cover thumbnails

### Image Management Within Collections

- Add images to a collection (upload from device or URL)
- Remove images from a collection
- Use as reference — tap any collection image to start a session with it
- Supabase Storage — images stored in cloud buckets tied to user ID

## 10. Tags System

- Tag images with custom labels (e.g., "travel", "couple", "family")
- Filter by tag in collections view
- Add/remove tags via image detail or context menu
- Stored in Supabase alongside image metadata

## 11. UI / UX Features

- Mobile-first responsive design — optimized for smartphone screens
- Safe area insets — respects notch/dynamic island via CSS environment variables
- Context menus — long-press actions on images and collections
- Action sheets — bottom-sliding modal menus for options
- Toast notifications — brief feedback messages for actions
- Loading states — spinners and skeleton screens during async operations
- Smooth transitions — CSS animations between screens
- Pull-to-refresh style interactions
- Bottom navigation — screen-to-screen navigation with back gestures

## 12. AI / Cloud Vision Coaching

- Qwen-VL-Max multimodal vision-language model integration
- Sends the live camera frame plus reference image to the cloud API
- Returns natural-language coaching instructions (e.g., "Tilt your chin slightly down", "Shift your weight to the left foot")
- Triggered on-demand or periodically during sessions
- Cost: approximately $0.003 per API call

## 13. Technical Infrastructure

- Pose detection: TensorFlow.js + MoveNet — 17-keypoint body estimation at approximately 10fps
- Face detection: BlazeFace — face bounding box detection
- Camera: WebRTC getUserMedia — live camera feed access
- Auth and DB: Supabase — user accounts, collections, metadata
- Storage: Supabase Storage — cloud image storage
- Cloud AI: Qwen-VL-Max — vision-language coaching
- Hosting: Vercel — static deployment at piceful.vercel.app
- Framework: Vanilla HTML/CSS/JS — no framework dependencies, single-file app

The app is a single index.html file (approximately 2600+ lines) with no build step, no framework, running entirely in the browser with on-device AI for the core experience and optional cloud AI for advanced coaching.
