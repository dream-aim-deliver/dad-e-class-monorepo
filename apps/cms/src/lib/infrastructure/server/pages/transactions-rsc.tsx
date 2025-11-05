import { HydrateClient, prefetch, getServerTRPC } from '../config/trpc/cms-server';
import { Suspense } from 'react';
import DefaultLoadingWrapper from '../../client/wrappers/default-loading';
import Transactions from '../../client/pages/transactions';
import { TLocale } from '@maany_shr/e-class-translations';

interface TransactionsServerComponentProps {
  locale: TLocale;
  platformSlug: string;
}

export default async function TransactionsServerComponent(
  props: TransactionsServerComponentProps
) {
  const trpc = getServerTRPC({
    platform_locale: props.locale,
    platform_slug: props.platformSlug,
  });

  // TRPC prefetching for page data using EXACT usecase names from Notion
  await Promise.all([
    prefetch(trpc.listTransactions.queryOptions({})),
    prefetch(trpc.listPlatformCoaches.queryOptions({})),
    prefetch(trpc.listTransactionTags.queryOptions({})),
  ]);

  return (
    <HydrateClient>
      <Suspense fallback={<DefaultLoadingWrapper />}>
        <Transactions
          locale={props.locale}
          platformSlug={props.platformSlug}
        />
      </Suspense>
    </HydrateClient>
  );
}
