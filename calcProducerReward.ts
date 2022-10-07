import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function producerReward() {
  //find all the coding needed for every transaction type from the ledger table to apply it to the Accounting JE table where realized Gain/Loss does not need to be calculated

  //tokens received is a seperate script to handle the tribe vs not tribe logic

  const findAllJeCoding = await prisma.ledger.findMany({
    where: { Realized: false, Transaction_Type: "PRODUCER_REWARD" },
    select: {
      id: true,
      Transaction_Type: true,
      Dledger: true,
      DLedger_SType: true,
      Cledger: true,
      CLedger_SType: true,
      Realized: true,
      Sale: true,
    },
  });

  //the below for loop finds all the transactions that match the  transaction type (see the where clause)note all the tranaction types must exist in the legder table before this script will run correctly
  for (const elementJeCoding of findAllJeCoding) {
    /* (below) will pull the coding from the ledger table which should be equal to where the loop is in the array */

    let debitLedgerType = elementJeCoding.Dledger;
    let creditLedgerType = elementJeCoding.Cledger;
    let creditLedger = elementJeCoding.CLedger_SType;
    let debitLedger = elementJeCoding.DLedger_SType;

    //if the transaction type returns a true for the realized field that indicates realized needs to be calculated so the script will run the following script

    const findTransactionsTypeForThisLoop = await prisma.hive.findMany({
      distinct: ["id"],
      select: {
        id: true,
        Account_Ownership: true,
        Asset_Type: true,
        Asset: true,
        Account: true,
        Counterparty: true,
        Proceed_Date: true,
        Token_Price: true,
        Price_Symbol: true,
        Gross_Proceed: true,
        Cost_of_Basis: true,
        Net: true,
        Transaction_Type: true,
        Duration: true,
      },
      where: {
        Transaction_Type: elementJeCoding?.Transaction_Type,
      },

      // if you want to do a test run uncomment the below line
      // take: 3,
    });

    for (const createJELineElement of findTransactionsTypeForThisLoop) {
      if (elementJeCoding.Sale === "Sale") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        let storeString = createJELineElement?.Price_Symbol;
        let storeString2 = createJELineElement?.Asset;

        createJELineElement.Asset = storeString;
        createJELineElement.Price_Symbol = storeString2;
      }
      if (elementJeCoding.Sale === "Buy") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        let storeString = createJELineElement?.Price_Symbol;
        let storeString2 = createJELineElement?.Asset;

        createJELineElement.Asset = storeString2;
        createJELineElement.Price_Symbol = storeString;
      }

      const createAllDebit = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: createJELineElement.Asset,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: debitLedgerType,
          Ledger_Type2: debitLedger,
          Ledger_Name: createJELineElement.Transaction_Type,
          Debit: createJELineElement?.Gross_Proceed,
          Duration: createJELineElement?.Duration,
          hive: {
            connect: {
              id: createJELineElement?.id,
            },
          },
        },
      });

      const createAllCredit = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: createJELineElement.Price_Symbol,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: creditLedgerType,
          Ledger_Type2: creditLedger,
          Ledger_Name: createJELineElement.Transaction_Type,
          Credit: createJELineElement?.Gross_Proceed,
          Duration: createJELineElement?.Duration,
          hive: {
            connect: {
              id: createJELineElement?.id,
            },
          },
        },
      });
    }

    // if you want to see your script running on a larger data set
    console.log(elementJeCoding.Transaction_Type, " process completed");
  }
}

////----end of  producerReward function---------------------------------------

producerReward()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
