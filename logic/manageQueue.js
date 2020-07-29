const RedisSMQ = require("rsmq");
const utils = require('./log');

const rsmq = new RedisSMQ({host: "127.0.0.1",realtime:true});


const createQueue = (name, callback)=>{
    utils.saveLog("quiero crear cola");
    rsmq.createQueue({qname: name,vt:10 }, function (err, resp) {
        // utils.saveLog(err);
        // utils.saveLog(resp);
        if (resp===1) {
            callback(true);
        }else{
            callback(false);
        }

    });
}


const sendMessage = (name, message)=>{
    if(!isNaN(message)){
        message = ''+message;
    }
    rsmq.sendMessage({qname: name, message:message}, function (err, resp) {
        if(err){
            utils.saveLog("Error to send message");
            utils.saveLog(err);
        }
        
        if (resp) {
            utils.saveLog("Message sent: " + message + ". ID:", resp);
        }
        
    });
}

const popMessage = (name, callback)=>{
    rsmq.popMessage({qname: name}, (err, resp)=>{
        callback(err, resp);
    });
}

const deleteQueue = (name, callback)=>{
    rsmq.deleteQueue({ qname: name }, (err, resp)=>{
        callback(err, resp);
    });
}


module.exports = {
    popMessage,
    sendMessage,
    createQueue,
    deleteQueue
}