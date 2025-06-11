import { revalidateTag } from 'next/cache';
import { cacheTags } from '../../../lib/infrastructure/server/utils/cache-tags';
import { env } from '../../../lib/infrastructure/server/utils/env';

export async function GET(request: Request) {
    revalidateTag(`${cacheTags.HOME_PAGE}-${env.platformId}`);
    return new Response('Hello, from API!!');
}
