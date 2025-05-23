import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconVideo
 * @usage <IconVideo />
 */
export const IconVideo = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={generateClassesForIcon(props)} viewBox="0 0 20 20" fill="none">
  <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" fill="#FAFAF9"/>
  <path d="M7 15L15 10L7 5V15Z" fill="#FAFAF9"/>
</svg>
  );
};
