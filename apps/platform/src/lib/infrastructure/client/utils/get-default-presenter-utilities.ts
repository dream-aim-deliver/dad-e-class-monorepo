import { useRouter } from 'next/navigation';

export function getDefaultPresenterUtilities() {
    const router = useRouter();

    const redirect = (page: 'login') => {
        if (page === 'login') {
            router.push(
                `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
            );
        }
    };

    return { redirect };
}
