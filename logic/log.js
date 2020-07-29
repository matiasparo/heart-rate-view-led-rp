const fs = require("fs");
const ph = require('path');
const saveLog = (txt) =>{
    //fs.writeFileSync
    txt += "\n";
    fs.writeFile(ph.resolve(__dirname,'../debug.log'), txt, { encoding: 'utf8', flag: 'a' }, (err) => {
        if (err) {
            console.log(err);
        }
    });
}
module.exports = {
    saveLog
}

