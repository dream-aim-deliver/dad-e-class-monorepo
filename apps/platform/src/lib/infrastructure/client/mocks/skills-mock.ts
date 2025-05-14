// @VIKA You can use core models here 
export const skillsQuery = (controllerParameters: {
    userId: number
}) => {
    return {
        data: {
            skills: [
                {
                    id: 1,
                    name: "JavaScript",
                    level: 5,
                },
                {
                    id: 2,
                    name: "TypeScript",
                    level: 4,
                },
                {
                    id: 3,
                    name: "React",
                    level: 4,
                },
            ],
        },
        error: null,
        isLoading: false,
        isError: false,
    }
}
