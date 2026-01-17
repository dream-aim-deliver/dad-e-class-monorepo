'use client';

import { trpc } from '../trpc/cms-client';
import { useEffect, useState, useRef } from 'react';
import {
  DefaultLoading,
  DefaultError,
  Breadcrumbs,
  TransactionsGrid,
  AddTransactionModal,
  Button,
  ConfirmationModal
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { viewModels } from '@maany_shr/e-class-models';
import { useListTransactionsPresenter } from '../hooks/use-list-transactions-presenter';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useRouter } from 'next/navigation';
import { generateInvoicePdf } from '../utils/generate-invoice-pdf';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | number | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Error modal state for PDF generation
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState<string | null>(null);

  const utils = trpc.useUtils();

  // TRPC queries
  const [transactionsResponse] = trpc.listTransactions.useSuspenseQuery({});
  const coachesQuery = trpc.listPlatformCoaches.useQuery({});
  const tagsQuery = trpc.listTransactionTags.useQuery({});

  // Presenter and ViewModel - transform data directly
  const [listTransactionsViewModel, setListTransactionsViewModel] = useState<
    viewModels.TListTransactionsViewModel | undefined
  >(undefined);
  const { presenter } = useListTransactionsPresenter(setListTransactionsViewModel);

  // Present server response into view model - runs on every render with fresh data
  useEffect(() => {
    // @ts-ignore
    presenter.present(transactionsResponse, listTransactionsViewModel);
  }, [transactionsResponse, presenter, listTransactionsViewModel]);

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
      setIsDeleteModalOpen(false);
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
    const supportEmail = platform.supportEmailAddress;

    if (supportEmail && supportEmail.trim() !== '') {
      return (
        <DefaultError
          type="withSupportEmail"
          locale={locale}
          title={t('error.kaboom.title')}
          description={t('error.kaboom.description')}
          supportEmailAddress={supportEmail}
        />
      );
    } else {
      return (
        <DefaultError
          type="simple"
          locale={locale}
          title={t('error.kaboom.title')}
          description={t('error.kaboom.description')}
        />
      );
    }
  }

  if (listTransactionsViewModel.mode === 'not-found') {
    const errorData = listTransactionsViewModel.data;
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

  // Success state
  const transactionsData = listTransactionsViewModel.data as any;

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
      items: data?.items ?? [],
      coachId: Number(data?.coachId),
      tagIds: (data?.tagIds ?? []).map((x: any) => String(x)),
      settledAt: data?.paidAt ? new Date(data.paidAt).toISOString() : null,
      invoiceUrl: data?.invoiceUrl ?? null,
    };
    createTransactionMutation.mutate(payload as any);
  };

  const handleDeleteTransaction = (transactionId: string | number) => {
    setDeletingTransactionId(transactionId);
    setDeleteErrorMessage(null);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingTransactionId) return;
    deleteTransactionMutation.mutate({ transactionId: deletingTransactionId } as any);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingTransactionId(null);
    setDeleteErrorMessage(null);
  };

  const handleOpenInvoice = async (transactionId: string | number, invoiceUrl?: string | null) => {
    if (invoiceUrl) {
      try {
        window.open(invoiceUrl, '_blank');
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // Generate PDF for transactions without invoiceUrl
    const allTransactions = transactionsData?.transactions || [];
    const transaction = allTransactions.find((t: any) => t.id === transactionId);

    if (!transaction) {
      setErrorModal({
        isOpen: true,
        title: t('error.title'),
        message: t('invoice.transactionNotFound'),
      });
      return;
    }

    // Get coach data from the transaction's user field (user is the coach receiving payment)
    const coachUserId = transaction.user?.id;

    if (!coachUserId) {
      setErrorModal({
        isOpen: true,
        title: t('error.title'),
        message: t('invoice.coachDataFetchFailed'),
      });
      return;
    }

    // Handle different possible response structures from listPlatformCoaches
    let coaches: any[] = [];
    if (coachesQuery.data) {
      // Try to extract coaches from the response
      const responseData = coachesQuery.data as any;
      if (responseData.coaches) {
        coaches = responseData.coaches;
      } else if (responseData.data?.coaches) {
        coaches = responseData.data.coaches;
      } else if (Array.isArray(responseData)) {
        coaches = responseData;
      }
    }

    const coachData = coaches.find((c: any) => c.id === coachUserId || c.userId === coachUserId);

    if (!coachData) {
      console.error('Coach data not found. CoachUserId:', coachUserId, 'Available coaches:', coaches);
      setErrorModal({
        isOpen: true,
        title: t('error.title'),
        message: t('invoice.coachDataFetchFailed'),
      });
      return;
    }

    console.log('Found coach data:', coachData);
    console.log('Transaction user data:', transaction.user);

    // Validate that coach has filled in required profile fields
    // Check both coachData.profile and transaction.user for name/surname
    const profileName = coachData.profile?.name || transaction.user?.name;
    const profileSurname = coachData.profile?.surname || transaction.user?.surname;
    const profileEmail = coachData.profile?.email || transaction.user?.email;

    if (!profileName || !profileSurname) {
      console.error('Missing name/surname. CoachData:', coachData, 'Transaction.user:', transaction.user);
      setErrorModal({
        isOpen: true,
        title: t('error.title'),
        message: t('invoice.coachDataMissing'),
      });
      return;
    }

    setIsGeneratingPdf(String(transactionId));

    try {
      // Transform transaction to match InvoiceTransactionData interface
      const invoiceTransaction = {
        id: transaction.id,
        createdAt: transaction.createdAt,
        currency: transaction.currency,
        content: {
          type: 'coachingOffers' as const,
          unitPrice: 0,
          items: (transaction.content?.items || []).map((item: any) => ({
            title: item.description,
            duration: item.duration || '0',
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      };

      // Generate PDF with coach as customer
      await generateInvoicePdf({
        transaction: invoiceTransaction,
        platformData: {
          name: platform.name,
          logoUrl: platform.logo?.downloadUrl || '',
          domainName: platform.domainName,
          companyName: platform.companyName,
          companyAddress: platform.companyAddress,
          companyUid: platform.companyUuid,
        },
        customerData: {
          name: profileName,
          surname: profileSurname,
          email: coachData.profile?.email || transaction.user?.email,
          phone: coachData.profile?.phone || transaction.user?.phone,
          companyDetails: coachData.profile?.companyDetails,
        },
        locale: locale,
        translations: {
          invoiceNo: t('invoice.invoiceNo'),
          invoiceDate: t('invoice.invoiceDate'),
          customerDetails: t('invoice.customerDetails'),
          fullName: t('invoice.fullName'),
          email: t('invoice.email'),
          phoneNumber: t('invoice.phoneNumber'),
          companyName: t('invoice.companyName'),
          companyUidVat: t('invoice.companyUidVat'),
          companyEmail: t('invoice.companyEmail'),
          companyAddress: t('invoice.companyAddress'),
          orderId: t('invoice.orderId'),
          pricePerUnit: t('invoice.pricePerUnit'),
          units: t('invoice.units'),
          total: t('invoice.total'),
          course: t('invoice.course'),
          coachingSession: t('invoice.coachingSession'),
          package: t('invoice.package'),
          totalLabel: t('invoice.totalLabel'),
          paymentMethod: t('invoice.paymentMethod'),
          type: t('invoice.type'),
          description: t('invoice.description'),
        },
      });
    } catch (error: any) {
      setErrorModal({
        isOpen: true,
        title: t('invoice.generationFailedTitle'),
        message: `${t('invoice.generationFailed')}: ${error.message || t('invoice.generationFailedGeneric')}`,
      });
    } finally {
      setIsGeneratingPdf(null);
    }
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
      label: breadcrumbsTranslations('transactions'),
      onClick: () => {
        // current page
      },
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] space-y-2 gap-4">
      <div className="flex-shrink-0">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <div className="flex-shrink-0 flex flex-col space-y-2">
        <h1>{t('title')}</h1>
        <p className="text-text-secondary text-sm">
          Platform: {platformContext.platformSlug}
        </p>
      </div>

      {/* Transactions Grid */}
      <div className="flex-1 min-h-0">
        <TransactionsGrid
          gridRef={gridRef}
          transactions={transactionsData.transactions as any}
          locale={locale}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenInvoice={handleOpenInvoice}
          onCreateTransaction={handleOpenCreateModal}
          availableTagsForFilter={((tagsQuery.data?.data as any)?.tags) || []}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center z-[1100]" onClick={handleCancelDelete}>
          <div className="flex flex-col gap-4 p-6 bg-card-fill border border-card-stroke text-text-primary w-full max-w-[500px] rounded-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{t('deleteModal.title')}</h2>
              <p className="text-text-secondary text-sm">{t('deleteModal.message')}</p>
            </div>

            {deleteErrorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                {deleteErrorMessage}
              </div>
            )}

            <div className="h-px w-full bg-divider"></div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="medium"
                onClick={handleCancelDelete}
                className="flex-1"
                text={t('deleteModal.cancel')}
                disabled={deleteTransactionMutation.isPending}
              />
              <Button
                variant="primary"
                size="medium"
                onClick={handleConfirmDelete}
                className="flex-1"
                text={deleteTransactionMutation.isPending ? t('deleteModal.deleting') : t('deleteModal.confirm')}
                disabled={deleteTransactionMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Modal for PDF Generation */}
      <ConfirmationModal
        type="accept"
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="OK"
        locale={locale}
      />
    </div>
  );
}
