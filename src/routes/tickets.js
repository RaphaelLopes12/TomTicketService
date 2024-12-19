const express = require('express');
const ticketService = require('../services/ticketService');

const router = express.Router();

router.get('/load', async (req, res) => {
    try {
        const result = await ticketService.loadInitialTickets();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao carregar tickets.' });
    }
});

module.exports = router;
