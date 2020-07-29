const RSMQWorker = require( "rsmq-worker" );
const screen = require('./screen');


let worker = null;

const onMessageStart = ()=>{
    

    worker = new RSMQWorker( process.env.QNAME, {
        interval: 0.1,
        invisibletime: 10,							
        autostart: false,
        rsmq: rsmq
    });

    worker.start();
    // Listen to errors
	worker.on('error', function( err, msg ){
	    console.log( "ERROR", err, msg.id );
	});
	worker.on('timeout', function( msg ){
	    console.log( "TIMEOUT", msg.id, msg.rc );
    });
    
    var rsmq = worker._getRsmq();
	worker.on('exceeded', function( msg ){
		console.log( "EXCEEDED", msg.id );
		// NOTE: make sure this queue exists
		rsmq.sendMessage( "YOUR_EXCEEDED_QUEUE", msg, function( err, resp ){
			if( err ){
				console.error( "write-to-exceeded-queue", err )
			}
		});
	});

	// listen to messages
	worker.on( "message", function( message, next, id ){
		/*console.log("======== MESSGAGE ======");
        console.log(id);
        console.log(message);*/
        try{
            screen.sendToDisplayPanel({
                message: message,
                imageFile: `${message}.ppm`
            }).then(res => {
                console.log("*********RETORNA EL RESOLVE A LA COLA");
                sizeQueue();
                next();
            }).catch(err => {
                console.log("**********EL RESOLVE DE LA COLA CATCH");
                console.log(err);
                sizeQueue();
                next();
            });   
        }catch(e){
            console.log(e.message);
        }
	});
}

const sizeQueue = () => {
    if(worker){

        worker.size(false, (err, size)=>{
            if(err){
                console.log(err.message);
            }
            console.log("[SIZE]:", size);
        });
    }
}
const onMessageStop = () =>{
    if(worker){
        worker.stop();
        worker.quit();
        worker = null;
    }
}


module.exports = {
    onMessageStart,
    onMessageStop
}