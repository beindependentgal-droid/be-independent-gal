BIG PWA image assets

This folder should contain the final, production-ready icons and optional screenshots used by the PWA manifest and HTML meta tags.

Required files (place here):

- favicon.ico               (multi-resolution ICO, optional but good for desktop)
- bigFavicon.png            (source high-res PNG used as a fallback)
- icon-192.png              (192×192 PNG)
- icon-512.png              (512×512 PNG)
- apple-touch-icon.png      (180×180 PNG)
- maskable-icon.png         (512×512 PNG, designed for maskable purpose)
- screenshot-home.png       (1280×720 PNG, optional)
- screenshot-mobile.png     (540×720 PNG, optional)

Image generation (ImageMagick)

Windows PowerShell / Bash examples using ImageMagick (install ImageMagick first):

magick public/images/biglogo.png -resize 192x192 public/images/icon-192.png
magick public/images/biglogo.png -resize 512x512 public/images/icon-512.png
magick public/images/biglogo.png -resize 180x180 public/images/apple-touch-icon.png
magick public/images/biglogo.png -resize 512x512 public/images/maskable-icon.png

# Create favicon.ico (contains multiple sizes)
magick public/images/icon-192.png public/images/icon-512.png public/images/favicon.ico

Alternative: pwa-asset-generator (Node.js)

This tool will generate the full set of icons and a manifest-ready output folder.

Install globally or use npx:

npm i -g pwa-asset-generator
pwa-asset-generator public/images/biglogo.png public/images --icon-only

Or with npx:
npx pwa-asset-generator public/images/biglogo.png public/images --icon-only

Recommended workflow

1. Copy your high-resolution source logo to `public/images/biglogo.png` (ideally 2048×2048 or high DPI PNG).
2. Run ImageMagick or `pwa-asset-generator` to produce the files above.
3. Commit the generated images to the repo.
4. (Optional) Add a manifest query string after you commit new icons to force clients to refetch: `href="/manifest.json?v=2"`.
5. Uninstall any previously installed PWA from devices and re-add from the browser menu.

Verification

- In Chrome desktop: DevTools → Application → Manifest → verify icons and maskable purpose.
- On Android: Settings → Apps → Installed apps or Add to Home screen; reinstall the PWA.
- On iPhone: Add to Home Screen in Safari (uses `apple-touch-icon.png`).

Notes

- Use separate real PNGs for `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` for crisp icons across platforms.
- `maskable-icon.png` should have safe-zone margins if your design requires it.

If you want, I can add an `npm` script to `package.json` with the `pwa-asset-generator` command, or generate a PowerShell script file for you to run locally.
