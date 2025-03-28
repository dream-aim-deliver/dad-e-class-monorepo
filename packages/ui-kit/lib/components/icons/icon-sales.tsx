import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconSales
 * @usage <IconSales />
 */
export const IconSales = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M12 15C10.16 15 10 14.14 10 14H8C8 14.92 8.66 16.55 11 16.92V18H13V16.92C15 16.58 16 15.29 16 14C16 12.88 15.48 11 12 11C10 11 10 10.37 10 10C10 9.63 10.7 9 12 9C13.3 9 13.39 9.64 13.4 10H15.4C15.3865 9.31876 15.1415 8.66241 14.7053 8.13896C14.269 7.61551 13.6676 7.25614 13 7.12V6H11V7.09C9 7.42 8 8.71 8 10C8 11.12 8.52 13 12 13C14 13 14 13.68 14 14C14 14.32 13.38 15 12 15Z" />
      <path d="M2 2V4H4V21C4 21.2652 4.10536 21.5196 4.29289 21.7071C4.48043 21.8946 4.73478 22 5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21V4H22V2H2ZM18 20H6V4H18V20Z" />
    </svg>
  );
};
