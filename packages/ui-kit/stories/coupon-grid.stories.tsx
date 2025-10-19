import type { Meta, StoryObj } from '@storybook/react';
import { CouponRow, CouponGrid } from '../lib/components/grids/coupon-grid';
import { CouponGridFilterModal, CouponFilterModel } from '../lib/components/grids/coupon-grid-filter-modal';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '../lib/components/button';
import { IRowNode } from 'ag-grid-community';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {
    en: {
        couponGrid: {
            nameColumn: 'Name',
            usagesLeftColumn: 'Usages left',
            creationDateColumn: 'Creation date',
            expirationDateColumn: 'Expiration date',
            outcomeColumn: 'Outcome',
            statusColumn: 'Status',
            revokeButton: 'Revoke',
            revokedBadge: 'Revoked',
            createCouponButton: 'Create coupon',
            filterButton: 'Filter',
            searchPlaceholder: 'Search',
            exportCurrentView: 'Export current view',
            clearFilters: 'Clear filters',
            freeCourses: 'Free courses',
            discountPercent: 'Discount',
            loadMore: 'Load more...',
            emptyState: 'No coupons found'
        }
    },
    de: {
        couponGrid: {
            nameColumn: 'Name',
            usagesLeftColumn: 'Verwendungen übrig',
            creationDateColumn: 'Erstellungsdatum',
            expirationDateColumn: 'Ablaufdatum',
            outcomeColumn: 'Ergebnis',
            statusColumn: 'Status',
            revokeButton: 'Widerrufen',
            revokedBadge: 'Widerrufen',
            createCouponButton: 'Gutschein erstellen',
            filterButton: 'Filter',
            searchPlaceholder: 'Suchen',
            exportCurrentView: 'Aktuelle Ansicht exportieren',
            clearFilters: 'Filter löschen',
            freeCourses: 'Kostenlose Kurse',
            discountPercent: 'Rabatt',
            loadMore: 'Mehr laden...',
            emptyState: 'Keine Gutscheine gefunden'
        }
    }
};

const meta: Meta<typeof CouponGrid> = {
    title: 'Components/CouponGrid',
    component: CouponGrid,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
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

const mockCoupons: CouponRow[] = [
    {
        id: 1001,
        couponId: 1001,
        name: 'NAME_TEST_1',
        usagesLeft: 2,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1002,
        couponId: 1002,
        name: '50PERCENTOFF',
        usagesLeft: 0,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'revoked'
    },
    {
        id: 1003,
        couponId: 1003,
        name: 'COACHING50PERCENTOFF',
        usagesLeft: 15,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1004,
        couponId: 1004,
        name: 'FREECOURSE50',
        usagesLeft: 8,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1005,
        couponId: 1005,
        name: 'COUPON_NAME',
        usagesLeft: 20,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1006,
        couponId: 1006,
        name: 'COUPON_NAME',
        usagesLeft: 0,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'revoked'
    },
    {
        id: 1007,
        couponId: 1007,
        name: 'COUPON_NAME',
        usagesLeft: 12,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1008,
        couponId: 1008,
        name: 'COUPON_NAME',
        usagesLeft: 3,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1009,
        couponId: 1009,
        name: 'COUPON_NAME',
        usagesLeft: 0,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'revoked'
    },
    {
        id: 1010,
        couponId: 1010,
        name: 'COUPON_NAME',
        usagesLeft: 18,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1011,
        couponId: 1011,
        name: 'COUPON_NAME',
        usagesLeft: 1,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1012,
        couponId: 1012,
        name: 'COUPON_NAME',
        usagesLeft: 0,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'revoked'
    },
    {
        id: 1013,
        couponId: 1013,
        name: 'COUPON_NAME',
        usagesLeft: 7,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    },
    {
        id: 1014,
        couponId: 1014,
        name: 'COUPON_NAME',
        usagesLeft: 0,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'revoked'
    },
    {
        id: 1015,
        couponId: 1015,
        name: 'COUPON_NAME',
        usagesLeft: 20,
        maxUsages: 20,
        creationDate: 1704067200000, // January 1, 2024
        expirationDate: 1735689600000, // January 1, 2025
        outcome: {
            type: 'free_courses',
            courses: ['Course A', 'Course B with coaching']
        },
        status: 'active'
    }
];

export default meta;
type Story = StoryObj<typeof CouponGrid>;

const multipleMockCoupons = Array(3).fill(mockCoupons).flat();

export const Default: Story = {
    args: {
        coupons: mockCoupons,
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};

export const GermanLocale: Story = {
    args: {
        coupons: mockCoupons,
        locale: 'de',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};

export const Empty: Story = {
    args: {
        coupons: [],
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};

export const ActiveOnly: Story = {
    args: {
        coupons: mockCoupons.filter(coupon => coupon.status === 'active'),
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};

export const RevokedOnly: Story = {
    args: {
        coupons: mockCoupons.filter(coupon => coupon.status === 'revoked'),
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};

export const WithFilters: Story = {
    args: {
        coupons: multipleMockCoupons,
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    },
    decorators: [
        (Story, context) => {
            const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
            const [appliedFilters, setAppliedFilters] = useState<Partial<CouponFilterModel>>({});

            const doesFilterPass = useCallback((node: IRowNode<CouponRow>) => {
                if (!node.data) return false;
                if (appliedFilters.status?.length && !appliedFilters.status.includes(node.data.status)) return false;
                if (appliedFilters.minUsagesLeft !== undefined && node.data.usagesLeft < appliedFilters.minUsagesLeft) return false;
                if (appliedFilters.maxUsagesLeft !== undefined && node.data.usagesLeft > appliedFilters.maxUsagesLeft) return false;
                if (appliedFilters.createdAfter && node.data.creationDate < new Date(appliedFilters.createdAfter).getTime()) return false;
                if (appliedFilters.createdBefore && node.data.creationDate > new Date(appliedFilters.createdBefore).getTime()) return false;
                if (appliedFilters.expiresAfter && node.data.expirationDate < new Date(appliedFilters.expiresAfter).getTime()) return false;
                if (appliedFilters.expiresBefore && node.data.expirationDate > new Date(appliedFilters.expiresBefore).getTime()) return false;
                if (appliedFilters.outcomeTypes?.length && !appliedFilters.outcomeTypes.includes(node.data.outcome.type)) return false;
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
                            <CouponGridFilterModal
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

export const Pagination: Story = {
    args: {
        coupons: multipleMockCoupons,
        locale: 'en',
        onRevokeCoupon: (couponId) => {
            alert(`Revoke coupon: ${couponId}`);
        },
        onCreateCoupon: () => {
            alert('Create new coupon');
        }
    }
};
