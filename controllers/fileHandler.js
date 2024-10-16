const fs = require('fs');


// Función para leer datos de un archivo JSON
const readDataFromFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath,'utf8');
        return JSON.parse(data);
    }catch (error){
        console.error('Error al leer el archivo:', error);
        return [];
        
    };
};

// Función para escribir datos en un archivo JSON
const writeDataToFile = (filePath, data) =>{
    try {
        fs.writeFileSync(filePath, JSON.stringify(data,null,2));
    } catch (error) {
        console.error('Error al escribir en el archivo:', error);
        
    }
}

module.exports ={
    readDataFromFile,
    writeDataToFile,
}