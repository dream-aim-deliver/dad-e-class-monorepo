import { getLocale } from 'next-intl/server';
import { TLocale } from '@maany_shr/e-class-translations';
import { auth } from '@maany_shr/e-class-models';
import { NextAuthGateway } from '@maany_shr/e-class-auth';
import nextAuth from '../config/auth/next-auth.config';
import Home from '../../client/pages/home';
import { HydrateClient, trpc } from '../config/trpc/server';
import { Suspense } from 'react';

export default async function HomeServerComponent() {
    /*
     * Replace the elements below with your own.
     *
     * Note: The corresponding styles are in the ./index.tailwind file.
     */
    const locale = await getLocale();
    const authGateway = new NextAuthGateway(nextAuth);
    const sessionDTO = await authGateway.getSession();
    let session: auth.TSession | undefined;
    if (sessionDTO.success) {
        session = sessionDTO.data;
    }

    // await trpc.getSkills.prefetch();

    return (
        <HydrateClient>
            <div className="bg-card-color-fill">
                <Suspense
                    fallback={
                        <div className="text-white">Loading... Hello...</div>
                    }
                >
                    <Home locale={locale as TLocale} session={session} />
                </Suspense>
            </div>
        </HydrateClient>
    );
}
