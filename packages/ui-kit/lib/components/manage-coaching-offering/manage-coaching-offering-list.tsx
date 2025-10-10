import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ManageCoachingOfferingListProps extends isLocalAware {
    children?: React.ReactNode;
}

export function ManageCoachingOfferingList({ children, locale }: ManageCoachingOfferingListProps) {
    const dictionary = getDictionary(locale).components.manageCategoryTopicItem;

    const isEmpty =
        !children || (Array.isArray(children) && children.length === 0);

    if (isEmpty) {
        return (
            <div className="flex flex-col p-5 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
                <p className="text-text-primary text-md">
                    {dictionary.emptyState}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div
                className="flex flex-col overflow-hidden gap-6"
                role="list"
            >
                {Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={child?.key ?? `topic-item-${index}`}
                            role="listitem"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    <div key="single-topic-item" role="listitem">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
