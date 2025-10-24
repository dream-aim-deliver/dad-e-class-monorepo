'use client';

import { useContentLocale } from '../hooks/use-platform-translations';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useState, useCallback } from 'react';
import { trpc } from '../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../hooks/use-platform-language-presenter';
import { getAuthorDisplayName } from '../utils/get-author-display-name';
import { useCreatePackagePresenter } from '../hooks/use-create-package-presenter';
import React from 'react';
import {
    Button,
    Stepper,
    Breadcrumbs,
    PackageDetailsStep,
    PackagePricingStep,
    PackageCoursesStep,
    PackagePreviewStep,
    Banner,
    FeedBackMessage,
} from '@maany_shr/e-class-ui-kit';
import type { PackageDetailsFormData, PackagePricingFormData } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fileMetadata } from '@maany_shr/e-class-models';
import { AccordionBuilderItem } from '@maany_shr/e-class-ui-kit';
import { usePackageFileUpload } from './common/hooks/use-package-file-upload';
import { idToNumber } from '../utils/id-to-number';
import { useEffect } from 'react';

// Types for course data
interface CourseData {
    id: string;
    slug: string;
    title: string;
    description: string;
    rating: number;
    reviewCount: number;
    language: { code: string; name: string };
    sessions: number;
    duration: { video: number; coaching: number; selfStudy: number };
    sales: number;
    imageUrl: string;
    author: { name: string; image: string; username: string };
    pricing: { fullPrice: number; currency: string; partialPrice: number };
}

// Types for package preview
interface PackagePreviewData {
    title: string;
    description: string;
    featuredImage: fileMetadata.TFileMetadata | null;
    showListItemNumbers: boolean;
    accordionItems: AccordionBuilderItem[];
    selectedCourses: CourseData[];
    pricingFormData: PackagePricingFormData;
    coachingIncluded: boolean;
}

