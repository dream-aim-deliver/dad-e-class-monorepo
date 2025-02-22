import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconClock
 * @usage <IconClock />
 */
export const IconClock = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M12.9474 6.94737C12.9474 6.42415 12.5232 6 12 6C11.4768 6 11.0526 6.42415 11.0526 6.94737V11.6842C11.0526 12.3818 11.6182 12.9474 12.3158 12.9474H17.0526C17.5758 12.9474 18 12.5232 18 12C18 11.4768 17.5758 11.0526 17.0526 11.0526H12.9474V6.94737Z" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM22.1053 12C22.1053 17.581 17.581 22.1053 12 22.1053C6.41902 22.1053 1.89474 17.581 1.89474 12C1.89474 6.41902 6.41902 1.89474 12 1.89474C17.581 1.89474 22.1053 6.41902 22.1053 12Z"
      />
    </svg>
  );
};
