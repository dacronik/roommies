const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { readDataFromFile, writeDataToFile } = require('../controllers/fileHandler'); 
const axios = require('axios');
const router = express.Router();
const path = require('path');

// Ruta para obtener todos los roommates
router.get('/', (req, res) => {
    const roommates = readDataFromFile(path.join(__dirname, '../data/roommates.json'));
    res.status(200).json(roommates);
});

// Ruta para agregar un nuevo roommate
router.post('/', async (req, res) => {
    try {
        // Obtener un nuevo roommate aleatorio desde la API randomuser.me
        const response = await axios.get('https://randomuser.me/api/');
        const randomUser = response.data.results[0];

        // Crear un nuevo objeto de roommate
        const newRoommate = {
            id: uuidv4(),
            nombre: `${randomUser.name.first} ${randomUser.name.last}`,
            debe: 0,
            recibe: 0,
        };

        const roommates = readDataFromFile(path.join(__dirname, '../data/roommates.json'));
        roommates.push(newRoommate);
        writeDataToFile(path.join(__dirname, '../data/roommates.json'), roommates);

        console.log('Nuevo Roommate:', newRoommate);

        res.status(201).json(newRoommate);

    } catch (error) {
        console.error('Error al obtener un roommate aleatorio:', error);
        res.status(500).json({ message: 'Error al obtener un roommate aleatorio' });
    }
});

module.exports = router;