import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconAssignmentPassed
 * @usage <IconAssignmentPassed />
 */
export const IconAssignmentPassed = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 25"
            className={generateClassesForIcon(props)}
        >
            <path d="M12 2.25781C6.486 2.25781 2 5.84681 2 10.2578C2 13.1658 3.898 15.7728 7 17.1918V22.2578L12.339 18.2528C17.697 18.1098 22 14.5778 22 10.2578C22 5.84681 17.514 2.25781 12 2.25781ZM12 16.2578H11.667L9 18.2578V15.8408L8.359 15.5938C5.67 14.5588 4 12.5138 4 10.2578C4 6.94881 7.589 4.25781 12 4.25781C16.411 4.25781 20 6.94881 20 10.2578C20 13.5668 16.411 16.2578 12 16.2578Z" />
            <path d="M11 11.8438L8.707 9.55081L7.293 10.9648L11 14.6718L17.207 8.46481L15.793 7.05081L11 11.8438Z" />
        </svg>
    );
};
