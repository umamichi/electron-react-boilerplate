# electron-react-boilerplate

forked this repository : [chentsulin/electron-react-boilerplate: Live editing development on desktop app](https://github.com/chentsulin/electron-react-boilerplate)

> Live editing development on desktop app

[Electron](http://electron.atom.io/) application boilerplate based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development


## Install

Install dependencies.

```bash
$ npm install
```

Install wine. (It takes about 30 minutes)

__this is required to package in mac.__

```bash
$ brew install Caskroom/cask/xquartz
$ brew install wine
```

## Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

*Note: requires a node version >= 4 and an npm version >= 2.*

#### Toggle Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

#### Toggle Redux DevTools

- All platforms: <kbd>Ctrl+H</kbd>

*See [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more information.*


## Externals

If you use any 3rd party libraries which can't be built with webpack, you must list them in your `webpack.config.base.js`：

```javascript
externals: [
  // put your node 3rd party libraries which can't be built with webpack here (mysql, mongodb, and so on..)
]
```

You can find those lines in the file.


## CSS Modules

This boilerplate out of the box is configured to use [css-modules](https://github.com/css-modules/css-modules).

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the
css-modules loader. e.g. `app.global.css`


## Package

To package apps for windows:

```bash
$ npm run package-win
```

#### Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon
- --all: pack for all platforms

Use `electron-packager` to pack your app with `--all` options for darwin (osx), linux and win32 (windows) platform. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

#### Default Ignore modules

We add some module's `peerDependencies` to ignore option as default for application size reduction.

- `babel-core` is required by `babel-loader` and its size is ~19 MB
- `node-libs-browser` is required by `webpack` and its size is ~3MB.

> **Note:** If you want to use any above modules in runtime, for example: `require('babel/register')`, you should move them from `devDependencies` to `dependencies`.

#### Building windows apps from non-windows platforms

Please checkout [Building windows apps from non-windows platforms](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms).


## Native-like UI

If you want to have native-like User Interface (OS X El Capitan and Windows 10), [react-desktop](https://github.com/gabrielbull/react-desktop) may perfect suit for you.