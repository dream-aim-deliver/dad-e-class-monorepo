import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconQuiz
 * @usage <IconQuiz />
 */
export const IconQuiz = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M2 3H4V21H2V3ZM20 3H22V21H20V3ZM5 13H7V14H9V13H11V14H13V13H17V14H19V10H17V11H13V10H11V11H9V10H7V11H5V13ZM5 4V8H7V7H15V8H17V7H19V5H17V4H15V5H7V4H5ZM5 17V20H7V19H9V20H11V19H19V17H11V16H9V17H7V16H5V17Z" />
    </svg>
  );
};
