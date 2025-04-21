import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './badge';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

interface SkillBadgesProps {
    skills: string[];
    locale?: TLocale;
}

/**
 * A component that displays a list of skill badges with a toggle for overflow.
 *
 * @param {SkillBadgesProps} props - The component props.
 * @param {string[]} props.skills - The array of skills to be displayed as badges.
 * @param {TLocale} [props.locale] - The locale for translations.
 *
 * @returns {JSX.Element} A list of skill badges with a toggle for overflow.
 * 
 * @description
 * The SkillBadges component displays a list of skill badges. If the list overflows, it shows a "Show more" button to expand the view.
 * When expanded, it shows all badges and a "Show less" button to collapse the view. The component also handles window resizing to check for overflow.
 * The component uses a ref to track the container's height and scroll position, and it calculates the number of hidden badges based on the visible area.
 * The component is designed to be responsive and works well with different screen sizes.
 */


const SkillBadges: React.FC<SkillBadgesProps> = ({ skills = [], locale }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);
    const containerRef = useRef(null);
    const dictionary = getDictionary(locale);

    useEffect(() => {
        if (!containerRef.current) return;

        const checkOverflow = () => {
            const container = containerRef.current;
            const isContentOverflowing = container.scrollHeight > container.clientHeight;
            setIsOverflowing(isContentOverflowing);

            if (isContentOverflowing) {
                const visibleRatio = container.clientHeight / container.scrollHeight;
                const approximateVisibleCount = Math.floor(skills.length * visibleRatio);
                setHiddenCount(skills.length - approximateVisibleCount);
            } else {
                setHiddenCount(0);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [skills, containerRef.current]);

    const toggleExpand = (expand: boolean) => {
        setExpanded(expand);

        if (!expand && containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="flex flex-col w-full min-h-8 max-h-24">
            <div
                ref={containerRef}
                className={`w-full flex flex-wrap gap-2 ${expanded ? 'max-h-24 overflow-y-auto' : 'max-h-16 overflow-hidden'
                    }`}
            >
                {skills.map((skill) => (
                    <Badge
                        key={skill}
                        text={skill}
                        className="h-6 py-1 text-base max-w-full"
                    />
                ))}

                {expanded && (
                    <Badge
                        className="h-6 w-auto py-1 text-base cursor-pointer"
                        text="Show less"
                        onClick={() => toggleExpand(false)}
                    />
                )}
            </div>

            {!expanded && isOverflowing && (

                <div className="flex">
                    <Badge
                        className="h-6 py-1 text-base cursor-pointer"
                        text={`+${hiddenCount} ${dictionary.components.coachCard.more}...`}
                        onClick={() => toggleExpand(true)}
                    />
                </div>

            )}
        </div>
    );
};

export default SkillBadges;