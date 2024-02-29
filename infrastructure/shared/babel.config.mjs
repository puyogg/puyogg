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
      plugins: ['source-map-support', '@babel/plugin-transform-class-properties'],
    },
  },
};
