'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './badge';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';

interface SkillBadgesProps {
    skills: string[];
    locale: TLocale;
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
 * The component uses refs to track visible and hidden badges, giving an accurate count of hidden items.
 * The component is designed to be responsive and works well with different screen sizes.
 */
const SkillBadges: React.FC<SkillBadgesProps> = ({ skills = [], locale }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dictionary = getDictionary(locale);

    // Initialize badge refs array
    useEffect(() => {
        badgeRefs.current = badgeRefs.current.slice(0, skills.length);
    }, [skills]);

    useEffect(() => {
        if (!containerRef.current) return;

        const checkOverflow = () => {
            const container = containerRef.current;
            if (!container) return;

            // Reset
            setIsOverflowing(false);
            setHiddenCount(0);

            if (container.scrollHeight > container.clientHeight) {
                setIsOverflowing(true);
                // Calculate which badges are actually visible
                let visibleCount = 0;
                let lastVisibleIndex = -1;

                badgeRefs.current.forEach((badgeRef, index) => {
                    if (!badgeRef) return;

                    const badgeRect = badgeRef.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // Check if badge is fully visible within container
                    if (
                        badgeRect.top >= containerRect.top &&
                        badgeRect.bottom <= containerRect.bottom &&
                        badgeRect.left >= containerRect.left &&
                        badgeRect.right <= containerRect.right
                    ) {
                        visibleCount++;
                        lastVisibleIndex = index;
                    }
                    // Check if badge is partially visible (for the last row)
                    else if (
                        badgeRect.top < containerRect.bottom &&
                        badgeRect.top >= containerRect.top
                    ) {
                        visibleCount++;
                        lastVisibleIndex = index;
                    }
                });

                // Set hidden count - how many badges are actually not visible
                setHiddenCount(skills.length - visibleCount);
            }
        };

        // Run after a short delay to ensure DOM updates are complete
        const timer = setTimeout(checkOverflow, 50);
        window.addEventListener('resize', checkOverflow);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [skills, expanded]);

    const toggleExpand = (expand: boolean) => {
        setExpanded(expand);

        if (!expand && containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="flex flex-col w-full max-h-24">
            <div
                ref={containerRef}
                className={`w-full flex flex-wrap gap-2 ${expanded ? 'max-h-16 overflow-y-auto' : 'max-h-8 overflow-hidden'
                    }`}
            >
                {skills.map((skill, index) => (
                    <div
                        key={skill}
                        ref={el => { badgeRefs.current[index] = el; }}
                    >
                        <Badge
                            text={skill}
                            className="h-6 py-1 text-base max-w-full"
                        />
                    </div>
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