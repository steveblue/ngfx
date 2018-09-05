// rollup.config.lib.js

export default {
  input: 'out-tsc/es2015/ui.js',
  output: {
    file: 'dist/@ngfx/ui/fesm2015/ui.js',
    format: 'es',
    sourcemap: false
  },
  onwarn: function ( message ) {

    return;

  }
}
