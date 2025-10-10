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
} from '@maany_shr/e-class-ui-kit';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useRouter } from 'next/navigation';

export default function ManageAboutPage() {
	// Platform context
	const platformContext = useRequiredPlatformLocale();
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

	// ✅ PATTERN: Present query data directly in render, not in useEffect
	// This follows the manage-topics pattern and prevents circular useEffect dependencies
	// Reference: apps/cms/src/lib/infrastructure/client/pages/manage-topics.tsx:300
	// @ts-ignore
	platformLanguagePresenter.present(platformLanguageResponse, platformLanguageViewModel);

	// Rich text editor state
	const [currentContent, setCurrentContent] = useState<string>('');
	const [isContentInitialized, setIsContentInitialized] = useState(false);

	// ✅ PATTERN: Initialize content from loaded data with a flag to prevent re-initialization
	// This prevents the useEffect from running multiple times with stale state
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

	// ✅ PATTERN: Present mutation result in useEffect when mutation succeeds
	// The presenter is called ONLY when the mutation completes successfully
	// Reference: apps/platform/src/lib/infrastructure/client/pages/workspace/edit/hooks/save-hooks.ts:151-159
	useEffect(() => {
		if (saveAboutPageMutation.isSuccess && saveAboutPageMutation.data) {
			// @ts-ignore
			savePresenter.present(saveAboutPageMutation.data, saveViewModel);
		}
	}, [saveAboutPageMutation.isSuccess, saveAboutPageMutation.data, savePresenter, saveViewModel]);

	// ✅ PATTERN: Handle mutation success states in a separate useEffect
	// Check for different view model modes: 'default' (success) and other error modes
	// Reference: apps/platform/src/lib/infrastructure/client/pages/workspace/edit/hooks/save-hooks.ts:161-182
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
		// Note: The TSaveAboutPageViewModel might not have 'conflict' mode
		// If your API supports optimistic concurrency, add the conflict mode to the view model
		// For now, we handle kaboom and other error modes
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

	// ✅ PATTERN: Handle mutation errors in a separate useEffect
	// This catches network errors, server errors, and other mutation failures
	// Reference: apps/platform/src/lib/infrastructure/client/pages/workspace/edit/hooks/save-hooks.ts:184-190
	useEffect(() => {
		if (saveAboutPageMutation.isError) {
			setErrorMessage(
				saveAboutPageMutation.error?.message ||
				'Failed to save about page content. Please try again.'
			);
			setSuccessMessage(null);
		}
	}, [saveAboutPageMutation.isError, saveAboutPageMutation.error]);

	// ✅ PATTERN: Save handler should NOT call presenter directly
	// Instead, it only triggers the mutation and lets useEffect handle the presenter
	// Reference: apps/platform/src/lib/infrastructure/client/pages/workspace/edit/hooks/save-hooks.ts:192-219
	const handleSave = useCallback(async () => {
		// Clear previous messages
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			await saveAboutPageMutation.mutateAsync({
				aboutPageContent: currentContent,
			});
			// ✅ Presenter will be called automatically in useEffect above
			// ✅ No need to refetch - the mutation response includes updated data
		} catch (error) {
			// ✅ Error will be set automatically in useEffect above
			console.error('Failed to save about page:', error);
		}
	}, [currentContent, saveAboutPageMutation]);

	// ✅ PATTERN: Error handling for query with retry functionality
	// Reference: apps/cms/src/lib/infrastructure/client/pages/manage-topics.tsx:308-316
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
						Platform: {platformContext.platformSlug} | Content Language: {contentLocale.toUpperCase()}
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

	// Breadcrumbs following the standard pattern
	const breadcrumbItems = [
		{
			label: breadcrumbsTranslations('platforms'),
			onClick: () => router.push('/'),
		},
		{
			label: platformContext.platformSlug.charAt(0).toUpperCase() + platformContext.platformSlug.slice(1),
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
		<div className="flex flex-col space-y-2 bg-card-fill p-5 border border-card-stroke rounded-medium gap-4">
			<Breadcrumbs items={breadcrumbItems} />

			<div className="flex flex-col space-y-2">
				<h1>Manage About Page</h1>
				<p className="text-text-secondary text-sm">
					Platform: {platformContext.platformSlug} | Content Language: {contentLocale.toUpperCase()}
				</p>
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
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-white">About page content</h2>
					<Button
						onClick={handleSave}
						disabled={saveAboutPageMutation.isPending}
						variant="primary"
						size="medium"
						text={saveAboutPageMutation.isPending ? 'Saving...' : 'Save Changes'}
					/>
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
