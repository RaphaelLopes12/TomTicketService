const axios = require('axios');
const prisma = require('../database/prismaClient');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { format } = require('date-fns');
require('dotenv').config();

const BASE_URL = 'https://api.tomticket.com/v2.0/ticket/list';
const API_TOKEN = process.env.API_TOKEN;
const PAGE_SIZE = 50;
const TIME_ZONE_OFFSET = '-0300';

async function loadInitialTickets() {
    logger.info('Iniciando a carga inicial de tickets...');
    const now = new Date();
    let lastExecution;

    try {
        lastExecution = await prisma.executionLog.findFirst({
            where: { status: 'success' },
            orderBy: { executedAt: 'desc' },
        });

        const lastUpdateGe = lastExecution
        ? `${format(lastExecution.executedAt, 'yyyy-MM-dd HH:mm:ss')}${TIME_ZONE_OFFSET}`
        : null;
    
        const formattedLastUpdateGe = lastUpdateGe?.replace(/([+-]\d{2}):(\d{2})/, '$1$2');

        logger.info(`Última execução bem-sucedida: ${formattedLastUpdateGe || 'Nenhuma execução anterior encontrada.'}`);

        let page = 1;
        let totalLoaded = 0;

        const existingCustomers = await prisma.customer.findMany({
            select: { email: true, id: true },
        });

        const customerMap = new Map(existingCustomers.map(c => [c.email, c.id]));

        while (true) {
            logger.info(`Buscando página ${page}...`);

            const url = `${BASE_URL}?page=${page}&size=${PAGE_SIZE}${lastUpdateGe ? `&last_update_ge=${encodeURIComponent(lastUpdateGe)}` : ''}`;
            logger.info(`URL gerada: ${url}`);

            const response = await axios.get(url, {
                headers: { Authorization: API_TOKEN },
            });

            const tickets = response.data.data;
            if (!tickets || tickets.length === 0) {
                logger.warn(`Nenhum ticket encontrado na página ${page}.`);
                break;
            }

            logger.info(`Recebidos ${tickets.length} tickets na página ${page}.`);

            const customersToInsert = [];
            const ticketsToInsert = [];

            for (const ticket of tickets) {
                const customer = ticket.customer;
                let customerId = null;

                if (customer && customer.email) {
                    if (customerMap.has(customer.email)) {
                        customerId = customerMap.get(customer.email);
                    } else {
                        customerId = uuidv4();
                        customerMap.set(customer.email, customerId);
                        customersToInsert.push({
                            id: customerId,
                            name: customer.name,
                            email: customer.email,
                        });
                    }
                }

                ticketsToInsert.push({
                    id: uuidv4(),
                    protocol: ticket.protocol.toString(),
                    subject: ticket.subject,
                    message: ticket.message,
                    mimetype: ticket.mimetype,
                    priority: ticket.priority,
                    ticketType: ticket.ticket_type,
                    creationDate: new Date(ticket.creation_date),
                    situation: ticket.situation?.description,
                    categoryId: ticket.category?.id,
                    categoryName: ticket.category?.name,
                    departmentId: ticket.department?.id,
                    departmentName: ticket.department?.name,
                    operatorId: ticket.operator?.id,
                    operatorName: ticket.operator?.name,
                    statusId: ticket.status?.id,
                    statusDesc: ticket.status?.description,
                    statusDate: ticket.status?.apply_date ? new Date(ticket.status.apply_date) : null,
                    organizationId: ticket.customer?.organization?.id,
                    organizationName: ticket.customer?.organization?.name,
                    customerId,
                });
            }

            await prisma.$transaction(async (prisma) => {
                if (customersToInsert.length > 0) {
                    await prisma.customer.createMany({
                        data: customersToInsert,
                        skipDuplicates: true, 
                    });
                }

                if (ticketsToInsert.length > 0) {
                    await prisma.ticket.createMany({
                        data: ticketsToInsert,
                        skipDuplicates: true,
                    });
                }
            });

            totalLoaded += tickets.length;

            if (!response.data.next_page) break;
            page++;
        }

        await prisma.executionLog.create({
            data: {
                id: uuidv4(),
                executedAt: now,
                status: 'success',
                message: `Carga concluída com ${totalLoaded} tickets carregados.`,
            },
        });
    
        logger.info(`Carga inicial concluída. Total de tickets carregados: ${totalLoaded}.`);
        return { message: `Carga inicial concluída. ${totalLoaded} tickets carregados.` };
    }
    catch (error) {
        logger.error(`Erro ao carregar tickets: ${error.message}`);
        await prisma.executionLog.create({
            data: {
                id: uuidv4(),
                executedAt: now,
                status: 'failure',
                message: error.message,
            },
        });

        throw error;
    }

}

module.exports = {
    loadInitialTickets,
};
