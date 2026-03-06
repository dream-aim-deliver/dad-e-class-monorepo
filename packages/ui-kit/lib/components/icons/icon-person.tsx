import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPerson
 * @usage <IconPerson />
 */
export const IconPerson = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={generateClassesForIcon(props)}>
      <path d="M9.5 12C11.706 12 13.5 10.206 13.5 7.99997C13.5 5.79397 11.706 3.99997 9.5 3.99997C7.294 3.99997 5.5 5.79397 5.5 7.99997C5.5 10.206 7.294 12 9.5 12ZM9.5 5.99997C10.603 5.99997 11.5 6.89697 11.5 7.99997C11.5 9.10297 10.603 9.99997 9.5 9.99997C8.397 9.99997 7.5 9.10297 7.5 7.99997C7.5 6.89697 8.397 5.99997 9.5 5.99997ZM11 13H8C4.691 13 2 15.691 2 19V20H4V19C4 16.794 5.794 15 8 15H11C13.206 15 15 16.794 15 19V20H17V19C17 15.691 14.309 13 11 13Z" />
    </svg>
  );
};
