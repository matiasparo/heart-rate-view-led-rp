const screen = require('./screen');
const rsmq = require('./manageQueue');
const utils = require('./log');
var config = { run: false };

let getMessage = async (key) => {
    return new Promise((resolve, reject) => {


        rsmq.popMessage(process.env.QNAME, (err, resp) => {
            if (err) {
                utils.saveLog("[DEAMON]@@@@@@@error");
                utils.saveLog(err);
                reject(false);
            }
            if (resp.id) {
                utils.saveLog("======= MESSAGE DEAMON=====");
                utils.saveLog(resp.id);
                screen.sendToDisplayPanel({
                    message: resp.message,
                    imageFile: `${resp.message}.ppm`
                }).then(res => {
                    resolve(true);
                }).catch(err => {
                    reject(false);
                });
            } else {
                resolve(false);
            }
        });
    });
}

const init = async () => {
    config.run = true;
    while (config.run) {
        try{
            await getMessage();
        }catch(ex){
            utils.saveLog("EXCEPTION in GETMESSAGE");
            utils.saveLog(ex);
        }
    }
}

const stop = () => {
    config.run = false;
}



module.exports = {
    getMessage,
    config,
    init,
    stop
}