export default function CreatePackage() {
    // Platform context
    const platformContext = useRequiredPlatformLocale();
    const contentLocale = useContentLocale();
    const locale = useLocale() as TLocale;
    const router = useRouter();
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const t = useTranslations('pages.createPackage');

    // CMS-specific context hooks
    const platformSlug = platformContext.platformSlug;
    const platformLocale = platformContext.platformLocale;

    // Data fetching - platform language (hydrated by RSC)
    const [platformLanguageResponse, { refetch: refetchPlatformLanguage }] = trpc.getPlatformLanguage.useSuspenseQuery({});
    const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
        viewModels.TPlatformLanguageViewModel | undefined
    >(undefined);
    const { presenter: platformLanguagePresenter } = useGetPlatformLanguagePresenter(
        setPlatformLanguageViewModel,
    );
    // @ts-ignore
    platformLanguagePresenter.present(platformLanguageResponse, platformLanguageViewModel);

    // Authentication check for CMS users
    const sessionDTO = useSession();
    const session = sessionDTO.data;
    const isLoggedIn = !!session;

    // Multi-step form state
    const [currentStep, setCurrentStep] = useState(1);
    
    // Package details form data
    const [packageDetailsFormData, setPackageDetailsFormData] = useState<PackageDetailsFormData>({
        packageTitle: '',
        packageDescription: '',
        featuredImage: null,
        showListItemNumbers: true,
        accordionItems: [],
    });

    // Pricing form data
    const [pricingFormData, setPricingFormData] = useState<PackagePricingFormData>({
        completePackageWithCoaching: '',
        completePackageWithoutCoaching: '',
        partialDiscounts: {
            '2': '',
            '3': '',
            '4': '',
            '5': '',
            '6': '',
            '7': ''
        }
    });

    // Course selection state
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]); // Start with empty selection

    // Preview state
    const [coachingIncluded, setCoachingIncluded] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);

    // Error and success message state
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Create package presenter
    const [createPackageViewModel, setCreatePackageViewModel] = useState<
        viewModels.TCreatePackageViewModel | undefined
    >(undefined);
    const { presenter: createPresenter } = useCreatePackagePresenter(setCreatePackageViewModel);

    // Courses data from TRPC usecase
    const [coursesResponse] = trpc.listCourses.useSuspenseQuery({});
    const allCourses: CourseData[] = (() => {
        if (!coursesResponse.success) return [];
        const payload: any = coursesResponse.data;
        const data = payload?.success ? payload.data : payload;
        const courses: any[] = data?.courses ?? [];
        return courses.map((course) => ({
            id: String(course.id),
            slug: course.slug,
            title: course.title,
            description: course.description,
            rating: course.averageRating ?? 0,
            reviewCount: course.reviewCount,
            language: { code: '', name: course.language },
            sessions: course.coachingSessionCount ?? 0,
            duration: { video: 0, coaching: 0, selfStudy: course.fullDuration },
            sales: course.salesCount,
            imageUrl: course.imageUrl ?? '',
            author: {
                name: getAuthorDisplayName(course.author.name, course.author.surname, locale),
                image: course.author.avatarUrl ?? '',
                username: course.author.username
            },
            pricing: {
                fullPrice: course.pricing.withCoaching ?? 0,
                partialPrice: course.pricing.base,
                currency: course.pricing.currency
            }
        }));
    })();


    // Handler for purchase click - show alert since this is preview mode
    const handleClickPurchase = () => {
        alert(t('alerts.previewPurchaseNotAvailable'));
    };

    // Handler for course details click - navigate to course page
    const handleCourseDetails = useCallback((courseId: string) => {
        const course = allCourses.find(c => c.id === courseId);
        if (course?.slug) {
            router.push(`/courses/${course.slug}`);
        }
    }, [allCourses, router]);

    // Handler for course author click - navigate to coach profile
    const handleCourseAuthorClick = useCallback((courseId: string) => {
        const course = allCourses.find(c => c.id === courseId);
        if (course?.author?.username) {
            router.push(`/coaches/${course.author.username}`);
        }
    }, [allCourses, router]);


    // File upload handlers using custom hook
    const [packageImageProgress, setPackageImageProgress] = useState<number | undefined>(undefined);
    const {
        handleFileChange: handleFeaturedImageUpload,
        handleDelete: handleDeleteFeaturedImage,
        handleDownload: handleDownloadFeaturedImage,
        uploadError: packageImageError,
    } = usePackageFileUpload("upload_package_image", null, setPackageImageProgress);

    const [iconUploadProgress, setIconUploadProgress] = useState<number | undefined>(undefined);
    const {
        handleFileChange: handleAccordionIconUpload,
        uploadError: iconUploadError,
        handleDelete: handleDeleteAccordionIcon,
        handleDownload: handleDownloadAccordionIcon,
    } = usePackageFileUpload("upload_package_accordion_item_icon", null, setIconUploadProgress);

    // Form data handlers
    const handlePackageDetailsChange = useCallback((updates: Partial<PackageDetailsFormData>) => {
        setPackageDetailsFormData((prev: PackageDetailsFormData) => ({ ...prev, ...updates }));
    }, []);

    const handlePricingChange = useCallback((updates: Partial<PackagePricingFormData>) => {
        setPricingFormData((prev: PackagePricingFormData) => ({ ...prev, ...updates }));
    }, []);

    // Course management functions
    const toggleCourseSelection = useCallback((courseId: string) => {
        setSelectedCourseIds(prev => 
            prev.includes(courseId) 
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    }, []);

    const createPackageMutation = trpc.createPackage.useMutation();

    // Handle create package mutation presentation
    useEffect(() => {
        if (createPackageMutation.isSuccess && createPackageMutation.data) {
            // @ts-ignore
            createPresenter.present(createPackageMutation.data, createPackageViewModel);
        }
    }, [createPackageMutation.isSuccess, createPackageMutation.data, createPresenter, createPackageViewModel]);

    // Handle create package success/error
    useEffect(() => {
        if (createPackageViewModel?.mode === 'default') {
            setSuccessMessage(t('successMessages.packageCreated'));
            setErrorMessage(null);
            // Redirect to packages list after successful create
            router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages`);
        }
        if (createPackageViewModel?.mode === 'kaboom') {
            setErrorMessage(t('errorMessages.createFailed'));
            setSuccessMessage(null);
            setIsPublishing(false);
        }
    }, [createPackageViewModel, router, locale, platformSlug, platformLocale]);

    // Handle mutation errors (network/unknown)
    useEffect(() => {
        if (createPackageMutation.isError) {
            setErrorMessage(createPackageMutation.error?.message || t('errorMessages.createFailed'));
            setSuccessMessage(null);
            setIsPublishing(false);
        }
    }, [createPackageMutation.isError, createPackageMutation.error]);
    
    const handlePublishPackage = useCallback(async () => {
        setIsPublishing(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        try {
            // Validate required data
            if (!packageDetailsFormData.packageTitle.trim()) {
                throw new Error('Package title is required');
            }
            if (!packageDetailsFormData.packageDescription.trim()) {
                throw new Error('Package description is required');
            }
            if (selectedCourseIds.length === 0) {
                throw new Error('At least one course must be selected');
            }

            // Build payload matching backend contract
            // TODO: Replace string parsing when backend exposes numeric price fields
            const price = parseFloat(pricingFormData.completePackageWithoutCoaching.replace(/[^\d.]/g, '')) || 0;
            const priceWithCoachings = parseFloat(pricingFormData.completePackageWithCoaching.replace(/[^\d.]/g, '')) || 0;

            const partialDiscountsPayload = Object.entries(pricingFormData.partialDiscounts)
                .map(([courseAmount, discount]) => ({
                    courseAmount: Number(courseAmount),
                    discountPercent: Number(String(discount).replace('%', '')),
                }))
                .filter(d => !Number.isNaN(d.courseAmount) && !Number.isNaN(d.discountPercent));

            const accordionItemsPayload = packageDetailsFormData.accordionItems.map((item: AccordionBuilderItem, idx: number) => ({
                title: item.title,
                description: item.content,
                position: idx + 1,
                iconId: idToNumber(item.icon?.id) ?? null,
            }));

            const courseIdsPayload = selectedCourseIds
                .map((id) => idToNumber(id))
                .filter((n): n is number => n !== undefined);

            const payload = {
                title: packageDetailsFormData.packageTitle,
                description: packageDetailsFormData.packageDescription,
                price,
                priceWithCoachings,
                partialDiscounts: partialDiscountsPayload,
                showAccordionNumbers: packageDetailsFormData.showListItemNumbers,
                accordionItems: accordionItemsPayload,
                courseIds: courseIdsPayload,
                featuredImageId: null,
            };

            const result = await createPackageMutation.mutateAsync(payload);
            
            // Success/error handling done by useEffect hooks
        } catch (error) {
            // Error handled by useEffect hooks
        }
    }, [
        packageDetailsFormData, selectedCourseIds, pricingFormData, 
        coachingIncluded, router, locale, platformSlug, platformLocale, createPackageMutation
    ]);

    // Get selected courses data
    const selectedCourses = allCourses.filter(course => selectedCourseIds.includes(course.id));

    // Pricing calculations
    const calculateIndividualCourseTotal = useCallback(() => {
        return selectedCourses.reduce((total, course) => {
            return total + (coachingIncluded ? course.pricing.fullPrice : course.pricing.partialPrice);
        }, 0);
    }, [selectedCourses, coachingIncluded]);

    const calculatePackagePrice = useCallback(() => {
        const basePrice = coachingIncluded 
            ? pricingFormData.completePackageWithCoaching 
            : pricingFormData.completePackageWithoutCoaching;
        
        // Extract numeric value from price string (e.g., "5400 CHF" -> 5400)
        const numericPrice = parseFloat(basePrice.replace(/[^\d.]/g, '')) || 0;
        return numericPrice;
    }, [pricingFormData, coachingIncluded]);

    const calculateSavings = useCallback(() => {
        const individualTotal = calculateIndividualCourseTotal();
        const packagePrice = calculatePackagePrice();
        return Math.max(0, individualTotal - packagePrice);
    }, [calculateIndividualCourseTotal, calculatePackagePrice]);

    // Calculate total duration from selected courses
    const calculateTotalDuration = useCallback(() => {
        return selectedCourses.reduce((total, course) => {
            const courseDuration = course.duration.video + course.duration.coaching + course.duration.selfStudy;
            return total + courseDuration;
        }, 0);
    }, [selectedCourses]);

    // Breadcrumbs following the standard pattern
    const breadcrumbItems = [
        {
            label: breadcrumbsTranslations('platforms'),
            onClick: () => router.push('/'),
        },
        {
            label: platformSlug.charAt(0).toUpperCase() + platformSlug.slice(1),
            onClick: () => {
                router.push(`/${locale}/platform/${platformSlug}/${platformLocale}`);
            },
        },
        {
            label: 'Packages',
            onClick: () => {
                router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages`);
            },
        },
        {
            label: t('breadcrumbs.createPackage'),
            onClick: () => {
                // Nothing should happen on clicking the current page
            },
        },
    ];

    // Authentication check
    if (!isLoggedIn) {
        router.push(`/${locale}/login`);
        return null;
    }

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2); // Move to Courses step
        } else if (currentStep === 2) {
            setCurrentStep(3); // Move to Pricing step
        } else if (currentStep === 3) {
            setCurrentStep(4); // Move to Preview step
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1); // Move back to Package Details step
        } else if (currentStep === 3) {
            setCurrentStep(2); // Move back to Courses step
        } else if (currentStep === 4) {
            setCurrentStep(3); // Move back to Pricing step
        }
    };

    const handleDiscard = () => {
        router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages`);
    };

        return (
        <div className="flex flex-col space-y-4">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            <div className="flex flex-col space-y-2">
                <h1>{t('title')}</h1>
                <p className="text-text-secondary text-sm">
                    {t('subtitle', { platformSlug, platformLocale: platformLocale.toUpperCase() })}
                </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
                <Banner
                    title={t('success')}
                    description={successMessage}
                    style="success"
                    closeable={true}
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            {/* Error Message */}
            {errorMessage && (
                <FeedBackMessage
                    type="error"
                    message={errorMessage}
                />
            )}

            {/* Step Navigation */}
            <Stepper.Root 
                key={`stepper-${currentStep}`}
                defaultStep={currentStep} 
                totalSteps={4}
                onStepChange={(step) => setCurrentStep(step)}
            >
                <Stepper.List>
                    <Stepper.Item 
                        step={1} 
                        description={t('stepper.details')} 
                    />
                    <Stepper.Item 
                        step={2} 
                        description={t('stepper.courses')} 
                    />
                    <Stepper.Item 
                        step={3} 
                        description={t('stepper.pricing')} 
                    />
                    <Stepper.Item 
                        step={4} 
                        description={t('stepper.preview')} 
                    />
                </Stepper.List>
            </Stepper.Root>

            {/* Step Content */}

            {/* Step 1: Package Details */}
            {currentStep === 1 && (
            <PackageDetailsStep
                formData={packageDetailsFormData}
                onFormDataChange={handlePackageDetailsChange}
                featuredImageUpload={{
                    onUpload: handleFeaturedImageUpload,
                    onDelete: handleDeleteFeaturedImage,
                    onDownload: handleDownloadFeaturedImage,
                    uploadProgress: packageImageProgress ?? 0,
                    errorMessage: packageImageError ?? '',
                }}
                accordionIconUpload={{
                    onUpload: handleAccordionIconUpload,
                    onDelete: handleDeleteAccordionIcon,
                    onDownload: handleDownloadAccordionIcon,
                    uploadProgress: iconUploadProgress ?? 0,
                    errorMessage: iconUploadError ?? '',
                }}
                locale={locale}
            />
            )}

            {/* Step 2: Course Selection */}
            {currentStep === 2 && (
            <PackageCoursesStep
                courses={allCourses}
                selectedCourseIds={selectedCourseIds}
                onToggleCourseSelection={toggleCourseSelection}
                locale={locale}
            />
            )}

            {/* Step 3: Pricing Configuration */}
            {currentStep === 3 && (
                <PackagePricingStep
                    formData={pricingFormData}
                    onFormDataChange={handlePricingChange}
                    locale={locale}
                />
            )}

            {/* Step 4: Preview and Publish */}
            {currentStep === 4 && (
                <PackagePreviewStep
                    packageTitle={packageDetailsFormData.packageTitle}
                    packageDescription={packageDetailsFormData.packageDescription}
                    featuredImageUrl={packageDetailsFormData.featuredImage?.url}
                    durationInMinutes={calculateTotalDuration()}
                    showListItemNumbers={packageDetailsFormData.showListItemNumbers}
                    accordionItems={packageDetailsFormData.accordionItems}
                    selectedCourses={selectedCourses}
                    onExcludeCourse={(id: string) => toggleCourseSelection(id)}
                    coachingIncluded={coachingIncluded}
                    onToggleCoaching={() => setCoachingIncluded(!coachingIncluded)}
                    selectedCoursesTotal={calculateIndividualCourseTotal()}
                    selectedCoursesSavings={calculateSavings()}
                    onBack={handleBack}
                    onPublish={handlePublishPackage}
                    isPublishing={isPublishing}
                    onClickPurchase={handleClickPurchase}
                    onCourseDetails={handleCourseDetails}
                    onCourseAuthorClick={handleCourseAuthorClick}
                    locale={locale}
                />
            )}

            

            {/* Footer Actions */}
            <div className="flex justify-between pt-2 pb-6">
                {currentStep === 1 ? (
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="secondary"
                            size="medium"
                            text={t('buttons.discard')}
                            onClick={handleDiscard}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            size="medium"
                            text={t('buttons.nextCourses')}
                            onClick={handleNext}
                            className="flex-1"
                        />
                    </div>
                ) : currentStep === 2 ? (
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="secondary"
                            size="medium"
                            text={t('buttons.back')}
                            onClick={handleBack}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            size="medium"
                            text={t('buttons.nextPricing')}
                            onClick={handleNext}
                            className="flex-1"
                        />
                    </div>
                ) : currentStep === 3 ? (
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="secondary"
                            size="medium"
                            text={t('buttons.back')}
                            onClick={handleBack}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            size="medium"
                            text={t('buttons.nextPreview')}
                            onClick={handleNext}
                            className="flex-1"
                        />
                    </div>
                ) : currentStep === 4 ? (
                    <>
                        <div className="flex flex-col gap-4 pt-1">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-semibold text-text-primary">{t('publishConfirm.title')}</h3>
                                <p className="text-text-secondary">
                                    {t('publishConfirm.description')}
                                </p>
                            </div>
                            <div className="flex gap-4 w-full">
                                <Button
                                    variant="secondary"
                                    size="medium"
                                    text={t('buttons.noGoBack')}
                                    onClick={handleBack}
                                    className="flex-1"
                                />
                                <Button
                                    variant="primary"
                                    size="medium"
                                    text={isPublishing ? t('buttons.publishing') : t('buttons.publishPackage')}
                                    onClick={handlePublishPackage}
                                    disabled={isPublishing}
                                    className="flex-1"
                                />
                            </div>
                </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
