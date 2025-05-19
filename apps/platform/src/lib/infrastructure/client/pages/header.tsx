'use client';

import { platform } from '@maany_shr/e-class-models';
import { Navbar } from '@maany_shr/e-class-ui-kit';

interface HeaderProps {
    platform: platform.TPlatform;
}

export default function Header({ platform }: HeaderProps) {
    return (
        <Navbar
            isLoggedIn={false}
            availableLocales={['en', 'de']}
            locale="en"
            logoSrc={platform.logoUrl}
        >
            <a></a>
        </Navbar>
    );
}
