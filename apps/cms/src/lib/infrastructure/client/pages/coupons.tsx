'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useRef } from 'react';
import { DefaultLoading, DefaultError, CouponGrid, Breadcrumbs, RevokeCouponModal, CreateCouponModal } from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useListCouponsPresenter } from '../hooks/use-list-coupons-presenter';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useRouter } from 'next/navigation';

interface CouponsProps {
  locale: string;
  platformSlug: string;
  platformLocale: string;
}

export default function Coupons({ platformSlug, platformLocale }: CouponsProps) {
  const locale = useLocale() as TLocale;
  const t = useTranslations('pages.coupons');
  const tCreate = useTranslations('components.createCouponModal');
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

  // Platform context
  const platformContext = useRequiredPlatformLocale();
  const { platform } = useRequiredPlatform();
  const router = useRouter();

  // Grid ref for AG Grid instance
  const gridRef = useRef<any>(null);

  // Revoke Modal state
  const [revokingCouponId, setRevokingCouponId] = useState<string | null>(null);
  const [revokingCouponName, setRevokingCouponName] = useState<string>('');
  const [revokeSuccess, setRevokeSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [createdCouponName, setCreatedCouponName] = useState<string>('');
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);

  // TRPC mutation for revoking coupons
  const revokeCouponMutation = trpc.revokeCoupon.useMutation({
    onSuccess: () => {
      setRevokeSuccess(true);
      setErrorMessage(null);
      utils.listCoupons.invalidate();
      // Auto-close modal after 5 seconds
      const timer = setTimeout(() => {
        setRevokingCouponId(null);
        setRevokingCouponName('');
        setRevokeSuccess(false);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    },
    onError: (error) => {
      setRevokeSuccess(false);
      setErrorMessage(null);
      // Set appropriate error message based on error type
      if (error?.data?.code === 'UNAUTHORIZED') {
        setErrorMessage(t('error.unauthorized'));
      } else if (error?.data?.code === 'NOT_FOUND') {
        setErrorMessage(t('error.notFound'));
      } else {
        setErrorMessage(t('error.revokeFailed'));
      }
    },
  });

  const utils = trpc.useUtils();

  // TRPC queries for Create Coupon Modal
  const coursesQuery = trpc.listPlatformCoursesShort.useQuery({});
  const packagesQuery = trpc.listPackagesShort.useQuery({});
  const coachingQuery = trpc.listPlatformCoachingOfferings.useQuery({});

  // TRPC mutation for creating coupons
  const createCouponMutation = trpc.createCoupon.useMutation({
    onSuccess: (data) => {
      utils.listCoupons.invalidate();
      setCreateSuccess(true);
      setCreatedCouponName((data as any)?.data?.coupon?.name || '');
      setCreateErrorMessage(null); // Clear any previous errors
    },
    onError: (error) => {
      setCreateSuccess(false);
      
      // Set appropriate error message based on error type
      const errorData = (error as any)?.data;
      if (errorData?.errorType === 'name_already_exists') {
        setCreateErrorMessage(errorData?.message);
      } else {
        setCreateErrorMessage(t('error.createFailed'));
      }
    },
  });

  // ViewModel state
  const [listCouponsViewModel, setListCouponsViewModel] = useState<
    viewModels.TListCouponsViewModel | undefined
  >(undefined);

  // Presenter hook
  const { presenter } = useListCouponsPresenter(setListCouponsViewModel);

  // TRPC query for page data
  const [couponsResponse] = trpc.listCoupons.useSuspenseQuery({});

  //console.log('couponsResponse', couponsResponse);
  
  // @ts-ignore
  presenter.present(couponsResponse, listCouponsViewModel);

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
        locale={locale}
        title={t('error.notFoundError.title')}
        description={t('error.notFoundError.description')}
      />
    );
  }

  // Success state - extract data from ViewModel
  const couponsData = listCouponsViewModel.data;

  console.log('couponsData', listCouponsViewModel.data.coupons);

  // Revoke coupon handlers
  const handleRevokeCoupon = (couponId: string) => {
    const coupon = listCouponsViewModel.data.coupons.find(c => c.id === couponId);
    if (coupon) {
      setRevokingCouponId(coupon.id);
      setRevokingCouponName(coupon.name);
      setRevokeSuccess(false);
      setErrorMessage(null); // Clear any previous errors
    }
  };

  const handleConfirmRevoke = async () => {
    if (!revokingCouponId) return;
    
    revokeCouponMutation.mutate({couponId: revokingCouponId});
  };

  const handleCancelRevoke = () => {
    setRevokingCouponId(null);
    setRevokingCouponName('');
    setRevokeSuccess(false);
    setErrorMessage(null);
  };

  // Create coupon handlers
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateSuccess(false);
    setCreatedCouponName('');
    setCreateErrorMessage(null); // Clear error state
  };

  const handleCreateCoupon = (data: any) => {
    const newName: string | undefined = data?.name?.trim();
    if (newName) {
      const exists = listCouponsViewModel?.data?.coupons?.some(
        (c) => (c.name || '').toLowerCase() === newName.toLowerCase()
      );
      if (exists) {
        setCreateSuccess(false);
        setCreateErrorMessage(tCreate('nameConflictMessage', { couponName: newName }));
        return;
      }
    }
    setCreateErrorMessage(null);
    createCouponMutation.mutate(data);
  };

  const handleCreateCouponSuccess = (_couponName: string) => {
    // The modal will be closed by the mutation's onSuccess callback
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
        // TODO: Implement navigation to platform
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
    <div className="flex flex-col space-y-2 bg-card-fill p-5 border border-card-stroke rounded-medium gap-4 h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col space-y-2">
        <h1>{t('title')}</h1>
        <p className="text-text-secondary text-sm">
          Platform: {platformContext.platformSlug} | Content Language: {platformLocale.toUpperCase()}
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="flex flex-col grow bg-transparent">
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
        <RevokeCouponModal
          couponName={revokingCouponName}
          locale={locale}
          onConfirm={handleConfirmRevoke}
          onCancel={handleCancelRevoke}
          isRevoking={revokeCouponMutation.isPending}
          isSuccess={revokeSuccess}
          errorMessage={errorMessage}
        />
      )}

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <CreateCouponModal
          locale={locale}
          onClose={handleCloseCreateModal}
          onSuccess={handleCreateCouponSuccess}
          coursesQuery={coursesQuery}
          packagesQuery={packagesQuery}
          coachingQuery={coachingQuery}
          onCreateCoupon={handleCreateCoupon}
          isCreating={createCouponMutation.isPending}
          isSuccess={createSuccess}
          createdCouponName={createdCouponName}
          errorMessage={createErrorMessage}
        />
      )}
    </div>
  );
}
