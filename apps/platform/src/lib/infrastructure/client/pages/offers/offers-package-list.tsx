import {
    CardListLayout,
    DefaultError,
    DefaultLoading,
    EmptyState,
    PackageCard,
    CheckoutModal,
    Banner,
    type TransactionDraft,
} from '@maany_shr/e-class-ui-kit';
import { trpc } from '../../trpc/cms-client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useListOffersPagePackagesPresenter } from '../../hooks/use-list-offers-page-packages-presenter';
import { useRouter } from 'next/navigation';
import { useRequiredPlatform } from '../../context/platform-context';
import { useSession } from 'next-auth/react';
import { usePrepareCheckoutPresenter } from '../../hooks/use-prepare-checkout-presenter';
import { useCheckoutIntent } from '../../hooks/use-checkout-intent';
import { useCheckoutErrors, createCheckoutErrorViewModel } from '../../hooks/use-checkout-errors';
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
    const [currentRequest, setCurrentRequest] = useState<useCaseModels.TPrepareCheckoutRequest | null>(null);
    const [checkoutViewModel, setCheckoutViewModel] = useState<viewModels.TPrepareCheckoutViewModel | undefined>(undefined);
    const [checkoutError, setCheckoutError] = useState<viewModels.TPrepareCheckoutViewModel | null>(null);
    const { presenter: checkoutPresenter } = usePrepareCheckoutPresenter(setCheckoutViewModel);
    const utils = trpc.useUtils();
    const containerRef = useRef<HTMLDivElement>(null);

    // Helper to execute checkout
    const executeCheckout = useCallback(async (
        request: useCaseModels.TPrepareCheckoutRequest,
    ) => {
        try {
            setCurrentRequest(request);
            setCheckoutError(null);
            // @ts-ignore
            const response = await utils.prepareCheckout.fetch(request);
            if (response && typeof response === 'object' && 'success' in response) {
                if (response.success === true && response.data) {
                    checkoutPresenter.present({ success: true, data: response.data } as useCaseModels.TPrepareCheckoutUseCaseResponse, checkoutViewModel);
                } else if (response.success === false && response.data) {
                    // Directly set error state for better reliability on repeated attempts
                    const errorViewModel = createCheckoutErrorViewModel(response.data);
                    setCheckoutError(errorViewModel);
                    // Scroll to packages section so user can see the error banner
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                checkoutPresenter.present(response as useCaseModels.TPrepareCheckoutUseCaseResponse, checkoutViewModel);
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
        const request: useCaseModels.TPrepareCheckoutRequest = {
            purchaseType: 'StudentPackagePurchase',
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
                                fullPrice: pkg.pricing.allCourses,
                                partialPrice: pkg.pricing.actual,
                                currency: platform.currency,
                            }}
                            duration={pkg.duration}
                            locale={locale}
                            onClickDetails={() => {
                                router.push(`/packages/${pkg.id}`);
                            }}
                            onClickPurchase={() => {
                                handlePurchase(pkg.id);
                            }}
                        />
                    );
                })}
            </CardListLayout>

            {/* Checkout Modal */}
            {transactionDraft && currentRequest && currentRequest.purchaseType === 'StudentPackagePurchase' && (
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
                />
            )}
        </div>
    );
}
