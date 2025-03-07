import React from 'react';
import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconLanguage
 * @usage <IconLanguage />
 */
export const IconLanguage = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M18.5 10L22.9 21H20.745L19.544 18H15.454L14.255 21H12.101L16.5 10H18.5ZM10 2V4H16V6H14.032C13.2612 8.32232 12.03 10.4654 10.412 12.301C11.1335 12.9439 11.9155 13.5155 12.747 14.008L11.997 15.886C10.9225 15.2767 9.91752 14.5521 9 13.725C7.21313 15.3411 5.09773 16.5515 2.799 17.273L2.263 15.344C4.23284 14.7159 6.04802 13.6793 7.59 12.302C6.44783 11.0106 5.49712 9.56179 4.767 8H7.007C7.56413 9.02899 8.23246 9.99376 9 10.877C10.2495 9.43567 11.2346 7.78498 11.91 6.001L2 6V4H8V2H10ZM17.5 12.885L16.253 16H18.745L17.5 12.885Z" />
    </svg>
  );
};
