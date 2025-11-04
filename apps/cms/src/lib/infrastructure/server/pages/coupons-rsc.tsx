import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import Coupons from '../../client/pages/coupons';

interface CouponsServerComponentProps {
  locale: string;
  platformSlug: string;
  platformLocale: string;
}

export default async function CouponsServerComponent({
  locale,
  platformSlug,
  platformLocale,
}: CouponsServerComponentProps) {
  const trpc = getServerTRPC({
    platform_slug: platformSlug,
    platform_locale: platformLocale
  });

  // Prefetch coupons data with cache-busting to always fetch fresh data
  await Promise.all([
    prefetch(trpc.listCoupons.queryOptions({})), 
  ]);

  return (
    <HydrateClient>
      <Suspense fallback={<DefaultLoadingWrapper />}>
        <Coupons
          locale={locale}
          platformSlug={platformSlug}
          platformLocale={platformLocale}
        />
      </Suspense>
    </HydrateClient>
  );
}
