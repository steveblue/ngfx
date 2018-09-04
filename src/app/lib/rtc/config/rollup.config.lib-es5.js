// rollup.config.lib-es5.js

export default {
  input: 'out-tsc/es5/rtc.js',
  output: {
    file: 'dist/@ng-tools/rtc/fesm5/rtc.js',
    format: 'es',
    sourcemap: true
  },
  onwarn: function ( message ) {

    return;

  }

}
