import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const usersWithSomePosts = await prisma.hive.findMany({
    where: {
      id: {
        in: [
          2003725, 2003778, 1634485, 1634486, 1636662, 1, 2, 3, 677, 694, 695,
          641526, 710619, 710620, 1444790, 1444791, 1444792, 1904251, 13, 94,
          100, 21, 38, 43, 1432353, 1439138, 1439483, 1909749, 1464949, 1465502,
          1465545, 1465850, 1467563, 1475155, 1446628, 1446630, 1446631,
          1465863, 1465864, 1475326, 253735, 265400, 276755, 1645475, 1645476,
          1899214, 1432395, 1439520, 1440231, 882, 957, 959, 1910784, 1910785,
          1910786, 486280, 1432206, 1432272, 204, 597, 1620, 1530122, 1531328,
          1531687, 1596913, 1598180, 1598751, 1465567, 1465849, 1465866,
          1477423, 1477773, 1480630, 1465865, 1465867, 1475948, 6829, 6873,
          6904, 797, 986, 1204, 1963442, 1966652, 1966704, 14, 96, 115, 1665505,
          1669116, 1677087, 1445738, 1557936, 1599201, 1439037, 1439314,
          1439386, 22, 23, 26, 355479, 1447432, 1466242, 1695479, 1963443,
          1966653, 1966703, 706, 798, 855, 486279, 1444391, 1444801, 1439381,
          1439420, 1439427, 1444632, 1444823, 1445159, 1676384, 1685918,
          1689158,
        ],
      },
    },
  });

  for (const createJELineElement of usersWithSomePosts) {
    const createAllCredit = await prisma.output.create({
      data: {
        id: createJELineElement?.id,
        Report_Type: createJELineElement?.Report_Type,
        Asset_Type: createJELineElement?.Asset_Type,
        Asset: createJELineElement?.Asset,
        Account: createJELineElement?.Account,
        Counterparty: createJELineElement?.Counterparty,
        Quantity: createJELineElement?.Quantity,
        Basis_Date: createJELineElement?.Basis_Date,
        Proceed_Date: createJELineElement?.Proceed_Date,
        Token_Price: createJELineElement?.Token_Price,
        Gross_Proceed: createJELineElement?.Gross_Proceed,
        Total_Price: createJELineElement?.Total_Price,
        Price_Symbol: createJELineElement?.Price_Symbol,
        Basis_Price: createJELineElement?.Basis_Price,
        Cost_of_Basis: createJELineElement?.Cost_of_Basis,
        Net: createJELineElement?.Net,
        Transaction_Type: createJELineElement?.Transaction_Type,
        Duration: createJELineElement?.Duration,
        Block: createJELineElement?.Block,
        Transaction_ID: createJELineElement?.Transaction_ID,
        Note: createJELineElement?.Note,
        Ownership: createJELineElement?.Ownership,
        Index: createJELineElement?.Index,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
    console.log("disconect");
  });
