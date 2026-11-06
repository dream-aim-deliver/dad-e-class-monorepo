import TermsOfUsePageServerComponent from '../../../../lib/infrastructure/server/pages/terms-of-use-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'termsOfUse', '/terms-of-use');
}

export default async function TermsOfUsePage() {
    return <TermsOfUsePageServerComponent />;
}
