#!/usr/bin/env bash
# Bash helper to generate PWA icons using ImageMagick or pwa-asset-generator
# Usage: ./scripts/generate-pwa-icons.sh

set -e
SRC=public/images/biglogo.png
DEST=public/images

if [ ! -f "$SRC" ]; then
  echo "Source not found: $SRC" >&2
  exit 1
fi

if command -v magick >/dev/null 2>&1; then
  echo "ImageMagick detected. Generating icons..."
  magick "$SRC" -resize 192x192 "$DEST/icon-192.png"
  magick "$SRC" -resize 512x512 "$DEST/icon-512.png"
  magick "$SRC" -resize 180x180 "$DEST/apple-touch-icon.png"
  magick "$SRC" -resize 512x512 "$DEST/maskable-icon.png"
  magick "$DEST/icon-192.png" "$DEST/icon-512.png" "$DEST/favicon.ico"
  echo "Icons generated in $DEST"
  exit 0
fi

if command -v npx >/dev/null 2>&1; then
  echo "ImageMagick not found; using pwa-asset-generator via npx."
  npx pwa-asset-generator "$SRC" "$DEST" --icon-only --background '#ffffff'
  echo "pwa-asset-generator finished. Check $DEST for generated icons."
  exit 0
fi

echo "Neither ImageMagick nor npx found. Install one of them and try again." >&2
exit 1
