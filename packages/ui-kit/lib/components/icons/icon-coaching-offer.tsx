import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCoachingOffer
 * @usage <IconCoachingOffer />
 */
export const IconCoachingOffer = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M20 6H17V4C17 2.897 16.103 2 15 2H9C7.897 2 7 2.897 7 4V6H4C2.897 6 2 6.897 2 8V19C2 20.103 2.897 21 4 21H20C21.103 21 22 20.103 22 19V8C22 6.897 21.103 6 20 6ZM16 8V19H8V8H16ZM15 4V6H9V4H15ZM4 8H6V19H4V8ZM18 19V8H20L20.001 19H18Z" />
    </svg>
  );
};
