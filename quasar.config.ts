/* eslint-env node */

import { configure } from 'quasar/wrappers';
import { config as dotEnvConfig } from 'dotenv';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import CryptoJS from 'crypto-js';

/**
 * Environment variables
 */
const env = dotEnvConfig().parsed;

/**
 * Modify variables in the environment
 */
if (env) {
  env.ENCRYPT_KEY = env?.ENCRYPT_KEY ? CryptoJS.MD5(env?.ENCRYPT_KEY).toString() : '';
}

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
export default configure((/* ctx */) => {
  return {
    htmlVariables: {
      productName: env?.APP_NAME || 'Quasar Blank'
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['axios', 'apollo'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['tailwind.css', 'app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'mdi-v7',
      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      env: env,
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      publicPath: process.env.PUBLIC_PATH,
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      afterBuild: () => {
        if (process.env.DEBUG_MODE) return;
        const inputDir = './dist/spa/assets';

        fs.readdirSync(inputDir).forEach((file) => {
          if (file.endsWith('.js')) {
            const filePath = `${inputDir}/${file}`;
            console.log(`Obfuscating file: ${filePath}`);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
              compact: true,
              controlFlowFlattening: true,
              deadCodeInjection: false,
              debugProtection: false,
              debugProtectionInterval: 0,
              disableConsoleOutput: true,
              identifierNamesGenerator: 'hexadecimal',
              log: false,
              numbersToExpressions: false,
              renameGlobals: false,
              selfDefending: true,
              simplify: true,
              splitStrings: false,
              stringArray: true,
              stringArrayEncoding: [],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 1,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersParametersMaxCount: 2,
              stringArrayWrappersType: 'variable',
              stringArrayThreshold: 1,
              unicodeEscapeSequence: false
            });

            fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
          }
        });

        console.log('FINISH :)');
      },

      // viteVuePluginOptions: {},

      alias: {
        '@': path.join(__dirname, 'src')
      },

      vitePlugins: [
        [
          //'vite-plugin-checker',
          {
            vueTsc: {
              tsconfigPath: 'tsconfig.vue-tsc.json'
            },
            eslint: {
              //lintCommand: 'eslint "./**/*.{js,ts,mjs,cjs,vue}"'
              //lintCommand: 'eslint "./src/**/*.{ts,vue}"',
            }
          },
          { server: false }
        ]
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      open: true, // opens browser window automatically,
      port: !env?.APP_HOST_PORT ? undefined : Number(env.APP_HOST_PORT)
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        dark: false,
        brand: {
          white: '#ffffff'
        }
      },

      lang: 'es',

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ['Notify', 'Dialog']
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: 'all',

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
    //   pwaServiceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    //   bexManifestFile: 'src-bex/manifest.json
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ],

      // extendPackageJson (json) {},
      // extendSSRWebserverConf (esbuildConf) {},

      // manualStoreSerialization: true,
      // manualStoreSsrContextInjection: true,
      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      pwa: false

      // pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // pwaExtendGenerateSWOptions (cfg) {},
      // pwaExtendInjectManifestOptions (cfg) {}
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      injectPwaMetaTags: true
      // extendManifestJson (json) {},
      // extendPWACustomSWConf (esbuildConf) {},
      // extendGenerateSWOptions (cfg) {},
      // extendInjectManifestOptions (cfg) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf) {},
      // extendElectronPreloadConf (esbuildConf) {},

      // extendPackageJson (json) {},

      // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
      preloadScripts: ['electron-preload'],

      // specify the debugging port to use for the Electron app when running in development mode
      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'quasar-blank'
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      // extendBexScriptsConf (esbuildConf) {},
      // extendBexManifestJson (json) {},

      contentScripts: ['my-content-script']
    }
  };
});
