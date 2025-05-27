import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';

export interface GroupCourseBannerProps extends isLocalAware {
    studentsName: string;
    children: React.ReactNode;
    onClickGroupWorkspace: () => void;
}

export const GroupCourseBanner = ({
    studentsName,
    onClickGroupWorkspace,
    children,
    locale,
}: GroupCourseBannerProps) => {
    const dictionary = getDictionary(locale).components.groupCourseBanner;
    return (
        <div className="flex flex-row w-full p-3 items-center gap-16 bg-base-neutral-800 rounded-small border border-base-neutral-700">
            <div className="flex flex-col gap-3 justify-start items-left">
                <p className="text-sm text-text-primary font-important">
                    {' '}
                    {dictionary.takenAlsoBy}{' '}
                </p>
                <div className="flex flex-row items-center gap-4">
                    {children}
                    <p className="text-sm text-text-primary">{studentsName}</p>
                </div>
            </div>
            <div className="flex-1 flex justify-end">
                <Button
                    size="medium"
                    variant="primary"
                    text={dictionary.groupWorkspaceButton}
                    onClick={onClickGroupWorkspace}
                />
            </div>
        </div>
    );
};
