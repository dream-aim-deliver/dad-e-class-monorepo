import OfferInformationPageServerComponent from '../../../../lib/infrastructure/server/pages/offer-information-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'offerInformation', '/offer-information');
}

export default async function OfferInformationPage() {
    return <OfferInformationPageServerComponent />;
}
