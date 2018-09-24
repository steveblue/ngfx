// rollup.config.lib.js

export default {
  input: 'out-tsc/es2015/audio.js',
  output: {
    file: 'dist/@ngfx/audio/fesm2015/audio.js',
    format: 'es',
    sourcemap: false
  },
  onwarn: function(message) {
    return;
  }
};
