<h1 align="center">🍔 訂便當小幫手</h1>
<p align="center">填資料是快樂的事，不用填資料是更快樂的事</p>

[![semantic-release](https://img.shields.io/badge/semantic-release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

<hr />

## Install From Webstore (for user)

- [Chrome webstore](https://chrome.google.com/webstore/detail/%E8%A8%82%E4%BE%BF%E7%95%B6%E5%B0%8F%E5%B9%AB%E6%89%8B/fnpjbgenepaaepfnaondnagceknknadm) 

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](/) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](/) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](/) | [![Yandex](https://raw.github.com/alrra/browser-logos/master/src/yandex/yandex_48x48.png)](/) | [![Brave](https://raw.github.com/alrra/browser-logos/master/src/brave/brave_48x48.png)](/) | [![vivaldi](https://raw.github.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png)](/) |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 49 & later ✔                                                                                  | 52 & later ✔                                                                                     | 36 & later ✔                                                                               | 79 & later ✔                                                                            | Latest ✔                                                                                      | Latest ✔                                                                                   | Latest ✔                                                                                         |

## 🚀 Quick Start (for developer)

Ensure you have

- [Node.js](https://nodejs.org) 10 or later installed
- [NPM](https://www.npmjs.com/)

Then run the following:

- `npm install` to install dependencies.
- `npm run dev:chrome` to start the development server for chrome extension
- `npm run dev:firefox` to start the development server for firefox addon
- `npm run dev:opera` to start the development server for opera extension
- `npm run build:chrome` to build chrome extension
- `npm run build:firefox` to build firefox addon
- `npm run build:opera` to build opera extension
- `npm run build` builds and packs extensions all at once to extension/ directory

### Development

- `npm install` to install dependencies.
- To watch file changes in development

  - Chrome
    - `npm run dev:chrome`
  - Firefox
    - `npm run dev:firefox`
  - Opera
    - `npm run dev:opera`

- **Load extension in browser**

- ### Chrome

  - Go to the browser address bar and type `chrome://extensions`
  - Check the `Developer Mode` button to enable it.
  - Click on the `Load Unpacked Extension…` button.
  - Select your extension’s extracted directory.

- ### Firefox

  - Load the Add-on via `about:debugging` as temporary Add-on.
  - Choose the `manifest.json` file in the extracted directory

- ### Opera

  - Load the extension via `opera:extensions`
  - Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

### Production

- `npm run build` builds the extension for all the browsers to `extension/BROWSER` directory respectively.

Note: By default the `manifest.json` is set with version `0.0.0`. The webpack loader will update the version in the build with that of the `package.json` version. In order to release a new version, update version in `package.json` and run script.

If you don't want to use `package.json` version, you can disable the option [here](https://github.com/abhijithvijayan/web-extension-starter/blob/e10158c4a49948dea9fdca06592876d9ca04e028/webpack.config.js#L79).

## Bugs

Please file an issue [here](https://github.com/akccakcctw/kk-bendon-helper/issues/new) for bugs, missing documentation, or unexpected behavior.

## License

[MIT © Rex Tsou](https://github.com/akccakcctw/kk-bendon-helper/blob/main/LICENSE)

## Thanks

[abhijithvijayan/web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter)
