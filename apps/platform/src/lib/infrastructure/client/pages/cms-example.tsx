'use client';

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { trpc } from "../trpc/cms-client";

// This is a simple example component that uses the CMS client
// It can be used to demonstrate how to fetch data from the CMS
// and display it in a Next.js page.
export default function CMSExample() {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [cmsVersion] = trpc.version.useSuspenseQuery();
    const [skills] = trpc.getSkills.useSuspenseQuery({
        userId: "1",
    });

    return (
        <div>
            <h1>CMS Example</h1>
            <p>Current locale: {locale}</p>
            <h2>CMS Version</h2>
            <pre>{JSON.stringify(cmsVersion, null, 2)}</pre>
            <h2>Skills</h2>
            <pre>{JSON.stringify(skills, null, 2)}</pre>
        </div>
    );
}