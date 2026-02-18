import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { TransactionsGrid, TransactionRow } from '../../lib/components/grids/transactions-grid';
import { TransactionsGridFilterModal, TransactionFilterModel } from '../../lib/components/grids/transactions-grid-filter-modal';
import { Button } from '../../lib/components/button';
import { IRowNode } from 'ag-grid-community';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {
    en: {
        components: {
            baseGrid: {
                loading: 'Loading...',
                noRows: 'Nothing found',
                page: 'Page',
                of: 'of',
            },
            transactionsGrid: {
                userColumn: 'User',
                typeColumn: 'Type',
                directionColumn: 'Direction',
                statusColumn: 'Status',
                stateColumn: 'State',
                currencyColumn: 'Currency',
                amountColumn: 'Amount',
                creationDateColumn: 'Created At',
                settledDateColumn: 'Settled At',
                updatedDateColumn: 'Updated At',
                detailsColumn: 'Details',
                actionsColumn: 'Actions',
                searchPlaceholder: 'Search transactions',
                exportCurrentView: 'Export current view',
                filterButton: 'Filter',
                clearFilters: 'Clear filters',
                coachingLabel: 'Coaching',
                invoiceButton: 'Invoice',
                deleteButton: 'Delete',
            },
        },
    },
    de: {
        components: {
            baseGrid: {
                loading: 'Laden...',
                noRows: 'Nichts gefunden',
                page: 'Seite',
                of: 'von',
            },
            transactionsGrid: {
                userColumn: 'Benutzer',
                typeColumn: 'Typ',
                directionColumn: 'Richtung',
                statusColumn: 'Status',
                stateColumn: 'Zustand',
                currencyColumn: 'Währung',
                amountColumn: 'Betrag',
                creationDateColumn: 'Erstellt am',
                settledDateColumn: 'Abgerechnet am',
                updatedDateColumn: 'Aktualisiert am',
                detailsColumn: 'Details',
                actionsColumn: 'Aktionen',
                searchPlaceholder: 'Transaktionen suchen',
                exportCurrentView: 'Aktuelle Ansicht exportieren',
                filterButton: 'Filter',
                clearFilters: 'Filter löschen',
                coachingLabel: 'Coaching',
                invoiceButton: 'Rechnung',
                deleteButton: 'Löschen',
            },
        },
    },
};

