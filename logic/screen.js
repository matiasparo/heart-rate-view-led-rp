const fs = require('fs');
const path = require('path');
const configFile = fs.readFileSync(path.resolve(__dirname, '../config/config.json'));
const { exec } = require('child_process');
const config = JSON.parse(configFile);
const { logo, initMessage, ledMatrix, initImageFilename } = config;

let sendToDisplayPanel = async ({ message, imageFile }) => {
    imageFile = path.resolve(__dirname, '../img/', `${imageFile}`);
    const cmdDisplayMessage = `sudo ${ledMatrix.path}/examples-api-use/demo -t 1 -m 0 -D 1 ${imageFile} ${buildLedMatrixOptions(ledMatrix.options)}`;

    let respuesta = await execCommand({
        cmd: cmdDisplayMessage,
        message,
        ledMatrix
    });
    return respuesta;
}

let initServer = (callback) => {
    const cmdDisplayLogo = `sudo ${ledMatrix.path}/utils/led-image-viewer ${logo} -w2 ${initImageFilename} -w2 -C ${buildLedMatrixOptions(ledMatrix.options)}`;
    //console.log(cmdDisplayLogo);
    execCommand({
        cmd: cmdDisplayLogo,
        ledMatrix
    }).then(() => {
        callback(true);
    });
}

let clearScreen = () => {
    killProcess(`${ledMatrix.path}/examples-api-use/demo`);
}

async function execCommand({ cmd, message, ledMatrix }) {
    
    await killProcess(`${ledMatrix.path}/examples-api-use/demo`);
    return new Promise((resolve, reject) => {
        try {

            const child = exec(cmd);
            child.on('exit', (status) => {
                let msg = message;
                if (status !== 0) {
                    msg = null;
                }
                resolve(msg);
            });
        } catch (err) {
            console.log(err);
            resolve(false);
        }
    });

}

function killProcess(grepPattern) {
    const cmdKillProcess = `sudo kill $(ps aux | grep '${grepPattern}' | awk '{print $2}')`;
    //exec(cmdKillProcess);
    return new Promise((resolve, reject) => {
        try {

           /* const child = */
           exec(cmdKillProcess, (err, stdout, stderr)=>{
               if(err){
                   console.log(`error al ejectuar el comando ${cmdKillProcess}`);
                   console.log(err);
               }
                resolve('x)');
            });
           
        } catch (err) {
            console.log(err);
            resolve("[k]Catch kill");
        }
    });
}


function buildLedMatrixOptions(options) {
    return `--led-rows=${options.ledRows} --led-chain=${options.ledChain} ${options.ledNoHardwarePulse ? '--led-no-hardware-pulse' : ''} --led-gpio-mapping=${options.ledGpioMapping}`;
}


module.exports = {
    sendToDisplayPanel,
    initServer,
    clearScreen
}