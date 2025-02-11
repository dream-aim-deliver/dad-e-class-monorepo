import React from 'react';
import { getLocale } from 'next-intl/server';
import { TLocale } from '@maany_shr/e-class-translations';
import Home from '../../../components/home';

export default async function HomePage() {
    const locale = await getLocale();
    return (
            <Home locale={locale as TLocale}/>
    );
}