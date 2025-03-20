import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCourse
 * @usage <IconCourse />
 */
export const IconCourse = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M20 2H7C4.243 2 2 4.243 2 7V17C2 19.757 4.243 22 7 22H19C20.654 22 22 20.654 22 19C22 17.346 20.654 16 19 16H6V18H19C19.2652 18 19.5196 18.1054 19.7071 18.2929C19.8946 18.4804 20 18.7348 20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H7C5.346 20 4 18.654 4 17C4 15.346 5.346 14 7 14H20C21.103 14 22 13.103 22 12V4C22 2.897 21.103 2 20 2ZM20 12H7C5.9176 11.9986 4.86431 12.3504 4 13.002V7C4 5.346 5.346 4 7 4H20V12Z" />
    </svg>
  );
};
