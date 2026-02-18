import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
    stories: ['../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
    addons: [
        getAbsolutePath("@chromatic-com/storybook"),
        getAbsolutePath("@storybook/addon-themes"),
        getAbsolutePath("@storybook/addon-docs")
    ],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {
            builder: {
                viteConfigPath: 'packages/ui-kit/vite.config.ts',
            },
        },
    },
    docs: {},
    async viteFinal(config) {
        // Merge custom configuration into the default config
        return mergeConfig(config, {
            // Add dependencies to pre-optimization
            optimizeDeps: {
                include: [
                    'storybook-dark-mode',
                    '@fullcalendar/react',
                    '@fullcalendar/core',
                    '@fullcalendar/daygrid',
                    '@fullcalendar/timegrid',
                    '@fullcalendar/interaction',
                    '@fullcalendar/common',
                ],
            },
            resolve: {
                alias: [],
            },
        });
    },
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}