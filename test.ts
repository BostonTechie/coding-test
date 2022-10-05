import { PrismaClient } from "@prisma/client";
import { HiveFilter } from "./type";
const prisma = new PrismaClient();

async function calcServiceFeeTransfer() {
  //find all the coding needed for every transaction type where a realized gain / loss needs to be calculated from the ledger table to apply it to the Accounting JE table

  const findAllJeCoding = await prisma.ledger.findMany({
    where: { Realized: true, Transaction_Type: "TRANSFER" },
    select: {
      id: true,
      Transaction_Type: true,
      Dledger: true,
      DLedger_SType: true,
      Cledger: true,
      CLedger_SType: true,
      Sale: true,
      Realized_Type: true,
    },
  });

  //the below for loop finds all the transactions that match the  transaction type (see the where clause)note all the tranaction types must exist in the legder table before this script will run correctly
  for (const elementJeCoding of findAllJeCoding) {
    /* the below will pull the coding from the ledger table which should be equal to where the loop is in the array*/

    let debitLedgerType = elementJeCoding.Dledger;
    let creditLedgerType = elementJeCoding.Cledger;
    let creditLedger = elementJeCoding.CLedger_SType;
    let debitLedger = elementJeCoding.DLedger_SType;
    let realType = elementJeCoding.Realized_Type;

    // toggled realized = true on the find many where clause the beloew calculates that script

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
        Counterparty: {
          in: [
            "privex",
            "postpromoter",
            "buildawhale",
            "upme",
            "appreciator",
            "null",
            "randowhale",
            "anonsteem",
            "upmyvote",
            "sneaky-ninja",
            "smartsteem",
            "lovejuice",
            "boomerang",
            "booster",
            "promobot",
            "pushup",
            "jerrybanfield",
            "msp-bidbot",
            "therising",
            "minnowbooster",
            "upmewhale",
            "familyprotection",
            "rocky1",
            "freedom",
            "ginabot",
            "minnowhelper",
            "paywithsteem",
            "sm-voter",
            "buiildawhale",
            "msp-lovebot",
            "msp-reg",
            "openmic",
            "banjo",
          ],
        },
      },
      // if you want to do a test run uncomment the below line
      take: 3,
    });

    for (const createJELineElement of findTransactionsTypeForThisLoop) {
      let storeStringPriceSymbol = createJELineElement.Price_Symbol;
      let storeStringAsset = createJELineElement.Asset;
      let storeNet = createJELineElement.Net;
      let StoreRealizedSell = "";

      if (elementJeCoding.Sale === "Buy") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        createJELineElement.Asset = storeStringAsset;
        createJELineElement.Price_Symbol = storeStringPriceSymbol;
        StoreRealizedSell = `${storeStringPriceSymbol}`;
      }

      const createAllDebit = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: createJELineElement.Asset,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: debitLedgerType,
          Ledger_Type2: "Business-Services",
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

    // if you want to see your script running on a larger data set
    console.log(elementJeCoding.Transaction_Type, " process completed");
  }
}
////----end of calcServiceFeeTransfer function---------------------------------------

