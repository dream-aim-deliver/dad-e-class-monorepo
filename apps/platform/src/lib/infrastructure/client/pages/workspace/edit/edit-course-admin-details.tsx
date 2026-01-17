import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import {
    DefaultError,
    DefaultLoading,
    CheckBox,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import React, { useEffect, useState } from 'react';
import { useCourseDetails } from './hooks/edit-details-hooks';

interface EditCourseAdminDetailsProps {
    slug: string;
    courseVersion: number | null;
    setCourseVersion: React.Dispatch<React.SetStateAction<number | null>>;
    isPublic: boolean;
    setIsPublic: (value: boolean) => void;
    basePrice: number | null;
    setBasePrice: (value: number | null) => void;
    priceIncludingCoachings: number | null;
    setPriceIncludingCoachings: (value: number | null) => void;
    setIsEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditCourseAdminDetails(props: EditCourseAdminDetailsProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.editCourse.adminDetails');
    const editCourseT = useTranslations('pages.editCourse');
    const courseViewModel = useCourseDetails(props.slug);

    const [isFormLoading, setIsFormLoading] = useState(true);

    useEffect(() => {
        if (!courseViewModel || courseViewModel.mode !== 'default') return;
        const course = courseViewModel.data;

        // Initialize form with existing admin data if available
        props.setCourseVersion(course.courseVersion);

        // Initialize admin fields from course data
        if ('public' in course && typeof course.public === 'boolean') {
            props.setIsPublic(course.public);
        }
        if ('basePrice' in course && (course.basePrice === null || typeof course.basePrice === 'number')) {
            props.setBasePrice(course.basePrice);
        }
        if ('priceIncludingCoachings' in course && (course.priceIncludingCoachings === null || typeof course.priceIncludingCoachings === 'number')) {
            props.setPriceIncludingCoachings(course.priceIncludingCoachings);
        }

        setIsFormLoading(false);
        props.setIsEdited(false);
    }, [courseViewModel]);

    if (!courseViewModel || isFormLoading) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (courseViewModel.mode !== 'default') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={editCourseT('error.title')}
                description={editCourseT('error.description')}
            />
        );
    }

    return (
        <div className="w-full p-4 bg-card-fill rounded-md flex flex-col gap-4 border-1 border-card-stroke">
            <div className="flex flex-col gap-4">
                {/* Public Checkbox */}
                <div className="flex flex-col gap-1">
                    <CheckBox
                        name="public-checkbox"
                        value="public"
                        label={t('publicLabel')}
                        checked={props.isPublic}
                        onChange={() => {
                            props.setIsPublic(!props.isPublic);
                            props.setIsEdited(true);
                        }}
                        withText={true}
                        labelClass="text-sm md:text-md text-text-secondary"
                    />
                    <p className="text-sm text-text-secondary ml-11">
                        {t('publicHelper')}
                    </p>
                </div>

                {/* Price Inputs - Side by Side */}
                <div className="flex gap-4">
                    {/* Base Price Input */}
                    <div className="flex flex-col gap-1 flex-1">
                        <label htmlFor="base-price" className="text-sm md:text-md text-text-secondary">
                            {t('basePriceLabel')}
                        </label>
                        <InputField
                            id="base-price"
                            inputText={t('basePricePlaceholder')}
                            type="number"
                            value={props.basePrice?.toString() ?? ''}
                            setValue={(value) => {
                                // Validate that input is a valid number
                                if (value === '' || value === null) {
                                    props.setBasePrice(null);
                                    props.setIsEdited(true);
                                    return;
                                }
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue) && numValue >= 0) {
                                    props.setBasePrice(numValue);
                                    props.setIsEdited(true);
                                }
                            }}
                            min={0}
                        />
                        <p className="text-sm text-text-secondary">
                            {t('basePriceHelper')}
                        </p>
                    </div>

                    {/* Price Including Coachings Input */}
                    <div className="flex flex-col gap-1 flex-1">
                        <label htmlFor="price-including-coachings" className="text-sm md:text-md text-text-secondary">
                            {t('priceIncludingCoachingsLabel')}
                        </label>
                        <InputField
                            id="price-including-coachings"
                            inputText={t('priceIncludingCoachingsPlaceholder')}
                            type="number"
                            value={props.priceIncludingCoachings?.toString() ?? ''}
                            setValue={(value) => {
                                // Validate that input is a valid number
                                if (value === '' || value === null) {
                                    props.setPriceIncludingCoachings(null);
                                    props.setIsEdited(true);
                                    return;
                                }
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue) && numValue >= 0) {
                                    props.setPriceIncludingCoachings(numValue);
                                    props.setIsEdited(true);
                                }
                            }}
                            min={0}
                        />
                        <p className="text-sm text-text-secondary">
                            {t('priceIncludingCoachingsHelper')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
