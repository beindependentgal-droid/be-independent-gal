'use client'

import * as React from 'react'

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  fill?: boolean
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  className,
  fill = false,
  style,
  ...props
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(() =>
    typeof src === 'string' ? src : src?.toString() ?? ''
  )
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    setCurrentSrc(typeof src === 'string' ? src : src?.toString() ?? '')
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      style={fill ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' } : style}
      onError={handleError}
    />
  )
}
