'use client';

import { createContext, useContext, ComponentType } from 'react';

export interface ImageComponentProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    loading?: 'lazy' | 'eager';
    onError?: () => void;
    onLoad?: () => void;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export type ImageComponentType = ComponentType<ImageComponentProps> | 'img';

const ImageComponentContext = createContext<ImageComponentType>('img');

export const ImageProvider = ImageComponentContext.Provider;

export const useImageComponent = (): ComponentType<ImageComponentProps> => {
    const ImageComponent = useContext(ImageComponentContext);

    if (ImageComponent === 'img') {
        // Return a wrapper component that renders native img
        return function NativeImg(props: ImageComponentProps) {
            return <img {...props} />;
        };
    }

    return ImageComponent;
};
