import { cn } from "../../utils/style-utils";

export default function LoadingOverlay({className}: {className?: string}) {
    return <div className={cn("absolute inset-0 bg-base-neutral-950/50 flex items-center justify-center z-10 rounded-xl", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-transparent border-t-neutral-100"></div>
    </div>;
}