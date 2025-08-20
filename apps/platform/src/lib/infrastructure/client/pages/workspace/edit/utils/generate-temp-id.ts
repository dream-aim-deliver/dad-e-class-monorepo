// Required to seamlessly integrate with the components
export const generateTempId = () => {
    const randomId = crypto.randomUUID();
    return `temp-${randomId}`;
};
