import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './badge';
interface SkillBadgesProps {
    skills: string[];
}
const SkillBadges: React.FC<SkillBadgesProps> = ({ skills = [] }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hiddenCount, setHiddenCount] = useState(0);
    const containerRef = useRef(null);


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


    const toggleExpand = (expand) => {
        setExpanded(expand);


        if (!expand && containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="relative flex flex-col gap-1">
        <div
            ref={containerRef}
            className={`relative w-full flex flex-wrap gap-2 transition-all duration-100 ${expanded
                    ? 'max-h-24 overflow-y-auto'
                    : 'max-h-16 overflow-hidden '
                }`}
        >
            {skills.map((skill) => (
                <Badge
                    key={skill}
                    text={skill}
                    className="h-6 py-1 text-base max-w-full"
                />
            ))}

            {/* Only show the "more" badge when content is actually overflowing and not expanded */}


            {/* Show "show less" when expanded */}
            {expanded && (
                <Badge
                    className="h-6 w-auto py-1 text-base cursor-pointer"
                    text="Show less"
                    onClick={() => toggleExpand(false)}
                />
            )}
        </div>
        {!expanded && isOverflowing && (
                <div className=" absolute -bottom-6 left-0 ">
                    <Badge
                        className="h-6 w-auto py-1 text-base cursor-pointer"
                        text={`+${hiddenCount} more...`}
                        onClick={() => toggleExpand(true)}
                    />
                </div>
            )}
        </div>
    );
};

export default SkillBadges;