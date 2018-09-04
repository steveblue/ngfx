// rollup.config.lib-umd.js

export default {
  input: 'out-tsc/es5/rtc.js',
  output: {
    file: 'dist/@ngfx/rtc/bundles/rtc.umd.js',
    format: 'cjs',
    sourcemap: true
  },
  onwarn: function ( message ) {

    return;

  }
}
