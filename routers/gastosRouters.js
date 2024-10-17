const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {readDataFromFile, writeDataToFile} = require('../controllers/fileHandler'); 
const path = require('path');
const {actualizarRoommates} = require('../controllers/roommatesController')

const router = express.Router();

//Ruta para obtener todos los gastos
router.get('/',(req,res) =>{
    const gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));
    res.status(200).json(gastos);
});

// Ruta para agregar un nuevo gasto
router.post('/', (req, res) =>{
    try {
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


    // Actualizar los roomates después de agregar un gasto
        actualizarRoommates(roommates,gastos);    


        res.status(201).json(nuevoGasto);
    } catch (error) {
        console.error('Error al agregar un nuevo gasto:',error);
        res.status(500).json({message:'Error al agregar gasto'});
    }
});

//Ruta para eliminar un gasto
router.delete('/:id', (req,res) =>{
    try {
        // Leer los datos actuales de los gastos y los roommates
        let gastos = readDataFromFile(path.join(__dirname, '../data/gastos.json'));
        const roommates = readDataFromFile(path.join(__dirname, '../data/roommates.json'));
        const { id} = req.params;
    
        


        const filteredGastos = gastos.filter((gasto) => gasto.id !== id);
        
        writeDataToFile(path.join(__dirname,'../data/gastos.json'),filteredGastos);

        // Actualizar los roommates después de eliminar un gasto
        actualizarRoommates(roommates, filteredGastos);

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar el gasto:',error);
        res.status(500).json({message: 'Error al eliminar el gasto'});
    }
});

//Ruta para actualizar un gasto
router.put('/:id', (req,res) =>{
    try {
        // Leer los datos actuales de los gastos y los roommates
        let gastos = readDataFromFile(path.join(__dirname,'../data/gastos.json'));
        const roommates = readDataFromFile(path.join(__dirname, '../data/roommates.json'));
        const { id} = req.params;
        const { roommate,descripcion,monto } = req.body;
        
        

        const updatedGasto = gastos.map((gasto)=>{
            if(gasto.id === id){
                return {...gasto, roommate, descripcion, monto};
            }
            return gasto;
        });

        writeDataToFile(path.join(__dirname,'../data/gastos.json'),updatedGasto);

        // Actualizar los roommates después de modificar un gasto
        actualizarRoommates(roommates, updatedGasto);

        res.status(200).json(updatedGasto.find(gasto=>gasto.id === id));
    } catch (error) {
        console.error('Error al actualizar el gasto:',error);
        res.status(500).json({message:'Error al actualizar el gasto'})
    }
});

module.exports = router;
