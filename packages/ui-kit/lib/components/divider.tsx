import { cn } from "../utils/style-utils";

export function Divider({ className = "" }) {
    return (
        <div className={cn("w-full border-t border-divider my-16", className)} />
    );
}