async function calcContractorFeeTransfer() {
  //find all the coding needed for every transaction type where a realized gain / loss needs to be calculated from the ledger table to apply it to the Accounting JE table

  const findAllJeCoding = await prisma.ledger.findMany({
    where: { Realized: true, Transaction_Type: "TRANSFER" },
    select: {
      id: true,
      Transaction_Type: true,
      Dledger: true,
      DLedger_SType: true,
      Cledger: true,
      CLedger_SType: true,
      Sale: true,
      Realized_Type: true,
    },
  });

  //the below for loop finds all the transactions that match the  transaction type (see the where clause)note all the tranaction types must exist in the legder table before this script will run correctly
  for (const elementJeCoding of findAllJeCoding) {
    /* the below will pull the coding from the ledger table which should be equal to where the loop is in the array*/

    let debitLedgerType = elementJeCoding.Dledger;
    let creditLedgerType = elementJeCoding.Cledger;
    let creditLedger = elementJeCoding.CLedger_SType;
    let debitLedger = elementJeCoding.DLedger_SType;
    let realType = elementJeCoding.Realized_Type;

    // toggled realized = true on the find many where clause the beloew calculates that script

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
      },
      where: {
        Transaction_Type: elementJeCoding?.Transaction_Type,
        internal: "external",
        Counterparty: {
          in: [
            "isaria",
            "reazuliqbal",
            "bait002",
            "clayboyn",
            "cryptomancer",
            "eonwarped",
            "lion200",
            "chobro",
            "cupz",
            "r0nd0n",
            "zaxan",
            "swelker101",
            "crimsonclad",
            "victoriabsb",
            "theghost1980",
            "gmuxx",
            "juliakponsford",
            "meno",
            "someguy123",
            "donchate",
            "ausbitbank",
            "discordiant",
            "sircork",
            "kubbyelizabeth",
            "llfarms",
            "rhondak",
            "wanderingartist",
            "hz432creations",
            "ali-h",
            "inertia",
            "crystalhuman",
            "daniarnold",
            "gtg",
            "jesse2you",
            "jestermage",
            "neoxian",
            "suzi3d",
            "thejohalfiles",
            "yabapmatt",
            "bdexchange",
            "heraclio",
            "acidyo",
            "choogirl",
            "creativesoul",
            "danielsaori",
            "exyle",
            "fatpandadesign",
            "globocop",
            "kaylinart",
            "limabeing",
            "ma1neevent",
            "modprobe",
            "otage",
            "paulag",
            "rougebot",
            "slowwalker",
            "soundwavesphoton",
            "sunravelme",
            "swolesome",
            "theprophet0",
            "uniwhisp",
            "princessmewmew",
            "anyx",
            "asgarth",
            "beggars",
            "cryptoctopus",
            "amberyooper",
            "artsygoddess",
            "bearone",
            "birdinc",
            "byzantinist",
            "candycal",
            "carlgnash",
            "carrieallen",
            "clove71",
            "crystalpacheco30",
            "drakos",
            "lexiconical",
            "nealmcspadden",
            "pennsif",
            "picokernel",
            "rakkasan84",
            "reseller",
            "rivalzzz",
            "roelandp",
            "theuxyeti",
            "ty2nicerva",
            "wilhb81",
            "wipgirl",
            "silentscreamer",
            "simgirl",
          ],
        },
      },
      // if you want to do a test run uncomment the below line
      take: 3,
    });

    for (const createJELineElement of findTransactionsTypeForThisLoop) {
      let storeStringPriceSymbol = createJELineElement.Price_Symbol;
      let storeStringAsset = createJELineElement.Asset;
      let storeNet = createJELineElement.Net;
      let StoreRealizedSell = "";

      if (elementJeCoding.Sale === "Buy") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        createJELineElement.Asset = storeStringAsset;
        createJELineElement.Price_Symbol = storeStringPriceSymbol;
        StoreRealizedSell = `${storeStringPriceSymbol}`;
      }

      const createAllDebit = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: createJELineElement.Asset,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: debitLedgerType,
          Ledger_Type2: "Business-Contractors",
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

    // if you want to see your script running on a larger data set
    console.log(elementJeCoding.Transaction_Type, " process completed");
  }
}

////----end of calcContractorFeeTransfer function---------------------------------------

