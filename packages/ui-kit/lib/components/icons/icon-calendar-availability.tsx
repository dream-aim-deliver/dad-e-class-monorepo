import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCalendarAvailability
 * @usage <IconCalendarAvailability />
 */
export const IconCalendarAvailability = (props: IconProps) => {
  return (
    
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M11 12H17V18H11V12Z" />
      <path d="M19 4H17V2H15V4H9V2H7V4H5C3.897 4 3 4.897 3 6V20C3 21.103 3.897 22 5 22H19C20.103 22 21 21.103 21 20V6C21 4.897 20.103 4 19 4ZM19.001 20H5V8H19L19.001 20Z" />
    </svg>
  );
};
