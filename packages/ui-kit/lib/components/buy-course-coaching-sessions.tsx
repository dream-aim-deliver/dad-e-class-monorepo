'use client';

import { useMemo, useState } from 'react';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { CheckBox } from './checkbox';
import { formatPrice } from '../utils/format-utils';

type CoachingSession = {
    status: "purchased" | "not_purchased" | "pending";
    coachingOfferingTitle: string;
    coachingOfferingDuration: number;
    coachingSessionId: number | null;
    lessonComponentId: string;
    lessonId: number;
    lessonTitle: string;
    moduleId: number;
    moduleTitle: string;
    purchaseDate: string | null;
};

type CoachingOffering = {
    id: string | number;
    name: string;
    price: number;
    duration: number;
    currency: string;
    description: string;
};

type SessionWithOffering = CoachingSession & {
    price: number;
    currency: string;
};

export interface BuyCourseCoachingSessionsProps extends isLocalAware {
    coachingSessions: CoachingSession[];
    coachingOfferings: CoachingOffering[];
    onPurchase: (lessonComponentIds: string[]) => void;
    onClose: () => void;
}

/**
 * Component for purchasing course-specific coaching sessions.
 * Allows explicit selection of individual lesson components.
 */
function BuyCourseCoachingSessionsContent({
    coachingSessions,
    coachingOfferings,
    onPurchase,
    onClose,
    locale,
}: BuyCourseCoachingSessionsProps) {
    const dictionary = getDictionary(locale);
    
    // Filter only unpurchased sessions and enrich with offering details
    const availableSessions = useMemo(() => {
        const unpurchasedSessions = coachingSessions.filter(
            s => s.status === 'not_purchased'
        );

        return unpurchasedSessions.map(session => {
            // Find the offering to get price and currency
            const offering = coachingOfferings.find(
                o => o.name === session.coachingOfferingTitle
            );
            
            return {
                ...session,
                price: offering?.price || 0,
                currency: offering?.currency || 'CHF',
            } as SessionWithOffering;
        });
    }, [coachingSessions, coachingOfferings]);

    // Track selected lessonComponentIds
    const [selectedLessonComponentIds, setSelectedLessonComponentIds] = useState<Set<string>>(new Set());

    // Calculate total cost
    const totalCost = useMemo(() => {
        return availableSessions
            .filter(session => selectedLessonComponentIds.has(session.lessonComponentId))
            .reduce((total, session) => total + session.price, 0);
    }, [availableSessions, selectedLessonComponentIds]);

    // Get currency (assume all sessions use same currency)
    const currency = availableSessions[0]?.currency || 'CHF';

    function handleToggleSession(lessonComponentId: string): void {
        setSelectedLessonComponentIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(lessonComponentId)) {
                newSet.delete(lessonComponentId);
            } else {
                newSet.add(lessonComponentId);
            }
            return newSet;
        });
    }

    function handlePurchase(): void {
        if (selectedLessonComponentIds.size > 0) {
            onPurchase(Array.from(selectedLessonComponentIds));
        }
    }

    if (availableSessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4">
                <p className="text-text-secondary text-md">
                    {dictionary.components.buyCourseCoachingSessions.noSessionsAvailable}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex flex-col gap-2 flex-shrink-0">
                <h5 className="text-xl font-bold text-text-primary">
                    {dictionary.components.buyCourseCoachingSessions.title}
                </h5>
                <p className="text-text-secondary text-md md:text-lg">
                    {dictionary.components.buyCourseCoachingSessions.description}
                </p>
            </div>

            {/* Body */}
            <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
                {availableSessions.map((session) => {
                    const isSelected = selectedLessonComponentIds.has(session.lessonComponentId);
                    
                    return (
                        <div
                            key={session.lessonComponentId}
                            className="flex items-center gap-3 py-4 border-b border-divider last:border-b-0"
                        >
                            <div className="flex-1 flex flex-col gap-1">
                                {/* Offering title -> Price -> Duration */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h6 className="text-lg font-semibold text-text-primary">
                                        {session.coachingOfferingTitle}
                                    </h6>
                                    <span className="text-text-secondary">•</span>
                                    <p className="text-xs md:text-sm font-important text-text-secondary">
                                        {formatPrice(session.price)} {session.currency}
                                    </p>
                                    <span className="text-text-secondary">•</span>
                                    <p className="text-sm md:text-md text-text-secondary">
                                        {session.coachingOfferingDuration}{' '}
                                        {dictionary.components.buyCourseCoachingSessions.minutes}
                                    </p>
                                </div>
                                {/* Module Title */}
                                <p className="text-sm text-text-secondary font-medium">
                                    {session.moduleTitle}
                                </p>
                                {/* Lesson Title */}
                                <p className="text-xs text-text-secondary italic">
                                    {session.lessonTitle}
                                </p>
                            </div>
                            {/* Checkbox on the right, vertically centered */}
                            <div className="flex items-center">
                                <CheckBox
                                    name={`session-${session.lessonComponentId}`}
                                    value={session.lessonComponentId}
                                    checked={isSelected}
                                    onChange={handleToggleSession}
                                    size="medium"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total */}
            {totalCost > 0 && (
                <h6 className="text-right text-text-primary font-normal flex-shrink-0">
                    {dictionary.components.buyCourseCoachingSessions.total}: {formatPrice(totalCost)}{' '}
                    {currency}
                </h6>
            )}

            {/* Footer */}
            <div className="flex gap-2 flex-shrink-0">
                <Button
                    onClick={onClose}
                    variant="secondary"
                    text={dictionary.components.buyCourseCoachingSessions.cancelText}
                    className="flex-1"
                />
                <Button
                    onClick={handlePurchase}
                    variant="primary"
                    text={dictionary.components.buyCourseCoachingSessions.buttonText}
                    disabled={selectedLessonComponentIds.size === 0}
                    className="flex-1"
                />
            </div>
        </div>
    );
}

export function BuyCourseCoachingSessions(
    props: BuyCourseCoachingSessionsProps,
) {
    return <BuyCourseCoachingSessionsContent {...props} />;
}
