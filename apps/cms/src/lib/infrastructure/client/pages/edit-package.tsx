'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { trpc } from '../trpc/cms-client';
import { useGetPackagePresenter } from '../hooks/use-get-package-presenter';
import { useUpdatePackagePresenter } from '../hooks/use-update-package-presenter';
import { useState, useCallback, useMemo } from 'react';
import { DefaultLoading, DefaultError, DefaultNotFound, PackageDetailsStep, PackagePricingStep, Breadcrumbs, Button, Banner, FeedBackMessage } from '@maany_shr/e-class-ui-kit';
import type { PackageDetailsFormData, PackagePricingFormData } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useContentLocale } from '../hooks/use-platform-translations';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { usePackageFileUpload } from './common/hooks/use-package-file-upload';
import { AccordionBuilderItem } from '@maany_shr/e-class-ui-kit';
import { slateifySerialize } from '@maany_shr/e-class-ui-kit';
import React from 'react';
import { idToNumber } from '../utils/id-to-number';
import { useEffect } from 'react';

interface PackageImage {
  id: string;
  name: string;
  size: number;
  category: "image";
  downloadUrl: string;
}

interface PackageAccordionItem {
  id: string | number;
  title: string;
  description: string;
  position: number;
  icon?: PackageImage | null;
}

interface EditPackageProps {
    locale: TLocale;
    platformSlug: string;
    platformLocale: string;
    packageId: string;
}

