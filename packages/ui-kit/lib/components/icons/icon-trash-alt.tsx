import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconTrashAlt
 * @usage <IconTrashAlt />
 */
export const IconTrashAlt = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M15 2H9C7.897 2 7 2.897 7 4V6H3V8H5V20C5 21.103 5.897 22 7 22H17C18.103 22 19 21.103 19 20V8H21V6H17V4C17 2.897 16.103 2 15 2ZM9 4H15V6H9V4ZM17 20H7V8H17V20Z" />
    </svg>
  );
};
