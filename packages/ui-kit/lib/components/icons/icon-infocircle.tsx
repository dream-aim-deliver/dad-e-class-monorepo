import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPlus
 * @usage <IconInfoCircle  />
 */
export const IconInfoCircle = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17"
    className={generateClassesForIcon(props)} >
    <g opacity="0.5">
      <path d="M8.00065 1.8335C4.32465 1.8335 1.33398 4.82416 1.33398 8.50016C1.33398 12.1762 4.32465 15.1668 8.00065 15.1668C11.6767 15.1668 14.6673 12.1762 14.6673 8.50016C14.6673 4.82416 11.6767 1.8335 8.00065 1.8335ZM8.00065 13.8335C5.05998 13.8335 2.66732 11.4408 2.66732 8.50016C2.66732 5.5595 5.05998 3.16683 8.00065 3.16683C10.9413 3.16683 13.334 5.5595 13.334 8.50016C13.334 11.4408 10.9413 13.8335 8.00065 13.8335Z" fill="#FAFAF9"/>
      <path d="M7.33398 7.8335H8.66732V11.8335H7.33398V7.8335ZM7.33398 5.16683H8.66732V6.50016H7.33398V5.16683Z" fill="#FAFAF9"/>
    </g>
  </svg>
  
  );
};
