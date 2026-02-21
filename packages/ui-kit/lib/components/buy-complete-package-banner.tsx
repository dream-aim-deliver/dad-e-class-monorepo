'use client';

import { useRef } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { IconClock } from './icons/icon-clock';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TEClassPackage } from 'packages/models/src/eclass-package';
import { UserAvatar } from './avatar/user-avatar';
import { CheckBox } from './checkbox';
import Tooltip from './tooltip';
import { formatPrice } from '../utils/format-utils';

export interface BuyCompletePackageBannerProps
    extends TEClassPackage,
        isLocalAware {
    onClickPurchase?: () => void;
    titleBanner: string;
    descriptionBanner: string;
    coachingIncluded?: boolean;
    onToggleCoaching?: () => void;
}

/**
 * A banner component designed to promote the purchase of a complete e-learning package.
 * Displays marketing content including title, description, pricing details, avatar image,
 * duration, and a call-to-action button, along with optional coaching inclusion information.
 *
 * @param titleBanner The main headline for the banner (e.g., promotional message).
 * @param descriptionBanner A short supporting message displayed below the titleBanner.
 * @param imageUrl The URL of the instructor or package avatar image.
 * @param title The title of the package offering.
 * @param description A short description of what the package includes.
 * @param duration The total duration of the package content, in minutes.
 *                 Automatically formatted to hours and minutes (e.g., "2h 30m").
 * @param pricing An object representing the full and discounted pricing details.
 * @param pricing.currency The currency symbol or code (e.g., "CHF", "USD").
 * @param pricing.fullPrice The original price of the package before any discount.
 * @param pricing.partialPrice The amount the user saves, shown as a discount.
 * @param locale The user's locale for localization and translation (e.g., "en", "de").
 * @param onClickPurchase Optional callback triggered when the "Buy Now" button is clicked.
 *
 * @example
 * <BuyCompletePackageBanner
 *   titleBanner="Unlock the Complete Package"
 *   descriptionBanner="Includes every course, feature, and coaching session"
 *   imageUrl="https://example.com/avatar.jpg"
 *   title="Full Access Pass"
 *   description="Everything you need to master the subject"
 *   duration={180}
 *   pricing={{ currency: 'CHF', fullPrice: 860, partialPrice: 240 }}
 *   locale="en"
 *   onClickPurchase={() => console.log('Purchased')}
 * />
 *
 * @remarks
 * - If `duration` is 0 or undefined, the duration badge will not be displayed.
 * - The avatar is displayed using `UserAvatar`; if `imageUrl` is invalid, fallback behavior depends on the component.
 * - A localized label "Coaching included" is always shown with a checked checkbox.
 * - The layout is responsive and adapts across mobile and desktop breakpoints using Tailwind classes.
 */

export const BuyCompletePackageBanner = ({
    titleBanner,
    descriptionBanner,
    imageUrl,
    title,
    description,
    duration,
    pricing,
    locale,
    onClickPurchase,
    coachingIncluded = true,
    onToggleCoaching,
}: BuyCompletePackageBannerProps) => {
    const dictionary =
        getDictionary(locale).components.buyCompletePackageBanner;
    const titleRef = useRef<HTMLHeadingElement>(null);

    const formatDuration = (duration?: number): string => {
        if (!duration || duration <= 0) return '';
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    return (
        <div className="flex flex-col xl:flex-row w-full bg-background text-text-primary gap-2 lg:items-center justify-between">
            <div className="flex flex-col max-w-120 w-full">
                <h3 className="text-text-primary mb-4">{titleBanner}</h3>
                <p className="text-md text-text-secondary">
                    {descriptionBanner}
                </p>
            </div>

            <div className="flex flex-col px-6 py-4 gap-3 rounded-medium bg-base-neutral-800 border-[1px] border-base-neutral-700 max-w-120 w-full">
                <div className="flex gap-4 items-center">
                    <UserAvatar
                        size="medium"
                        imageUrl={imageUrl}
                        className="rounded-small"
                    />
                    <div className="flex flex-col gap-2">
                        <h3 ref={titleRef} className="text-xl lg:text-2xl">
                            {title}
                        </h3>

                        <div className="flex gap-2 items-center">
                            {(duration as number) > 0 && (
                                <Badge
                                    hasIconLeft
                                    iconLeft={<IconClock size="4" />}
                                    text={formatDuration(duration)}
                                    className="text-sm"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4">
                    <p className="text-text-secondary text-md lg:text-lg">
                        {description}
                    </p>
                    <CheckBox
                        name="coachingIncluded"
                        value="coachingIncluded"
                        checked={coachingIncluded}
                        onChange={onToggleCoaching}
                        disabled={!onToggleCoaching}
                        size="medium"
                        withText={true}
                        label={dictionary.coachingIncluded}
                        labelClass="text-text-secondary text-md"
                    />

                    <div className="flex flex-row gap-4 items-center w-full justify-between">
                        <div className="flex-grow">
                            <Button
                                className="w-full"
                                variant="primary"
                                size="big"
                                text={dictionary.purchaseButton}
                                onClick={onClickPurchase}
                            />
                        </div>
                        <div className="flex flex-col items-end text-right shrink-0">
                            {/* Strikethrough original price when there's a discount */}
                            {(pricing as any).fullPrice > (pricing as any).partialPrice && (
                                <span className="text-text-secondary line-through text-sm">
                                    {(pricing as any).currency} {formatPrice((pricing as any).fullPrice)}
                                </span>
                            )}
                            <h6 className="text-text-primary lg:text-lg text-md">
                                {dictionary.fromText} {(pricing as any).currency}{' '}
                                {formatPrice((pricing as any).partialPrice)}
                            </h6>
                            {/* Use backend savings based on coaching toggle */}
                            {(() => {
                                const savings = coachingIncluded
                                    ? (pricing as any).savingsWithCoachings
                                    : (pricing as any).savingsWithoutCoachings;
                                return savings != null && savings > 0 ? (
                                    <div className="flex items-center gap-1">
                                        <p className="text-feedback-success-primary lg:text-md text-sm font-bold">
                                            {dictionary.saveText} {(pricing as any).currency} {formatPrice(savings)}
                                        </p>
                                        <Tooltip
                                            text=""
                                            description={getDictionary(locale).components.packages.savingsTooltip}
                                        />
                                    </div>
                                ) : null;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};