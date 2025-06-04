import { Carousel } from '@maany_shr/e-class-ui-kit';
import React, { ComponentProps } from 'react';

type CarouselProps = ComponentProps<typeof Carousel> & {
    children: React.ReactNode;
};

/*
 This wrapper is required to bypass linter. Without it we would need to lazy
 load the ui-kit library, which causes the linting to fail.
 */
export function CarouselWrapper({ children, ...props }: CarouselProps) {
    return <Carousel {...props}>{children}</Carousel>;
}
