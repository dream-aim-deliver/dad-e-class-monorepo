import { z } from 'zod';
import { BuildFilters } from './filter-generator';
import { StringContainsFilterFactory, StringEqFilterFactory } from './string-filters';
// [APP] - Define a Core Model as Zod Schema
export const CourseModelSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    duration: z.number().int().min(1).max(52), // Duration in weeks
})

export type TCourse = z.infer<typeof CourseModelSchema>;

// [SDK] - Factories
export const MasterFilterSchema = z.object({
    field: z.string(),
    op: z.string(),
    type: z.string(),
    value: z.any(),
})
.describe('Master filter schema for all filters')
.superRefine((data, ctx) => {
    const { field, op, type, value } = data;
    // string type only supports eq and contains operations
    if (type === 'string') {
        if (!['eq', 'contains'].includes(op)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Operation '${op}' is not supported for string type. Supported operations are 'eq' and 'contains'.`,   
            });
            return;
        }
    }
});



export const validateFiltersAtRuntime = <TModel extends z.ZodRawShape>(
    filters: BuildFilters<TModel, {}>,
    modelSchema: z.ZodObject<TModel>,
    filtersSchema?: z.Schema<z.ZodAny>
): boolean => {
    if(filtersSchema) {
        filtersSchema.parse(filters);
        return true;
    }
    // custom logic to validate that fields in the filters are actually present in the model
    // provide custom validation logic if no schema is provided
    
    MasterFilterSchema.parse(filters);
    return true;
}


export const ListRequestFilterFactory = <TModel extends z.ZodRawShape>(
    modelSchema: z.ZodObject<TModel>
) => {
    // loop over model schema, for each field, generate a filter factory of the type of the field and with the name of the field
    return z.union([
        StringEqFilterFactory<TModel>('name'),
        StringContainsFilterFactory<TModel>('description'),
    ]);
}
// [APP] - Request and Response Models for Listing Courses
const ListCourseRequestFiltersSchema = z.union([
    StringEqFilterFactory<TCourse, "name">('name'),
    StringContainsFilterFactory<typeof CourseModelSchema.shape>('description'),
]);
export type TListCourseRequestFilters = z.infer<typeof ListCourseRequestFiltersSchema>;


export const ListCoursesRequestSchema = z.object({
    filters: ListCourseRequestFiltersSchema
});

export type TListCoursesRequest = {
    filters: BuildFilters<TCourse, {}>;
}

export const ListCoursesResponseSchema = z.array(CourseModelSchema).describe('List of courses');
export type TListCoursesResponse = z.infer<typeof ListCoursesResponseSchema>;


// [APP] - Function to List Courses

export const listCourses = (request: TListCoursesRequest): TListCoursesResponse => {
    const courses: TCourse[] = [
        { name: 'Introduction to Programming', description: 'Learn the basics of programming.', duration: 10 },
    ]
    validateFiltersAtRuntime<typeof CourseModelSchema.shape>(request.filters, CourseModelSchema)
    return courses
}

// [APP] - Usage of the function
const response = listCourses({
    filters: {
        field: 'duration',
        op: 'eq',
        type: 'number',
        value: 1,
    }
});

// What are the filters?
// export type TCourseFilters = BuildFilters<TCourse, {}>;
// const ExampleCourseFilter: TCourseFilters = {
//     field: 'duration',
//     op: 'gte',
//     type: 'number',
//     value: 5,
// }