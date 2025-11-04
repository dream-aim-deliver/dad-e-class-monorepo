import { Suspense } from 'react';
import CouponsServerComponent from '../../../../../../../../lib/infrastructure/server/pages/coupons-rsc';
import DefaultLoadingWrapper from '../../../../../../../../lib/infrastructure/client/wrappers/default-loading';

export default async function CouponsPage({
  params: paramsPromise,
}: {
  params: Promise<{
    locale: string;
    platform_slug: string;
    platform_locale: string;
  }>;
}) {
  const params = await paramsPromise;
  const { locale, platform_slug, platform_locale } = params;

  return (
    <Suspense fallback={<DefaultLoadingWrapper />}>
      <CouponsServerComponent
        locale={locale}
        platformSlug={platform_slug}
        platformLocale={platform_locale}
      />
    </Suspense>
  );
}
