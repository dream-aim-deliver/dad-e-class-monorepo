'use client';

import { trpc } from '../trpc/cms-client';
import { useEffect, useState, useRef } from 'react';
import { 
  DefaultLoading, 
  DefaultError, 
  Breadcrumbs, 
  TransactionsGrid, 
  AddTransactionModal 
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useListTransactionsPresenter } from '../hooks/use-list-transactions-presenter';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useRouter } from 'next/navigation';

interface TransactionsProps {
  locale: TLocale;
  platformSlug: string;
}

export default function Transactions(_props: TransactionsProps) {
  const locale = useLocale() as TLocale;
  const t = useTranslations('pages.cmsTransactions') as any;
  const breadcrumbsTranslations = useTranslations('components.breadcrumbs') as any;

  // Platform context
  const platformContext = useRequiredPlatformLocale();
  const { platform } = useRequiredPlatform();
  const router = useRouter();

  // Grid ref for AG Grid instance
  const gridRef = useRef<any>(null);

  // Add Transaction Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);

  // Delete Transaction Modal state
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | number | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();

  // Presenter and ViewModel state
  const [listTransactionsViewModel, setListTransactionsViewModel] = useState<
    viewModels.TListTransactionsViewModel | undefined
  >(undefined);
  const { presenter } = useListTransactionsPresenter(setListTransactionsViewModel);

  // TRPC queries
  const [transactionsResponse] = trpc.listTransactions.useSuspenseQuery({});
  const coachesQuery = trpc.listPlatformCoaches.useQuery({});
  const tagsQuery = trpc.listTransactionTags.useQuery({});

  // Present server response into view model outside of render to avoid state updates during render
  useEffect(() => {
    // @ts-ignore
    presenter.present(transactionsResponse, listTransactionsViewModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionsResponse]);

  // Mutations 
  const createTransactionMutation = trpc.createOutgoingTransaction.useMutation({
    onSuccess: () => {
      utils.listTransactions.invalidate();
      setCreateSuccess(true);
      setCreateErrorMessage(null);
      // Auto-close modal after 2s
      const timer = setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreateSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    },
    onError: (error) => {
      setCreateSuccess(false);
      setCreateErrorMessage(t('error.createFailed'));
    },
  });

  const deleteTransactionMutation = trpc.deleteOutgoingTransaction.useMutation({
    onSuccess: () => {
      utils.listTransactions.invalidate();
      setDeletingTransactionId(null);
      setDeleteErrorMessage(null);
    },
    onError: (error) => {
      const code = (error as any)?.data?.code;
      if (code === 'UNAUTHORIZED') setDeleteErrorMessage(t('error.unauthorized'));
      else if (code === 'NOT_FOUND') setDeleteErrorMessage(t('error.notFound'));
      else setDeleteErrorMessage(t('error.deleteFailed'));
    },
  });

  // Create Tag mutation
  const createTagMutation = trpc.createTransactionTag.useMutation({
    onSuccess: () => {
      utils.listTransactionTags.invalidate();
      // mirror success handling: clear any create error and keep modal open
      setCreateErrorMessage(null);
    },
    onError: () => {
      // reuse the same error messaging as transaction creation
      setCreateErrorMessage(t('error.createFailed'));
    },
  });

  // Loading state
  if (!listTransactionsViewModel) {
    return <DefaultLoading locale={locale} variant="minimal" />;
  }

  // Error handling
  if (listTransactionsViewModel.mode === 'kaboom') {
    const errorData = listTransactionsViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        locale={locale}
        title={t('error.kaboom.title')}
        description={t('error.kaboom.description')}
      />
    );
  }

  if (listTransactionsViewModel.mode === 'not-found') {
    const errorData = listTransactionsViewModel.data;
    console.error(errorData);
    return (
      <DefaultError
        locale={locale}
        title={t('error.notFoundError.title')}
        description={t('error.notFoundError.description')}
      />
    );
  }

  // Success state
  const transactionsData = listTransactionsViewModel.data;

  // Handlers
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateSuccess(false);
    setCreateErrorMessage(null);
  };

  const handleCreateTransaction = (data: any) => {
    setCreateErrorMessage(null);
    const payload = {
      currency: platform.currency,
      items: [
        {
          description: (data?.description ?? '').toString(),
          unitPrice: Number(data?.amount),
          quantity: 1,
        },
      ],
      coachId: Number(data?.coachId),
      tagIds: (data?.tagIds ?? []).map((x: any) => String(x)),
      settledAt: data?.paidAt ? new Date(data.paidAt).toISOString() : null,
      invoiceUrl: data?.invoiceUrl ?? null,
    };
    createTransactionMutation.mutate(payload as any);
  };

  const handleDeleteTransaction = (transactionId: string | number) => {
    setDeletingTransactionId(transactionId);
    // immediate delete (no modal) to mirror coupons revoke; can be extended later
    deleteTransactionMutation.mutate({ transactionId } as any);
  };

  const handleOpenInvoice = (transactionId: string | number, invoiceUrl?: string | null) => {
    if (invoiceUrl) {
      try {
        window.open(invoiceUrl, '_blank');
      } catch (e) {
        console.error(e);
      }
      return;
    }
    // TODO: Implement generateInvoicePdf use case and then navigate/open the generated URL
    console.info('generateInvoicePdf is not implemented yet for transaction', transactionId);
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
      label: breadcrumbsTranslations('transactions'),
      onClick: () => {
        // current page
      },
    },
  ];

  return (
    <div className="flex flex-col space-y-2 bg-card-fill p-5 border border-card-stroke rounded-medium gap-4 h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col space-y-2">
        <h1>{t('title')}</h1>
        <p className="text-text-secondary text-sm">
          Platform: {platformContext.platformSlug}
        </p>
      </div>

      {/* Transactions Grid */}
      <div className="flex flex-col grow bg-transparent">
        <TransactionsGrid
          gridRef={gridRef}
          transactions={transactionsData.transactions as any}
          locale={locale}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenInvoice={handleOpenInvoice}
          onCreateTransaction={handleOpenCreateModal}
        />
      </div>

      {/* Create Transaction Modal */}
      {isCreateModalOpen && (
        <AddTransactionModal
          locale={locale}
          onClose={handleCloseCreateModal}
          onCreateTransaction={handleCreateTransaction}
          isCreating={createTransactionMutation.isPending}
          isSuccess={createSuccess}
          errorMessage={createErrorMessage}
          coachesQuery={coachesQuery as any}
          tagsQuery={tagsQuery as any}
          onCreateTag={(name) => createTagMutation.mutate({ name })}
          isCreatingTag={createTagMutation.isPending}
        />
      )}

      {/* Delete errors (simple banner) */}
      {deleteErrorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {deleteErrorMessage}
        </div>
      )}
    </div>
  );
}
