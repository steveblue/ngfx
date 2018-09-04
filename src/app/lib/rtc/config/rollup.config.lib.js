// rollup.config.lib.js

export default {
  input: 'out-tsc/es2015/rtc.js',
  output: {
    file: 'dist/rtc/fesm2015/rtc.js',
    format: 'es',
    sourcemap: false
  },
  onwarn: function ( message ) {

    return;

  }
}
