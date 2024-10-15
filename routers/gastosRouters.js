const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {readDataFromFile, writeDataToFile} = require('../utils/fileHandler'); 
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

    //Crear un nuevo objeto de gasto
    const nuevoGasto ={
        id: uuidv4(),
        roommate,
        descripcion,
        monto
    };
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));
    gastos.push(nuevoGasto);
    writeDataToFile(path.join(__dirname,'../data/gastos.json'),gastos);

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
