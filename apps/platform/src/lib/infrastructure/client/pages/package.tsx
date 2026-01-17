'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useEffect, useCallback } from 'react';
import {
  DefaultLoading,
  DefaultError,
  DefaultNotFound,
  PackageGeneralInformation,
  DefaultAccordion,
  PackageCourseSelector,
  BuyCompletePackageBanner,
  PackageCourseCard,
  PackageCardList,
  PackageCard,
  Breadcrumbs,
  CheckoutModal,
  Banner,
  type TransactionDraft,
  type CouponValidationResult,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutRequest, TPrepareCheckoutUseCaseResponse} from "@dream-aim-deliver/e-class-cms-rest"
import { useGetPackageWithCoursesPresenter } from '../hooks/use-get-package-with-courses-presenter';
import { useListPackageRelatedPackagesPresenter } from '../hooks/use-list-package-related-packages-presenter';
import { useRequiredPlatform } from '../context/platform-context';
import { usePrepareCheckoutPresenter } from '../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel, getCheckoutErrorMode } from '../hooks/use-checkout-errors';
import env from '../config/env';

interface PackageProps {
  locale: TLocale;
  packageId: number;
}

export default function Package({ locale, packageId }: PackageProps) {
  const currentLocale = useLocale() as TLocale;
  const router = useRouter();
  const t = useTranslations('pages.packagePage');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
  const { getCheckoutErrorTitle, getCheckoutErrorDescription } = useCheckoutErrors();
  const sessionDTO = useSession();

  const { platform } = useRequiredPlatform();

  const [coachingIncluded, setCoachingIncluded] = useState(false);

  // TRPC query for package data with courses
  const [packageResponse] = trpc.getPackageWithCourses.useSuspenseQuery({
    packageId: packageId,
    includeCoachingPrices: true,
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

  // Checkout state management
  const [transactionDraft, setTransactionDraft] = useState<TransactionDraft | null>(null);
  const [currentRequest, setCurrentRequest] = useState<TPrepareCheckoutRequest | null>(null);
  const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<viewModels.TPrepareCheckoutViewModel | null>(null);

  // Get tRPC utils for fetching checkout data (prepareCheckout is a query in cms-rest)
  const utils = trpc.useUtils();

  // Checkout presenter
  const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);

  // Helper to execute checkout (must be before conditional returns)
  const executeCheckout = useCallback(async (
    request: TPrepareCheckoutRequest,
  ) => {
    try {
      setCurrentRequest(request);
      setCheckoutError(null); // Clear any previous error
      // @ts-ignore - TBaseResult structure is compatible with use case response at runtime
      const response = await utils.prepareCheckout.fetch(request);
      // Unwrap TBaseResult if needed
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success === true && response.data) {
          checkoutPresenter.present({ success: true, data: response.data } as unknown as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
        } else if (response.success === false && response.data) {
          // Access the nested data structure from tRPC response
          const errorData = 'data' in response.data ? response.data.data : response.data;
          const errorViewModel = createCheckoutErrorViewModel(errorData as { message?: string; errorType?: string; operation?: string; context?: unknown });
          setCheckoutError(errorViewModel);
          // Scroll to top so user can see the error banner
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Direct response (not wrapped)
        checkoutPresenter.present(response as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
      }
    } catch (err) {
      console.error('Failed to prepare checkout:', err);
    }
  }, [utils, checkoutPresenter, checkoutViewModel]);

  // Checkout intent hook for login flow preservation (must be before conditional returns)
  const { saveIntent } = useCheckoutIntent({
    onResumeCheckout: executeCheckout,
  });

  // Watch for checkoutViewModel changes and open modal when ready (must be before conditional returns)
  useEffect(() => {
    if (checkoutViewModel) {
      if (checkoutViewModel.mode === 'default') {
        setTransactionDraft(checkoutViewModel.data);
        setIsCheckoutOpen(true);
        setCheckoutError(null);
      } else {
        // Show error banner for any non-default mode
        setCheckoutError(checkoutViewModel);
      }
    }
  }, [checkoutViewModel]);

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

  // Handle coupon validation via prepareCheckout (must be before conditional returns)
  const handleApplyCoupon = useCallback(async (couponCode: string): Promise<CouponValidationResult> => {
    if (!currentRequest) {
      return {
        success: false,
        errorMessage: getCheckoutErrorDescription('kaboom')
      };
    }

    try {
      const requestWithCoupon = { ...currentRequest, couponCode };
      // @ts-ignore - TBaseResult structure is compatible with use case response at runtime
      const response = await utils.prepareCheckout.fetch(requestWithCoupon);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success === true && response.data) {
          return {
            success: true,
            data: response.data as unknown as TransactionDraft,
          };
        } else if (response.success === false && response.data) {
          // Extract error data from response
          const errorData = 'data' in response.data ? response.data.data : response.data;

          // Get error mode using centralized logic
          const errorMode = getCheckoutErrorMode(errorData as { errorType?: string; message?: string });

          // Get translated error message
          const errorMessage = getCheckoutErrorDescription(errorMode);

          return {
            success: false,
            errorMessage
          };
        }
      }

      return {
        success: false,
        errorMessage: getCheckoutErrorDescription('kaboom')
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: getCheckoutErrorDescription('kaboom')
      };
    }
  }, [currentRequest, utils, getCheckoutErrorDescription]);

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
        type="simple"
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

  /**
   * Calculate pricing for partial course selection (PackageCourseSelector section).
   *
   * This function handles the "flexible section" where users can select/deselect individual courses
   * from a package and see dynamically calculated pricing.
   *
   * ## Pricing Fields Explained:
   *
   * - `fullPrice` (scratched/strikethrough price): What you'd pay if buying courses + coaching separately
   * - `partialPrice` (actual price): The discounted price user pays after package discount
   * - `savings`: The amount saved (fullPrice - partialPrice)
   *
   * ## Course-Level Fields (from backend):
   *
   * - `basePrice`: Course price without coaching
   * - `coachingSessionsTotalPrice`: Total price of coaching sessions if bought separately
   * - `priceIncludingCoachings`: Bundled price for course + coaching (already discounted vs buying separately)
   *
   * ## Calculation Logic:
   *
   * ### All Courses Selected:
   * Uses backend package-level values directly:
   * - Without coaching: fullPrice = sum(basePrice), partialPrice = packageData.price
   * - With coaching: fullPrice = sum(basePrice) + sum(coachingTotal), partialPrice = packageData.priceWithCoachings
   *
   * ### Partial Selection (subset of courses):
   *
   * | Scenario | Scratched (fullPrice) | Actual (partialPrice) | Savings |
   * |----------|----------------------|----------------------|---------|
   * | Without coaching | sum of selected basePrice | sum(basePrice) × (1 - discount%) | fullPrice - partialPrice |
   * | With coaching | sum of selected (basePrice + coachingTotal) | sum(priceIncludingCoachings) × (1 - discount%) | fullPrice - partialPrice |
   *
   * ### Why different bases for discount?
   *
   * - Without coaching: Discount applies to course base prices
   * - With coaching: Discount applies to `priceIncludingCoachings` (the bundled price),
   *   NOT to `basePrice + coachingSessionsTotalPrice`. This is because `priceIncludingCoachings`
   *   already represents a bundled deal, and the package discount is applied on top of that.
   *
   * ## Example:
   *
   * Given 3 courses:
   * - Course A: basePrice=500, coachingTotal=1400, priceIncludingCoachings=1900
   * - Course B: basePrice=500, coachingTotal=1400, priceIncludingCoachings=1900
   * - Course C: basePrice=500, coachingTotal=1400, priceIncludingCoachings=1900
   *
   * If 2 courses selected (A & B) with 10% discount:
   *
   * Without coaching:
   * - fullPrice = 500 + 500 = 1000
   * - partialPrice = 1000 × 0.9 = 900
   * - savings = 100
   *
   * With coaching:
   * - fullPrice = (500 + 1400) + (500 + 1400) = 3800
   * - partialPrice = (1900 + 1900) × 0.9 = 3420
   * - savings = 380
   */
  const calculatePackageWithCoursesPricing = () => {
    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

    const courseCount = displayedCourses.length;
    const totalCoursesInPackage = packageData.courses.length;
    const allCoursesSelected = courseCount === totalCoursesInPackage;

    // Sum of course BASE prices (without coaching) for selected courses
    const sumOfBasePrices = roundToTwoDecimals(
      displayedCourses.reduce((sum, course) => sum + course.basePrice, 0)
    );

    // Sum of coaching session prices for selected courses (what you'd pay if buying coaching separately)
    const sumOfCoachingPrices = roundToTwoDecimals(
      displayedCourses.reduce((sum, course) =>
        sum + (course.coachingSessionsTotalPrice ?? 0), 0
      )
    );

    // Sum of priceIncludingCoachings for selected courses (bundled course+coaching price)
    const sumOfPricesWithCoachings = roundToTwoDecimals(
      displayedCourses.reduce((sum, course) => sum + course.priceIncludingCoachings, 0)
    );

    // fullPrice (scratched price) = what you'd pay if buying everything separately
    const fullPrice = coachingIncluded
      ? sumOfBasePrices + sumOfCoachingPrices  // courses + coaching bought separately
      : sumOfBasePrices;                        // just courses

    // If all courses are selected, use package-level pricing from backend
    if (allCoursesSelected) {
      const packagePrice = roundToTwoDecimals(
        coachingIncluded ? packageData.priceWithCoachings : packageData.price
      );
      const savings = coachingIncluded
        ? packageData.savingsWithCoachings
        : packageData.savingsWithoutCoachings;

      return { fullPrice, partialPrice: packagePrice, savings };
    }

    // For partial selection, find the applicable discount based on number of courses
    const applicableDiscount = packageData.partialDiscounts
      .sort((a, b) => b.courseAmount - a.courseAmount) // Sort descending to find highest applicable
      .find(discount => courseCount >= discount.courseAmount);

    // No discount available for this course count - show full price
    if (!applicableDiscount) {
      const priceBase = coachingIncluded ? sumOfPricesWithCoachings : sumOfBasePrices;
      return {
        fullPrice,
        partialPrice: priceBase,
        savings: roundToTwoDecimals(fullPrice - priceBase),
      };
    }

    // Apply the partial discount
    const discountPercent = applicableDiscount.discountPercent;

    // IMPORTANT: The discount base differs by coaching toggle:
    // - Without coaching: discount applied to sum of basePrice
    // - With coaching: discount applied to sum of priceIncludingCoachings (the bundled price)
    const priceBase = coachingIncluded ? sumOfPricesWithCoachings : sumOfBasePrices;
    const discountedPrice = roundToTwoDecimals(priceBase * (1 - discountPercent / 100));

    return {
      fullPrice,
      partialPrice: discountedPrice,
      savings: roundToTwoDecimals(fullPrice - discountedPrice),
    };
  };

  const pricing = calculatePackageWithCoursesPricing();

  /**
   * Calculate pricing for the full package (all courses included).
   *
   * Used by PackageGeneralInformation (top section) and BuyCompletePackageBanner (bottom section).
   * Uses backend-provided values directly - minimal frontend calculation required.
   *
   * ## Pricing Display:
   *
   * | Toggle State | Scratched (fullPrice) | Actual (partialPrice) | Savings |
   * |--------------|----------------------|----------------------|---------|
   * | Without coaching | sum(basePrice) | packageData.price | savingsWithoutCoachings |
   * | With coaching | sum(basePrice) + coachingSessionsTotalPrice | packageData.priceWithCoachings | savingsWithCoachings |
   *
   * ## Package-Level Fields (from backend):
   *
   * - `price`: Package price without coaching
   * - `priceWithCoachings`: Package price with coaching included
   * - `coachingSessionsTotalPrice`: Total price of all coaching sessions if bought separately
   * - `savingsWithoutCoachings`: Savings vs buying courses individually (without coaching)
   * - `savingsWithCoachings`: Savings vs buying courses + coaching individually
   *
   * ## Example:
   *
   * Package with 3 courses (basePrice=500 each, coachingTotal=1400 each):
   * - sum(basePrice) = 1500
   * - coachingSessionsTotalPrice = 4200
   * - packageData.price = 299.99
   * - packageData.priceWithCoachings = 449.99
   *
   * Without coaching: fullPrice=1500, partialPrice=299.99, savings=1200.01
   * With coaching: fullPrice=5700, partialPrice=449.99, savings=5250.01
   */
  const calculatePackagePricing = () => {
    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

    // Sum of all course BASE prices (without coaching)
    const sumOfBasePrices = roundToTwoDecimals(
      packageData.courses.reduce((sum, course) => sum + course.basePrice, 0)
    );

    // fullPrice (scratched price) = what you'd pay if buying everything separately
    const fullPrice = coachingIncluded
      ? sumOfBasePrices + (packageData.coachingSessionsTotalPrice ?? 0)  // courses + coaching separately
      : sumOfBasePrices;                                                  // just courses

    // partialPrice = discounted package price from backend
    const packagePrice = roundToTwoDecimals(
      coachingIncluded ? packageData.priceWithCoachings : packageData.price
    );

    // savings = backend-provided value (no frontend calculation needed)
    const savings = coachingIncluded
      ? packageData.savingsWithCoachings
      : packageData.savingsWithoutCoachings;

    return { fullPrice, partialPrice: packagePrice, savings };
  };

  const packagePricing = calculatePackagePricing();

  // Calculate total package duration from all courses
  const calculatePackageDuration = (): number => {
    return packageData.courses.reduce((totalMinutes, course) => {
      if (!course.duration) return totalMinutes;
      const courseDuration = (course.duration.video || 0) +
                            (course.duration.coaching || 0) +
                            (course.duration.selfStudy || 0);
      return totalMinutes + courseDuration;
    }, 0);
  };

  const packageDuration = calculatePackageDuration();

  // Helper to build purchase identifier from request (handles discriminated union)
  const getPurchaseIdentifier = (request: TPrepareCheckoutRequest) => {
    switch (request.purchaseType) {
      case 'StudentPackagePurchase':
      case 'StudentPackagePurchaseWithCoaching':
        return {
          packageId: request.packageId,
          withCoaching: request.purchaseType === 'StudentPackagePurchaseWithCoaching',
          selectedCourseIds: request.selectedCourseIds, // Include selected courses for partial package purchases
        };
      case 'StudentCoursePurchase':
        return {
          courseSlug: request.courseSlug,
        };
      case 'StudentCoursePurchaseWithCoaching':
        return {
          courseSlug: request.courseSlug,
          withCoaching: request.purchaseType === 'StudentCoursePurchaseWithCoaching',
        };
      case 'StudentCoachingSessionPurchase':
        return {
          coachingOfferingId: request.coachingOfferingId,
          quantity: request.quantity,
        };
      case 'StudentCourseCoachingSessionPurchase':
        return {
          courseSlug: request.courseSlug,
          lessonComponentIds: request.lessonComponentIds,
        };
    }
  };

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
    const request: TPrepareCheckoutRequest = {
      purchaseType: coachingIncluded
        ? 'StudentPackagePurchaseWithCoaching'
        : 'StudentPackagePurchase',
      packageId: packageId,
      selectedCourseIds: selectedCourseIds.length === packageData.courses.length
        ? undefined
        : selectedCourseIds, // Only include if partial selection
    };

    // If user is not logged in, save intent and redirect to login
    if (!isLoggedIn) {
      saveIntent(request, window.location.pathname);
      router.push(
        `/${currentLocale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    // User is logged in, execute checkout
    executeCheckout(request);
  };

  const handleRelatedPackageDetails = (packageId: string | number) => {
    router.push(`/${currentLocale}/packages/${packageId}`);
  };

  const handleRelatedPackagePurchase = (packageId: string | number) => {
    const packageIdNum = typeof packageId === 'string' ? parseInt(packageId, 10) : packageId;
    const request: TPrepareCheckoutRequest = {
      purchaseType: 'StudentPackagePurchaseWithCoaching', // Always purchase with coaching for related packages
      packageId: packageIdNum,
    };

    // If user is not logged in, save intent and redirect to login
    if (!isLoggedIn) {
      saveIntent(request, window.location.pathname);
      router.push(
        `/${currentLocale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    // User is logged in, execute checkout
    executeCheckout(request);
  };

  const handlePaymentComplete = (sessionId: string) => {
    setIsCheckoutOpen(false);
    setTransactionDraft(null);
    setCheckoutViewModel(undefined);
    setCurrentRequest(null);
    // TODO: Redirect to success page or show success message
  };

  // Breadcrumbs configuration
  const breadcrumbItems = [
    {
      label: breadcrumbsTranslations('home'),
      onClick: () => router.push(`/${currentLocale}`),
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

      {/* Checkout Error Banner */}
      {checkoutError && checkoutError.mode !== 'default' && (
        <Banner
          style="error"
          icon
          closeable
          title={getCheckoutErrorTitle(checkoutError.mode)}
          description={getCheckoutErrorDescription(checkoutError.mode)}
          onClose={() => {
            setCheckoutError(null);
            setCheckoutViewModel(undefined);
          }}
        />
      )}

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
            partialPrice: packagePricing.partialPrice,
            // Use backend savings directly based on coaching toggle
            savingsWithoutCoachings: packagePricing.savings,
            savingsWithCoachings: packagePricing.savings,
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
            partialPrice: pricing.partialPrice,
            savings: pricing.savings,
          }}
          onClickCheckbox={handleToggleCoaching}
          onClickPurchase={handlePurchase}
          locale={currentLocale}
        >
          {allCourses.map((course) => {
            const courseIncluded = selectedCourseIds.includes(course.id);
            // Convert language string to object format if needed
            const language = typeof course.language === 'string'
              ? { code: '', name: course.language }
              : course.language;
            return (
              <PackageCourseCard
                key={course.id}
                courseId={course.id.toString()}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl || ''}
                rating={course.averageRating}
                author={{
                    name: course.creator.name,
                    image: course.creator.avatarUrl || ''
                }}
                language={language}
                duration={{
                    video: course.duration.video || 0,
                    coaching: course.duration.coaching || 0,
                    selfStudy: course.duration.selfStudy || 0
                }}
                pricing={{
                  fullPrice: coachingIncluded ? course.priceIncludingCoachings : course.basePrice,
                  partialPrice: coachingIncluded ? course.priceIncludingCoachings : course.basePrice,
                    currency: platform.currency
                }}
                sales={course.salesCount}
                reviewCount={course.ratingCount}
                courseIncluded={courseIncluded}
                onClickUser={() => handleCourseAuthorClick(course.id.toString())}
                onClickDetails={() => handleCourseDetails(course.id.toString())}
                onClickIncludeExclude={() => handleIncludeExclude(course.id.toString())}
                locale={currentLocale}
                  />
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
            partialPrice: packagePricing.partialPrice,
            // Use backend savings directly based on coaching toggle
            savingsWithoutCoachings: packagePricing.savings,
            savingsWithCoachings: packagePricing.savings,
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
                    // Always show with coachings amounts for related packages
                    fullPrice: relatedPackage.coursesPriceWithCoachings ?? relatedPackage.priceWithCoachings,
                    partialPrice: relatedPackage.priceWithCoachings,
                    savingsWithoutCoachings: relatedPackage.savingsWithCoachings,
                    savingsWithCoachings: relatedPackage.savingsWithCoachings,
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

      {transactionDraft && currentRequest && (
        (currentRequest.purchaseType === 'StudentPackagePurchase' ||
         currentRequest.purchaseType === 'StudentPackagePurchaseWithCoaching') && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => {
              setIsCheckoutOpen(false);
              setTransactionDraft(null);
              setCheckoutViewModel(undefined);
              setCurrentRequest(null);
            }}
            transactionDraft={transactionDraft}
            stripePublishableKey={
              env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            }
            customerEmail={sessionDTO.data?.user?.email}
            purchaseType={currentRequest.purchaseType}
            purchaseIdentifier={getPurchaseIdentifier(currentRequest)}
            locale={currentLocale}
            onPaymentComplete={handlePaymentComplete}
            onApplyCoupon={handleApplyCoupon}
          />
        )
      )}
    </div>
  );
}
