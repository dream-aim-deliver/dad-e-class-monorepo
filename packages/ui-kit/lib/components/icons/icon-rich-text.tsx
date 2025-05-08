import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconRichText
 * @usage <IconRichText  />
 */
export const IconRichText = (props: IconProps) => {
    return (
    
  <svg 
  xmlns="http://www.w3.org/2000/svg"
 viewBox="0 0 14 16"
  className={generateClassesForIcon(props)}>
  <path d="M0 4H2V2H5.252L2.68 14H0V16H8V14H5.748L8.32 2H12V4H14V0H0V4Z" />
  </svg>
    );
};
