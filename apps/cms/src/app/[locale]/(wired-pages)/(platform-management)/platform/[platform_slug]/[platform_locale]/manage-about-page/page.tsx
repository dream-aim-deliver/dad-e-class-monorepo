import { Suspense } from 'react';
import ManageAboutPageServerComponent from '../../../../../../../../lib/infrastructure/server/pages/manage-about-page-rsc';
import DefaultLoadingWrapper from '../../../../../../../../lib/infrastructure/client/wrappers/default-loading';

export default async function ManageAboutPagePage({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{
		platform_slug: string;
		platform_locale: string;
		locale: string;
	}>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await paramsPromise;
	await searchParamsPromise;

	return (
		<Suspense fallback={<DefaultLoadingWrapper />}>
			<ManageAboutPageServerComponent
				platformSlug={params.platform_slug}
				platformLocale={params.platform_locale}
				locale={params.locale}
			/>
		</Suspense>
	);
}
