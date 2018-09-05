// rollup.config.lib-umd.js

export default {
  input: 'out-tsc/es5/ui.js',
  output: {
    file: 'dist/@ngfx/ui/bundles/ui.umd.js',
    format: 'cjs',
    sourcemap: true
  },
  onwarn: function ( message ) {

    return;

  }
}
