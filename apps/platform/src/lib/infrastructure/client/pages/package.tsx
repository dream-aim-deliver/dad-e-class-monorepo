'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useEffect } from 'react';
import {
  DefaultLoading,
  DefaultError,
  DefaultNotFound,
  PackageGeneralInformation,
  DefaultAccordion,
  PackageCourseSelector,
  BuyCompletePackageBanner,
  CourseCard,
  PackageCardList,
  PackageCard,
  Button,
  Breadcrumbs
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPackageWithCoursesPresenter } from '../hooks/use-get-package-with-courses-presenter';
import { useListPackageRelatedPackagesPresenter } from '../hooks/use-list-package-related-packages-presenter';
import { useRequiredPlatform } from '../context/platform-context';

interface PackageProps {
  locale: TLocale;
  packageId: number;
}

export default function Package({ locale, packageId }: PackageProps) {
  const currentLocale = useLocale() as TLocale;
  const router = useRouter();
  const t = useTranslations('pages.packagePage');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
  const sessionDTO = useSession();

  const { platform } = useRequiredPlatform();

  const [coachingIncluded, setCoachingIncluded] = useState(false);

  // TRPC query for package data with courses
  const [packageResponse] = trpc.getPackageWithCourses.useSuspenseQuery({
    packageId: packageId,
  });

  // TRPC query for related packages
  const [relatedPackagesResponse] = trpc.listPackageRelatedPackages.useSuspenseQuery({
    packageId: packageId,
  });

  // Package view model state and presenter
  const [packageViewModel, setPackageViewModel] = useState<
    viewModels.TGetPackageWithCoursesViewModel | undefined
  >(undefined);
  const { presenter } = useGetPackageWithCoursesPresenter(setPackageViewModel);

  // Related packages view model and presenter
  const [relatedPackagesViewModel, setRelatedPackagesViewModel] = useState<
    viewModels.TListPackageRelatedPackagesViewModel | undefined
  >(undefined);
  const { presenter: relatedPackagesPresenter } = useListPackageRelatedPackagesPresenter(
    setRelatedPackagesViewModel
  );

  // Present data
  // @ts-ignore
  presenter.present(packageResponse, packageViewModel);
  // @ts-ignore
  relatedPackagesPresenter.present(relatedPackagesResponse, relatedPackagesViewModel);

  // Track selected courses 
  // Initialize with empty array - will be set in useEffect when data is available
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  // Initialize selectedCourseIds with all course IDs when data is available
  // This must be before any conditional returns
  useEffect(() => {
    if (packageViewModel?.mode === 'default' && relatedPackagesViewModel) {
      const packageData = packageViewModel.data.package;
      if (selectedCourseIds.length === 0 && packageData.courses.length > 0) {
        setSelectedCourseIds(packageData.courses.map(course => course.id));
      }
    }
  }, [packageViewModel, relatedPackagesViewModel, selectedCourseIds.length]);

  // Loading state
  if (!packageViewModel || !relatedPackagesViewModel) {
    return <DefaultLoading locale={currentLocale} variant="minimal" />;
  }

  // Error handling for package
  if (packageViewModel.mode === 'kaboom') {
    const errorData = packageViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        locale={currentLocale}
        title={t('error.kaboom.title')}
        description={t('error.kaboom.description')}
      />
    );
  }

  if (packageViewModel.mode === 'not-found') {
    const errorData = packageViewModel.data;
    console.error(errorData);
    return (
      <DefaultNotFound
        locale={currentLocale}
        title={t('error.notFound.title')}
        description={t('error.notFound.description')}
      />
    );
  }

  // Success state - extract data from view model
  const packageData = packageViewModel.data.package;
  const relatedPackagesData = relatedPackagesViewModel.mode === 'default'
    ? relatedPackagesViewModel.data.packages
    : [];

  // Session check for purchase action (non-blocking)
  const session = sessionDTO.data;
  const isLoggedIn = !!session;

  // Filter courses based on selection (only for pricing calculation)
  const displayedCourses = packageData.courses.filter(
    course => selectedCourseIds.includes(course.id)
  );
  
  // Show all courses in the UI (for selection/deselection)
  const allCourses = packageData.courses;

  // Calculate pricing with partial discounts
  const calculatePackageWithCoursesPricing = () => {
    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

    const courseCount = displayedCourses.length;
    const totalCoursesInPackage = packageData.courses.length;
    const allCoursesSelected = courseCount === totalCoursesInPackage;

    // Calculate sum of individual course prices for displayed courses
    const sumOfCoursePrices = roundToTwoDecimals(
      displayedCourses.reduce((sum, course) =>
        sum + (coachingIncluded ? course.priceIncludingCoachings : course.basePrice),
        0
      )
    );

    // If all courses are selected, use the same logic as calculatePackagePricing
    if (allCoursesSelected) {
      const packagePrice = roundToTwoDecimals(
        coachingIncluded ? packageData.priceWithCoachings : packageData.price
      );

      return {
        fullPrice: sumOfCoursePrices,
        partialPrice: packagePrice,
      };
    }

    // For partial selection, find the applicable discount based on number of courses
    const applicableDiscount = packageData.partialDiscounts
      .sort((a, b) => b.courseAmount - a.courseAmount) // Sort descending
      .find(discount => courseCount >= discount.courseAmount);

    if (!applicableDiscount) {
      // No discount available for this course count - no discount applied
      return {
        fullPrice: sumOfCoursePrices,
        partialPrice: sumOfCoursePrices,
      };
    }

    // Apply the partial discount to the sum of selected courses
    const discountPercent = applicableDiscount.discountPercent;
    const discountedPrice = roundToTwoDecimals(
      sumOfCoursePrices * (1 - discountPercent / 100)
    );

    return {
      fullPrice: sumOfCoursePrices,
      partialPrice: discountedPrice,
    };
  };

  const pricing = calculatePackageWithCoursesPricing();

  // Calculate pricing for the Package (all courses, no exclusions)
  const calculatePackagePricing = () => {
    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

    // Sum of ALL courses in the package (no exclusions)
    const sumOfAllCourses = roundToTwoDecimals(packageData.courses.reduce((sum, course) =>
      sum + (coachingIncluded ? course.priceIncludingCoachings : course.basePrice), 0
    ));

    // Package price (with or without coaching) which is the discounted price
    const packagePrice = roundToTwoDecimals(coachingIncluded ? packageData.priceWithCoachings : packageData.price);


    return {
      fullPrice: sumOfAllCourses,
      partialPrice: packagePrice
    };
  };

  const packagePricing = calculatePackagePricing();

  // Calculate total package duration from all courses
  const calculatePackageDuration = (): number => {
    return packageData.courses.reduce((totalMinutes, course) => {
      return totalMinutes + (course.duration || 0);
    }, 0);
  };

  const packageDuration = calculatePackageDuration();

  // Handlers
  const handleToggleCoaching = () => setCoachingIncluded(!coachingIncluded);
  const handleIncludeExclude = (courseId: string) => {
    const courseIdNum = parseInt(courseId);
    setSelectedCourseIds(prev =>
      prev.includes(courseIdNum)
        ? prev.filter(id => id !== courseIdNum)
        : [...prev, courseIdNum]
    );
  };

  const handleCourseDetails = (courseId: string) => {
    const course = packageData.courses.find(c => c.id.toString() === courseId);
    if (course && course.slug) {
      router.push(`/${currentLocale}/courses/${course.slug}`);
    }
  };

  const handleCourseAuthorClick = (courseId: string) => {
    const course = packageData.courses.find(c => c.id.toString() === courseId);
    if (course && course.creator && course.creator.username) {
      router.push(`/${currentLocale}/coaches/${course.creator.username}`);
    }
  };

  const handlePurchase = () => {
    if (!isLoggedIn) {
      // Redirect to login page with return URL
      router.push(`/${currentLocale}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    // TODO: Redirect to payment/checkout page
    console.log('Redirect to payment page');
  };

  const handleRelatedPackageDetails = (packageId: string | number) => {
    router.push(`/${currentLocale}/packages/${packageId}`);
  };
  
  const handleRelatedPackagePurchase = (packageId: string | number) => {
    if (!isLoggedIn) {
      router.push(`/${currentLocale}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    // TODO: Redirect to payment/checkout page
    console.log('Redirect to payment page for package:', packageId);
  };

  // Breadcrumbs configuration
  const breadcrumbItems = [
    {
      label: breadcrumbsTranslations('home'),
      onClick: () => router.push(`/${currentLocale}`),
    },
    {
      label: breadcrumbsTranslations('platforms'),
      onClick: () => router.push(`/${currentLocale}/packages`),
    },
    {
      label: packageData.title,
      onClick: () => { return; }, // Current page, no action
    },
  ];

  return (
    <div className="flex flex-col space-y-5 px-30">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col gap-8 bg-card-fill p-5 border border-card-stroke rounded-medium">
        {/* Top hero section - PackageGeneralInformation */}
        <PackageGeneralInformation
          title={packageData.title}
          subTitle={''}
          imageUrl={packageData.image?.downloadUrl || ''}
          description={packageData.description}
          duration={packageDuration}
          pricing={{
            currency: platform.currency,
            fullPrice: packagePricing.fullPrice,
            partialPrice: packagePricing.partialPrice
          }}
          locale={currentLocale}
          onClickPurchase={handlePurchase}
          coachingIncluded={coachingIncluded}
          onToggleCoaching={handleToggleCoaching}
        />

        <div className="border-t border-card-stroke" />

        {/* Accordion Section */}
        {packageData.accordionItems.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-bg font-semibold text-text-primary">
              {t('packageDetails')}
            </h3>
            <DefaultAccordion
              showNumbers={packageData.showAccordionNumbers}
              items={packageData.accordionItems.map((item, index) => ({
                title: item.title,
                iconImageUrl: item.icon?.downloadUrl,
                content: item.description,
                position: item.position,
              }))}
            />
          </div>
        )}

        <div className="border-t border-card-stroke" />

        {/* Flexible Section - PackageCourseSelector */}
        <PackageCourseSelector
          title={packageData.title}
          description={packageData.description}
          coachingIncluded={coachingIncluded}
          pricing={{
            currency: platform.currency,
            fullPrice: pricing.fullPrice,
            partialPrice: pricing.partialPrice
          }}
          onClickCheckbox={handleToggleCoaching}
          onClickPurchase={handlePurchase}
          locale={currentLocale}
        >
          {allCourses.map((course) => {
            const courseIncluded = selectedCourseIds.includes(course.id);
            return (
            <div key={course.id} className={`w-full ${!courseIncluded ? 'opacity-60' : ''}`}>
              <CourseCard
                userType={isLoggedIn ? "student" : "visitor"}
                reviewCount={course.ratingCount}
                locale={currentLocale}
                language={course.language}
                course={{
                  title: course.title,
                  description: course.description,
                  author: {
                    name: course.creator.name,
                    image: course.creator.avatarUrl || ''
                  },
                  imageUrl: course.imageUrl || '',
                  rating: course.averageRating,
                  duration: {
                    video: 100, // TODO: Get course video duration once backend is updated
                    coaching: 200, // TODO: Get course coaching duration once backend is updated
                    selfStudy: 300 // TODO: Get course self-study duration once backend is updated
                  },
                  pricing: {
                    fullPrice: course.priceIncludingCoachings,
                    partialPrice: course.basePrice,
                    currency: platform.currency
                  },
                  language: course.language,
                }}
                sessions={course.coachingSessionCount}
                sales={course.salesCount}
                onDetails={() => handleCourseDetails(course.id.toString())}
                onClickUser={() => handleCourseAuthorClick(course.id.toString())}
                className="mb-3"
              />
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${!courseIncluded ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                  {platform.currency} {coachingIncluded ? course.priceIncludingCoachings : course.basePrice}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant={courseIncluded ? "secondary" : "primary"}
                    size="small"
                    text={courseIncluded ? t('excludeButton') : (t as any)('includeButton') || 'Include'}
                    onClick={() => handleIncludeExclude(course.id.toString())}
                  />
                  <Button
                    variant="text"
                    size="small"
                    text={t('detailsButton')}
                    onClick={() => handleCourseDetails(course.id.toString())}
                  />
                </div>
              </div>
            </div>
            );
          })}
        </PackageCourseSelector>

        <div className="border-t border-card-stroke" />

        {/* Bottom banner - BuyCompletePackageBanner */}
        <BuyCompletePackageBanner
          titleBanner={t('buyCompletePackageTitle')}
          descriptionBanner={t('buyCompletePackageDescription')}
          imageUrl={packageData.image?.downloadUrl || ''}
          title={packageData.title}
          description={packageData.description}
          duration={packageDuration}
          pricing={{
            currency: platform.currency,
            fullPrice: packagePricing.fullPrice,
            partialPrice: packagePricing.partialPrice
          }}
          locale={currentLocale}
          onClickPurchase={handlePurchase}
          coachingIncluded={coachingIncluded}
          onToggleCoaching={handleToggleCoaching}
        />


        {/* Related Packages Section */}
        <div className="border-t border-card-stroke" />
        {relatedPackagesData.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {t('relatedPackages.title')}
              </h2>
              <p className="text-text-secondary">
                {t('relatedPackages.subtitle').split(t('relatedPackages.findAllOffers'))[0]}
                <button
                  className="text-primary hover:underline"
                  onClick={() => router.push(`/${currentLocale}/packages`)}
                >
                  {t('relatedPackages.findAllOffers')}
                </button>
                {t('relatedPackages.subtitle').split(t('relatedPackages.findAllOffers'))[1]}
              </p>
            </div>

            <PackageCardList locale={currentLocale}>
              {relatedPackagesData.map((relatedPackage) => (
                <PackageCard
                  key={relatedPackage.id}
                  imageUrl={relatedPackage.image?.downloadUrl || ''}
                  title={relatedPackage.title}
                  description={relatedPackage.description}
                  duration={relatedPackage.duration}
                  courseCount={relatedPackage.courseCount}
                  pricing={{
                    currency: platform.currency,
                    fullPrice: relatedPackage.priceWithCoachings * 1.5,  // TODO: Refactor once backend sends sum of courses' prices
                    partialPrice: relatedPackage.priceWithCoachings
                  }}
                  locale={currentLocale}
                  onClickPurchase={() => handleRelatedPackagePurchase(relatedPackage.id)}
                  onClickDetails={() => handleRelatedPackageDetails(relatedPackage.id)}
                />
              ))}
            </PackageCardList>
          </div>
        )}
      </div>
    </div>
  );
}
