import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconClose
 * @usage <IconClose />
 */
export const IconClose = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M16.192 6.34375L11.949 10.5858L7.70697 6.34375L6.29297 7.75775L10.535 11.9998L6.29297 16.2418L7.70697 17.6558L11.949 13.4137L16.192 17.6558L17.606 16.2418L13.364 11.9998L17.606 7.75775L16.192 6.34375Z" />
    </svg>
  );
};
