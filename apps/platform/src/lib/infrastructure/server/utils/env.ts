function getEnvironmentVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `CRITICAL! Configuration Error: ${key} not found in the environment variables`,
        );
    }
    return value;
}

export const env = {
    platformId: getEnvironmentVariable('E_CLASS_PLATFORM_ID'),
} as const;
