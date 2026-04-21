import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track } from '../../src/lib/infrastructure/client/analytics/track';

declare global {
    interface Window {
        dataLayer?: unknown[];
    }
}

function readDataLayer(): unknown[] {
    return ((window as Window).dataLayer ?? []).slice();
}

describe('track.*', () => {
    beforeEach(() => {
        (window as Window).dataLayer = [];
    });

    describe('track.viewItem', () => {
        it('pushes a view_item event with ecommerce payload', () => {
            track.viewItem({
                item_id: 'course_42',
                item_name: 'Advanced TS',
                item_category: 'course',
                price: 149,
                currency: 'CHF',
            });
            expect(readDataLayer()).toEqual([
                {
                    event: 'view_item',
                    ecommerce: {
                        currency: 'CHF',
                        value: 149,
                        items: [
                            {
                                item_id: 'course_42',
                                item_name: 'Advanced TS',
                                item_category: 'course',
                                price: 149,
                                quantity: 1,
                            },
                        ],
                    },
                },
            ]);
        });

        it('drops silently and console.errors on invalid payload in non-production', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            // @ts-expect-error — intentionally missing fields
            track.viewItem({ item_id: '' });
            expect(readDataLayer()).toEqual([]);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('track.viewItemList', () => {
        it('pushes a view_item_list event with items array', () => {
            track.viewItemList({
                item_list_id: 'offers_home',
                item_list_name: 'Featured offers',
                items: [
                    { item_id: 'c1', item_name: 'Course 1', item_category: 'course', price: 99, index: 0 },
                    { item_id: 'p1', item_name: 'Package 1', item_category: 'package', price: 299, index: 1 },
                ],
            });
            const layer = readDataLayer();
            expect(layer[0]).toMatchObject({
                event: 'view_item_list',
                ecommerce: {
                    item_list_id: 'offers_home',
                    item_list_name: 'Featured offers',
                    items: [
                        expect.objectContaining({ item_id: 'c1' }),
                        expect.objectContaining({ item_id: 'p1' }),
                    ],
                },
            });
        });
    });

    describe('track.selectItem', () => {
        it('pushes a select_item event carrying list attribution', () => {
            track.selectItem({
                item_list_id: 'offers_home',
                items: [{ item_id: 'c1', item_name: 'Course 1', item_category: 'course', price: 99, index: 0 }],
            });
            expect(readDataLayer()[0]).toMatchObject({
                event: 'select_item',
                ecommerce: { item_list_id: 'offers_home' },
            });
        });
    });

    describe('track.signUp / track.login', () => {
        it('pushes sign_up with method', () => {
            track.signUp({ method: 'auth0' });
            expect(readDataLayer()[0]).toEqual({ event: 'sign_up', method: 'auth0' });
        });

        it('pushes login with method', () => {
            track.login({ method: 'auth0' });
            expect(readDataLayer()[0]).toEqual({ event: 'login', method: 'auth0' });
        });
    });

    describe('track.beginCheckout', () => {
        it('pushes begin_checkout with items, value, and coaching flag', () => {
            track.beginCheckout({
                value: 349,
                currency: 'CHF',
                coaching_selected: true,
                items: [{ item_id: 'course_42', item_name: 'Advanced TS', item_category: 'course', price: 349 }],
            });
            expect(readDataLayer()[0]).toMatchObject({
                event: 'begin_checkout',
                ecommerce: {
                    currency: 'CHF',
                    value: 349,
                    coaching_selected: true,
                },
            });
        });
    });

    describe('track.purchase', () => {
        it('pushes purchase with transaction_id and coaching flag', () => {
            track.purchase({
                transaction_id: 'stripe_ch_abc',
                value: 349,
                currency: 'CHF',
                coaching_selected: false,
                items: [{ item_id: 'course_42', item_name: 'Advanced TS', item_category: 'course', price: 349 }],
            });
            expect(readDataLayer()[0]).toMatchObject({
                event: 'purchase',
                ecommerce: {
                    transaction_id: 'stripe_ch_abc',
                    value: 349,
                    currency: 'CHF',
                    coaching_selected: false,
                },
            });
        });

        it('rejects negative value and pushes nothing', () => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
            track.purchase({
                transaction_id: 'stripe_ch_bad',
                value: -10,
                currency: 'CHF',
                coaching_selected: false,
                items: [{ item_id: 'c', item_name: 'c', item_category: 'course', price: -10 }],
            });
            expect(readDataLayer()).toEqual([]);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    describe('track.offerClick', () => {
        it('pushes a custom offer_click event', () => {
            track.offerClick({
                offer_id: 'pkg_premium',
                offer_name: 'Premium package',
                offer_type: 'package',
                location: 'homepage_hero',
            });
            expect(readDataLayer()[0]).toEqual({
                event: 'offer_click',
                offer_id: 'pkg_premium',
                offer_name: 'Premium package',
                offer_type: 'package',
                location: 'homepage_hero',
            });
        });
    });
});
