import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconSingleChoice
 * @usage <IconSingleChoice />
 */
export const IconSingleChoice = (props: IconProps) => {
  return (
    
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  className={generateClassesForIcon(props)}>
    <path d="M6 12H8V14H6V12ZM6 17H8V19H6V17ZM22 9V7H10.023V9H22ZM10 12H22V14H10V12ZM10 17H22V19H10V17Z" />
    <path d="M4.696 7.267L3.4 5.996L2 7.426L4.704 10.073L9.403 5.422L7.997 4L4.696 7.267Z"/>
  </svg>
  );
};
