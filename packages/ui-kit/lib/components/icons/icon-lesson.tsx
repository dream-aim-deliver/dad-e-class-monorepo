import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconLesson
 * @usage <IconLesson />
 */
export const IconLesson = (props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={generateClassesForIcon(props)}
        >
            <path d="M20 3H4C2.897 3 2 3.897 2 5V16C2 17.103 2.897 18 4 18H8L6.2 20.4L7.8 21.6L10.5 18H13.5L16.2 21.6L17.8 20.4L16 18H20C21.103 18 22 17.103 22 16V5C22 3.897 21.103 3 20 3ZM4 16V5H20L20.001 16H4Z" />
            <path d="M6 12H10V14H6V12Z" />
        </svg>
    );
};
