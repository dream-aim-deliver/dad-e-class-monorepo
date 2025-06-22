export function PageTitle({ text }: { text: string }) {
    return <h1 className="text-4xl lg:text-5xl text-text-primary font-bold">
        {text}
    </h1>;
}

export function SectionHeading({ text }: { text: string }) {
    return <h2 className="text-2xl lg:text-mega text-text-primary font-bold">
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
