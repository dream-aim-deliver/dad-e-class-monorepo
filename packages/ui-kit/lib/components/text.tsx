import { cn } from "../utils/style-utils";

export function PageTitle({ text }: { text: string }) {
    return <h1 className="text-4xl lg:text-5xl text-text-primary font-bold">
        {text}
    </h1>;
}

export function SectionHeading({ text, className = "" }: { text: string, className?: string }) {
    return <h2 className={cn(
        "text-2xl lg:text-3xl text-text-primary font-bold",
        className
    )}>
        {text}
    </h2>;
} 

export function SubsectionHeading({ text }: { text: string }) {
    return <h3 className="text-xl lg:text-2xl text-text-primary font-bold">
        {text}
    </h3>;
}

export function Description({ text }: { text: string }) {
    return <p className="text-lg text-text-secondary leading-[150%]">
        {text}
    </p>;
}
