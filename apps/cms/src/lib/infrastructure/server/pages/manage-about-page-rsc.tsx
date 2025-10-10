import ManageAboutPage from '../../client/pages/manage-about-page';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';

interface ManageAboutPageProps {
	platformSlug: string;
	platformLocale: string;
	locale: string;
}

export default async function ManageAboutPageServerComponent({
	platformSlug,
	platformLocale,
	locale
}: ManageAboutPageProps) {
	const trpc = getServerTRPC({
		platform_slug: platformSlug,
		platform_locale: platformLocale
	});

	// Prefetch platform language data for the about page editor
	await Promise.all([
		prefetch(trpc.getPlatformLanguage.queryOptions({})),
	]);

	return (
		<HydrateClient>
			<Suspense fallback={<DefaultLoadingWrapper />}>
				<ManageAboutPage />
			</Suspense>
		</HydrateClient>
	);
}
