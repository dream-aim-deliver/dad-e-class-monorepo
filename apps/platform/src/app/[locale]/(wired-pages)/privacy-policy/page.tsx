import PrivacyPolicyPageServerComponent from '../../../../lib/infrastructure/server/pages/privacy-policy-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'privacyPolicy', '/privacy-policy');
}

export default async function PrivacyPolicyPage() {
    return <PrivacyPolicyPageServerComponent />;
}
