import {
    CardListLayout,
    DefaultError,
    DefaultLoading,
    EmptyState,
    PackageCard,
    CheckoutModal,
    Banner,
    type TransactionDraft,
    type CouponValidationResult,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { TPrepareCheckoutRequest, TPrepareCheckoutUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListOffersPagePackagesPresenter } from '../../hooks/use-list-offers-page-packages-presenter';
import { useRouter } from 'next/navigation';
import { useRequiredPlatform } from '../../context/platform-context';
import { useSession } from 'next-auth/react';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel, getCheckoutErrorMode } from '../../hooks/use-checkout-errors';
import env from '../../config/env';

export default function PackageList() {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.offers');
    const { platform } = useRequiredPlatform();

    const [packagesResponse] = trpc.listOffersPagePackages.useSuspenseQuery({});
    const [packagesViewModel, setPackagesViewModel] = useState<
        viewModels.TListOffersPagePackagesViewModel | undefined
    >(undefined);
    const { presenter } =
        useListOffersPagePackagesPresenter(setPackagesViewModel);
    // @ts-ignore
    presenter.present(packagesResponse, packagesViewModel);

    const router = useRouter();

    // Session and checkout state
    const sessionDTO = useSession();
    const isLoggedIn = !!sessionDTO.data;
    const { getCheckoutErrorTitle, getCheckoutErrorDescription } = useCheckoutErrors();

    // Checkout modal state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [transactionDraft, setTransactionDraft] = useState<TransactionDraft | null>(null);
    const [currentRequest, setCurrentRequest] = useState<TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [checkoutError, setCheckoutError] = useState<viewModels.TPrepareCheckoutViewModel | null>(null);
    const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);
    const utils = trpc.useUtils();
    const containerRef = useRef<HTMLDivElement>(null);

    // Helper to execute checkout
    const executeCheckout = useCallback(async (
        request: TPrepareCheckoutRequest,
    ) => {
        try {
            setCurrentRequest(request);
            setCheckoutError(null);
            // @ts-ignore
            const response = await utils.prepareCheckout.fetch(request);
            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success === true && response.data) {
                    checkoutPresenter.present({ success: true, data: response.data } as unknown as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
                } else if (response.success === false && response.data) {
                    // Access the nested data structure from tRPC response
                    const errorData = 'data' in response.data ? response.data.data : response.data;
                    const errorViewModel = createCheckoutErrorViewModel(errorData as { message?: string; errorType?: string; operation?: string; context?: unknown });
                    setCheckoutError(errorViewModel);
                    // Scroll to packages section so user can see the error banner
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                checkoutPresenter.present(response as TPrepareCheckoutUseCaseResponse, checkoutViewModel);
            }
        } catch (err) {
            console.error('Failed to prepare checkout:', err);
        }
    }, [utils, checkoutPresenter, checkoutViewModel]);

    // Checkout intent hook for login flow preservation
    const { saveIntent } = useCheckoutIntent({
        onResumeCheckout: executeCheckout,
    });

    // Watch for checkoutViewModel changes and open modal when ready
    useEffect(() => {
        if (checkoutViewModel) {
            if (checkoutViewModel.mode === 'default') {
                setTransactionDraft(checkoutViewModel.data);
                setIsCheckoutOpen(true);
                setCheckoutError(null);
            } else {
                setCheckoutError(checkoutViewModel);
            }
        }
    }, [checkoutViewModel]);

    const handlePurchase = (packageId: number) => {
        const request: TPrepareCheckoutRequest = {
            purchaseType: 'StudentPackagePurchaseWithCoaching',
            packageId,
        };

        if (!isLoggedIn) {
            saveIntent(request, window.location.pathname);
            router.push(
                `/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
            );
            return;
        }

        executeCheckout(request);
    };

    const handlePaymentComplete = (sessionId: string) => {
        setIsCheckoutOpen(false);
        setTransactionDraft(null);
        setCheckoutViewModel(undefined);
        setCurrentRequest(null);
    };

    // Handle coupon validation via prepareCheckout
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

    if (!packagesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (packagesViewModel.mode === 'not-found') {
        return (
            <EmptyState
                locale={locale}
                message={t('packagesNotFound.description')}
            />
        );
    }

    if (packagesViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    const packages = packagesViewModel.data.packages;

    if (packages.length === 0) {
        return (
            <EmptyState
                locale={locale}
                message={t('packagesNotFound.description')}
            />
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col gap-4 scroll-mt-24">
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
            <CardListLayout>
                {packages.map((pkg) => {
                    return (
                        <PackageCard
                            key={`package-${pkg.id}`}
                            courseCount={pkg.courseCount}
                            title={pkg.title}
                            description={pkg.description}
                            imageUrl={pkg.imageUrl ?? ''}
                            pricing={{
                                // fullPrice = sum of all courses + all coaching sessions (what you'd pay if bought separately)
                                fullPrice: (pkg.pricing.allCourses ?? 0) + (pkg.pricing.coachingSessionsTotal ?? 0),
                                // partialPrice = actual package price (NOTE: 'actual' is the price WITH coaching in this API)
                                partialPrice: pkg.pricing.actual,
                                currency: platform.currency,
                                // Display savingsWithCoachings as the savings amount shown to user
                                savingsWithoutCoachings: pkg.pricing.savingsWithCoachings,
                                savingsWithCoachings: pkg.pricing.savingsWithCoachings,
                                coachingSessionsTotal: pkg.pricing.coachingSessionsTotal,
                            }}
                            duration={pkg.duration}
                            locale={locale}
                            onClickDetails={() => {
                                router.push(`/packages/${pkg.id}`);
                            }}
                            onClickPurchase={() => {
                                handlePurchase(Number(pkg.id));
                            }}
                        />
                    );
                })}
            </CardListLayout>

            {/* Checkout Modal */}
            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentPackagePurchaseWithCoaching' && (
                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => {
                        setIsCheckoutOpen(false);
                        setTransactionDraft(null);
                        setCheckoutViewModel(undefined);
                        setCurrentRequest(null);
                    }}
                    transactionDraft={transactionDraft}
                    stripePublishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                    customerEmail={sessionDTO.data?.user?.email}
                    purchaseType={currentRequest.purchaseType}
                    purchaseIdentifier={{ packageId: currentRequest.packageId }}
                    locale={locale}
                    onPaymentComplete={handlePaymentComplete}
                    onApplyCoupon={handleApplyCoupon}
                />
            )}
        </div>
    );
}
