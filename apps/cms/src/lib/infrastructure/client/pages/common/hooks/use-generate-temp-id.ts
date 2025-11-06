// Required to seamlessly integrate with the components
export function useGenerateTempId() {
    const generateTempId = () => {
        const randomId = crypto.randomUUID();
        return `temp-${randomId}`;
    };

    const extractId = (id: string): string | undefined => {
        if (id.startsWith('temp-')) {
            return undefined;
        }
        return id;
    };

    return {
        generateTempId,
        extractId,
    };
}

