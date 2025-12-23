'use client';

import Image from 'next/image';
import { ImageComponentProps } from '@maany_shr/e-class-ui-kit';

/**
 * OptimizedImage wrapper that provides Next.js Image optimization
 * to UI kit components through the ImageProvider context.
 *
 * Features:
 * - Automatic WebP/AVIF format conversion
 * - Responsive srcset generation
 * - Server-side caching (1 hour TTL matching MinIO signed URLs)
 * - Lazy loading by default
 *
 * Note: When width/height are not provided, falls back to native img
 * to preserve natural sizing behavior (Next.js Image requires dimensions).
 */
export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    loading = 'lazy',
    onError,
    onLoad,
    onClick,
    style,
}: ImageComponentProps) {
    if (!src) {
        return null;
    }

    // When dimensions are not provided, use native img to preserve natural sizing
    // Next.js Image requires explicit dimensions or fill mode with positioned parent
    if (!width && !height) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt || ''}
                className={className}
                loading={loading}
                onError={onError}
                onLoad={onLoad}
                onClick={onClick}
                style={style}
            />
        );
    }

    return (
        <Image
            src={src}
            alt={alt || ''}
            width={width || 400}
            height={height || 300}
            className={className}
            loading={loading}
            onError={onError ? () => onError() : undefined}
            onLoad={onLoad ? () => onLoad() : undefined}
            onClick={onClick}
            style={style}
        />
    );
}
