import { cn } from '../utils/style-utils';
import { Description, PageTitle } from './text';

interface OutlineProps {
    title: string;
    description: string;
    className?: string;
}

export function Outline({ title, description, className }: OutlineProps) {
    return (
        <div className={cn('flex flex-col gap-5 items-start w-full', className)}>
            <PageTitle text={title} />
            <Description text={description} />
        </div>
    );
}
