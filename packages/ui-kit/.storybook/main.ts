import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'packages/ui-kit/vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
      resolve: {
        alias: []
      },
    });
  },
};

export default config;
