import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPlus
 * @usage <IconMinus />
 */
export const IconMinus = (props: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    className={generateClassesForIcon(props)}
    >
  <path d="M5 11H19V13H5V11Z" />
</svg>
  );
};
