export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    return <>{children}</>;
}