export default function EditPackage({
    locale,
    platformSlug,
    platformLocale,
    packageId,
}: EditPackageProps) {
    // All hooks must be called before any conditional returns
    const currentLocale = useLocale() as TLocale;
    const router = useRouter();

    // CMS context hooks
    const requiredPlatformLocale = useRequiredPlatformLocale();
    const contentLocale = useContentLocale();

    // Translations
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const editPackageTranslations = useTranslations('pages.editPackage');
    const t = useTranslations('pages.editPackage');

    // State and presenter hooks
    const [getPackageViewModel, setGetPackageViewModel] = useState<
        viewModels.TGetPackageViewModel | undefined
    >(undefined);

    const { presenter } = useGetPackagePresenter(setGetPackageViewModel);

    // Package details form state
    const [packageDetailsFormData, setPackageDetailsFormData] = useState<PackageDetailsFormData>({
        packageTitle: '',
        packageDescription: '',
        featuredImage: null,
        showListItemNumbers: true,
        accordionItems: [],
    });

    // Pricing form state
    const [pricingFormData, setPricingFormData] = useState<PackagePricingFormData>({
        completePackageWithCoaching: '',
        completePackageWithoutCoaching: '',
        partialDiscounts: { '2': '', '3': '', '4': '', '5': '', '6': '', '7': '' }
    });

    // Update state flag
    const [isUpdating, setIsUpdating] = useState(false);

    // Error and success message state
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Update package presenter
    const [updatePackageViewModel, setUpdatePackageViewModel] = useState<
        viewModels.TUpdatePackageViewModel | undefined
    >(undefined);
    const { presenter: updatePresenter } = useUpdatePackagePresenter(setUpdatePackageViewModel);

    // File upload handlers
    const [packageImageProgress, setPackageImageProgress] = useState<number | undefined>(undefined);
    const { 
        handleFileChange: handlePackageImageUpload, 
        uploadError: packageImageError,
        handleDelete: handleDeleteFeaturedImage,
        handleDownload: handleDownloadFeaturedImage,
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

    // Validate packageId after all hooks
    const packageIdInt = parseInt(packageId);
    
    // Fetch package data using getPackage feature
    const [getPackageResponse] = trpc.getPackage.useSuspenseQuery({
        packageId: packageIdInt
    });

    // @ts-ignore
    presenter.present(getPackageResponse, getPackageViewModel);

    // Success state - extract package data
    const packageData = getPackageViewModel?.data;

    // Populate form data when package data is loaded
    React.useEffect(() => {
        if (packageData && typeof packageData === 'object' && 'package' in packageData) {
            const pkg = (packageData as { package: any }).package;
            
            // Populate package details
            setPackageDetailsFormData({
                packageTitle: pkg.title || '',
                packageDescription: pkg.description || '',
                featuredImage: pkg.image ? {
                    status: 'available' as const,
                    name: pkg.image.name || '',
                    id: pkg.image.id || '',
                    category: 'image' as const,
                    size: pkg.image.size || 0,
                    url: pkg.image.downloadUrl || '',
                    thumbnailUrl: null,
                } : null,
                showListItemNumbers: true, 
                accordionItems: pkg.accordionItems?.map((item: { id?: string; title?: string; description?: string; content?: string; icon?: any }) => ({
                    id: item.id || String(Math.random()),
                    title: item.title || '',
                    content: slateifySerialize(item.description || item.content || ''),
                    icon: item.icon || null,
                })) || [],
            });
            
            // Populate pricing - convert numbers to string format
            setPricingFormData({
                completePackageWithCoaching: pkg.priceWithCoachings ? `${pkg.priceWithCoachings} CHF` : '',
                completePackageWithoutCoaching: pkg.price ? `${pkg.price} CHF` : '',
                partialDiscounts: pkg.partialDiscounts?.reduce((acc: Record<string, string>, d: { courseAmount: number; discountPercent: number }) => {
                    acc[String(d.courseAmount)] = `${d.discountPercent}%`;
                    return acc;
                }, { '2': '', '3': '', '4': '', '5': '', '6': '', '7': '' }) || { '2': '', '3': '', '4': '', '5': '', '6': '', '7': '' }
            });
        }
    }, [packageData]);

    const updatePackageMutation = trpc.updatePackage.useMutation();

    // Handle update package mutation presentation
    useEffect(() => {
        if (updatePackageMutation.isSuccess && updatePackageMutation.data) {
            // @ts-ignore
            updatePresenter.present(updatePackageMutation.data, updatePackageViewModel);
        }
    }, [updatePackageMutation.isSuccess, updatePackageMutation.data, updatePresenter, updatePackageViewModel]);

    // Handle update package success/error
    useEffect(() => {
        if (updatePackageViewModel?.mode === 'default') {
            setSuccessMessage(t('successMessages.packageUpdated'));
            setErrorMessage(null);
            // Auto-dismiss success message after 5 seconds
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
        if (updatePackageViewModel?.mode === 'kaboom') {
            setErrorMessage(t('errorMessages.updateFailed'));
            setSuccessMessage(null);
            setIsUpdating(false);
        }
    }, [updatePackageViewModel]);

    // Handle mutation errors (network/unknown)
    useEffect(() => {
        if (updatePackageMutation.isError) {
            setErrorMessage(updatePackageMutation.error?.message || t('errorMessages.updateFailed'));
            setSuccessMessage(null);
            setIsUpdating(false);
        }
    }, [updatePackageMutation.isError, updatePackageMutation.error]);

    const derivedSelectedCourseCount = useMemo(() => {
        const partialDiscounts = pricingFormData.partialDiscounts ?? {};
        const discountKeys = Object.entries(partialDiscounts)
            .filter(([_, value]) => value && value.trim() !== '') // Only consider discounts with actual values
            .map(([key, _]) => Number(key))
            .filter((value) => !Number.isNaN(value));

        if (discountKeys.length === 0) {
            return 0;
        }

        return Math.max(...discountKeys) + 1;
    }, [pricingFormData.partialDiscounts]);

    const handleUpdatePackage = useCallback(async () => {
        setIsUpdating(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        try {
            // Parse prices from string format
            const price = parseFloat(pricingFormData.completePackageWithoutCoaching.replace(/[^\d.]/g, '')) || 0;
            const priceWithCoachings = parseFloat(pricingFormData.completePackageWithCoaching.replace(/[^\d.]/g, '')) || 0;
            
            // Map partial discounts
            const partialDiscountsPayload = Object.entries(pricingFormData.partialDiscounts)
                .map(([courseAmount, discount]) => ({
                    courseAmount: Number(courseAmount),
                    discountPercent: Number(String(discount).replace('%', '')),
                }))
                .filter(
                    (d) =>
                        !Number.isNaN(d.courseAmount) &&
                        !Number.isNaN(d.discountPercent) &&
                        d.courseAmount > 1 &&
                        d.courseAmount < derivedSelectedCourseCount,
                );
            
            // Map accordion items
            const accordionItemsPayload = packageDetailsFormData.accordionItems.map((item: AccordionBuilderItem, idx: number) => ({
                title: item.title,
                description: item.content,
                position: idx + 1,
                iconId: idToNumber(item.icon?.id),
            }));
            
            const payload = {
                id: packageIdInt,
                title: packageDetailsFormData.packageTitle,
                description: packageDetailsFormData.packageDescription,
                price,
                priceWithCoachings,
                partialDiscounts: partialDiscountsPayload,
                showAccordionNumbers: packageDetailsFormData.showListItemNumbers,
                accordionItems: accordionItemsPayload.map((item, idx) => ({
                    ...item,
                    id: idx + 1, // Add required id field
                })),
                featuredImageId: null,
            };
            
            await updatePackageMutation.mutateAsync(payload);
            
            // Navigate back to packages list on success
            router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages`);
        } catch (error) {
            // Error handled by useEffect hooks
        }
    }, [
        packageDetailsFormData,
        pricingFormData,
        packageIdInt,
        updatePackageMutation,
        router,
        locale,
        platformSlug,
        platformLocale,
        derivedSelectedCourseCount,
    ]);

    // Conditional returns after all hooks
    if (isNaN(packageIdInt)) {
        return <DefaultNotFound locale={currentLocale} />;
    }
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
            label: editPackageTranslations('pageTitle'),
            onClick: () => {
                // Current page
            },
        },
    ];

    // Loading state using 
    if (!getPackageViewModel) {
        return <DefaultLoading locale={currentLocale} variant="minimal" />;
    }

    // Error handling
    if (getPackageViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={currentLocale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    if (getPackageViewModel.mode === 'not-found') {
        const errorData = getPackageViewModel.data;

        return <DefaultNotFound locale={currentLocale} />;
    }

    return (
        <div className="flex flex-col space-y-4">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="flex flex-col space-y-2">
                <h1>{editPackageTranslations('pageTitle')}</h1>
                <p className="text-text-secondary text-sm">
                    {editPackageTranslations('platformInfo', { 
                        platformSlug, 
                        platformLocale: platformLocale.toUpperCase() 
                    })}
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
            
            {/* Package Details Section */}
            <PackageDetailsStep
                formData={packageDetailsFormData}
                onFormDataChange={handlePackageDetailsChange}
                featuredImageUpload={{
                    onUpload: handlePackageImageUpload,
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
                locale={currentLocale}
            />
            
            {/* Pricing Section */}
            <PackagePricingStep
                formData={pricingFormData}
                onFormDataChange={handlePricingChange}
                locale={currentLocale}
                selectedCourseCount={derivedSelectedCourseCount}
            />
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-2 pb-6">
                <Button
                    variant="secondary"
                    size="medium"
                    text={editPackageTranslations('cancel')}
                    onClick={() => router.push(`/${locale}/platform/${platformSlug}/${platformLocale}/packages`)}
                    className="flex-1"
                />
                <Button
                    variant="primary"
                    size="medium"
                    text={isUpdating ? editPackageTranslations('updating') : editPackageTranslations('save')}
                    onClick={handleUpdatePackage}
                    disabled={isUpdating}
                    className="flex-1"
                />
            </div>
        </div>
    );
}