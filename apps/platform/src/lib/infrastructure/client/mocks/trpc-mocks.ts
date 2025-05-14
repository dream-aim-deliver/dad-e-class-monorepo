import { skillsQuery } from "./skills-mock";

export const MockedTrpcClient = {
    getSkills: {
        queryOptions: skillsQuery,
    }
}