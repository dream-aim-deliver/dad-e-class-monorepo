'use client';

import { trpc } from '../trpc/cms-client';
import { useState, useRef, useEffect } from 'react';
import { 
  DefaultLoading, 
  DefaultError,
  CouponGrid, 
  Breadcrumbs, 
  RevokeCouponModal, 
  CreateCouponModal 
} from '@maany_shr/e-class-ui-kit';
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

function RevokeCouponModalContent({
  couponId,
  couponName,
  locale,
  onSuccess,
  onClose,
}: {
  couponId: string;
  couponName: string;
  locale: TLocale;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const t = useTranslations('pages.coupons');
  const utils = trpc.useUtils();

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const revokeCouponMutation = trpc.revokeCoupon.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setErrorMessage(null);
      utils.listCoupons.invalidate();
    },
    onError: (error) => {
      setIsSuccess(false);
      setErrorMessage(null);
      if ((error as any)?.data?.code === 'UNAUTHORIZED') {
        setErrorMessage(t('error.unauthorized'));
      } else if ((error as any)?.data?.code === 'NOT_FOUND') {
        setErrorMessage(t('error.notFound'));
      } else {
        setErrorMessage(t('error.revokeFailed'));
      }
    },
  });

  const handleClose = () => {
    if (isSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleConfirm = () => {
    revokeCouponMutation.mutate({ couponId });
  };

  return (
    <RevokeCouponModal
      couponName={couponName}
      locale={locale}
      onConfirm={handleConfirm}
      onCancel={handleClose}
      isRevoking={revokeCouponMutation.isPending}
      isSuccess={isSuccess}
      errorMessage={errorMessage}
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
  const coursesQuery = trpc.listPlatformCoursesShort.useQuery({});
  const packagesQuery = trpc.listPackagesShort.useQuery({});
  const coachingQuery = trpc.listPlatformCoachingOfferings.useQuery({});

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCouponName, setCreatedCouponName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createCouponMutation = trpc.createCoupon.useMutation({
    onSuccess: (data) => {
      utils.listCoupons.invalidate();
      setIsSuccess(true);
      const name = (data as any)?.data?.coupon?.name || '';
      setCreatedCouponName(name);
      setErrorMessage(null);
    },
    onError: (error) => {
      setIsSuccess(false);
      const errorData = (error as any)?.data;
      if (errorData?.errorType === 'name_already_exists') {
        setErrorMessage(errorData?.message);
      } else {
        setErrorMessage(tCreate('error.createFailed'));
      }
    },
  });

  // Handle close: if in success state, notify parent; otherwise just close
  const handleClose = () => {
    if (isSuccess && createdCouponName) {
      onSuccess(createdCouponName);
    }
    onClose();
  };

  const handleCreateCoupon = (data: any) => {
    const newName: string | undefined = data?.name?.trim();
    if (newName) {
      // Check if there's an active coupon with the same name
      const activeCouponWithSameName = existingCoupons.find(
        (c) => c.name.toLowerCase() === newName.toLowerCase() && c.status === 'active'
      );
      if (activeCouponWithSameName) {
        setIsSuccess(false);
        setErrorMessage(tCreate('nameConflictMessage', { couponName: newName }));
        return;
      }
      // If coupon exists but is revoked, allow creating with same name
    }
    setErrorMessage(null);
    createCouponMutation.mutate(data);
  };

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
  const gridRef = useRef<any>(null);

  // Revoke Modal state
  const [revokingCouponId, setRevokingCouponId] = useState<string | null>(null);
  const [revokingCouponName, setRevokingCouponName] = useState<string>('');

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // ViewModel state
  const [listCouponsViewModel, setListCouponsViewModel] = useState<
    viewModels.TListCouponsViewModel | undefined
  >(undefined);

  // Presenter hook
  const { presenter } = useListCouponsPresenter(setListCouponsViewModel);

  // TRPC query for page data
  const [couponsResponse] = trpc.listCoupons.useSuspenseQuery({});

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
    <div className="flex flex-col space-y-2 gap-4 h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col space-y-2">
        <p className="text-text-secondary text-sm">
          Platform: {platformContext.platformSlug} | Content Language: {platformLocale.toUpperCase()}
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="flex flex-col grow bg-card-fill p-5 border border-card-stroke rounded-medium">
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
          onSuccess={() => {}}
          onClose={() => {
            setRevokingCouponId(null);
            setRevokingCouponName('');
          }}
        />
      )}

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
