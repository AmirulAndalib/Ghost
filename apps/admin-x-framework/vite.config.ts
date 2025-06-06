import path from 'path';
import react from '@vitejs/plugin-react';
import glob from 'glob';
import {resolve} from 'path';
import {defineConfig} from 'vitest/config';

// https://vitejs.dev/config/
export default (function viteConfig() {
    return defineConfig({
        logLevel: process.env.CI ? 'info' : 'warn',
        plugins: [
            react()
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        preview: {
            port: 4174
        },
        build: {
            reportCompressedSize: false,
            minify: false,
            sourcemap: true,
            outDir: 'dist',
            lib: {
                formats: ['es', 'cjs'],
                entry: glob.sync(resolve(__dirname, 'src/**/*.{ts,tsx}')).reduce((entries, libpath) => {
                    if (libpath.endsWith('.d.ts')) {
                        return entries;
                    }

                    const outPath = libpath.replace(resolve(__dirname, 'src') + '/', '').replace(/\.(ts|tsx)$/, '');
                    entries[outPath] = libpath;
                    return entries;
                }, {} as Record<string, string>)
            },
            commonjsOptions: {
                include: [/packages/, /node_modules/]
            },
            rollupOptions: {
                external: (source) => {
                    if (source.startsWith('.')) {
                        return false;
                    }

                    if (source.includes('node_modules')) {
                        return true;
                    }

                    return !source.includes(__dirname);
                }
            }
        },
        test: {
            globals: true, // required for @testing-library/jest-dom extensions
            environment: 'jsdom',
            include: ['./test/unit/**/*'],
            setupFiles: ['./test/setup.ts'],
            testTimeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 10000,
            ...(process.env.CI && { // https://github.com/vitest-dev/vitest/issues/1674
                minThreads: 1,
                maxThreads: 2
            })
        }
    });
});
