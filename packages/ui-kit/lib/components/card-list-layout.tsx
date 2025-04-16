import React from "react";
import { cn } from "../utils/style-utils";
interface CardListLayoutProps {
children: React.ReactNode;
className?: string;
}
/**
 * A layout component that arranges its children in a responsive grid format.
 *
 * @param {CardListLayoutProps} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed in the grid.
 * @param {string} [props.className] - Additional class names for styling.
 * @returns {JSX.Element} A responsive grid layout for the provided children.
 */


export default function CardListLayout({children,className}: CardListLayoutProps) {
    return <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",className)}>
    {children}
  </div>
}