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

router.get('/', async (req, res) => {
    try {
        const { page, size, status, priority, dateFrom, dateTo, sortField, sortOrder } = req.query;

        const filters = { status, priority, dateFrom, dateTo };
        const sort = sortField ? { field: sortField, order: sortOrder } : {};

        const result = await ticketService.getTickets({
            page: Number(page) || 1,
            size: Number(size) || 10,
            filters,
            sort,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar tickets.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.getTicketById(id);
        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Ticket não encontrado.' });
    }
});

module.exports = router;
