const fs = require('fs-extra');
const taskkill = require('taskkill');
const chokidar = require("chokidar");
const exec = require('child_process').execFile;
const execSync = require('child_process').execFileSync;
const config = require("./config.json");

const killOptions = {
    force: true
};

const execOptions = {
    stdio: 'ignore'
};

const dir = config.modName;

const watcher = chokidar.watch(dir, {
    ignored: /\.[pbo|bisign|bikey]/,
    persistent: true
});

let isReady = false;
let isAlreadyRunning = false;

watcher
  .on('add', killThenStart)
  .on('change', killThenStart)
  .on('unlink', killThenStart)
  .on('addDir', killThenStart)
  .on('unlinkDir', killThenStart)
  .on('ready', () => {
      isReady = true;
      killThenStart();
  })
  .on('error', error => console.error(`Watcher error: ${error}`))

function killThenStart()
{
    if (!isReady || isAlreadyRunning) return;
    isAlreadyRunning = !isAlreadyRunning;

    try {
        console.log("Deleting running client/server...")
        taskkill(['DayZ_x64.exe', 'DayZServer_x64.exe'], killOptions)
        .then(waitBeforeBuilding)
        .catch(waitBeforeBuilding);
    } catch (err) {
        console.error(err)
    }
}

function waitBeforeBuilding()
{
    console.log("Waiting 5 seconds before building to avoid locks...");
    setTimeout(buildThenStart, 5000)
}

function buildThenStart()
{
    const temp = 'temp';
    const clientModLocation = config.clientLocation + config.modName;
    const serverModLocation = config.serverLocation + config.modName

    fs.emptyDirSync(temp);
    console.log("Copying mod to temp.");
    fs.copySync(dir, temp)
    console.log("Reading files...");
    const tempAddons = temp+"\\addons";
    fs.readdirSync(tempAddons).forEach(file => {
        const current = `${__dirname}\\${tempAddons}\\${file}`;
        console.log("Packing " + file + "...");
        execSync(
            config.makePbo,
            [
                "-U",
                "-P",
                "-D",
                "-N",
                current
            ],
            execOptions
        );
        const pbo = current+".pbo";
        const privateKey = config.keysLocation+config.keyName+".biprivatekey";
        console.log("Packed ! Signing " + file + ".pbo with private key " + privateKey +  " ...");
        execSync(
            config.signFile,
            [
                privateKey,
                pbo
            ],
            execOptions
        );
        console.log("Signed ! Removing " + file + "...");
        fs.removeSync(current);
        console.log("Removed !");
    });
    
    const publicKey = config.keysLocation+config.keyName+".bikey";
    console.log("Copying public key " + publicKey + " ...");
    const keyDest = temp+"\\key\\"+config.keyName+".bikey";
    fs.copySync(publicKey, keyDest);
    console.log("Copied !");
    
    console.log("Copying mod to client and server, then pruning temp...");
    fs.removeSync(clientModLocation);
    fs.removeSync(serverModLocation);
    fs.copySync(temp, clientModLocation);
    fs.copySync(temp, serverModLocation);
    fs.emptyDirSync(temp);
    console.log("Done !");
    
    console.log("Launching server...");
    const serverExe = config.serverLocation + "DayZServer_x64.exe";
    exec(
        serverExe,
        [
            "-config=serverDZ.cfg",
            "-port=2302",
            "-dologs",
            "-adminlog",
            "-profiles=profiles",
            "-freezecheck",
            "-scriptDebug=true",
            "-cpuCount=4",
            `-mod=@RPCFramework;@Permissions-Framework;@Community-Online-Tools;${config.modName}`
        ],
        execOptions
    );

    const waitingSecs = 15;
    console.log("Launching client in " + waitingSecs + " seconds...");
    setTimeout(() => {
        console.log("Launching client...");
        const clientExe = config.clientLocation + "DayZ_BE.exe";
        exec(
            clientExe,
            [
                "-exe DayZ_x64.exe",
                "-connect=localhost",
                "-port=2302",
                "-noPause",
                "-noBenchmark",
                "-scriptDebug=true",
                "-name=GrosTon1",
                "-password=GrosTon1337",
                "-freezecheck",
                `-mod=@RPCFramework;@Permissions-Framework;@Community-Online-Tools;${config.modName}`
            ],
            execOptions
        );
        isAlreadyRunning = !isAlreadyRunning;
    }, waitingSecs * 1000);
}