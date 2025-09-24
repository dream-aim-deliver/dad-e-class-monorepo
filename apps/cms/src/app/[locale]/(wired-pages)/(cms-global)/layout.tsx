import CMSTRPCClientProviders from '../../../../lib/infrastructure/client/trpc/cms-client-provider';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CMSTRPCClientProviders>{children}</CMSTRPCClientProviders>;
}
