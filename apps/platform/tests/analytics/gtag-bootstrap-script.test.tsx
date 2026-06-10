import { describe, it, expect } from 'vitest';
import { GtagBootstrapScript } from '../../src/lib/infrastructure/client/analytics/gtag-bootstrap-script';

/**
 * The bootstrap replaces ConsentModeDefaultScript under the "Golden Rule":
 * the Usercentrics GTM template is the single owner of the consent DEFAULT,
 * so this script must define window.dataLayer + window.gtag (required by
 * consent-mode.ts updateConsent) and must NOT issue any consent command.
 */
describe('GtagBootstrapScript', () => {
    function renderedCode(): string {
        const el = GtagBootstrapScript();
        // next/script with dangerouslySetInnerHTML — read the inline code.
        return (
            (el.props as { dangerouslySetInnerHTML?: { __html?: string } })
                .dangerouslySetInnerHTML?.__html ?? ''
        );
    }

    it('renders a beforeInteractive inline script', () => {
        const el = GtagBootstrapScript();
        expect(el.props.strategy).toBe('beforeInteractive');
        expect(el.props.id).toBe('gtag-bootstrap');
    });

    it('defines dataLayer and a window-global gtag', () => {
        const code = renderedCode();
        expect(code).toContain('window.dataLayer = window.dataLayer || []');
        expect(code).toContain('window.gtag = window.gtag ||');
    });

    it('does NOT issue any consent command (defaults are owned by the Usercentrics GTM template)', () => {
        const code = renderedCode();
        expect(code).not.toContain("'consent'");
        expect(code).not.toContain('"consent"');
        expect(code).not.toContain('default');
    });

    it('the bootstrap code actually wires gtag calls into dataLayer when evaluated', () => {
        const code = renderedCode();
        delete (window as Window & { gtag?: unknown }).gtag;
        delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
        try {
            // eslint-disable-next-line no-new-func
            new Function(code)();
            const w = window as Window & {
                gtag?: (...a: unknown[]) => void;
                dataLayer?: unknown[];
            };
            expect(typeof w.gtag).toBe('function');
            w.gtag?.('consent', 'update', { analytics_storage: 'granted' });
            expect(w.dataLayer?.length).toBe(1);
            const entry = w.dataLayer?.[0] as ArrayLike<unknown>;
            expect(Array.from(entry)).toEqual([
                'consent',
                'update',
                { analytics_storage: 'granted' },
            ]);
        } finally {
            delete (window as Window & { gtag?: unknown }).gtag;
            delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
        }
    });
});
