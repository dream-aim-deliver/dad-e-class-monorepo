import { z } from "zod";


export const FilterOperatorEQSchema = z.literal("eq");
export type TFilterOperatorEQ = z.infer<typeof FilterOperatorEQSchema>;
export const FilterOperatorNESchema = z.literal("ne");
export type TFilterOperatorNE = z.infer<typeof FilterOperatorNESchema>;
export const FilterOperatorGTSchema = z.literal("gt");
export type TFilterOperatorGT = z.infer<typeof FilterOperatorGTSchema>;
export const FilterOperatorGTESchema = z.literal("gte");
export type TFilterOperatorGTE = z.infer<typeof FilterOperatorGTESchema>;
export const FilterOperatorLTSchema = z.literal("lt");
export type TFilterOperatorLT = z.infer<typeof FilterOperatorLTSchema>;
export const FilterOperatorLTESchema = z.literal("lte");
export type TFilterOperatorLTE = z.infer<typeof FilterOperatorLTESchema>;

export const FilterOperatorCONTAINSSchema = z.literal("contains");
export type TFilterOperatorCONTAINS = z.infer<typeof FilterOperatorCONTAINSSchema>;
export const FilterOperatorSTARTSWITHSchema = z.literal("startsWith");
export type TFilterOperatorSTARTSWITH = z.infer<typeof FilterOperatorSTARTSWITHSchema>;
export const FilterOperatorENDSWITHSchema = z.literal("endsWith");
export type TFilterOperatorENDSWITH = z.infer<typeof FilterOperatorENDSWITHSchema>;

export const FilterOperatorBETWEENSchema = z.literal("between");
export type TFilterOperatorBETWEEN = z.infer<typeof FilterOperatorBETWEENSchema>;

export const FilterOperatorINSchema = z.literal("in");
export type TFilterOperatorIN = z.infer<typeof FilterOperatorINSchema>;
export const FilterOperatorNINSchema = z.literal("nin");
export type TFilterOperatorNIN = z.infer<typeof FilterOperatorNINSchema>;


// single value operators
export const FilterOperatorSingleValueSchema = z.union([
    FilterOperatorEQSchema,
    FilterOperatorNESchema,
    FilterOperatorGTSchema,
    FilterOperatorGTESchema,
    FilterOperatorLTSchema,
    FilterOperatorLTESchema,
    FilterOperatorCONTAINSSchema,
    FilterOperatorSTARTSWITHSchema,
    FilterOperatorENDSWITHSchema,
]);

export type TFilterOperatorSingleValue = z.infer<typeof FilterOperatorSingleValueSchema>;

// 2 value operators
export const FilterOperatorTwoValuesSchema = FilterOperatorBETWEENSchema
export type TFilterOperatorTwoValues = z.infer<typeof FilterOperatorTwoValuesSchema>;

// multi value operators
export const FilterOperatorMultiValueSchema = z.union([
    FilterOperatorINSchema,
    FilterOperatorNINSchema,
]);
export type TFilterOperatorMultiValue = z.infer<typeof FilterOperatorMultiValueSchema>;

