#!/usr/bin/env bash
set -e

echo "=== Generating High-Fidelity Brand Assets for SpeakUp AI ==="

PUBLIC_DIR="/app/applet/public"
RES_DIR="/app/applet/android/app/src/main/res"

# 1. Generate PWA standard and iOS icons from public/icon.svg
echo "Rendering PWA icons..."
rsvg-convert -w 192 -h 192 "$PUBLIC_DIR/icon.svg" -o "$PUBLIC_DIR/pwa-192x192.png"
rsvg-convert -w 512 -h 512 "$PUBLIC_DIR/icon.svg" -o "$PUBLIC_DIR/pwa-512x512.png"
rsvg-convert -w 180 -h 180 "$PUBLIC_DIR/icon.svg" -o "$PUBLIC_DIR/apple-touch-icon.png"
rsvg-convert -w 32 -h 32 "$PUBLIC_DIR/favicon.svg" -o "$PUBLIC_DIR/favicon-32x32.png"
rsvg-convert -w 16 -h 16 "$PUBLIC_DIR/favicon.svg" -o "$PUBLIC_DIR/favicon-16x16.png"

# 2. Generate Maskable Icon from public/icon-maskable.svg
echo "Rendering maskable icons..."
rsvg-convert -w 512 -h 512 "$PUBLIC_DIR/icon-maskable.svg" -o "$PUBLIC_DIR/pwa-maskable-512x512.png"
rsvg-convert -w 192 -h 192 "$PUBLIC_DIR/icon-maskable.svg" -o "$PUBLIC_DIR/pwa-maskable-192x192.png"

# 3. Generate Android Launcher Icons
echo "Generating Android launcher mipmaps..."
mkdir -p "$RES_DIR/mipmap-mdpi" "$RES_DIR/mipmap-hdpi" "$RES_DIR/mipmap-xhdpi" "$RES_DIR/mipmap-xxhdpi" "$RES_DIR/mipmap-xxxhdpi"

rsvg-convert -w 48 -h 48 "$PUBLIC_DIR/icon.svg" -o "$RES_DIR/mipmap-mdpi/ic_launcher.png"
rsvg-convert -w 72 -h 72 "$PUBLIC_DIR/icon.svg" -o "$RES_DIR/mipmap-hdpi/ic_launcher.png"
rsvg-convert -w 96 -h 96 "$PUBLIC_DIR/icon.svg" -o "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
rsvg-convert -w 144 -h 144 "$PUBLIC_DIR/icon.svg" -o "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
rsvg-convert -w 192 -h 192 "$PUBLIC_DIR/icon.svg" -o "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"

# Round launcher icons
rsvg-convert -w 48 -h 48 "$PUBLIC_DIR/icon-maskable.svg" -o "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"
rsvg-convert -w 72 -h 72 "$PUBLIC_DIR/icon-maskable.svg" -o "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"
rsvg-convert -w 96 -h 96 "$PUBLIC_DIR/icon-maskable.svg" -o "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"
rsvg-convert -w 144 -h 144 "$PUBLIC_DIR/icon-maskable.svg" -o "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"
rsvg-convert -w 192 -h 192 "$PUBLIC_DIR/icon-maskable.svg" -o "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

# 4. Generate Android Splash Screens
echo "Generating Android splash screens..."
# Create a rich splash SVG
cat << 'EOF' > /tmp/splash.svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="splashBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="50%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#splashBg)" />
  <circle cx="540" cy="880" r="460" fill="url(#glow)" />

  <!-- Logo Mark Center -->
  <g transform="translate(540, 840) scale(0.65) translate(-256, -256)">
    <rect x="16" y="16" width="480" height="480" rx="112" ry="112" fill="#0F172A" stroke="#8B5CF6" stroke-width="6" />
    <path d="M 276 96 C 362 96 424 158 424 240 C 424 286 400 326 364 354 L 384 416 L 322 392 C 307 397 292 400 276 400 C 246 400 220 392 198 378 L 228 344 C 242 352 258 356 276 356 C 334 356 376 312 376 250 C 376 194 336 148 276 148 C 214 148 168 184 154 238 L 108 226 C 126 150 190 96 276 96 Z" fill="#6366F1" />
    <path d="M 152 232 C 160 214 176 198 196 186 L 224 220 C 210 228 202 238 198 250 C 192 270 204 290 226 304 L 268 330 C 316 360 338 394 330 432 C 322 470 286 496 234 496 C 162 496 104 446 96 374 L 142 364 C 148 412 186 450 234 450 C 260 450 280 436 284 416 C 288 396 274 378 248 362 L 204 334 C 160 306 144 268 152 232 Z" fill="#06B6D4" />
    <g transform="translate(378, 114)">
      <path d="M 0 -48 Q 0 0 -48 0 Q 0 0 0 48 Q 0 0 48 0 Q 0 0 0 -48 Z" fill="#38BDF8" />
      <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
    </g>
  </g>

  <!-- Typography -->
  <text x="540" y="1120" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.02em">
    SpeakUp AI
  </text>
  <text x="540" y="1175" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="600" fill="#94A3B8" text-anchor="middle" letter-spacing="0.02em">
    Speak English. Build Confidence. Transform Your Future.
  </text>
</svg>
EOF

rsvg-convert -w 480 -h 800 /tmp/splash.svg -o "$RES_DIR/drawable/splash.png"
rsvg-convert -w 480 -h 800 /tmp/splash.svg -o "$RES_DIR/drawable-port-hdpi/splash.png"
rsvg-convert -w 320 -h 480 /tmp/splash.svg -o "$RES_DIR/drawable-port-mdpi/splash.png"
rsvg-convert -w 720 -h 1280 /tmp/splash.svg -o "$RES_DIR/drawable-port-xhdpi/splash.png"
rsvg-convert -w 960 -h 1600 /tmp/splash.svg -o "$RES_DIR/drawable-port-xxhdpi/splash.png"
rsvg-convert -w 1080 -h 1920 /tmp/splash.svg -o "$RES_DIR/drawable-port-xxxhdpi/splash.png"

echo "Brand assets generated successfully!"
ls -lh "$PUBLIC_DIR"/pwa-*.png "$PUBLIC_DIR"/apple-touch-icon.png
