const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:4200',
    'https://raphaelferreiralopes.com.br',
    'http://raphaelferreiralopes.com.br',
    'http://161.35.183.249:4000',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
