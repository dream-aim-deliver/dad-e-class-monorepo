import RulesPageServerComponent from '../../../../lib/infrastructure/server/pages/rules-page-rsc';
import type { ResolvingMetadata } from 'next';
import { generatePageMetadata } from '../../../../lib/infrastructure/server/utils/page-metadata';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata,
) {
    return generatePageMetadata(params, parent, 'rules', '/rules');
}

export default async function RulesPage() {
    return <RulesPageServerComponent />;
}
