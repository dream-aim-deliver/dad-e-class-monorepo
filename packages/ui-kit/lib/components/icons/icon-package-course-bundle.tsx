import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconPackageCourseBundle
 * @usage <IconPackageCourseBundle />
 */
export const IconPackageCourseBundle = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={generateClassesForIcon(props)}
        >
            <path
                d="M7 3H9V21H7V3ZM4 3H6V21H4V3ZM10 3H12V21H10V3ZM19.062 20.792L12.839 3.902L14.716 3.21L20.939 20.1L19.062 20.792Z"
            />
        </svg>
    );
};