const meta: Meta<typeof TransactionsGrid> = {
    title: 'Components/Grids/TransactionsGrid',
    component: TransactionsGrid,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
    },
    decorators: [
        (Story, context) => {
            const gridRef = useRef<AgGridReact>(null);
            return (
                <NextIntlClientProvider
                    locale={context.args.locale || 'en'}
                    messages={mockMessages[context.args.locale || 'en']}
                >
                    <div className="h-screen w-full p-4">
                        <Story args={{
                            ...context.args,
                            gridRef: gridRef
                        }} />
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};

export default meta;

const mockTransactions: TransactionRow[] = [
    {
        id: 'tx-1',
        status: 'paid',
        state: 'created',
        currency: 'EUR',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
        settledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        invoiceUrl: 'https://example.com/invoice/tx-1',
        user: { id: 1, username: 'john', name: 'John', surname: 'Doe', avatarUrl: null },
        content: {
            type: 'course',
            direction: 'incoming',
            unitPrice: 199,
            course: { id: 'c-1', slug: 'course-1', title: 'Course One', imageUrl: null, coachingSessionCount: 2 },
        },
    },
    {
        id: 'tx-2',
        status: 'pending',
        state: 'created',
        currency: 'USD',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        settledAt: null,
        invoiceUrl: null,
        user: { id: 2, username: 'jane', name: 'Jane', surname: 'Smith', avatarUrl: null },
        content: {
            type: 'coachPayment',
            direction: 'outgoing',
            items: [
                { description: 'Coaching Session 1', unitPrice: 50, quantity: 1 },
                { description: 'Coaching Session 2', unitPrice: 75, quantity: 2 },
            ],
        },
    },
    {
        id: 'tx-3',
        status: 'refunded',
        state: 'created',
        currency: 'EUR',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date().toISOString(),
        settledAt: new Date(Date.now() - 86400000 * 9).toISOString(),
        invoiceUrl: 'https://example.com/invoice/tx-3',
        user: { id: 3, username: 'alice', name: 'Alice', surname: 'W', avatarUrl: null },
        content: {
            type: 'package',
            direction: 'incoming',
            unitPrice: 499,
            package: { id: 10, title: 'Full Package', description: 'All courses', imageUrl: null, courseCount: 5 },
            coursesIncluded: [
                { id: 1, slug: 'course-a', title: 'Course A', imageUrl: null },
                { id: 2, slug: 'course-b', title: 'Course B', imageUrl: null },
            ],
            coachingSessionCount: 3,
        },
    },
    {
        id: 'tx-4',
        status: 'paid',
        state: 'created',
        currency: 'EUR',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
        settledAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        invoiceUrl: 'https://example.com/invoice/tx-4',
        user: { id: 4, username: 'bob', name: 'Bob', surname: 'K', avatarUrl: null },
        content: {
            type: 'coachingOffers',
            direction: 'incoming',
            course: { id: 100, name: 'Course X', imageUrl: null, slug: 'course-x' },
            items: [
                { title: 'Offer A', duration: '30m', unitPrice: 60, quantity: 1 },
                { title: 'Offer B', duration: '60m', unitPrice: 100, quantity: 2 },
            ],
        },
    },
];

type TxStory = StoryObj<typeof TransactionsGrid>;

type Story = StoryObj<typeof TransactionsGrid>;

const multipleMockTransactions = Array(3).fill(mockTransactions).flat();

export const Default: TxStory = {
    args: {
        transactions: mockTransactions,
        locale: 'en',
        onDeleteTransaction: (id) => alert(`Delete tx: ${id}`),
        onOpenInvoice: (id) => alert(`Open invoice for: ${id}`),
    },
};

export const GermanLocale: TxStory = {
    args: {
        transactions: mockTransactions,
        locale: 'de',
        onDeleteTransaction: (id) => alert(`Delete tx: ${id}`),
        onOpenInvoice: (id) => alert(`Open invoice for: ${id}`),
    },
};

export const Empty: TxStory = {
    args: {
        transactions: [],
        locale: 'en',
        onDeleteTransaction: (id) => alert(`Delete tx: ${id}`),
        onOpenInvoice: (id) => alert(`Open invoice for: ${id}`),
    },
};

export const WithFilters: TxStory = {
    args: {
        transactions: multipleMockTransactions,
        locale: 'en',
        onDeleteTransaction: (id) => alert(`Delete tx: ${id}`),
        onOpenInvoice: (id) => alert(`Open invoice for: ${id}`),
    },
    decorators: [
        (Story, context) => {
            const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
            const [appliedFilters, setAppliedFilters] = useState<Partial<TransactionFilterModel>>({});

            const doesFilterPass = useCallback((node: IRowNode<TransactionRow>) => {
                if (!node.data) return false;
                const tx = node.data;

                if (appliedFilters.status?.length && !appliedFilters.status.includes(tx.status)) return false;
                if (appliedFilters.state?.length && !appliedFilters.state.includes(tx.state)) return false;
                if (appliedFilters.types?.length && !appliedFilters.types.includes(tx.content.type)) return false;
                if (appliedFilters.direction && tx.content.direction !== appliedFilters.direction) return false;
                if (appliedFilters.currencies?.length && !appliedFilters.currencies.includes(tx.currency)) return false;

                const amount = (() => {
                    switch (tx.content.type) {
                        case 'course':
                        case 'package':
                            return tx.content.unitPrice;
                        case 'coachPayment':
                        case 'coachingOffers':
                            return tx.content.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
                        default:
                            return 0;
                    }
                })();
                if (appliedFilters.minAmount !== undefined && amount < appliedFilters.minAmount) return false;
                if (appliedFilters.maxAmount !== undefined && amount > appliedFilters.maxAmount) return false;

                if (appliedFilters.createdAfter && tx.createdAt < appliedFilters.createdAfter) return false;
                if (appliedFilters.createdBefore && tx.createdAt > appliedFilters.createdBefore) return false;
                if (appliedFilters.settledAfter && tx.settledAt && tx.settledAt < appliedFilters.settledAfter) return false;
                if (appliedFilters.settledBefore && tx.settledAt && tx.settledAt > appliedFilters.settledBefore) return false;

                return true;
            }, [appliedFilters]);

            return (
                <NextIntlClientProvider
                    locale={context.args.locale || 'en'}
                    messages={mockMessages[context.args.locale || 'en']}
                >
                    <div className="flex grow h-full w-full flex-col">
                        <div className="flex space-x-2 mb-4">
                            <Button text="Open Filter Modal" onClick={() => setShowFilterModal(true)} />
                        </div>
                        {showFilterModal && (
                            <TransactionsGridFilterModal
                                onApplyFilters={(filters) => {
                                    setAppliedFilters(filters);
                                    setShowFilterModal(false);
                                }}
                                onClose={() => setShowFilterModal(false)}
                                initialFilters={appliedFilters}
                                locale={context.args.locale || 'en'}
                            />
                        )}
                        <Story args={{
                            ...context.args,
                            doesExternalFilterPass: doesFilterPass
                        }} />
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};

export const Pagination: TxStory = {
    args: {
        transactions: multipleMockTransactions,
        locale: 'en',
        onDeleteTransaction: (id) => alert(`Delete tx: ${id}`),
        onOpenInvoice: (id) => alert(`Open invoice for: ${id}`),
    },
};


