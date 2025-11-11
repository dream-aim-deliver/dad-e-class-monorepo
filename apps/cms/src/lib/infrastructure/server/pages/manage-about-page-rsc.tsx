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

	// Streaming pattern: Fire prefetch without awaiting (TSK-PERF-007)
	prefetch(trpc.getPlatformLanguage.queryOptions({}));

	return (
		<HydrateClient>
			<Suspense fallback={<DefaultLoadingWrapper />}>
				<ManageAboutPage />
			</Suspense>
		</HydrateClient>
	);
}
