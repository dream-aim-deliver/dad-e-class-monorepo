'use client';
import { Button, DummySkills } from '@maany_shr/e-class-ui-kit';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
import {
    isLocalAware,
    TLocale,
    getDictionary,
} from '@maany_shr/e-class-translations';
import { signOut } from 'next-auth/react';
import { isSessionAware } from '@maany_shr/e-class-auth';
import { redirect } from 'next/navigation';
import { trpc } from '../trpc/client';

export type HomeProps = isLocalAware & isSessionAware;

export default function Home(props: HomeProps) {
    const [data] = trpc.getSkills.useSuspenseQuery();

    return (
        <div className="flex flex-col  text-base-neutral-50 gap-4 mt-3 items-center justify-center text-center">
            {data &&
                data.map((skill) => (
                    <div key={skill} className="text-white">
                        {skill}
                    </div>
                ))}
        </div>
    );
}
