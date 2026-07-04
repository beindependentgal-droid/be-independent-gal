'use client'

import Image, { type ImageProps } from 'next/image'
import * as React from 'react'

interface FallbackImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
  quality?: number
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  className,
  fill = false,
  style,
  loading,
  quality = 65,
  ...props
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(true)
    }
  }

  const isLocal = currentSrc.startsWith('/')

  if (isLocal) {
    return (
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        fill={fill}
        className={className}
        style={style}
        loading={loading ?? 'lazy'}
        quality={quality}
        onError={handleError}
      />
    )
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading ?? 'lazy'}
      decoding="async"
      style={fill ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%' } : style}
      onError={handleError}
    />
  )
}
