import { type IconProps, generateClassesForIcon } from './icon';

/**
 * IconLoaderSpinner
 * @usage <IconLoaderSpinner />
 */
export const IconLoaderSpinner = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={generateClassesForIcon(props)}>
            <path d="M12 22C17.421 22 22 17.421 22 12H20C20 16.337 16.337 20 12 20C7.663 20 4 16.337 4 12C4 7.663 7.663 4 12 4V2C6.579 2 2 6.58 2 12C2 17.421 6.579 22 12 22Z"/>
        </svg>
    );
};
