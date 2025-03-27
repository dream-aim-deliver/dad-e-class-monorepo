import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconGroup
 * @usage <IconGroup />
 */
export const IconHamburgerMenu = (props: IconProps) => {
    return (

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={generateClassesForIcon(props)}>
            <path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM4 16H20V18H4V16Z" />
        </svg>
    );
};
