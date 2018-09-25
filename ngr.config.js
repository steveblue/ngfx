const spawn = require('child_process').spawn;
const fs = require('fs');

module.exports = {
  defaultProject: 'ngfx',
  projects: {
    '@ngfx/audio': {
      root: 'src/app/lib/audio',
      sourceRoot: 'src',
      projectType: 'library',
      configFile: 'lib.config.json',
      architect: {
        build: {
          builder: 'angular-rollup',
          options: {
            outputPath: 'dist/@ngfx/audio',
            styles: [],
            stylePreprocessorOptions: {
              includePaths: ['src/style'],
              outputStyle: 'expanded',
              sourceComments: true
            }
          },
          hooks: {
            prod: {
              pre: () => {
                return new Promise(res => {
                  // put togic in here for before the production build
                  res();
                });
              },
              post: () => {
                return new Promise(res => {
                  // put togic in here for after the production build
                  res();
                });
              }
            }
          }
        }
      }
    },

    '@ngfx/ui': {
      root: 'src/app/lib/ui',
      sourceRoot: 'src',
      projectType: 'library',
      configFile: 'lib.config.json',
      architect: {
        build: {
          builder: 'angular-rollup',
          options: {
            outputPath: 'dist/@ngfx/ui',
            styles: [],
            stylePreprocessorOptions: {
              includePaths: ['src/style'],
              outputStyle: 'expanded',
              sourceComments: true
            }
          },
          hooks: {
            prod: {
              pre: () => {
                return new Promise(res => {
                  // put togic in here for before the production build
                  res();
                });
              },
              post: () => {
                return new Promise(res => {
                  // put togic in here for after the production build
                  res();
                });
              }
            }
          }
        }
      }
    },
    '@ngfx/rtc': {
      root: 'src/app/lib/rtc',
      sourceRoot: 'src',
      projectType: 'library',
      configFile: 'lib.config.json',
      architect: {
        build: {
          builder: 'angular-rollup',
          options: {
            outputPath: 'dist/@ngfx/rtc',
            styles: [],
            stylePreprocessorOptions: {
              includePaths: ['src/style'],
              outputStyle: 'expanded',
              sourceComments: true
            }
          },
          hooks: {
            prod: {
              pre: () => {
                return new Promise(res => {
                  // put togic in here for before the production build
                  res();
                });
              },
              post: () => {
                return new Promise(res => {
                  // put togic in here for after the production build
                  res();
                });
              }
            }
          }
        }
      }
    },
    ngfx: {
      root: '',
      sourceRoot: 'src',
      projectType: 'application',
      configFile: '',
      architect: {
        build: {
          builder: 'angular-rollup',
          options: {
            outputPath: 'dist/ngfx',
            styles: ['src/style/style.scss'],
            stylePreprocessorOptions: {
              includePaths: ['src/style'],
              outputStyle: 'expanded',
              sourceComments: true
            },
            lib: {
              dev: [
                'core-js/client/shim.min.js',
                'core-js/client/shim.min.js.map',
                'zone.js/dist/zone.min.js',
                'webrtc-adapter/out/adapter.js',
                'web-animations-js/web-animations.min.js',
                'web-animations-js/web-animations.min.js.map',
                'ie9-oninput-polyfill/ie9-oninput-polyfill.js',
                'angular-polyfills/dist/blob.js',
                'angular-polyfills/dist/classList.js',
                'angular-polyfills/dist/formdata.js',
                'angular-polyfills/dist/intl.js',
                'angular-polyfills/dist/typedarray.js',
                'console-polyfill/index.js',
                'zone.js/dist/webapis-rtc-peer-connection.js',
                'zone.js/dist/zone-patch-user-media.js',
                'systemjs/dist/system.js',
                'systemjs/dist/system.js.map',
                'reflect-metadata/Reflect.js',
                'reflect-metadata/Reflect.js.map',
                'tslib/tslib.js',
                '@angular',
                'rxjs'
              ],
              prod: [
                'core-js/client/shim.min.js',
                'zone.js/dist/zone.min.js',
                'webrtc-adapter/out/adapter.js',
                'web-animations-js/web-animations.min.js',
                'ie9-oninput-polyfill/ie9-oninput-polyfill.js',
                'angular-polyfills/dist/blob.js',
                'angular-polyfills/dist/classList.js',
                'angular-polyfills/dist/formdata.js',
                'angular-polyfills/dist/intl.js',
                'angular-polyfills/dist/typedarray.js',
                'console-polyfill/index.js',
                'zone.js/dist/webapis-rtc-peer-connection.min.js',
                'zone.js/dist/zone-patch-user-media.min.js',
                'systemjs/dist/system.js'
              ],
              src: 'node_modules',
              dist: 'dist/ngfx/lib'
            }
          },
          hooks: {
            prod: {
              pre: () => {
                return new Promise(res => {
                  // put togic in here for before the production build
                  res();
                });
              },
              post: () => {
                return new Promise(res => {
                  // put togic in here for after the production build
                  res();
                });
              }
            }
          }
        }
      }
    }
  }
};
