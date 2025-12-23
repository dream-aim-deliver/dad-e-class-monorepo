'use client';

import { useState } from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useImageComponent } from '../../contexts/image-component-context';

export interface PlatformCardProps extends isLocalAware {
    imageUrl?: string;
    platformName: string;
    courseCount: number;
    onClickManage: () => void;
}

/**
 * A simple platform card component displaying platform information.
 *
 * Shows a platform image (avatar-sized), title, course count badge, and manage button.
 *
 * @param imageUrl The URL of the platform image/logo
 * @param title The platform title/name
 * @param courseCount The number of courses in the platform
 * @param onClickManage Callback for when the "Manage" button is clicked
 * @param locale The current locale for translations
 *
 * @example
 * <PlatformCard
 *   imageUrl="https://example.com/platform-logo.png"
 *   title="My Learning Platform"
 *   courseCount={12}
 *   locale="en"
 *   onClickManage={() => console.log('Manage clicked')}
 * />
 */
export const PlatformCard = ({
    imageUrl,
    platformName: title,
    courseCount,
    locale,
    onClickManage,
}: PlatformCardProps) => {
    const dictionary = getDictionary(locale);
    const [isImageError, setIsImageError] = useState(false);
    const ImageComponent = useImageComponent();

    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-4 rounded-medium border border-card-stroke bg-card-fill w-full">
            {/* Platform Image/Avatar */}
            {shouldShowPlaceholder ? (
                <UserAvatar
                    fullName={title}
                    size="large"
                />
            ) : (
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <ImageComponent
                        src={imageUrl}
                        alt={title}
                        width={64}
                        height={64}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h6>
                    {title}
                </h6>

                {/* Course Count Badge */}
                {courseCount > 0 && (
                    <div className="mt-1">
                        <Badge
                            text={
                                courseCount +
                                ' ' +
                                dictionary.components.packages.coursesText
                            }
                            className="h-6 py-1 text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Manage Button */}
            <Button
                variant="primary"
                size="medium"
                text={dictionary.components.courseCard.manageButton}
                onClick={onClickManage}
                className='w-full'
            />
        </div>
    );
};

