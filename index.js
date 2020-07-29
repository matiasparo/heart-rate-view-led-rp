require('./config/config');
const expres = require("express");
const app = expres();
const bodyParser = require('body-parser');
const rsmq = require('./logic/manageQueue');
const screen = require('./logic/screen');
const evoDeamon = require('./logic/evoDeamon');
//const redisDeamon = require('./logic/redisWorker');
const utils = require('./logic/log');
process.setMaxListeners(0);

// parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});


app.post('/heart-rate', (req, res)=> {
    var heartRate = req.body.heartRate;    
    utils.saveLog(`[INDEX]${heartRate}`);
    //mando la pulsacion a la cola de mensajes
    rsmq.sendMessage(process.env.QNAME ,heartRate);
    res.status(200).json('impeca');
});

app.get('/heart-rate/stop', (req, res)=>{
    //reseteo la pantalla
    
    utils.saveLog("[INDEX]Stop");
    evoDeamon.stop();
    rsmq.deleteQueue(process.env.QNAME, (err, resp)=>{
        screen.clearScreen();
        utils.saveLog("[INDEX]****elimina cola****");
        /*rsmq.createQueue(process.env.QNAME, (res)=>{
            utils.saveLog(`[INDEX]****creo cola de mensaje ${res}`);
        });*/
    });
    res.status(200).json("listo");
});

app.get('/heart-rate/start', (req,res)=>{
    utils.saveLog("[INDEX]Start");
    screen.clearScreen();
    rsmq.deleteQueue(process.env.QNAME, (err, resp)=>{
        utils.saveLog("[INDEX]****elimina cola****");
        rsmq.createQueue(process.env.QNAME, (res)=>{
            utils.saveLog(`[INDEX]****creo cola de mensaje ${res}`);
            setTimeout(()=>{
                evoDeamon.init();
            }, 1000);
        });
    });
   
    res.status(200).json();
});

 



app.listen(process.env.PORT, ()=>{
    utils.saveLog(`INICIO EL SERVICIO EN EL PUERTO: ${process.env.PORT}`);
    //inicio cola de mensajes
    //crear cola
    rsmq.createQueue(process.env.QNAME, (res)=>{
        utils.saveLog("[INDEX]crear cola "+ res);
        if(res){
            utils.saveLog("[INDEX]Cola Creada");
        }
    })

    //mustro logo en pantalla para indicar que inciio
    screen.initServer((resp)=>{
        if(resp){
            utils.saveLog("[INDEX]inicio la pantalla");
        }
    });
});


process.on('exit', data =>{
    utils.saveLog("[index]:el exit del process");
    utils.saveLog(data);
});
process.on('uncaughtException', exc=>{
    utils.saveLog("[INDEX]Exception");
    utils.saveLog(exc);
});
process.stdout.on('data', (data)=>{
    utils.saveLog("[INDEX][stdout] Data en el index");
})
process.stderr.on('data', ()=>{
    utils.saveLog("[INDEX][stderr] Data en el index");
})