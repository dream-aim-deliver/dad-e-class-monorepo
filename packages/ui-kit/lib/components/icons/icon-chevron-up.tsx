import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconChevronUp
 * @usage <IconChevronUp />
 */
export const IconChevronUp = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M6.29297 13.2929L7.70697 14.7069L12 10.4139L16.293 14.7069L17.707 13.2929L12 7.58594L6.29297 13.2929Z" />
    </svg>
  );
};
