import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconImageGallery
 * @usage <IconImageGallery />
 */
export const IconImageGallery = (props: IconProps) => {
  return (
    
    <svg xmlns="http://www.w3.org/2000/svg" className={generateClassesForIcon(props)} viewBox="0 0 24 24" fill="none">
  <path d="M20 2H8C6.897 2 6 2.897 6 4V16C6 17.103 6.897 18 8 18H20C21.103 18 22 17.103 22 16V4C22 2.897 21.103 2 20 2ZM8 16V4H20L20.002 16H8Z" fill="#FAFAF9"/>
  <path d="M4 8H2V20C2 21.103 2.897 22 4 22H16V20H4V8Z" fill="#FAFAF9"/>
  <path d="M12 12L11 11L9 14H19L15 8L12 12Z" fill="#FAFAF9"/>
</svg>
  );
};
