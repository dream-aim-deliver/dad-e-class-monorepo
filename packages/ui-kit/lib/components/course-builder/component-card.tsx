interface StructureComponentProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export function ComponentCard({
    name,
    icon,
    onClick,
}: StructureComponentProps) {
    return (
        <div
            className="flex items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-base-neutral-700 active:bg-base-neutral-500 transition-colors duration-150"
            onClick={onClick}
        >
            <div className="flex items-center">{icon}</div>
            <span className="text-md text-text-primary">{name}</span>
        </div>
    );
}
