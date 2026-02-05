export default async function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return <>{children}</>;
}
