interface StructureComponentProps {
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

export function ComponentCard({ name, icon, onClick }: StructureComponentProps) {
    return (
        <div
            className="flex items-center gap-2 bg-base-neutral-800 border border-base-neutral-700 rounded-lg p-4 cursor-pointer"
            onClick={onClick}
        >
            {icon}
            <span className="text-lg">{name}</span>
        </div>
    );
}
