'use client';

import { useContentLocale } from '../hooks/use-platform-translations';
import { useRequiredPlatformLocale } from '../context/platform-locale-context';
import { useState, useEffect } from 'react';
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
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export default function ManageAboutPage() {
	// Platform context
	const platformContext = useRequiredPlatformLocale();
	const contentLocale = useContentLocale();
	const locale = useLocale() as TLocale;

	// Data fetching
	const [platformLanguageResponse, { refetch: refetchPlatformLanguage }] = trpc.getPlatformLanguage.useSuspenseQuery({});
	const [platformLanguageViewModel, setPlatformLanguageViewModel] = useState<
		viewModels.TPlatformLanguageViewModel | undefined
	>(undefined);

	// Presenters
	const { presenter: platformLanguagePresenter } = useGetPlatformLanguagePresenter(
		setPlatformLanguageViewModel,
	);

	// Rich text editor state
	const [richTextError, setRichTextError] = useState<boolean>(false);
	const [currentContent, setCurrentContent] = useState<string>('');

	// Save mutation
	const saveAboutPageMutation = trpc.saveAboutPage.useMutation();
	const [saveViewModel, setSaveViewModel] = useState<
		viewModels.TSaveAboutPageViewModel | undefined
	>(undefined);
	const { presenter: savePresenter } = useSaveAboutPagePresenter(setSaveViewModel);

	// Present platform language data
	// @ts-ignore
	platformLanguagePresenter.present(platformLanguageResponse, platformLanguageViewModel);

	// Initialize current content with API data
	useEffect(() => {
		if (platformLanguageViewModel?.mode === 'default' && platformLanguageViewModel.data.aboutPageContent && currentContent === '') {
			setCurrentContent(platformLanguageViewModel.data.aboutPageContent);
		}
	}, [platformLanguageViewModel, currentContent]);


	// Save handler
	const handleSave = async () => {
		try {
			const response = await saveAboutPageMutation.mutateAsync({
				aboutPageContent: currentContent,
			});
			
			// @ts-ignore
			savePresenter.present(response, saveViewModel);
			
			// Refetch data to prevent hydration mismatch
			await refetchPlatformLanguage();
			
		} catch (error) {
			// Error will be handled by the mutation's error state
		}
	};

	// Error handling
	if (platformLanguageViewModel?.mode === 'kaboom' || richTextError) {
		return <DefaultError locale={locale} />;
	}

	if (saveViewModel?.mode === 'kaboom') {
		return <DefaultError locale={locale} />;
	}

	// Loading state - show loading animation while data is being fetched
	if (!platformLanguageViewModel) {
		return (
			<div className="flex flex-col space-y-6 p-6">
				{/* Page Header */}
				<div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-lg shadow-lg">
					<h1 className="text-3xl font-bold mb-2">Manage About Page</h1>
					<p className="text-lg opacity-90">
						Platform: {platformContext.platformSlug} | Content Language: {contentLocale.toUpperCase()}
					</p>
				</div>

				{/* Loading state for editor */}
				<div className="bg-card-fill rounded-medium border-[1px] border-card-stroke shadow">
					<div className="flex justify-between items-center p-6 border-b">
						<h2 className="text-xl font-semibold text-white-900">About page content</h2>
					<div className="flex space-x-2">
						<Button
							disabled
							variant="primary"
							size="medium"
							text="Save Changes"
						/>
					</div>
					</div>

					<div className="p-6">
						<div className="flex items-center justify-center min-h-[400px]">
							<DefaultLoading locale={locale} variant="minimal" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Success state
	const aboutPageData = platformLanguageViewModel.data;

	return (
		<div className="flex flex-col space-y-6 p-6">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold mb-2">Manage About Page</h1>
				<p className="text-lg opacity-90">
					Platform: {platformContext.platformSlug} | Content Language: {contentLocale.toUpperCase()}
				</p>
			</div>

			{/* Success Message */}
			{saveViewModel?.mode === 'default' && (
				<FeedBackMessage
					type="success"
					message="About page content saved successfully!"
				/>
			)}

			{/* Error Message */}
			{saveAboutPageMutation.isError && (
				<FeedBackMessage
					type="error"
					message="Failed to save about page content. Please try again."
				/>
			)}

			{/* About Page Content Editor */}
			<div className="bg-card-fill rounded-medium border-[1px] border-card-stroke shadow">
				<div className="flex justify-between items-center p-6 border-b">
					<h2 className="text-xl font-semibold text-white">About page content</h2>
					<div className="flex space-x-2">
						<Button
							onClick={handleSave}
							disabled={saveAboutPageMutation.isPending}
							variant="primary"
							size="medium"
							text={saveAboutPageMutation.isPending ? 'Saving...' : 'Save Changes'}
						/>
					</div>
				</div>

				<div className="p-6">
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
		</div>
	);
}
