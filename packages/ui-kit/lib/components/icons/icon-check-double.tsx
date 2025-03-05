import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconCheckDouble
 * @usage <IconCheckDouble />
 */
export const IconCheckDouble = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M2.39453 13.742L7.13753 17.362L14.7535 8.65804L13.2475 7.34204L6.86353 14.638L3.60653 12.152L2.39453 13.742ZM21.7535 8.65804L20.2475 7.34204L13.8785 14.621L13.1255 14.019L11.8755 15.581L14.1225 17.379L21.7535 8.65804Z" />
    </svg>
  );
};
