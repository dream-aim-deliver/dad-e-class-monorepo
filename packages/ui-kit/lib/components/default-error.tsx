interface DefaultErrorProps {
    errorMessage?: string;
}

export default function DefaultError(props: DefaultErrorProps) {
    return <span className="text-neutral-100">{props.errorMessage ?? "An unknown error happened"}</span>;
}
