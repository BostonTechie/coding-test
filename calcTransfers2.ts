import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function Remaining_Transfers() {
  // this function will run through any remaining tranfers that were not processed by the above script because they, for whatever reason, did not meet the permiters established there.  Therefore this function must run last in order to catch what remains

  const findTransactionsTypeForThisLoop = await prisma.hive.findMany({
    distinct: ["id"],
    select: {
      id: true,
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
      Account_Ownership: true,
      accountingJE: true,
    },
    where: {
      Transaction_Type: "TRANSFER",
      accountingJE: {
        none: {},
      },
    },
    // if you want to do a test run uncomment the below line
    take: 3,
  });

  for (const createJELineElement of findTransactionsTypeForThisLoop) {
    let storeStringPriceSymbol = createJELineElement.Price_Symbol;
    let storeStringAsset = createJELineElement.Asset;
    let storeNet = createJELineElement.Net;
    let StoreRealizedSell = createJELineElement.Transaction_Type;

    /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

    createJELineElement.Asset = storeStringPriceSymbol;
    createJELineElement.Price_Symbol = storeStringAsset;
    StoreRealizedSell = `${storeStringAsset}`;
    let debitLedgerType = "Expense";
    let debitLedger = "Transfer-Expense-All";
    let creditLedgerType = "Asset";
    let creditLedger = "Liquid";
    let realType = "Realized (Gain) /Loss";

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
        Credit: createJELineElement?.Cost_of_Basis,
        Duration: createJELineElement?.Duration,
        hive: {
          connect: {
            id: createJELineElement?.id,
          },
        },
      },
    });

    if (createJELineElement.Net === null || storeNet === 0) {
      /* the if (above) estential does nothing in the case that net (realized gain/ loss) is equal to zero or null. In either case You wouldn't want a script to process a journal entry.  It may be useful to have a log of nulls though for debuging */
    } else if (createJELineElement.Net < 0) {
      createJELineElement.Net = Math.abs(createJELineElement.Net);

      const createAllDRealized = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: StoreRealizedSell,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: "Revenue",
          Ledger_Type2: realType,
          Ledger_Name: createJELineElement.Transaction_Type,
          Debit: createJELineElement.Net,
          Duration: createJELineElement?.Duration,
          hive: {
            connect: {
              id: createJELineElement?.id,
            },
          },
        },
      });
    } else {
      const createAllCRealized = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: StoreRealizedSell,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: "Revenue",
          Ledger_Type2: realType,
          Ledger_Name: createJELineElement.Transaction_Type,
          Credit: createJELineElement.Net,
          Duration: createJELineElement?.Duration,
          hive: {
            connect: {
              id: createJELineElement?.id,
            },
          },
        },
      });
    }
  }
  console.log("Remaining Transfers process completed");
}

////----end of Remaining_Transfers function---------------------------------------

Remaining_Transfers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
