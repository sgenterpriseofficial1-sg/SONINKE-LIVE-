# Soninke TV Live

GitHub-ready front-end MVP for a continuous Soninke TV broadcast interface.

## What it does

- Live TV player
- Program queue
- Upload multiple local video files
- Automatic next-video transition
- Reorder queue
- Remove programs
- Standby animation when an item has no video URL
- Mobile and desktop UI
- Admin/control screen

## Run locally

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

1. Create a GitHub repository, for example `soninke-tv-live`.
2. Upload this project.
3. Run `npm install` and `npm run build`.
4. Configure GitHub Pages to publish the built `dist` folder using your preferred Pages workflow.

## Important: MVP vs real 24/7 TV

This version is a front-end prototype. Uploaded files are local browser object URLs, so they are not a real Internet TV stream and are not shared between viewers.

For a true 24/7 channel, the next architecture should be:

Admin dashboard
→ cloud video storage
→ broadcast scheduler
→ FFmpeg/transcoder
→ HLS stream
→ CDN
→ Soninke TV viewers

That architecture makes all viewers watch the same live broadcast position. It can later be connected to the main Soninke TV application.
