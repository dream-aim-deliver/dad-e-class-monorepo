import { useEffect, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';

export interface CoachesSkeletonProps extends isLocalAware {
    onRegister: () => void;
}

// Custom hook to get skeleton count based on screen size
function useResponsiveSkeletonCount() {
    const [count, setCount] = useState(6);

    useEffect(() => {
        function updateCount() {
            if (window.innerWidth >= 1280) {
                setCount(6); // xl: desktop
            } else if (window.innerWidth >= 768) {
                setCount(4); // md: tablet
            } else {
                setCount(3); // mobile
            }
        }
        updateCount();
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);

    return count;
}

/**
 * A responsive skeleton component that displays placeholder coach cards while data is loading.
 *
 * It adapts the number of skeletons shown based on screen size:
 * - 6 on large screens (≥1280px)
 * - 4 on medium screens (≥768px)
 * - 3 on small screens
 *
 * Also includes a register button to encourage user action while content is loading.
 *
 * @param onRegister A callback function triggered when the "Register" button is clicked.
 * @param locale A string representing the current locale used for translated dictionary labels.
 *
 * @example
 * <CoachesSkeleton
 *   onRegister={() => console.log('Register clicked')}
 *   locale="en"
 * />
 */


export const CoachesSkeleton = ({
    onRegister,
    locale,
}: CoachesSkeletonProps) => {
    const dictionary = getDictionary(locale).components?.coachesSkeleton;
    
    if (!dictionary) {
        // This should never happen as dictionary is always defined
        return null;
    }
    const skeletonCount = useResponsiveSkeletonCount();

    return (
        <div className="flex flex-col w-full xl:w-[76rem] gap-4 p-5 sm:p-8 bg-card-fill rounded-xl border border-card-stroke">
            <h3 className="text-xl sm:text-2xl text-center text-text-primary">
                {dictionary.title}
            </h3>
            <div
                className="
                    grid gap-2 sm:gap-4 w-full
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-3
                "
            >
                {Array.from({ length: skeletonCount }).map((_, idx) => (
                    <div
                        key={idx}
                        className="
                            flex justify-between items-center
                            bg-base-neutral-800 rounded-small border border-base-neutral-700
                            p-2 sm:p-4
                            gap-2 sm:gap-4
                            w-full
                            min-h-[80px] sm:min-h-[110px] xl:min-h-[130px]                            
                        "
                    >
                        {/* Skeleton for avatar */}
                        <div
                            className="
                            flex-shrink-0
                            rounded-full
                            bg-base-neutral-500
                            w-13 h-13
                            sm:w-16 sm:h-16
                            xl:w-20 xl:h-20
                            animate-pulse
                        "
                        />
                        {/* Skeleton for title and description */}
                        <div className="flex flex-col items-start gap-2 w-full">
                            <div
                                className="rounded-lg bg-base-neutral-600
                                h-5 w-full
                                sm:h-6 sm:w-full
                                xl:h-8 xl:w-full
                                animate-pulse
                            "
                            />
                            <div
                                className="rounded-lg bg-base-neutral-600
                                h-5 w-1/3
                                sm:h-6 sm:w-2/3
                                xl:h-8 xl:w-2/5
                                animate-pulse
                            "
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button
                size="big"
                variant="primary"
                text={dictionary.registerButton}
                onClick={onRegister}
                className="self-center w-full sm:w-auto mt-2 sm:mt-4"
            />
        </div>
    );
};
