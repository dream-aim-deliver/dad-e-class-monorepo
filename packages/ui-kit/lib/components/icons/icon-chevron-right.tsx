import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconChevronRight
 * @usage <IconChevronRight />
 */
export const IconChevronRight = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M10.707 17.707L16.414 12L10.707 6.29297L9.29297 7.70697L13.586 12L9.29297 16.293L10.707 17.707Z" />
    </svg>
  );
};