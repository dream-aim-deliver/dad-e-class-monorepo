'use client';

import NextTopLoader from 'nextjs-toploader';

export default function NextTopLoaderWrapper() {
    return (
        <NextTopLoader
            color="#4F46E5"
            height={3}
            showSpinner={false}
        />
    );
}
