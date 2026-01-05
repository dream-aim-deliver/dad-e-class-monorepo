import { TLocale } from '@maany_shr/e-class-translations';
import { getLocale } from 'next-intl/server';
import TermsOfUsePage from '../../client/pages/terms-of-use-page';
import { promises as fs } from 'fs';
import path from 'path';

export default async function TermsOfUseServerComponent() {
    const locale = (await getLocale()) as TLocale;

    // Read the markdown file based on locale
    const filePath = path.join(
        process.cwd(),
        'public',
        'content',
        `terms-of-use-${locale}.md`
    );

    let content = '';
    try {
        content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        // Fallback to English if locale-specific file not found
        const fallbackPath = path.join(
            process.cwd(),
            'public',
            'content',
            'terms-of-use-en.md'
        );
        try {
            content = await fs.readFile(fallbackPath, 'utf-8');
        } catch {
            content = '# Terms of Use\n\nContent not available.';
        }
    }

    return <TermsOfUsePage content={content} locale={locale} />;
}
