 
    
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
            let resultado = spawnSync('python', args);
            return resultado;
        }
    }catch(e){
      
    }
}

module.exports = {
    generateImage
}