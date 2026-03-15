import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
        setupFiles: [],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@maany_shr/e-class-models': path.resolve(workspaceRoot, 'packages/models/src/index.ts'),
            '@maany_shr/e-class-translations': path.resolve(workspaceRoot, 'packages/translations/src/index.ts'),
            '@maany_shr/e-class-ui-kit': path.resolve(workspaceRoot, 'packages/ui-kit/lib/index.ts'),
            '@maany_shr/e-class-auth': path.resolve(workspaceRoot, 'packages/auth/src/index.ts'),
        },
    },
});
