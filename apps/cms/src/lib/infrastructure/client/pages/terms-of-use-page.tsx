'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import Markdown from 'react-markdown';

interface TermsOfUsePageProps {
    content: string;
    locale: TLocale;
}

export default function TermsOfUsePage({ content, locale }: TermsOfUsePageProps) {
    return (
        <div className="min-h-screen bg-base-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <article className="prose prose-lg max-w-none">
                    <Markdown
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-bold text-text-primary mb-6">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-semibold text-text-primary mt-8 mb-4">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="text-text-secondary mb-4 leading-relaxed">
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-2">
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li className="text-text-secondary">{children}</li>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    className="text-button-primary-fill hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-text-primary">
                                    {children}
                                </strong>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-button-primary-fill pl-4 italic text-text-secondary my-4">
                                    {children}
                                </blockquote>
                            ),
                        }}
                    >
                        {content}
                    </Markdown>
                </article>
            </div>
        </div>
    );
}
