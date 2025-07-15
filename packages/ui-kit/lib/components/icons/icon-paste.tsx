import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPaste
 * @usage <IconPaste title="Paste" />
 */
export const IconPaste = (props: IconProps) => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={generateClassesForIcon(props)}
      >

      <path d="M20 11V5C20 3.897 19.103 3 18 3H15C15 2.73478 14.8946 2.48043 14.7071 2.29289C14.5196 2.10536 14.2652 2 14 2H8C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3H4C2.897 3 2 3.897 2 5V18C2 19.103 2.897 20 4 20H11C11 21.103 11.897 22 13 22H20C21.103 22 22 21.103 22 20V13C22 11.897 21.103 11 20 11ZM11 13V18H4V5H7V7H15V5H18V11H13C11.897 11 11 11.897 11 13ZM13 20V13H20L20.001 20H13Z" fill="#F59E0B"/>
      </svg>

  );
};