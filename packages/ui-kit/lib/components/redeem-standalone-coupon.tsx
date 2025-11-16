'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { useState } from 'react';
import { Button } from './button';
import { InputField } from './input-field';
import { IconClose } from './icons/icon-close';
import { IconCheck } from './icons/icon-check';
import { IconCourse } from './icons/icon-course';
import { IconPackageCourseBundle } from './icons/icon-package-course-bundle';
import { IconCoachingSession } from './icons/icon-coaching-session';
import { IconGroup } from './icons/icon-group';
import { IconCoupon } from './icons/icon-coupon';
import { Badge } from './badge';
import { Divider } from './divider';
import { UserAvatar } from './avatar/user-avatar';
import { IconError, IconLoaderSpinner } from './icons';

type CouponType = 'course' | 'package' | 'coaching' | 'group';

interface CourseItem {
    title: string;
    imageUrl?: string;
}

interface CouponData {
    type: CouponType;
    title?: string;
    imageUrl?: string;
    courses?: CourseItem[];
}

interface RedeemStandaloneCouponProps extends isLocalAware {
    onRedeem: (couponCode: string) => Promise<{
        valid: boolean;
        data?: CouponData;
    }>;
    onClose: () => void;
}

type ComponentState =
    | 'default'
    | 'invalid'
    | 'redeeming'
    | 'redeemed';

