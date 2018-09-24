// rollup.config.lib-es5.js

export default {
  input: 'out-tsc/es5/audio.js',
  output: {
    file: 'dist/@ngfx/audio/fesm5/audio.js',
    format: 'es',
    sourcemap: true
  },
  onwarn: function(message) {
    return;
  }
};
