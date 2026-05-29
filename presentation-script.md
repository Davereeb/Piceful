# Piceful — Presentation Script (~3 min)

---

### Slide 1 — Cover

Hi everyone. My name is [Your Name], and today I'm going to show you Piceful — an AI photography assistant that I built from scratch as my final project for this class.

---

### Slide 2 — Hero Image

Take a look at this image. She took the perfect shot for him. But when it was his turn to return the favor — he just couldn't get it right. And honestly, this happens all the time. We've all been there.

---

### Slide 3 — The Problem

The average person takes five to ten attempts just to get one decent posed photo. That's frustrating. That's wasted time. And it turns what should be a fun moment into an argument. Piceful exists to solve that — stop wasting time retaking photos, and get the shot right the first time.

---

### Slide 4 — What is Piceful

So what is Piceful? It's a browser-based AI photography assistant. You upload a reference photo — maybe a travel pose you saw online, a couple photo you love, or a family composition you want to recreate. Then Piceful uses on-device AI to detect your body position through the camera, compares it to the reference in real time, and gives you live guidance — like "move left," "step back," "hold steady" — until you match the framing. No app install needed. It works on any smartphone, right in the browser.

---

### Slide 5 — Target Users

And here's what's interesting — there are zero competitors doing this. The entire photo app market focuses on post-capture editing. Nobody is helping you during the actual capture. Our primary users are tourists recreating iconic shots, couples and families doing memorial photos, and social media creators reproducing trending poses. And the market is huge — 1.4 trillion photos taken every year, 85% on smartphones.

---

### Slide 6 — Problems

Let me break down the four specific problems Piceful solves. First, trial and error — we cut attempts from five-to-ten down to one or two. Second, there's no way to copy a reference photo — Piceful overlays it as a ghost image so you can match it exactly. Third, communication — instead of "move left, no, the other left," Piceful gives precise instructions to both the photographer and the subject at the same time. And fourth, composition expertise — rules like the rule of thirds are hard to apply in practice. Piceful applies them automatically.

---

### Slide 7 — Market

The global photo app market is worth over three billion dollars. 1.4 trillion photos taken per year. 85% on smartphones. And yet, not a single major app offers real-time guidance during capture. That's the gap we're filling.

---

### Slide 8 — Tech Stack

Under the hood, Piceful combines on-device AI with cloud vision. TensorFlow.js runs face detection and body pose estimation directly in your browser at around 10 frames per second — zero server cost. That same pose engine also powers our Premium feature — a skeleton overlay that places color-coded dots on the reference image and turns them green as your body matches the pose. For the smart coaching part, we use Qwen-VL-Max, a multimodal vision-language model that analyzes your live frame against the reference and generates natural-language instructions. Camera access is through WebRTC, and the backend runs on Supabase for authentication and cloud storage.

---

### Slide 9 — Business Model

For monetization, we use a freemium model designed around moments of need. You get three free sessions with no account. Sign up, and you get five per month. For travelers and event-goers, there's a seven-day pass at $2.99. And power users can go annual at $19.99 a year. The unit economics are strong — on-device AI means near-zero cost per free user, and cloud API calls are only about $0.003 each.

---

### Slide 10 — Current Status

Right now, Piceful is a solo project in MVP phase — but it's a live, working product. Authentication, cloud collections, and the full AI-guided capture flow are all functional. I'm looking for early adopters to test and provide feedback, and I'm open to collaborators with experience in mobile photography or computer vision.

---

### Slide 11 — Try It

And the best part is — you don't have to take my word for it. You can try it right now. Pull out your phone, scan the QR code or go to piceful.vercel.app, upload any reference photo, and watch the AI guide you into the frame. I'd love your feedback.

Thank you.
