const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://raphaelferreiralopes.com.br',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
