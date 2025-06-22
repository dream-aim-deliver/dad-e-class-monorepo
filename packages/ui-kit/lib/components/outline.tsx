import { cn } from '../utils/style-utils';

interface TitleProps {
    text: string;
}

export function Title({ text }: TitleProps) {
    return <p className="text-4xl text-text-primary font-bold leading-[100%] tracking-[-0.08rem]">
        {text}
    </p>;
}

interface DescriptionProps {
    text: string;
}

export function Description({ text }: DescriptionProps) {
    return <p className="text-lg text-text-secondary leading-[150%]">
        {text}
    </p>;
}

interface OutlineProps {
    title: string;
    description: string;
    className?: string;
}

export function Outline({ title, description, className }: OutlineProps) {
    return (
        <div className={cn('flex flex-col gap-[2.5625rem] items-start w-full', className)}>
            <Title text={title} />
            <Description text={description} />
        </div>
    );
}
