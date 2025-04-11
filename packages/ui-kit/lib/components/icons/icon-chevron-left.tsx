import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconChevronLeft
 * @usage <IconChevronLeft />
 */
export const IconChevronLeft = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M13.2929 6.29297L7.58594 12L13.2929 17.707L14.7069 16.293L10.4139 12L14.7069 7.70697L13.2929 6.29297Z" />
    </svg>
  );
};