import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconHeading
 * @usage <IconHeading />
 */
export const IconHeading = (props: IconProps) => {
  return (
    
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"  className={generateClassesForIcon(props)}>
    <path d="M18 20V4H15V10H9V4H6V20H9V13H15V20H18Z" />
  </svg>
  );
};
