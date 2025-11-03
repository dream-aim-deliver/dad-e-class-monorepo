interface EditLayoutProps {
    panel: React.ReactNode;
    editor: React.ReactNode;
}

export default function EditLayout(props: EditLayoutProps) {
    return (
        <div className="flex lg:flex-row flex-col gap-4 text-text-primary">
            <div className="sticky top-40 bottom-30 h-fit overflow-y-auto flex flex-col gap-3 bg-card-fill border border-base-neutral-700 rounded-lg p-4 lg:w-[300px] w-full">
                {props.panel}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                {props.editor}
            </div>
        </div>
    );
}
