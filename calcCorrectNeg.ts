import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function RemoveNegDebit() {
  const findNegs = await prisma.accountingJE.deleteMany({
    where: {
      id: {
        in: [
          14716, 14819, 14836, 14853, 15036, 15052, 15069, 16231, 16248, 16264,
          16281, 16466, 16480, 16494, 16589, 16603, 16617, 16630, 16643, 16657,
          17249, 17264, 17305, 17371, 17382, 17392, 17403, 17989, 18010, 18021,
          18032, 18041, 18152, 18164, 18174, 18184, 18195, 18216, 18237, 18248,
          18259, 18269, 18280, 18291, 18301, 18312, 18323, 18333, 18344, 18355,
          18366, 18376, 18387, 18398, 18408, 18419, 18430, 18440, 18450, 18461,
          18471, 18482, 18493, 18503, 18514, 18525, 18535, 18546, 18556, 18620,
          18631, 18641, 18653, 18664, 18673, 18684, 18695, 18705, 18716, 18739,
          18749, 18760, 18813, 18824, 18834, 18845, 18856, 18866, 18878, 18889,
          18900, 18910, 18921, 18932, 18942, 18953, 18963, 18974, 18985, 18996,
          19007, 19017, 19028, 19038, 19060, 19070, 19081, 19092, 19102, 19134,
          19144, 19155, 19165, 19176, 19187, 19197, 19208, 19229, 19239, 19250,
          19260, 19271, 19281, 19292, 19302, 19313, 19323, 19334, 19345, 19355,
          19366, 19376, 19387, 19397, 19408, 19419, 19429, 19440, 19451, 19461,
          19472, 19482, 19493, 19503, 19514, 19524, 19535, 19545, 19556, 19567,
          19577, 19588, 19598, 19609, 19619, 19630, 19640, 19651, 19662, 19672,
          19683, 19693, 19703, 19713, 19724, 19735, 19745, 19756, 19766, 19777,
          19788, 19798, 19809, 19819, 19830, 19840, 19851, 19861, 19872, 19882,
          19893, 19903, 19914, 19924, 19935, 19945, 19956, 19966, 19977, 19987,
          19998, 20008, 20019, 20029, 20040, 20051, 20061, 20072, 20082, 20093,
          20103, 20114, 20125, 20135, 20146, 20156, 20167, 20178, 20188, 20199,
          20209, 20220, 20230, 20241, 20252, 20262, 20273, 20283, 20294, 20304,
          20316, 20327, 20337, 20348, 20358, 20369, 20379, 20390, 20401, 20411,
          20422, 20432, 20443, 20453, 20464, 20475, 20485, 20496, 20506, 20517,
          20527, 20538, 20549, 20559, 20570, 20580, 20591, 20601, 20612, 20622,
          20633, 20643, 20654, 20665, 20675, 20686, 20696, 20707, 20717, 20728,
          20738, 20749, 20759, 20770, 20781, 20791, 20802, 20812, 20823, 20833,
          20844, 20854, 20865, 20876, 20886, 20897, 20907, 20918, 20928, 20939,
          20949, 20960, 20972, 20982, 20993, 21003, 21014, 21023, 21034, 21044,
          21055, 21065, 21075, 21086, 21097, 21107, 21118, 21128, 21139, 21149,
          21160, 21170, 21181, 21191, 21202, 21212, 21223, 21233, 21244, 21254,
          21265, 21275, 21286, 21296, 21307, 21317, 21328, 21338, 21349, 21359,
          21370, 21380, 21391, 21401, 21412, 21423, 21433, 21444, 21454, 21465,
          21475, 21486, 21496, 21506, 21517, 21528, 21538, 21549, 21559, 21569,
          21580, 21590, 21601, 21611, 21622, 21632, 21643, 21653, 21664, 21675,
          21685, 21696, 21706, 21717, 21729, 21739, 21750, 21760, 21771, 21781,
          21792, 21802, 21813, 21823, 21834, 21844, 21855, 21865, 21876, 21886,
          21897, 21907, 21918, 21928, 21939, 21949, 21960, 21970, 21981, 21991,
          22001, 22011, 22022, 22032, 22043, 22053, 22064, 22074, 22085, 22095,
          22106, 22116, 22128, 22138, 22149, 22159, 22171, 22182, 22192, 22203,
          22213, 22222, 22233, 22244, 22254, 22265, 22275, 22285, 22296, 22306,
          22316, 22326, 22337, 22347, 22358, 22368, 22379, 22390, 22400, 22410,
          22421, 22431, 22442, 22452, 22464, 22474, 22485, 22495, 22505, 22516,
          22526, 22537, 22548, 22559, 22569, 22579, 22590, 22600, 22612, 22622,
          22632, 22642, 22653, 22663, 22673, 22684, 22694, 22705, 22715, 22725,
          22736, 22747, 22757, 22768, 22779, 22789, 22799, 22809, 22821, 22831,
          22841, 22852, 22862, 22873, 22883, 22893, 22904, 22914, 22925, 22935,
          22945, 22956, 22966, 22977, 22987, 22997, 23008, 23018, 23029, 23039,
          23050, 23060, 23071, 23082, 23093, 23104, 23114, 23124, 23135, 23145,
          23155, 23166, 23176, 23187, 23197, 23208, 23218, 23229, 23239, 23249,
          23260, 23270, 23281, 23291, 23301, 23312, 23322, 23333, 23343, 23354,
          23364, 23373, 23384, 23394, 23404, 23415, 23426, 23437, 23447, 23458,
          23468, 23479, 23489, 23500, 23510, 23520, 23531, 23541, 23553, 23563,
          23574, 23584, 23595, 23605, 23616, 23626, 23637, 23647, 23657, 23668,
          23678, 23689, 23699, 23709, 23720, 23730, 23740, 23751, 23761, 23772,
          23782, 23792, 23803, 23813, 23824, 23834, 23844, 23855, 23865, 23875,
          23885, 23895, 23905, 23916, 23926, 23936, 23947, 23957, 23968, 23978,
          23989, 24000, 24010, 24021, 24031, 24041, 24052, 24062, 24073, 24083,
          24094, 24104, 24114, 24125, 24135, 24145, 24156, 24166, 24176, 24186,
          24197, 24207, 24216, 24227, 24237, 24248, 24258, 24268, 24279, 24289,
          24300, 24310, 24320, 24331, 24341, 24351, 24362, 24372, 24383, 24393,
          24403, 24414, 24424, 24434, 24445, 24455, 24465, 24476, 24487, 24498,
          24508, 24519, 24529, 24539, 24550, 24560, 24571, 24581, 24591, 24602,
          24612, 24622, 24633, 24643, 24654, 24664, 24674, 24684, 24695, 24705,
          24715, 24725, 24736, 24746, 24757, 24767, 24777, 24788, 24798, 24808,
          24819, 24829, 24839, 24850, 24860, 24870, 24881, 24891, 24901, 24912,
          24922, 24932, 24943, 24953, 24963, 24973, 24984, 24994, 25004, 25014,
          25025, 25035, 25046, 25056, 25066, 25077, 25087, 25097, 25108, 25118,
          25128, 25138, 25148, 25159, 25169, 25179, 25190, 25200, 25210, 25219,
          25230, 25241, 25251, 25262, 25272, 25283, 25293, 25303, 25314, 25324,
          25334, 25344, 25355, 25365, 25375, 25386, 25396, 25406, 25417, 25427,
          25437, 25447, 25457, 25467, 25478, 25488, 25498, 25508, 25519, 25529,
          25539, 25549, 25560, 25570, 25580, 25590, 25600, 25611, 25621, 25631,
          25642, 25652, 25663, 25674, 25685, 25695, 25705, 25715, 25726, 25736,
          25747, 25757, 25767, 25778, 25789, 25799, 25810, 25820, 25831, 25841,
          25851, 25861, 25872, 25882, 25893, 25903, 25913, 25924, 25935, 25945,
          25956, 25966, 25976, 25986, 25997, 26007, 26016, 26028, 26039, 26049,
          26060, 26070, 26080, 26090, 26101, 26111, 26121, 26132, 26142, 26152,
          26163, 26173, 26182, 26192, 26203, 26213, 26224, 26234, 26244, 26255,
          26265, 26275, 26285, 26295, 26305, 26316, 26327, 26337, 26347, 26357,
          26368, 26378, 26388, 26398, 26409, 26419, 26429, 26440, 26450, 26460,
          26470, 26481, 26491, 26501, 26511, 26522, 26532, 26542, 26553, 26563,
          26573, 26584, 26594, 26604, 26615, 26625, 26637, 26647, 26657, 26668,
          26678, 26688, 26698, 26709, 26719, 26729, 26740, 26750, 26760, 26770,
          26781, 26791, 26801, 26812, 26822, 26832, 26842, 26853, 26863, 26874,
          26884, 26894, 26904, 26915, 26925, 26934, 26945, 26955, 26966, 26976,
          26986, 26996, 27007, 27017, 27027, 27038, 27048, 27058, 27069, 27079,
          27089, 27099, 27110, 27120, 27130, 27141, 27151, 27161, 27171, 27181,
          27192, 27202, 27212, 27223, 27233, 27243, 27254, 27264, 27274, 27285,
          27295, 27305, 27316, 27326, 27336, 27347, 27357, 27367, 27378, 27388,
          27398, 27409, 27419, 27429, 27440, 27450, 27460, 27470, 27481, 27491,
          27501, 27511, 27522, 27532, 27542, 27552, 27562, 27573, 27583, 27593,
          27603, 27614, 27624, 27634, 27645, 27655, 27665, 27675, 27686, 27696,
          27706, 27717, 27727, 27737, 27747, 27758, 27768, 27778, 27788, 27799,
          27809, 27819, 27829, 27840, 27850, 27860, 27871, 27881, 27890, 27901,
          27912, 27921, 27931, 27941, 27951, 27962, 27973, 27983, 27994, 28004,
          28014, 28025, 28035, 28045, 28055, 28066, 28076, 28087, 28098, 28108,
          28118, 28129, 28139, 28149, 28160, 28170, 28181, 28192, 28202, 28212,
          28222, 28232, 28242, 28253, 28262, 28272, 28282, 28292, 28302, 28313,
          28323, 28333, 28343, 28354, 28364, 28374, 28384, 28395, 28405, 28415,
          28425, 28435, 28446, 28456, 28466, 28477, 28486, 28496, 28506, 28517,
          28527, 28537, 28547, 28558, 28568, 28578, 28589, 28599, 28609, 28619,
          28630, 28640, 28650, 28660, 28671, 28681, 28691, 28700, 28711, 28722,
          28732, 28742, 28753, 28763, 28773, 28783, 28794, 28804, 28814, 28824,
          28835, 28845, 28855, 28866, 28876, 28886, 28896, 28907, 28917, 28927,
          28937, 28948, 28959, 28970, 28980, 28990, 29000, 29010, 29021, 29031,
          29041, 29051, 29062, 29072, 29082, 29092, 29103, 29113, 29123, 29133,
          29144, 29154, 29205, 29215, 29226, 29236, 29246, 29256, 29267, 29277,
          29287, 29298, 29308, 29318, 29328, 29339, 29349, 29359, 29369, 29380,
          29390, 29400, 29410, 29421, 29431, 29441, 29451, 29462, 29472, 29482,
          29492, 29502, 29513, 29523, 29543, 29553, 29564, 29574, 29584, 29594,
          29605, 29615, 29625, 29635, 29646, 29656, 29666, 29677, 29688, 29698,
          29709, 29719, 29729, 29739, 29750, 29760, 29770, 29780, 30569, 30579,
          30600, 30610, 30620, 30630, 30640, 30651, 30661, 30671, 30692, 30732,
          30794, 30804, 30815, 30825, 30835, 30845, 30855, 30866, 30887, 30898,
          30907, 30917, 30927, 30937, 30948, 30958, 30968, 30978, 30989, 30999,
          31009, 31019, 31040, 31050, 31071, 31082, 31092, 31102, 31112, 31123,
          31133, 31143, 31153, 31164, 31174, 31184, 31194, 31205, 31215, 31225,
        ],
      },
    },
  });
}

async function ReplacePosDebit() {
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
        Net: { lt: 0 },
        NOT: {
          Counterparty: "null",
        },
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
      // take: 1,
    });

    for (const createJELineElement of findTransactionsTypeForThisLoop) {
      let storeStringPriceSymbol = createJELineElement.Price_Symbol;
      let storeStringAsset = createJELineElement.Asset;
      let storeNet = createJELineElement.Net;
      let StoreRealizedSell = "";

      if (elementJeCoding.Sale === "Sale") {
        /*   With hive inherantly some transaction types signify different things, an important example of this is "Sell" versus "Buy" transactions.  In the case of "Buy"  the token in the "Asset" column is the asset in question being purchase, which would be a Debit in accounting.  In "Sell: Transactions the "Asset" column denotes the asset being sold which would be a Credit.  The logic below handles that fundamental difference*/

        createJELineElement.Asset = storeStringPriceSymbol;
        createJELineElement.Price_Symbol = storeStringAsset;
        StoreRealizedSell = `${storeStringAsset}`;
      }

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
    console.log("Transfer Service fee process completed");
  }
}

// RemoveNegDebit()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => {
//     prisma.$disconnect;
//   });

ReplacePosDebit()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
