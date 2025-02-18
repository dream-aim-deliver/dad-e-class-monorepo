import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPlus
 * @usage <IconPlus />
 */
export const IconPlus = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M19 11H13V5H11V11H5V13H11V19H13V13H19V11Z" />
    </svg>
  );
};
