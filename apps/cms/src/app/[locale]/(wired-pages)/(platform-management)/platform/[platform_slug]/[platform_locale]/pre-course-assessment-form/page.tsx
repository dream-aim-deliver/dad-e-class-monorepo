import { Suspense } from 'react';
import PreCourseAssessmentServerComponent from '../../../../../../../../lib/infrastructure/server/pages/pre-course-assessment-rsc';
import DefaultLoadingWrapper from '../../../../../../../../lib/infrastructure/client/wrappers/default-loading';

export default async function Page({
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
			<PreCourseAssessmentServerComponent
                locale={params.locale}
				platformSlug={params.platform_slug}
				platformLocale={params.platform_locale}
			/>
		</Suspense>
	);
}

