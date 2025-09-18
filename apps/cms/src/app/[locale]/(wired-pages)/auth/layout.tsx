export const metadata = {
    title: 'CMS Authentication',
    description: 'Authentication pages for CMS',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout inherits from (wired-pages)/layout.tsx
    // which provides SessionProvider, HTML structure, and theme
    return <>{children}</>;
}
