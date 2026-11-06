import AboutPageServerComponent from '../../../../lib/infrastructure/server/pages/about-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'about', '/about');
}

export default async function AboutPage() {
    return <AboutPageServerComponent />;
}
