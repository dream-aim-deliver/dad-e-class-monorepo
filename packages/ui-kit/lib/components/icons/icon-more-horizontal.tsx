export const IconMoreHorizontal = ({ size = '5', classNames = '' }: { size?: string; classNames?: string }) => (
    <svg
        className={`w-${size} h-${size} ${classNames}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
    </svg>
);
