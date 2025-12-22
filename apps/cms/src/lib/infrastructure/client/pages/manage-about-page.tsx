'use client';

/**
 * ManageAboutPage component for CMS
 * Allows admins to manage the about page rich text content
 * - Fetches existing about page content from platform language settings
 * - Provides rich text editor for content modification
 * - Saves content back to the platform with optimistic concurrency control
 */

import { useContentLocale } from '../hooks/use-platform-translations';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useRequiredPlatform } from '../context/platform-context';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '../trpc/cms-client';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetPlatformLanguagePresenter } from '../hooks/use-platform-language-presenter';
import { useSaveAboutPagePresenter } from '../hooks/use-save-about-page-presenter';
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
	IconSave,
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

export default function ManageAboutPage() {
	// TRPC utils for query invalidation
	const utils = trpc.useUtils();

	// Platform context
	const platformContext = useRequiredPlatformLocale();
	const { platform } = useRequiredPlatform();
	const contentLocale = useContentLocale();
	const locale = useLocale() as TLocale;
	const router = useRouter();
	const breadcrumbsTranslations = useTranslations('components.breadcrumbs');

	// Data fetching - query for platform language data
	const [platformLanguageResponse, { refetch: refetchPlatformLanguage }] = trpc.getPlatformLanguage.useSuspenseQuery({});

	const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
		viewModels.TPlatformLanguageViewModel | undefined
	>(undefined);

	// Query presenter
	const { presenter: platformLanguagePresenter } = useGetPlatformLanguagePresenter(
		setPlatformLanguageViewModel,
	);

	// @ts-ignore
	platformLanguagePresenter.present(platformLanguageResponse, platformLanguageViewModel);

	// Rich text editor state
	const [currentContent, setCurrentContent] = useState<string>('');
	const [isContentInitialized, setIsContentInitialized] = useState(false);

	useEffect(() => {
		if (
			!isContentInitialized &&
			platformLanguageViewModel?.mode === 'default' &&
			platformLanguageViewModel.data.aboutPageContent
		) {
			setCurrentContent(platformLanguageViewModel.data.aboutPageContent);
			setIsContentInitialized(true);
		} else if (
			!isContentInitialized &&
			platformLanguageViewModel?.mode === 'default' &&
			!platformLanguageViewModel.data.aboutPageContent
		) {
			// Handle case where about page content is null/empty
			setCurrentContent('');
			setIsContentInitialized(true);
		}
	}, [platformLanguageViewModel, isContentInitialized]);

	// Save mutation
	const saveAboutPageMutation = trpc.saveAboutPage.useMutation();
	const [saveViewModel, setSaveViewModel] = useState<
		viewModels.TSaveAboutPageViewModel | undefined
	>(undefined);

	// Mutation presenter
	const { presenter: savePresenter } = useSaveAboutPagePresenter(setSaveViewModel);

	// Error and success message state
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (saveAboutPageMutation.isSuccess && saveAboutPageMutation.data) {
			// @ts-ignore
			savePresenter.present(saveAboutPageMutation.data, saveViewModel);
		}
	}, [saveAboutPageMutation.isSuccess, saveAboutPageMutation.data, savePresenter, saveViewModel]);

	useEffect(() => {
		if (
			saveAboutPageMutation.isSuccess &&
			saveViewModel?.mode === 'default'
		) {
			// Success case
			setErrorMessage(null);
			setSuccessMessage('About page content saved successfully!');
			// Auto-dismiss success message after 5 seconds
			const timer = setTimeout(() => setSuccessMessage(null), 5000);
			return () => clearTimeout(timer);
		}
		// Handle kaboom and other error modes
		if (
			saveAboutPageMutation.isSuccess &&
			saveViewModel?.mode === 'kaboom'
		) {
			setErrorMessage(
				'Failed to save about page content. Please try again.'
			);
			setSuccessMessage(null);
		}
	}, [saveViewModel, saveAboutPageMutation.isSuccess]);

	useEffect(() => {
		if (saveAboutPageMutation.isError) {
			setErrorMessage(
				saveAboutPageMutation.error?.message ||
				'Failed to save about page content. Please try again.'
			);
			setSuccessMessage(null);
		}
	}, [saveAboutPageMutation.isError, saveAboutPageMutation.error]);

	const handleSave = useCallback(async () => {
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			await saveAboutPageMutation.mutateAsync({
				aboutPageContent: currentContent,
			});
			// Invalidate query to trigger refetch
			await utils.getPlatformLanguage.invalidate();
		} catch (error) {
			// Error handled by useEffect
		}
	}, [currentContent, saveAboutPageMutation, utils.getPlatformLanguage]);

	if (platformLanguageViewModel?.mode === 'kaboom') {
		return (
			<DefaultError
				locale={locale}
				onRetry={() => refetchPlatformLanguage()}
			/>
		);
	}

	// Loading state - show loading animation while data is being fetched or initialized
	if (!platformLanguageViewModel || !isContentInitialized) {
		return (
			<div className="flex flex-col space-y-2 bg-card-fill p-5 border border-card-stroke rounded-medium gap-4">
				<div className="flex flex-col space-y-2">
					<h1>Manage About Page</h1>
					<p className="text-text-secondary text-sm">
						Platform: {platform.name} | Content Language: {contentLocale.toUpperCase()}
					</p>
				</div>

				<div className="flex items-center justify-center min-h-[400px]">
					<DefaultLoading locale={locale} variant="minimal" />
				</div>
			</div>
		);
	}

	// Success state - extract data from view model
	const aboutPageData = platformLanguageViewModel.data;
	
	// Check if content has been modified
	const hasChanges = currentContent !== (aboutPageData.aboutPageContent || '');

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
			label: breadcrumbsTranslations('aboutPage'),
			onClick: () => {
				// Nothing should happen on clicking the current page
			},
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<Breadcrumbs items={breadcrumbItems} />

			<div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-lg">
				<div className="flex justify-between items-center">
					<div className="flex flex-col space-y-2">
						<h1>Manage About Page</h1>
						<p className="text-text-secondary text-sm">
							Platform: {platform.name} | Content Language: {contentLocale.toUpperCase()}
						</p>
					</div>
					<Button
						variant="primary"
						size="medium"
						hasIconLeft
						iconLeft={<IconSave />}
						text={saveAboutPageMutation.isPending ? 'Saving...' : 'Save Changes'}
						onClick={handleSave}
						disabled={saveAboutPageMutation.isPending || !hasChanges}
					/>
				</div>
			</div>

			{/* Success Banner - Course builder style */}
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

			{/* About Page Content Editor */}
			<div className="flex flex-col gap-4 bg-card-fill p-5 border border-card-stroke rounded-medium">

					<div className='flex flex-row justify-between items-center'>
					<h3>About page content</h3>

				</div>

				<RichTextDesignerComponent
					elementInstance={{
						id: 'about-page-content',
						type: FormElementType.RichText,
						content: aboutPageData.aboutPageContent || '',
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
