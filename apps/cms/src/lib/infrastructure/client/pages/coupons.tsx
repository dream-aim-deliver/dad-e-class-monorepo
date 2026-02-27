'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useRef, useEffect } from 'react';
import {
  DefaultLoading,
  DefaultError,
  CouponGrid,
  Breadcrumbs,
  RevokeCouponModal,
  CreateCouponModal,
  Dialog,
  DialogContent,
  DialogBody,
  Button
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCouponsPresenter } from '../hooks/use-list-coupons-presenter';
import { useRevokeCouponPresenter } from '../hooks/use-revoke-coupon-presenter';
import { useCreateCouponPresenter } from '../hooks/use-create-coupon-presenter';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useRouter } from 'next/navigation';

interface CouponsProps {
  locale: string;
  platformSlug: string;
  platformLocale: string;
}

function RevokeCouponModalContent({
  couponId,
  couponName,
  locale,
  onClose,
  onError,
}: {
  couponId: string;
  couponName: string;
  locale: TLocale;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const utils = trpc.useUtils();

  const [revokeCouponViewModel, setRevokeCouponViewModel] = useState<
    viewModels.TRevokeCouponViewModel | undefined
  >(undefined);
  const { presenter } = useRevokeCouponPresenter(setRevokeCouponViewModel);

  const revokeCouponMutation = trpc.revokeCoupon.useMutation({
    onSuccess: () => {
      void utils.listCoupons.invalidate();
    },
  });

  const handleConfirm = async () => {
    try {
      setRevokeCouponViewModel(undefined);
      const result = await revokeCouponMutation.mutateAsync({ couponId });
      // @ts-ignore
      await presenter.present(result, revokeCouponViewModel);

      // Check for error after presenting
      if (result && !result.success) {
        const errorMsg = (result.data as { message?: string })?.message || 'Failed to revoke coupon';
        onClose();
        onError(errorMsg);
      }
    } catch (error) {
      console.error('Failed to revoke coupon:', error);
      onClose();
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isSuccess = revokeCouponViewModel?.mode === 'default';

  return (
    <RevokeCouponModal
      couponName={couponName}
      locale={locale}
      onConfirm={handleConfirm}
      onCancel={handleClose}
      isRevoking={revokeCouponMutation.isPending}
      isSuccess={isSuccess}
    />
  );
}

function CreateCouponModalContent({
  locale,
  onSuccess,
  onClose,
  existingCoupons,
}: {
  locale: TLocale;
  onSuccess: (couponName: string) => void;
  onClose: () => void;
  existingCoupons: Array<{ name: string; status: 'active' | 'revoked' }>;
}) {
  const tCreate = useTranslations('components.createCouponModal');
  const utils = trpc.useUtils();

  // background queries for modal
  const coursesQuery = trpc.listPlatformCoursesShort.useQuery({ status: 'live' });
  const packagesQuery = trpc.listPackagesShort.useQuery({});
  const coachingQuery = trpc.listPlatformCoachingOfferings.useQuery({});

  const [createCouponViewModel, setCreateCouponViewModel] = useState<
    viewModels.TCreateCouponViewModel | undefined
  >(undefined);
  const { presenter } = useCreateCouponPresenter(setCreateCouponViewModel);

  const [clientValidationError, setClientValidationError] = useState<string | null>(null);

  const createCouponMutation = trpc.createCoupon.useMutation();

  useEffect(() => {
    if (createCouponMutation.isSuccess && createCouponMutation.data) {
      // @ts-ignore
      presenter.present(createCouponMutation.data, createCouponViewModel);
      void utils.listCoupons.invalidate();
    }
  }, [createCouponMutation.isSuccess, createCouponMutation.data, presenter, createCouponViewModel, utils]);

  useEffect(() => {
    if (createCouponViewModel?.mode === 'default') {
      const couponName = createCouponViewModel.data.coupon.name;
      onSuccess(couponName);
    }
  }, [createCouponViewModel, onSuccess]);

  const handleClose = () => {
    onClose();
  };

  const handleCreateCoupon = (data: unknown) => {
    const couponData = data as { name?: string;[key: string]: unknown };
    const newName: string | undefined = couponData?.name?.trim();
    setClientValidationError(null);
    if (newName) {
      // Check if there's an active coupon with the same name
      const activeCouponWithSameName = existingCoupons.find(
        (c) => c.name.toLowerCase() === newName.toLowerCase() && c.status === 'active'
      );
      if (activeCouponWithSameName) {
        // Client-side validation error
        setClientValidationError(tCreate('nameConflictMessage', { couponName: newName }));
        return;
      }
      // If coupon exists but is revoked, allow creating with same name
    }
    createCouponMutation.mutate(data as Parameters<typeof createCouponMutation.mutate>[0]);
  };

  const isSuccess = createCouponViewModel?.mode === 'default';
  const createdCouponName = createCouponViewModel?.mode === 'default'
    ? createCouponViewModel.data.coupon.name
    : '';
  const errorMessage = clientValidationError
    ? clientValidationError
    : createCouponViewModel?.mode === 'kaboom'
      ? createCouponViewModel.data.message
      : null;

  return (
    <CreateCouponModal
      locale={locale}
      onClose={handleClose}
      onSuccess={onSuccess}
      coursesQuery={{ data: coursesQuery.data, isLoading: coursesQuery.isLoading, error: coursesQuery.error }}
      packagesQuery={{ data: packagesQuery.data, isLoading: packagesQuery.isLoading, error: packagesQuery.error }}
      coachingQuery={{ data: coachingQuery.data, isLoading: coachingQuery.isLoading, error: coachingQuery.error }}
      onCreateCoupon={handleCreateCoupon}
      isCreating={createCouponMutation.isPending}
      isSuccess={isSuccess}
      createdCouponName={createdCouponName}
      errorMessage={errorMessage}
    />
  );
}

export default function Coupons({ platformSlug, platformLocale }: CouponsProps) {
  const locale = useLocale() as TLocale;
  const t = useTranslations('pages.coupons');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

  // Platform context
  const platformContext = useRequiredPlatformLocale();
  const { platform } = useRequiredPlatform();
  const router = useRouter();

  // Grid ref for AG Grid instance
  const gridRef = useRef(null);

  // Revoke Modal state
  const [revokingCouponId, setRevokingCouponId] = useState<string | null>(null);
  const [revokingCouponName, setRevokingCouponName] = useState<string>('');

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Error modal state
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  // ViewModel state
  const [listCouponsViewModel, setListCouponsViewModel] = useState<
    viewModels.TListCouponsViewModel | undefined
  >(undefined);

  // Presenter hook
  const { presenter } = useListCouponsPresenter(setListCouponsViewModel);

  // TRPC query for page data
  const [couponsResponse] = trpc.listCoupons.useSuspenseQuery({});

  // Present the data whenever it changes
  useEffect(() => {
    if (couponsResponse) {
      // @ts-ignore
      presenter.present(couponsResponse, listCouponsViewModel);
    }
  }, [couponsResponse, presenter, listCouponsViewModel]);

  // Loading state
  if (!listCouponsViewModel) {
    return <DefaultLoading locale={locale} variant="minimal" />;
  }

  // Error handling
  if (listCouponsViewModel.mode === 'kaboom') {
    const errorData = listCouponsViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        type="simple"
        locale={locale}
        title={t('error.kaboom.title')}
        description={t('error.kaboom.description')}
      />
    );
  }

  if (listCouponsViewModel.mode === 'not-found') {
    const errorData = listCouponsViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        type="simple"
        locale={locale}
        title={t('error.notFoundError.title')}
        description={t('error.notFoundError.description')}
      />
    );
  }

  // Success state - extract data from ViewModel
  const couponsData = listCouponsViewModel.data;

  // Revoke coupon handler
  const handleRevokeCoupon = (couponId: string) => {
    const coupon = listCouponsViewModel.data.coupons.find(c => c.id === couponId);
    if (coupon) {
      setRevokingCouponId(coupon.id);
      setRevokingCouponName(coupon.name);
    }
  };

  // Create coupon handler
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Breadcrumbs following the standard pattern
  const breadcrumbItems = [
    {
      label: breadcrumbsTranslations('platforms'),
      onClick: () => router.push('/'),
    },
    {
      label: platform.name,
      onClick: () => {
        router.push(`/platform/${platformContext.platformSlug}/${platformContext.platformLocale}`);
      },
    },
    {
      label: breadcrumbsTranslations('coupons'),
      onClick: () => {
        // Nothing should happen on clicking the current page
      },
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] space-y-5">
      {/* Header - won't shrink */}
      <div className="flex-shrink-0">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-col space-y-2">
          <h1>Coupons</h1>
          <p className="text-text-secondary text-sm">
            Platform: {platformContext.platformSlug} | Content Language: {platformLocale.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Coupons Grid - grows to fill space */}
      <div className="flex-1 min-h-0">
        <CouponGrid
          gridRef={gridRef}
          coupons={listCouponsViewModel.data.coupons}
          locale={locale}
          onRevokeCoupon={handleRevokeCoupon}
          onCreateCoupon={handleOpenCreateModal}
        />
      </div>

      {/* Revoke Coupon Modal */}
      {revokingCouponId && (
        <RevokeCouponModalContent
          couponId={revokingCouponId}
          couponName={revokingCouponName}
          locale={locale}
          onClose={() => {
            setRevokingCouponId(null);
            setRevokingCouponName('');
          }}
          onError={(message) => setErrorModalMessage(message)}
        />
      )}

      {/* Error Modal */}
      <Dialog open={!!errorModalMessage} onOpenChange={() => setErrorModalMessage(null)} defaultOpen={false}>
        <DialogContent
          showCloseButton={true}
          closeOnOverlayClick={true}
          closeOnEscape={true}
          className="max-w-md"
        >
          <DialogBody>
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-semibold text-text-primary">
                {t('error.revokeError.title')}
              </h1>
              <p className="text-text-secondary">
                {errorModalMessage}
              </p>
              <div className="flex justify-end mt-4">
                <Button
                  variant="primary"
                  size="medium"
                  text={t('error.revokeError.closeButton')}
                  onClick={() => setErrorModalMessage(null)}
                />
              </div>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <CreateCouponModalContent
          locale={locale}
          onClose={handleCloseCreateModal}
          onSuccess={() => {
            setIsCreateModalOpen(false);
          }}
          existingCoupons={(listCouponsViewModel.data.coupons || []).map((c) => ({
            name: c.name || '',
            status: c.status,
          }))}
        />
      )}
    </div>
  );
}
