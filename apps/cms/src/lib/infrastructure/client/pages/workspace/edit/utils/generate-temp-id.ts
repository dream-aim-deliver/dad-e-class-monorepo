// Required to seamlessly integrate with the components
export const generateTempId = () => {
    const randomId = crypto.randomUUID();
    return `temp-${randomId}`;
};

export const extractId = (id: string): string | undefined => {
    if (id.startsWith('temp-')) {
        return undefined;
    }
    return id;
};
