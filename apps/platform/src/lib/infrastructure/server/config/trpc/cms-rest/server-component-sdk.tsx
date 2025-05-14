import 'server-only';

export function HydrateClient(props: { children: React.ReactNode }) {
    return <>{props.children}</>;
}

export function prefetch<T>(queryOptions: T) {
    return undefined;
}
