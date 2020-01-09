# Experiment for MMORPG map editor written using Electron and Typescript.

## Other Applications

==========

- To host your MMORPG game server, you can use [The Forgotten Server](https://github.com/otland/forgottenserver).
- To play your MMORPG game, you can use [OTClient](https://github.com/edubart/otclient)
- To map your MMORPG game, you can use [RME's Map Editor](https://github.com/hjnilsson/rme) (Or this one, assuming it is ever finished).


## Install

Clone the repository with Git:

```bash
git clone --depth=1 git@github.com:otserv-tools/ts-map-editor.git
```

And then install the dependencies:

```bash
cd ts-map-editor
npm install
```

## Usage

Both processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-dev
npm run start-main-dev
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
npm run start-dev
```

## Packaging

We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```


## Dependencies

The application is written in [Electron](https://electronjs.org/) with [TypeScript](https://www.typescriptlang.org/) and uses [React](https://reactjs.org/), [Redux](https://redux.js.org/), and [Webpack](https://webpack.js.org/).

This project is based on [this Electron React Typescript Boilerplate](https://github.com/Robinfr/electron-react-typescript).
