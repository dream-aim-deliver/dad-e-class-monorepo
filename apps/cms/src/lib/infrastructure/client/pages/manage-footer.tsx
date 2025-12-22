'use client';

/**
 * ManageFooter component for CMS
 * Allows admins to manage the footer rich text content
 * - Fetches existing footer content from platform language settings
 * - Provides rich text editor for content modification
 * - Saves content back to the platform with optimistic concurrency control
 */

import { useContentLocale } from '../hooks/use-platform-translations';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformPresenter } from '../hooks/use-get-platform-presenter';
import { useSavePlatformFooterPresenter } from '../hooks/use-save-platform-footer-presenter';
import {
	DefaultLoading,
	DefaultError,
	RichTextDesignerComponent,
	RichTextElement,
	FormElementType,
	Button,
	FeedBackMessage,
	Banner,
	Breadcrumbs,
	DefaultNotFound,
	IconSave,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

export default function ManageFooter() {
	// TRPC utils for query invalidation
	const utils = trpc.useUtils();

	// Platform context
	const platformContext = useRequiredPlatformLocale();
	const { platform } = useRequiredPlatform();
	const contentLocale = useContentLocale();
	const locale = useLocale() as TLocale;
	const router = useRouter();
	const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
	const platformTranslations = useTranslations('pages.managePagesGeneral');
	const t = useTranslations('pages.manageFooter');

	// Data fetching - query for platform data
	const [platformResponse, { refetch: refetchPlatform }] = trpc.getPlatform.useSuspenseQuery({});

	const [platformViewModel, setPlatformViewModel] = useState<
		viewModels.TGetPlatformViewModel | undefined
	>(undefined);

	// Query presenter
	const { presenter: platformPresenter } = useGetPlatformPresenter(
		setPlatformViewModel,
	);

	// @ts-ignore
	platformPresenter.present(platformResponse, platformViewModel);

	// Rich text editor state
	const [currentContent, setCurrentContent] = useState<string>('');
	const [isContentInitialized, setIsContentInitialized] = useState(false);

	useEffect(() => {
		if (
			!isContentInitialized &&
			platformViewModel?.mode === 'default' &&
			platformViewModel.data.footerContent
		) {
			setCurrentContent(platformViewModel.data.footerContent);
			setIsContentInitialized(true);
		} else if (
			!isContentInitialized &&
			platformViewModel?.mode === 'default' &&
			!platformViewModel.data.footerContent
		) {
			// Handle case where footer content is null/empty
			setCurrentContent('');
			setIsContentInitialized(true);
		}
	}, [platformViewModel, isContentInitialized]);

	// Save mutation
	const savePlatformFooterMutation = trpc.savePlatformFooter.useMutation();
	const [saveViewModel, setSaveViewModel] = useState<
		viewModels.TSavePlatformFooterViewModel | undefined
	>(undefined);

	// Mutation presenter
	const { presenter: savePresenter } = useSavePlatformFooterPresenter(setSaveViewModel);

	// Error and success message state
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (savePlatformFooterMutation.isSuccess && savePlatformFooterMutation.data) {
			// @ts-ignore
			savePresenter.present(savePlatformFooterMutation.data, saveViewModel);
		}
	}, [savePlatformFooterMutation.isSuccess, savePlatformFooterMutation.data, savePresenter, saveViewModel]);

	useEffect(() => {
		if (
			savePlatformFooterMutation.isSuccess &&
			saveViewModel?.mode === 'default'
		) {
			// Success case
			setErrorMessage(null);
			setSuccessMessage(t('saveSuccess'));
			// Auto-dismiss success message after 5 seconds
			const timer = setTimeout(() => setSuccessMessage(null), 5000);
			return () => clearTimeout(timer);
		}
		// Handle kaboom and other error modes
		if (
			savePlatformFooterMutation.isSuccess &&
			saveViewModel?.mode === 'kaboom'
		) {
			setErrorMessage(t('saveError'));
			setSuccessMessage(null);
		}
	}, [saveViewModel, savePlatformFooterMutation.isSuccess]);

	useEffect(() => {
		if (savePlatformFooterMutation.isError) {
			setErrorMessage(
				savePlatformFooterMutation.error?.message || t('saveError')
			);
			setSuccessMessage(null);
		}
	}, [savePlatformFooterMutation.isError, savePlatformFooterMutation.error, t]);

	const handleSave = useCallback(async () => {
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			await savePlatformFooterMutation.mutateAsync({
				footerContent: currentContent,
			});
			// Invalidate query to trigger refetch
			await utils.getPlatform.invalidate();
		} catch (error) {
			// Error handled by useEffect
		}
	}, [currentContent, savePlatformFooterMutation, utils.getPlatform]);

	if (platformViewModel?.mode === 'kaboom') {
		return (
			<DefaultError
				locale={locale}
				onRetry={() => refetchPlatform()}
			/>
		);
	}

	if (platformViewModel?.mode === 'not-found') {
		return <DefaultNotFound locale={locale} />;
	}

	// Loading state - show loading animation while data is being fetched or initialized
	if (!platformViewModel || !isContentInitialized) {
		return (
			<div className="flex flex-col space-y-2 p-5 gap-4">
				<div className="flex flex-col space-y-2">
					<h1>{t('title')}</h1>
					<p className="text-text-secondary text-sm">
						{t('description')}
					</p>
				</div>

				<div className="flex items-center justify-center min-h-[400px]">
					<DefaultLoading locale={locale} variant="minimal" />
				</div>
			</div>
		);
	}

	// Success state - extract data from view model
	const footerData = platformViewModel.data;
	
	// Check if content has been modified
	const hasChanges = currentContent !== (footerData.footerContent || '');

	// Breadcrumbs following the standard pattern
	const breadcrumbItems = [
		{
			label: breadcrumbsTranslations('platforms'),
			onClick: () => router.push('/'),
		},
		{
			label: platform.name,
			onClick: () => router.push(`/platform/${platformContext.platformSlug}/${platformContext.platformLocale}`),
		},
		{
			label: breadcrumbsTranslations('footer'),
			onClick: () => {
				// Nothing should happen on clicking the current page
			},
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumbs items={breadcrumbItems} />

			<div className="flex flex-col space-y-2">
				<h1>{t('title')}</h1>
				<p className="text-text-secondary text-sm">
					{platformTranslations('platformLabel')} {platform.name} | {platformTranslations('contentLanguageLabel')} {contentLocale.toUpperCase()}
				</p>
			</div>
			<div className="sticky top-18 z-50 flex justify-end"> 
				<Button
					onClick={handleSave}
					disabled={savePlatformFooterMutation.isPending}
					variant="primary"
					size="medium"
					text={savePlatformFooterMutation.isPending ? t('saving') : t('saveButton')}
					className='shadow-lg'
				/>
			</div>

			{/* Success Banner */}
			{successMessage && (
				<Banner
					title="Success!"
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

			{/* Footer Content Editor */}
			<div className="flex flex-col gap-4 bg-card-fill p-5 border border-card-stroke rounded-medium">
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-1">
						<h2>{t('footerContentTitle')}</h2>
						<p className="text-sm text-text-secondary italic">{t('languageIndependentNote')}</p>
					</div>
				</div>

				<RichTextDesignerComponent
					elementInstance={{
						id: 'footer-content',
						type: FormElementType.RichText,
						content: footerData.footerContent || '',
					} as RichTextElement}
					locale={locale}
					onContentChange={(value: string) => {
						setCurrentContent(value);
					}}
					isCourseBuilder={false}
				/>
			</div>
		</div>
	);
}
