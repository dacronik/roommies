const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {readDataFromFile, writeDataToFile} = require('../controllers/fileHandler'); 
const path = require('path');

const router = express.Router();

//Ruta para obtener todos los gastos
router.get('/',(req,res) =>{
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));
    res.status(200).json(gastos);
});

// Ruta para agregar un nuevo gasto
router.post('/', (req, res) =>{
    const { roommate,descripcion,monto } = req.body;

    //Leer los datos actualues de los gastos y roommates
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));
    const roommates = readDataFromFile(path.join(__dirname, '../data/roommates.json'));

    //Crear un nuevo objeto de gasto
    const nuevoGasto ={
        id: uuidv4(),
        roommate,
        descripcion,
        monto
    };
    
    //Agregar nuevo gasto a la lista
    gastos.push(nuevoGasto);
    writeDataToFile(path.join(__dirname,'../data/gastos.json'),gastos);

    //Actualizar los valores de 'debe' y 'recibe' en roommates.json
    const numRoommates = roommates.length;
    const montoPorRoommate = monto / numRoommates

    roommates.forEach(rm => {
        if (rm.nombre === roommate) {
            //Actualiza el 'recibe' para el que realizó el gasto
            rm.recibe += monto - montoPorRoommate;
        }else {
            //Actualiza el 'debe' para los demas usuarios
            rm.debe += montoPorRoommate;
        }
    });

    // Guardar los cambios en roommates.json
    writeDataToFile(path.join(__dirname, '../data/roommates.json'), roommates);

    res.status(201).json(nuevoGasto);
});

//Ruta para eliminar un gasto
router.delete('/:id', (req,res) =>{
    const { id} = req.params;
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));

    const filteredGastos = gastos.filter((gasto) => gasto.id !== id);
    writeDataToFile(path.join(__dirname,'../data/gastos.json'),filteredGastos);

    res.status(204).send();
});

//Ruta para actualizar un gasto
router.put('/:id', (req,res) =>{
    const { id} = req.params;
    const { roommate,descripcion,monto } = req.body;
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));

    const updatedGasto = gastos.map((gasto)=>{
        if(gasto.id === id){
            return {...gasto, roommate, descripcion, monto};
        }
        return gasto;
    });

    writeDataToFile(path.join(__dirname,'../data/gastos.json'),updatedGasto);
    res.status(200).json(updatedGasto.find(gasto=>gasto.id === id));
});

module.exports = router;
