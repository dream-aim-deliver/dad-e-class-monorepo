import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCoachingSession
 * @usage <IconCoachingSession />
 */
export const IconCoachingSession = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M16.5 14C17.327 14 18 13.327 18 12.5V3.5C18 2.673 17.327 2 16.5 2H3.5C2.673 2 2 2.673 2 3.5V18L7.333 14H16.5ZM6.667 12L4 14V4H16V12H6.667Z" />
      <path d="M20.5 8H20V14.001C20 15.101 19.107 15.994 18.01 16H8V16.5C8 17.327 8.673 18 9.5 18H16.667L22 22V9.5C22 8.673 21.327 8 20.5 8Z" />
    </svg>
  );
};
