import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconMultiChoice
 * @usage <IconMultiChoice />
 */
export const IconOneOutOfThree = (props: IconProps) => {
  return (
   
    <svg xmlns="http://www.w3.org/2000/svg" className={generateClassesForIcon(props)} viewBox="0 0 24 24">
    <path
      d="M4 21H19.893C20.996 21 21.893 20.103 21.893 19V5C21.893 3.897 20.996 3 19.893 3H4C2.897 3 2 3.897 2 5V19C2 20.103 2.897 21 4 21ZM4 19V14H8V19H4ZM14 7V12H10V7H14ZM8 7V12H4V7H8ZM10 19V14H14V19H10ZM16 19V14H19.894V19H16ZM19.893 12H16V7H19.893V12Z"
      fill="#FAFAF9"
    />
  </svg>
  );
};
