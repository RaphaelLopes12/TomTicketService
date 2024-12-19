# TomTicketService

Este projeto foi desenvolvido para integração com a API da TomTicket, permitindo realizar a carga de tickets para um banco de dados local.

## Tecnologias Utilizadas

- **Node.js**: Plataforma principal para o desenvolvimento.
- **Prisma**: ORM utilizado para gerenciar o banco de dados e realizar as migrações.
- **Winston**: Gerenciamento de logs.
- **Axios**: Para realizar requisições HTTP à API da TomTicket.
- **Dotenv**: Para gerenciamento de variáveis de ambiente.

## Funcionalidades Principais

- **Carga inicial de tickets**: Faz uma busca de tickets na API da TomTicket e armazena no banco de dados.
- **Persistência de dados**: Utiliza Prisma para salvar os dados no banco.
- **Logs detalhados**: Usa o Winston para gerar logs informativos e de erro durante a execução.
- **Gerenciamento de clientes**: Cria ou atualiza informações de clientes associadas aos tickets.

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 16 ou superior)
- **NPM** ou **Yarn**
- **Docker** (opcional, caso deseje rodar o banco em um container)

## Configuração do Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/tomticket-service.git
   ```

2. Entre no diretório do projeto:
   ```bash
   cd tomticket-service
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/tomticket_db
   API_TOKEN=seu_token_tomticket
   ```

5. Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   npx prisma migrate dev
   ```

## Como Usar

### Executar o Projeto Localmente

1. Inicie o servidor:
   ```bash
   npm start
   ```

2. O servidor estará disponível na porta `3000` por padrão. Você pode alterar a porta no código se necessário.

3. Acesse a rota de carga inicial (exemplo):
   ```bash
   http://localhost:3000/tickets/load
   ```

### Estrutura de Diretórios

- **src/**: Contém o código-fonte principal.
  - **services/**: Lógica principal para carregar tickets.
  - **routes/**: Definição de rotas da aplicação.
  - **database/**: Configuração do Prisma.
  - **utils/**: Configurações e utilitários, como gerenciamento de logs.
- **prisma/**: Configurações e migrações do Prisma.

### Logs

Os logs são gerados usando o Winston e podem ser encontrados no arquivo `app.log`.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Qualquer dúvida, entre em contato.
