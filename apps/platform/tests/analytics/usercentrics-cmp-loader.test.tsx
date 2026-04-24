import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { UsercentricsCMPLoader } from '../../src/lib/infrastructure/client/analytics/usercentrics-cmp-loader';

vi.mock('next/script', () => ({
    default: (props: Record<string, unknown>) => {
        const { strategy: _strategy, ...rest } = props as { strategy?: string } & Record<string, unknown>;
        void _strategy;
        return <script {...(rest as Record<string, unknown>)} />;
    },
}));

describe('UsercentricsCMPLoader', () => {
    it('renders nothing when settingsId is undefined', () => {
        const html = renderToStaticMarkup(<UsercentricsCMPLoader settingsId={undefined} />);
        expect(html).toBe('');
    });

    it('renders the loader script with settings and language when set', () => {
        const html = renderToStaticMarkup(
            <UsercentricsCMPLoader settingsId="qYcjvyqjEYm8kA" language="de" />,
        );
        expect(html).toContain('id="usercentrics-cmp"');
        expect(html).toContain('src="https://web.cmp.usercentrics.eu/ui/loader.js"');
        expect(html).toContain('data-settings-id="qYcjvyqjEYm8kA"');
        expect(html).toContain('data-language="de"');
    });

    it('omits data-language when language is not provided', () => {
        const html = renderToStaticMarkup(
            <UsercentricsCMPLoader settingsId="abc123" />,
        );
        expect(html).toContain('data-settings-id="abc123"');
        expect(html).not.toContain('data-language');
    });
});
