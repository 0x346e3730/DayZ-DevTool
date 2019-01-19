# DayZ-DevTool

## Description

This tools builds and signs your mod, then copy it in your client and server, then launch your server and your client with the mod loaded, automatically on launch and if you change files inside it.

## Prerequisites

You need :
* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [Mikero's DayZ tools](https://mikero.bytex.digital/Downloads) `MakePbo` and `DePbo`.
* [DayZ Tools](https://store.steampowered.com/app/830640/DayZ_Tools/)
*  Your mod needs to have the following structure : `@ModName/addons/whatever` : `@ModName/addons/scripts` for example.

## Usage

1. Install dependencies. `yarn install`
2. Change the `config.json` with the correct locations/names for your system/mod
3. `node index.js` et voilà !

## This work is licensed under CC-BY-NC-SA-4.0.