export default function RedeemStandaloneCoupon(
    props: RedeemStandaloneCouponProps,
) {
    const dictionary = getDictionary(props.locale).components
        .redeemStandaloneCouponModal;

    const [couponCode, setCouponCode] = useState<string>('');
    const [state, setState] = useState<ComponentState>('default');
    const [couponData, setCouponData] = useState<CouponData | null>(null);

    // Handle input change
    const handleCouponChange = (value: string) => {
        setCouponCode(value);
        // Reset error state when user starts typing again
        if (state === 'invalid') {
            setState('default');
        }
    };

    // Handle redeem button click - single operation
    const handleRedeem = async () => {
        if (!couponCode.trim()) return;

        setState('redeeming');

        try {
            const result = await props.onRedeem(couponCode);

            if (result.valid && result.data) {
                setCouponData(result.data);
                setState('redeemed');
            } else {
                setState('invalid');
                setCouponData(null);
            }
        } catch {
            setState('invalid');
            setCouponData(null);
        }
    };

    // Icons per type of coupon (course, package, coaching and group)
    const getTypeIcon = (type: CouponType) => {
        switch (type) {
            case 'course':
                return <IconCourse classNames="text-text-secondary" size="5" />;
            case 'package':
                return (
                    <IconPackageCourseBundle
                        classNames="text-text-secondary"
                        size="5"
                    />
                );
            case 'coaching':
                return (
                    <IconCoachingSession
                        classNames="text-text-secondary"
                        size="5"
                    />
                );
            case 'group':
                return <IconGroup classNames="text-text-secondary" size="5" />;
        }
    };

    // Text for what type of coupon is (course, package, coaching and group)
    const getTypeLabel = (type: CouponType, isMultiple = false) => {
        switch (type) {
            case 'course':
                return isMultiple ? dictionary.courses : dictionary.course;
            case 'package':
                return dictionary.package;
            case 'coaching':
                return dictionary.coachingSession;
            case 'group':
                return dictionary.group;
        }
    };

    const getRedeemedText = (type: CouponType, isMultiple = false) => {
        switch (type) {
            case 'course':
                return isMultiple ? dictionary.freeCoursesRedeemed : dictionary.freeCourseRedeemed;
            case 'package':
                return dictionary.freePackageRedeemed;
            case 'coaching':
                return dictionary.freeCoachingRedeemed;
            case 'group':
                return dictionary.freeGroupRedeemed;
        }
    };

    // Redeemed State
    if (state === 'redeemed' && couponData) {
        const isMultipleCourses = couponData.type === 'course' && couponData.courses && couponData.courses.length > 1;
        const hasCoursesList = couponData.type === 'course' && couponData.courses && couponData.courses.length > 0;

        return (
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex w-full">
                    <h2 className="text-center">
                        {dictionary.couponRedeemedTitle}
                    </h2>
                </div>

                {/* Success Card */}
                <div className="bg-base-neutral-800 border border-base-neutral-700 rounded-lg p-4 flex flex-col gap-4">
                    {/* Success Icon */}
                    <div className="bg-base-neutral-700 border border-base-neutral-600 rounded-lg w-fit">
                        <IconCheck
                            size="6"
                            classNames="text-feedback-success-primary m-2"
                        />
                    </div>

                    {/* Success Badge */}
                    <Badge
                        variant="successprimary"
                        text={getRedeemedText(couponData.type, isMultipleCourses)}
                        size="big"
                        className="w-fit"
                    />
                    <Divider className="my-2" />

                    {/* Course/Package Info */}
                    {hasCoursesList ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(couponData.type)}
                                <span className="text-text-secondary text-sm md:text-md">
                                    {getTypeLabel(couponData.type, isMultipleCourses)}
                                </span>
                            </div>
                            {couponData.courses?.map((course, index) => (
                                <div key={index} className="flex items-center gap-2 ml-8">
                                    <UserAvatar
                                        size="xSmall"
                                        imageUrl={course.imageUrl}
                                        fullName={course.title}
                                        className="rounded-small"
                                    />
                                    <span className="text-text-primary font-important text-sm md:text-md">
                                        {course.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(couponData.type)}
                                <span className="text-text-secondary text-sm md:text-md">
                                    {getTypeLabel(couponData.type)}
                                </span>
                                {(couponData.type === 'course' ||
                                    couponData.type === 'package') && couponData.title && (
                                    <>
                                        <UserAvatar
                                            size="xSmall"
                                            imageUrl={couponData.imageUrl}
                                            fullName={couponData.title}
                                            className="rounded-small"
                                        />
                                        <span className="text-text-primary font-important text-sm md:text-md">
                                            {couponData.title}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <Button
                    className="w-full"
                    variant="primary"
                    size="medium"
                    text={dictionary.closeButton}
                    onClick={props.onClose}
                />
            </div>
        );
    }

    // Default, Invalid, or Redeeming State
    const isRedeeming = state === 'redeeming';
    const isInvalid = state === 'invalid';
    const canRedeem = couponCode.trim().length > 0 && !isRedeeming;

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col items-start gap-3 w-full">
                <h4>{dictionary.title}</h4>
            </div>

            {/* Input Field */}
            <div className="flex flex-col gap-1 w-full">
                <p className="text-sm md:text-md text-text-secondary">
                    {dictionary.couponCodeLabel}
                </p>
                <div className="relative">
                    <InputField
                        value={couponCode}
                        setValue={handleCouponChange}
                        inputText={dictionary.couponCodePlaceholder}
                        state={
                            isRedeeming
                                ? 'disabled'
                                : isInvalid
                                  ? 'error'
                                  : 'placeholder'
                        }
                        hasLeftContent={true}
                        leftContent={
                            <IconCoupon
                                size="6"
                                classNames={isRedeeming ? 'text-text-secondary' : ''}
                            />
                        }
                        hasRightContent={isInvalid}
                        rightContent={
                            isInvalid ? (
                                <IconError classNames="text-feedback-error-primary" />
                            ) : undefined
                        }
                        inputClassName={isRedeeming ? 'text-text-secondary' : ''}
                    />
                    {isInvalid && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="bg-error-light w-6 h-6 rounded-full flex items-center justify-center">
                                <IconClose size="4" classNames="text-error" />
                            </div>
                        </div>
                    )}
                </div>
                {isInvalid && (
                    <div className="flex items-center gap-1 mt-1">
                        <IconError
                            size="4"
                            classNames="text-feedback-error-primary"
                        />
                        <span className="text-feedback-error-primary text-xs md:text-sm">
                            {dictionary.couponInvalid}
                        </span>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <Button
                className="w-full"
                variant="primary"
                size="medium"
                text={isRedeeming ? dictionary.redeeming : dictionary.redeemButton}
                onClick={handleRedeem}
                disabled={!canRedeem}
                hasIconLeft={isRedeeming}
                iconLeft={
                    isRedeeming ? (
                        <IconLoaderSpinner classNames="animate-spin text-text-primary-inverted" />
                    ) : undefined
                }
            />
            <Button
                className="w-full"
                variant="text"
                size="medium"
                text={dictionary.closeButton}
                onClick={props.onClose}
                disabled={isRedeeming}
            />
        </div>
    );
}
