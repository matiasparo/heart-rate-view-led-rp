 
    
let generateImage = (text, filename, ledRows) => {
    try{
        if(!fs.existsSync(`${__dirname}/${initImageFilename}`)){
            let r,g,b;
            if(text > 64){
                [r,g,b] = [255,0,0];
            }else{
                [r,g,b] = [0,255,0];
            }
            const args = [__dirname+"/generate-image.py", text, __dirname+"/img/"+filename, ledRows, r,g,b];
            console.log("VOY A GENERA IMAGEN")
            let resultado = spawnSync('python', args);
            return resultado;
        }
    }catch(e){
      console.log("LINE:162 error generate!!")
      //console.log("line:162"+e);
    }
}

module.exports = {
    generateImage
}