async function Exchange_Transfers() {
  //find all the coding needed for every transaction type where a realized gain / loss needs to be calculated from the ledger table to apply it to the Accounting JE table

  const findAllJeCoding = await prisma.ledger.findMany({
    where: { Realized: true, Transaction_Type: "TRANSFER" },
    select: {
      id: true,
      Transaction_Type: true,
      Dledger: true,
      DLedger_SType: true,
      Cledger: true,
      CLedger_SType: true,
      Sale: true,
      Realized_Type: true,
    },
  });

  //the below for loop finds all the transactions that match the  transaction type (see the where clause)note all the tranaction types must exist in the legder table before this script will run correctly
  for (const elementJeCoding of findAllJeCoding) {
    /* the below will pull the coding from the ledger table which should be equal to where the loop is in the array*/

    let debitLedgerType = elementJeCoding.Dledger;
    let creditLedgerType = elementJeCoding.Cledger;
    let creditLedger = elementJeCoding.CLedger_SType;
    let debitLedger = elementJeCoding.DLedger_SType;
    let realType = elementJeCoding.Realized_Type;

    // toggled realized = true on the find many where clause the beloew calculates that script

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
      },
      where: {
        Transaction_Type: elementJeCoding?.Transaction_Type,
        Counterparty: {
          in: [
            "honey-swap",
            "bittrex",
            "blocktrades",
            "graphene-swap",
            "swap-eth",
            "steem-peg",
            "steem-tokens",
          ],
        },
      },
      // if you want to do a test run uncomment the below line
      take: 3,
    });

    for (const createJELineElement of findTransactionsTypeForThisLoop) {
      let storeStringPriceSymbol = createJELineElement.Price_Symbol;
      let storeStringAsset = createJELineElement.Asset;
      let storeNet = createJELineElement.Net;
      let StoreRealizedSell = "";

      if (elementJeCoding.Sale === "Buy") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        createJELineElement.Asset = storeStringAsset;
        createJELineElement.Price_Symbol = storeStringPriceSymbol;
        StoreRealizedSell = `${storeStringPriceSymbol}`;
      }

      if (elementJeCoding.Sale === "Sale") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        createJELineElement.Asset = storeStringPriceSymbol;
        createJELineElement.Price_Symbol = storeStringAsset;
        StoreRealizedSell = `${storeStringAsset}`;

        // if (storeNet != 0) {
        //   createJELineElement.Gross_Proceed = storeNet;
        // }
      }

      const createAllDebit = await prisma.accountingJE.create({
        data: {
          Entity: createJELineElement?.Account_Ownership,
          Wallet: createJELineElement?.Account,
          Asset: createJELineElement.Asset,
          Proceed_Date: createJELineElement?.Proceed_Date,
          Ledger_Type1: "Asset",
          Ledger_Type2: "Liquid",
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
          Ledger_Type1: "Asset",
          Ledger_Type2: "Liquid",
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
            Ledger_Type2: "Realized (Gains) /Loss - on exchange",
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
            Ledger_Type2: "Realized (Gains) /Loss - on exchange",
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

    // if you want to see your script running on a larger data set
    console.log(elementJeCoding.Transaction_Type, " process completed");
  }
}

////----end of Exchange_Transfers function----------------------------------------------

async function NFT_Transfers() {
  //find all the coding needed for every transaction type where a the transaction type is tranfer but the counterparty is not recieving a Token like Hive, but a NFT card that has in fact been tokenized

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
    },
    where: {
      Transaction_Type: "TRANSFER",
      Counterparty: {
        in: [
          "peakmonsters",
          "steemmonsters",
          "steem-mart",
          "positive-trail",
          "sm-fundition",
          "patelincho",
          "splinterlands",
        ],
      },
    },
    // if you want to do a test run uncomment the below line
    take: 3,
  });

  for (const createJELineElement of findTransactionsTypeForThisLoop) {
    // console.log(createJELineElement);
    const createAllDebit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Accumlated Deprecition - NFT",
        Ledger_Name: createJELineElement?.Transaction_Type,
        Debit: createJELineElement?.Cost_of_Basis,
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
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Illiquid-NFT-Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
        Credit: createJELineElement?.Cost_of_Basis,
        Duration: createJELineElement?.Duration,
        hive: {
          connect: {
            id: createJELineElement?.id,
          },
        },
      },
    });

    // console.log(createJELineElement);
    const createOCIDebit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Liquid-NFT-Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
        Debit: createJELineElement?.Gross_Proceed,
        Duration: createJELineElement?.Duration,
        hive: {
          connect: {
            id: createJELineElement?.id,
          },
        },
      },
    });

    const createAllOCICredit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Revenue",
        Ledger_Type2: "Gain on NFT Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
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
  console.log("NFT Transfers process completed");
}

////----end of NFT_Transfers function---------------------------------------

async function NFT_Received() {
  //find all the coding needed for every transaction type where a the transaction type is tranfer but the counterparty is not recieving a Token like Hive, but a NFT card that has in fact been tokenized

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
    },
    where: {
      Transaction_Type: "RECEIVED",
      Counterparty: {
        in: [
          "peakmonsters",
          "steemmonsters",
          "steem-mart",
          "positive-trail",
          "sm-fundition",
          "patelincho",
          "splinterlands",
        ],
      },
    },
    // if you want to do a test run uncomment the below line
    take: 3,
  });

  for (const createJELineElement of findTransactionsTypeForThisLoop) {
    // console.log(createJELineElement);
    const createAllDebit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Illiquid-NFT-Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
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
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Liquid-NFT-Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
        Credit: createJELineElement?.Gross_Proceed,
        Duration: createJELineElement?.Duration,
        hive: {
          connect: {
            id: createJELineElement?.id,
          },
        },
      },
    });

    // console.log(createJELineElement);
    const createOCIDebit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Expense",
        Ledger_Type2: "Depreciation-NFT-Transfer",
        Ledger_Name: createJELineElement?.Transaction_Type,
        Debit: createJELineElement?.Gross_Proceed,
        Duration: createJELineElement?.Duration,
        hive: {
          connect: {
            id: createJELineElement?.id,
          },
        },
      },
    });

    const createAllOCICredit = await prisma.accountingJE.create({
      data: {
        Entity: createJELineElement?.Account_Ownership,
        Wallet: createJELineElement?.Account,
        Asset: createJELineElement.Asset,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Ledger_Type1: "Asset",
        Ledger_Type2: "Accumlated Deprecition - NFT",
        Ledger_Name: createJELineElement?.Transaction_Type,
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
  console.log("NFT Transfers process completed");
}

////----end of NFT_Received function---------------------------------------

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
    take: 1,
  });

  console.log(findTransactionsTypeForThisLoop);
}

////----end of Remaining_Transfers function---------------------------------------

// calcServiceFeeTransfer()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

// calcContractorFeeTransfer()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

// Exchange_Transfers()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

// NFT_Transfers()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

// NFT_Received()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

Remaining_Transfers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
