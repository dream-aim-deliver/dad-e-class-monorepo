import ImpressumPageServerComponent from '../../../../lib/infrastructure/server/pages/impressum-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'impressum', '/impressum');
}

export default async function ImpressumPage() {
    return <ImpressumPageServerComponent />;
}
