import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import PreCourseAssessment from '../../client/pages/pre-course-assessment';

interface PreCourseAssessmentProps {
	platformSlug: string;
	platformLocale: string;
	locale: string;
}

export default async function PreCourseAssessmentServerComponent({
	platformSlug,
	platformLocale,
	locale
}: PreCourseAssessmentProps) {
	const trpc = getServerTRPC({
		platform_slug: platformSlug,
		platform_locale: platformLocale
	});

	// Prefetch platform language data for the pre-course assessment editor
	await Promise.all([
		prefetch(trpc.getPlatformLanguage.queryOptions({})),
	]);

	return (
		<HydrateClient>
			<Suspense fallback={<DefaultLoadingWrapper />}>
				<PreCourseAssessment />
			</Suspense>
		</HydrateClient>
	);
}

