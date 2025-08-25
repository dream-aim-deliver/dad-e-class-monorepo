import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconAssignmentPassed
 * @usage <IconAssignmentPassed />
 */
export const IconAssignmentPassed = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={generateClassesForIcon(props)}
        >
            <path d="M12 2C6.486 2 2 5.589 2 10C2 12.908 3.898 15.515 7 16.934V22L12.339 17.995C17.697 17.852 22 14.32 22 10C22 5.589 17.514 2 12 2ZM12 16H11.667L9 18V15.583L8.359 15.336C5.67 14.301 4 12.256 4 10C4 6.691 7.589 4 12 4C16.411 4 20 6.691 20 10C20 13.309 16.411 16 12 16Z" />
            <path d="M11 11.586L8.707 9.293L7.293 10.707L11 14.414L17.207 8.207L15.793 6.793L11 11.586Z" />
        </svg>
    );
};
