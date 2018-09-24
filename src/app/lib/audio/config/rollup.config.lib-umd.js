// rollup.config.lib-umd.js

export default {
  input: 'out-tsc/es5/audio.js',
  output: {
    file: 'dist/audio/bundles/audio.umd.js',
    format: 'cjs',
    sourcemap: true
  },
  onwarn: function(message) {
    return;
  }
};
