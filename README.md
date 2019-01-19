# DayZ-DevTool

## Description

This tools builds and signs your mod, then copy it in your client and server, then launch your server and your client with the mod loaded, automatically on launch and if you change files inside it.

## Prerequisites

You need NodeJS and Yarn installed on your system to run the tool with its dependencies. You will also need Mikero's DayZ tools `MakePbo` and `DePbo` installed. You can download them on [his website](https://mikero.bytex.digital/Downloads).  
Your mod needs to have the following structure : `@ModName/addons/whatever`, `@ModName/addons/scripts` for example. You will need to copy your mod in the root directory where this tool is located.

## Usage
Start by modifying config.json to match your installation/system, then `node index.js`  
And that's it ! It will build, deploy and launch everything at launch, and it will do it over again if you change stuff inside your mod.

## This work is licensed under CC-BY-NC-SA-4.0.