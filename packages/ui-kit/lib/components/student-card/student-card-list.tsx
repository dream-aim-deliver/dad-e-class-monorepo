import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface StudentCardListProps extends isLocalAware {
    children?: React.ReactNode;
}

export function StudentCardList({ children, locale }: StudentCardListProps) {
    const dictionary = getDictionary(locale).components.studentCard;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                <p className="text-text-primary text-md">
                    {dictionary.emptyState}
                </p>
            </div>
        );
    }

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            role="list"
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <div
                        key={child?.key ?? `student-card-${index}`}
                        role="listitem"
                    >
                        {child}
                    </div>
                ))
            ) : (
                <div key="single-student-card" role="listitem">
                    {children}
                </div>
            )}
        </div>
    );
}
