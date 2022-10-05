-- CreateEnum
CREATE TYPE "DLedger" AS ENUM ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense');

-- CreateEnum
CREATE TYPE "CLedger" AS ENUM ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense');

-- CreateEnum
CREATE TYPE "Sale" AS ENUM ('Buy', 'Sale');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" SERIAL NOT NULL,
    "Report Type" TEXT,
    "Asset Type" TEXT,
    "Asset" TEXT,
    "Account" TEXT,
    "Counterparty" TEXT DEFAULT '',
    "Quantity" REAL,
    "Basis Date" TIMESTAMP(3),
    "Proceed Date" TIMESTAMP(3),
    "Token Price" REAL,
    "Gross Proceed" REAL,
    "Total Price" REAL,
    "Price Symbol" TEXT,
    "Basis Price" REAL,
    "Cost of Basis" REAL,
    "Net" REAL DEFAULT 0,
    "Transaction Type" TEXT,
    "Duration" TEXT,
    "Block" INTEGER,
    "Transaction ID" TEXT,
    "Note" TEXT,
    "Index" INTEGER,
    "Account_Ownership" TEXT,
    "CounterParty_Ownership" TEXT,
    "internal" TEXT,

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingJE" (
    "id" SERIAL NOT NULL,
    "Entity" TEXT,
    "Wallet" TEXT,
    "Asset" TEXT,
    "Proceed_Date" TIMESTAMP(3),
    "Ledger_Type1" TEXT,
    "Ledger_Type2" TEXT,
    "Ledger_Name" TEXT,
    "Debit" REAL DEFAULT 0,
    "Credit" REAL DEFAULT 0,
    "CryptoDBid" INTEGER NOT NULL,
    "Duration" TEXT,

    CONSTRAINT "AccountingJE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" SERIAL NOT NULL,
    "Transaction Type" TEXT,
    "Dledger" "DLedger",
    "DLedger_SType" TEXT DEFAULT 'Liquid',
    "Cledger" "CLedger",
    "CLedger_SType" TEXT DEFAULT 'Deferred Revenue',
    "Realized" BOOLEAN DEFAULT false,
    "Realized_Type" TEXT,
    "Sale" "Sale",
    "Notes" TEXT,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Output" (
    "id" SERIAL NOT NULL,
    "Report Type" TEXT,
    "Asset Type" TEXT,
    "Asset" TEXT,
    "Account" TEXT,
    "Counterparty" TEXT DEFAULT '',
    "Quantity" REAL,
    "Basis Date" TIMESTAMP(3),
    "Proceed Date" TIMESTAMP(3),
    "Token Price" REAL,
    "Gross Proceed" REAL,
    "Total Price" REAL,
    "Price Symbol" TEXT,
    "Basis Price" REAL,
    "Cost of Basis" REAL,
    "Net" REAL DEFAULT 0,
    "Transaction Type" TEXT,
    "Duration" TEXT,
    "Block" INTEGER,
    "Transaction ID" TEXT,
    "Note" TEXT,
    "Ownership Type" TEXT,
    "Index" INTEGER,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" SERIAL NOT NULL,
    "cp_account" TEXT,
    "entity_type" TEXT,
    "action" BOOLEAN DEFAULT true,

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hive_id_key" ON "Hive"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AccountingJE_id_key" ON "AccountingJE"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_id_key" ON "Ledger"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Output_id_key" ON "Output"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Counterparty_id_key" ON "Counterparty"("id");

-- AddForeignKey
ALTER TABLE "AccountingJE" ADD CONSTRAINT "AccountingJE_CryptoDBid_fkey" FOREIGN KEY ("CryptoDBid") REFERENCES "Hive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
