-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT,
    "mimetype" TEXT,
    "priority" INTEGER NOT NULL,
    "ticketType" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "situation" TEXT,
    "categoryId" TEXT,
    "categoryName" TEXT,
    "departmentId" TEXT,
    "departmentName" TEXT,
    "operatorId" TEXT,
    "operatorName" TEXT,
    "statusId" TEXT,
    "statusDesc" TEXT,
    "statusDate" TIMESTAMP(3),
    "customerId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_protocol_key" ON "Ticket"("protocol");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
