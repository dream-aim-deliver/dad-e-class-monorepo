import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconExternalLink
 * @usage <IconExternalLink />
 */
export const IconExternalLink = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={generateClassesForIcon(props)}
        >
            <path d="M13 3L16.293 6.293L9.293 13.293L10.707 14.707L17.707 7.707L21 11V3H13Z" />
            <path d="M19 19H5V5H12L10 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21H19C20.103 21 21 20.103 21 19V14L19 12V19Z" />
        </svg>
    );
};
