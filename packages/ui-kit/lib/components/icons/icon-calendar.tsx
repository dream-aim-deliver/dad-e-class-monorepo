import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCalendar
 * @usage <IconCalendar />
 */
export const IconCalendar = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            viewBox="0 0 16 16"
            className={generateClassesForIcon(props)}>
            <path
                d="M2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967C14 3.64605 13.8595 3.30691 13.6095 3.05687C13.3594 2.80682 13.0203 2.66634 12.6667 2.66634H11.3333V1.33301H10V2.66634H6V1.33301H4.66667V2.66634H3.33333C2.97971 2.66634 2.64057 2.80682 2.39052 3.05687C2.14048 3.30691 2 3.64605 2 3.99967ZM12.6667 13.333H3.33333V5.33301H12.6667V13.333Z"
                fill="#D6D3D1" />
        </svg>
    );
};
