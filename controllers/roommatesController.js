const path = require('path');
const {writeDataToFile} = require('./fileHandler')


//Función para actualizar los datos de los roommates
const actualizarRoommates = (roommates,gastos) =>{
    if(gastos.length === 0){
        roommates.forEach(rm => {
            rm.debe = 0;
            rm.recibe = 0;
        });
    }else{
        const totalGastos = gastos.reduce((acc,gasto) => acc + gasto.monto,0);

        //Calcular el valor que cada roomate debe pagar
        const numRoommates = roommates.length;
        const debePorRoommate = totalGastos / numRoommates;

        //Actualizar los valores de 'debe' y'recibe' en roommates.json
        roommates.forEach(rm => {
            //Calcular cuánto ha gastado este roommate
            const totalGastadoPorRoommate = gastos
                .filter(gasto => gasto.roommate === rm.nombre)
                .reduce((acc, gasto) => acc + gasto.monto, 0);

            //Actualizar el valor de 'debe' y'recibe'
            rm.debe = debePorRoommate;
            rm.recibe = totalGastadoPorRoommate - debePorRoommate;
        });

        // Guardar los cambios en roommates.json
        writeDataToFile(path.join(__dirname, '../data/roommates.json'), roommates);
    }
}

module.exports = {
    actualizarRoommates
}