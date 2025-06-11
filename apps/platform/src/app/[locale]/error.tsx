'use client';

// TODO: localize and style the error page
export default function Page({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return <div className="text-white">{error.message}</div>;
}
