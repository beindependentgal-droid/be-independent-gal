# PowerShell helper to generate PWA icons using ImageMagick or pwa-asset-generator

# Usage: Open PowerShell in repo root and run:
# ./scripts/generate-pwa-icons.ps1

$source = "public/images/biglogo.png"
$dest = "public/images"

if (Test-Path $source) {
    Write-Host "Source found: $source"
} else {
    Write-Error "Source not found: $source"
    exit 1
}

# Prefer ImageMagick if available
$magick = Get-Command magick -ErrorAction SilentlyContinue
if ($magick) {
    Write-Host "ImageMagick detected. Generating icons..."
    magick $source -resize 192x192 "$dest/icon-192.png"
    magick $source -resize 512x512 "$dest/icon-512.png"
    magick $source -resize 180x180 "$dest/apple-touch-icon.png"
    magick $source -resize 512x512 "$dest/maskable-icon.png"
    magick "$dest/icon-192.png" "$dest/icon-512.png" "$dest/favicon.ico"
    Write-Host "Icons generated in $dest"
    exit 0
}

# Fallback to pwa-asset-generator via npx
Write-Host "ImageMagick not found; falling back to pwa-asset-generator (npx)."
$npx = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npx) {
    Write-Error "npx not found. Install Node.js or ImageMagick and try again."
    exit 1
}

Write-Host "Running: npx pwa-asset-generator $source $dest --icon-only"
npx pwa-asset-generator $source $dest --icon-only
Write-Host "pwa-asset-generator finished. Check $dest for generated icons."