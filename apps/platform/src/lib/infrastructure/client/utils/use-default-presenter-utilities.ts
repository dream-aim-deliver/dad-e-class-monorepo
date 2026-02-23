import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

export function useDefaultPresenterUtilities() {
    const router = useRouter();
    const locale = useLocale() as TLocale;

    const redirect = (page: 'login') => {
        if (page === 'login') {
            router.push(
                `/${locale}/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
            );
        }
    };

    return { redirect };
}
