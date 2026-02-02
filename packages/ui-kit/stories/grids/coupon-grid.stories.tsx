import type { Meta, StoryObj } from '@storybook/react';
import { CouponRow, CouponGrid } from '../../lib/components/grids/coupon-grid';
import { CouponGridFilterModal, CouponFilterModel } from '../../lib/components/grids/coupon-grid-filter-modal';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useRef, useState } from 'react';
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
                emptyState: 'No coupons found',
                coachingLabel: 'Coaching',
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
                emptyState: 'Keine Gutscheine gefunden',
                coachingLabel: 'Coaching',
            },
        },
    },
};

const meta: Meta<typeof CouponGrid> = {
    title: 'Components/Grids/CouponGrid',
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
        id: '1001',
        name: 'NAME_TEST_1',
        status: 'active',
        usageCount: 2,
        usagesAllowed: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
        expirationDate: '2025-01-01T00:00:00.000Z',
        outcome: {
            type: 'freeCourses',
            courses: [
                { id: 1, title: 'Course A', slug: 'course-a', withCoaching: false },
                { id: 2, title: 'Course B with coaching', slug: 'course-b', withCoaching: true },
            ],
        },
    },
    {
        id: '1002',
        name: '50PERCENTOFF',
        status: 'revoked',
        usageCount: 0,
        usagesAllowed: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
        expirationDate: '2025-01-01T00:00:00.000Z',
        outcome: {
            type: 'freeCourses',
            courses: [
                { id: 1, title: 'Course A', slug: 'course-a', withCoaching: false },
                { id: 2, title: 'Course B with coaching', slug: 'course-b', withCoaching: true },
            ],
        },
    },
    {
        id: '1003',
        name: 'COACHING50PERCENTOFF',
        status: 'active',
        usageCount: 15,
        usagesAllowed: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
        expirationDate: '2025-01-01T00:00:00.000Z',
        outcome: {
            type: 'freeCourses',
            courses: [
                { id: 1, title: 'Course A', slug: 'course-a', withCoaching: false },
                { id: 2, title: 'Course B with coaching', slug: 'course-b', withCoaching: true },
            ],
        },
    },
    {
        id: '1004',
        name: 'FREECOURSE50',
        status: 'active',
        usageCount: 8,
        usagesAllowed: 20,
        createdAt: '2024-01-01T00:00:00.000Z',
        expirationDate: '2025-01-01T00:00:00.000Z',
        outcome: {
            type: 'freeCourses',
            courses: [
                { id: 1, title: 'Course A', slug: 'course-a', withCoaching: false },
                { id: 2, title: 'Course B with coaching', slug: 'course-b', withCoaching: true },
            ],
        },
    },
    // One example for each remaining outcome type
    {
        id: '2001',
        name: 'GROUPCOURSE-INTRO',
        status: 'active',
        usageCount: 1,
        usagesAllowed: 30,
        createdAt: '2024-03-10T00:00:00.000Z',
        expirationDate: '2025-03-10T00:00:00.000Z',
        outcome: {
            type: 'groupCourse',
            groupId: 10,
            groupName: 'Spring Cohort',
            course: { id: 101, title: 'Intro to TypeScript', slug: 'intro-ts' },
        },
    },
    {
        id: '2002',
        name: 'FREE-COACHING-30',
        status: 'active',
        usageCount: 3,
        usagesAllowed: 10,
        createdAt: '2024-04-15T00:00:00.000Z',
        expirationDate: '2025-04-15T00:00:00.000Z',
        outcome: {
            type: 'freeCoachingSession',
            coachingOffering: { id: 501, title: '30 min Coaching', duration: 30 },
            course: { id: 102, title: 'Advanced React', slug: 'advanced-react' },
        },
    },
    {
        id: '2003',
        name: 'DISCOUNT-25OFF',
        status: 'active',
        usageCount: 6,
        usagesAllowed: null,
        createdAt: '2024-05-20T00:00:00.000Z',
        expirationDate: null,
        outcome: {
            type: 'discountOnEverything',
            percentage: 25,
        },
    },
    {
        id: '2004',
        name: 'FREE-BUNDLES-Q1',
        status: 'revoked',
        usageCount: 9,
        usagesAllowed: 9,
        createdAt: '2024-02-01T00:00:00.000Z',
        expirationDate: '2024-12-31T00:00:00.000Z',
        outcome: {
            type: 'freePackages',
            packages: [
                { id: 301, title: 'Starter Bundle', withCoaching: false },
                { id: 302, title: 'Pro Bundle', withCoaching: true },
            ],
        },
    },
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

                // Status filter
                if (appliedFilters.status?.length && !appliedFilters.status.includes(node.data.status)) return false;

                // Usages left: derive from usageCount/usagesAllowed
                const usagesLeft = node.data.usagesAllowed == null ? Infinity : (node.data.usagesAllowed - node.data.usageCount);
                if (appliedFilters.minUsagesLeft !== undefined && usagesLeft < appliedFilters.minUsagesLeft) return false;
                if (appliedFilters.maxUsagesLeft !== undefined && usagesLeft > appliedFilters.maxUsagesLeft) return false;

                // Creation date range (ISO strings)
                if (appliedFilters.createdAfter && node.data.createdAt < appliedFilters.createdAfter) return false;
                if (appliedFilters.createdBefore && node.data.createdAt > appliedFilters.createdBefore) return false;

                // Expiration date range (ISO strings, nullable)
                if (appliedFilters.expiresAfter && node.data.expirationDate && node.data.expirationDate < appliedFilters.expiresAfter) return false;
                if (appliedFilters.expiresBefore && node.data.expirationDate && node.data.expirationDate > appliedFilters.expiresBefore) return false;

                // Outcome type filter
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
