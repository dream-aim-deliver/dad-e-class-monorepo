import { type IconProps, generateClassesForIcon } from './icon';
/**
 * IconHourglass
 * @usage <IconHourglass />
 */
export const IconHourglass = (props: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={generateClassesForIcon(props)}
    >
      <path d="M15.566 11.021C16.6105 10.4004 17.476 9.51927 18.0779 8.46389C18.6799 7.4085 18.9976 6.21497 19 5V4H20V2H4V4H5V5C5.00242 6.21497 5.32013 7.4085 5.92205 8.46389C6.52398 9.51927 7.38951 10.4004 8.434 11.021C8.788 11.229 9 11.566 9 11.921V12.079C9 12.433 8.788 12.769 8.434 12.979C7.38951 13.5996 6.52398 14.4807 5.92205 15.5361C5.32013 16.5915 5.00242 17.785 5 19V20H4V22H20V20H19V19C18.9985 17.7851 18.6813 16.5915 18.0794 15.5361C17.4776 14.4808 16.6118 13.5999 15.567 12.98C15.212 12.77 15 12.433 15 12.079V11.921C15 11.566 15.212 11.229 15.566 11.021ZM14.551 14.702C15.2962 15.1452 15.9137 15.7743 16.343 16.5277C16.7722 17.281 16.9986 18.1329 17 19V20H7V19C7.00131 18.1327 7.22777 17.2805 7.65723 16.5269C8.08669 15.7734 8.70443 15.1442 9.45 14.701C10.421 14.128 11 13.147 11 12.079V11.921C11 10.852 10.42 9.87 9.449 9.298C8.70376 8.85477 8.08631 8.2257 7.65704 7.47234C7.22778 6.71897 7.00138 5.86708 7 5V4H17V5C17 6.76 16.062 8.406 14.551 9.298C13.58 9.87 13 10.852 13 11.921V12.079C13 13.147 13.579 14.128 14.551 14.702Z" />
    </svg>
  );
};