const cron = require('node-cron');
const ticketService = require('./services/ticketService');
const logger = require('./utils/logger');

logger.info('Iniciando o cron local.');

cron.schedule('* * * * *', async () => {
    logger.info('Executando cron job...');
    try {
        await ticketService.loadInitialTickets();
        logger.info('Cron job executado com sucesso.');
    } catch (error) {
        logger.error(`Erro no cron job: ${error.message}`);
    }
});
