import ManageFooter from '../../client/pages/manage-footer';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';

interface ManageFooterProps {
	platformSlug: string;
	platformLocale: string;
	locale: string;
}

export default async function ManageFooterServerComponent({
	platformSlug,
	platformLocale,
	locale
}: ManageFooterProps) {
	const trpc = getServerTRPC({
		platform_slug: platformSlug,
		platform_locale: platformLocale
	});

	// Prefetch platform data for the footer editor
	await Promise.all([
		prefetch(trpc.getPlatform.queryOptions({})),
	]);

	return (
		<HydrateClient>
			<Suspense fallback={<DefaultLoadingWrapper />}>
				<ManageFooter />
			</Suspense>
		</HydrateClient>
	);
}
