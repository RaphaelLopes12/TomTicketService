const express = require('express');
const dotenv = require('dotenv');
const ticketRoutes = require('./routes/tickets');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
