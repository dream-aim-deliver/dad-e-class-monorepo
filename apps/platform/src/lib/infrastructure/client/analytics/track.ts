import { z } from 'zod';
import { sendGTMEvent } from '@next/third-parties/google';

const offerTypeSchema = z.enum(['course', 'package', 'coaching']);

const itemSchema = z.object({
    item_id: z.string().min(1),
    item_name: z.string().min(1),
    item_category: offerTypeSchema,
    price: z.number().nonnegative(),
    quantity: z.number().int().positive().optional(),
    index: z.number().int().nonnegative().optional(),
});

const viewItemSchema = z.object({
    item_id: z.string().min(1),
    item_name: z.string().min(1),
    item_category: offerTypeSchema,
    price: z.number().nonnegative(),
    currency: z.string().length(3),
});

const viewItemListSchema = z.object({
    item_list_id: z.string().min(1),
    item_list_name: z.string().min(1),
    items: z.array(itemSchema).nonempty(),
});

const selectItemSchema = z.object({
    item_list_id: z.string().min(1),
    items: z.array(itemSchema).nonempty(),
});

const authMethodSchema = z.object({
    method: z.string().min(1),
});

const beginCheckoutSchema = z.object({
    value: z.number().nonnegative(),
    currency: z.string().length(3),
    coupon: z.string().optional(),
    coaching_selected: z.boolean(),
    items: z.array(itemSchema).nonempty(),
});

const purchaseSchema = z.object({
    transaction_id: z.string().min(1),
    value: z.number().nonnegative(),
    currency: z.string().length(3),
    tax: z.number().nonnegative().optional(),
    coaching_selected: z.boolean(),
    items: z.array(itemSchema).nonempty(),
});

const offerClickSchema = z.object({
    offer_id: z.string().min(1),
    offer_name: z.string().min(1),
    offer_type: offerTypeSchema,
    location: z.string().min(1),
});

function validateAndPush<T>(
    schema: z.ZodSchema<T>,
    payload: unknown,
    build: (valid: T) => Record<string, unknown>,
    tag: string,
): void {
    const result = schema.safeParse(payload);
    if (!result.success) {
        const msg = `[analytics] invalid ${tag} payload`;
        if (process.env.NODE_ENV !== 'production') {
            console.error(msg, result.error.flatten());
        } else {
            console.error(msg);
        }
        return;
    }
    sendGTMEvent(build(result.data));
}

export const track = {
    viewItem(payload: z.infer<typeof viewItemSchema>): void {
        validateAndPush(
            viewItemSchema,
            payload,
            (v) => ({
                event: 'view_item',
                ecommerce: {
                    currency: v.currency,
                    value: v.price,
                    items: [
                        {
                            item_id: v.item_id,
                            item_name: v.item_name,
                            item_category: v.item_category,
                            price: v.price,
                            quantity: 1,
                        },
                    ],
                },
            }),
            'view_item',
        );
    },

    viewItemList(payload: z.infer<typeof viewItemListSchema>): void {
        validateAndPush(
            viewItemListSchema,
            payload,
            (v) => ({
                event: 'view_item_list',
                ecommerce: {
                    item_list_id: v.item_list_id,
                    item_list_name: v.item_list_name,
                    items: v.items,
                },
            }),
            'view_item_list',
        );
    },

    selectItem(payload: z.infer<typeof selectItemSchema>): void {
        validateAndPush(
            selectItemSchema,
            payload,
            (v) => ({
                event: 'select_item',
                ecommerce: { item_list_id: v.item_list_id, items: v.items },
            }),
            'select_item',
        );
    },

    signUp(payload: z.infer<typeof authMethodSchema>): void {
        validateAndPush(
            authMethodSchema,
            payload,
            (v) => ({ event: 'sign_up', method: v.method }),
            'sign_up',
        );
    },

    login(payload: z.infer<typeof authMethodSchema>): void {
        validateAndPush(
            authMethodSchema,
            payload,
            (v) => ({ event: 'login', method: v.method }),
            'login',
        );
    },

    beginCheckout(payload: z.infer<typeof beginCheckoutSchema>): void {
        validateAndPush(
            beginCheckoutSchema,
            payload,
            (v) => ({
                event: 'begin_checkout',
                ecommerce: {
                    currency: v.currency,
                    value: v.value,
                    coupon: v.coupon,
                    coaching_selected: v.coaching_selected,
                    items: v.items,
                },
            }),
            'begin_checkout',
        );
    },

    purchase(payload: z.infer<typeof purchaseSchema>): void {
        validateAndPush(
            purchaseSchema,
            payload,
            (v) => ({
                event: 'purchase',
                ecommerce: {
                    transaction_id: v.transaction_id,
                    value: v.value,
                    currency: v.currency,
                    tax: v.tax,
                    coaching_selected: v.coaching_selected,
                    items: v.items,
                },
            }),
            'purchase',
        );
    },

    offerClick(payload: z.infer<typeof offerClickSchema>): void {
        validateAndPush(
            offerClickSchema,
            payload,
            (v) => ({
                event: 'offer_click',
                offer_id: v.offer_id,
                offer_name: v.offer_name,
                offer_type: v.offer_type,
                location: v.location,
            }),
            'offer_click',
        );
    },
};
