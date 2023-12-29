/** @type {import('@babel/core').TransformOptions} */
export default {
  inputSourceMap: true,
  sourceMaps: true,
  compact: false,
  ignore: ['src/**/*.spec.ts'],
  env: {
    esm: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead',
            modules: false, // Preserve ES modules
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: ['source-map-support'],
    },
    cjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: true,
            },
            modules: 'cjs',
          },
        ],
        '@babel/preset-typescript',
      ],
      plugins: ['babel-plugin-transform-import-meta', 'source-map-support'],
    },
  },
};
