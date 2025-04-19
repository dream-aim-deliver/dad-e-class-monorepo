import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconLogOut
 * @usage <IconLogOut />
 */
export const IconLogOut = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M16.5 13.0001V11.0001H7.5V8.00012L2.5 12.0001L7.5 16.0001V13.0001H16.5Z" />
      <path d="M20.5 3.00012H11.5C10.397 3.00012 9.5 3.89712 9.5 5.00012V9.00012H11.5V5.00012H20.5V19.0001H11.5V15.0001H9.5V19.0001C9.5 20.1031 10.397 21.0001 11.5 21.0001H20.5C21.603 21.0001 22.5 20.1031 22.5 19.0001V5.00012C22.5 3.89712 21.603 3.00012 20.5 3.00012Z" />
    </svg>
  );
};
