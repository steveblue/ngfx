// rollup.config.lib-es5.js

export default {
  input: 'out-tsc/es5/ui.js',
  output: {
    file: 'dist/@ngfx/ui/fesm5/ui.js',
    format: 'es',
    sourcemap: true
  },
  onwarn: function ( message ) {

    return;

  }

}
