import algosdk from "algosdk";
import { apiGetTxnParams, ChainType } from "./helpers/api";


// const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
// const port = '';
// const token = {
//   'X-API-Key': 'nJ5YXLrilW3yhWqFoMsV68CEcEJ54uAg1Z3XAFsN'
// }

const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
console.log(algodClient)

const testAccounts = [
  algosdk.mnemonicToSecretKey(
    "cannon scatter chest item way pulp seminar diesel width tooth enforce fire rug mushroom tube sustain glide apple radar chronic ask plastic brown ability badge",
  ),
  algosdk.mnemonicToSecretKey(
    "person congress dragon morning road sweet horror famous bomb engine eager silent home slam civil type melt field dry daring wheel monitor custom above term",
  ),
  algosdk.mnemonicToSecretKey(
    "faint protect home drink journey humble tube clinic game rough conduct sell violin discover limit lottery anger baby leaf mountain peasant rude scene abstract casual",
  ),
];

const our_private_key = algosdk.mnemonicToSecretKey('vivid slogan love awkward stem burden possible judge student egg post frozen swear target drastic noise gadget fence gas foot harvest join devote abandon gaze')


export function signTxnWithTestAccount(txn: algosdk.Transaction): Uint8Array {
  const sender = algosdk.encodeAddress(txn.from.publicKey);

  for (const testAccount of testAccounts) {
    if (testAccount.addr === sender) {
      return txn.signTxn(testAccount.sk);
    }
  }

  throw new Error(`Cannot sign transaction from unknown test account: ${sender}`);
}

export interface IScenarioTxn {
  txn: algosdk.Transaction;
  signers?: string[];
  authAddr?: string;
  message?: string;
}

export type ScenarioReturnType = IScenarioTxn[][];

export type Scenario = (chain: ChainType, address: string) => Promise<ScenarioReturnType>;

// function getAssetIndex(chain: ChainType): number {
//   if (chain === ChainType.MainNet) {
//     // MainNet USDC
//     return 31566704;
//   }

//   if (chain === ChainType.TestNet) {
//     // TestNet USDC
//     return 10458941;
//   }

//   throw new Error(`Asset not defined for chain ${chain}`);
// }

// function getAssetReserve(chain: ChainType): string {
//   if (chain === ChainType.MainNet) {
//     return "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM";
//   }

//   if (chain === ChainType.TestNet) {
//     return "UJBZPEMXLD6KZOLUBUDSZ3DXECXYDADZZLBH6O7CMYXHE2PLTCW44VK5T4";
//   }

//   throw new Error(`Asset reserve not defined for chain ${chain}`);
// }

// function getAppIndex(chain: ChainType): number {
//   if (chain === ChainType.MainNet) {
//     return 305162725;
//   }

//   if (chain === ChainType.TestNet) {
//     return 22314999;
//   }

//   throw new Error(`App not defined for chain ${chain}`);
// }

// const singlePayTxn: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);

//   const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
//     from: address,
//     to: address,
//     amount: 100000,
//     note: new Uint8Array(Buffer.from("example note value")),
//     suggestedParams,
//   });

//   const txnsToSign = [
//     {
//       txn,
//       message: "This is a payment transaction that sends 0.1 Algos to yourself.",
//     },
//   ];
//   return [txnsToSign];
// };

// const singleAssetOptInTxn: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);
//   const assetIndex = getAssetIndex(chain);

//   const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
//     from: address,
//     to: address,
//     amount: 0,
//     assetIndex,
//     note: new Uint8Array(Buffer.from("example note value")),
//     suggestedParams,
//   });

//   const txnsToSign = [
//     {
//       txn,
//       message: "This transaction opts you into the USDC asset if you have not already opted in.",
//     },
//   ];
//   return [txnsToSign];
// };

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



const singleAssetTransferTxn: Scenario = async (
  chain: ChainType,
  address: string,

): Promise<ScenarioReturnType> => {
  const data = window.location.href;
  const dt = data.split('/');
  const params = new URLSearchParams(dt[3]);
  const trade_id = params.get('trade_id');

  const asset_id = params.get('asset_id')
  const asset_price = params.get('asset_price')
  console.log(asset_id)


  const suggestedParams = await apiGetTxnParams(chain);
  const assetIndex = Number(asset_id);
  if (trade_id === 'sell') {
    // optin from our account
    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log(suggestedParams)

    const optin_txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: '4X7GN7RLOGAQH2E67CRBMVGVVBK4XI6S7BEKMGJBKAQHPDZTT4LRGCICVQ',
      to: '4X7GN7RLOGAQH2E67CRBMVGVVBK4XI6S7BEKMGJBKAQHPDZTT4LRGCICVQ',
      amount: 0,
      assetIndex,
      note: new Uint8Array(Buffer.from("Optin asset  " + asset_id)),
      suggestedParams,
    });
    const signed_txn = optin_txn.signTxn(our_private_key.sk)
    const tx = (await algodClient.sendRawTransaction(signed_txn).do());
    console.log("Transaction : " + tx.txId);


    // // Wait for transaction to be confirmed
    // let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
    // //Get the completed Transaction
    // console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    sleep(5000);
    // asset transfer
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: address,
      to: '4X7GN7RLOGAQH2E67CRBMVGVVBK4XI6S7BEKMGJBKAQHPDZTT4LRGCICVQ',
      amount: 1,
      assetIndex,
      note: new Uint8Array(Buffer.from("On sale for " + asset_price)),
      suggestedParams,
    });
    const txnsToSign = [{ txn, message: "This transaction will Transfer the NFT" }];
    return [txnsToSign];


  } else {
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      to: '4X7GN7RLOGAQH2E67CRBMVGVVBK4XI6S7BEKMGJBKAQHPDZTT4LRGCICVQ',
      amount: Number(asset_price) * 1000000,
      note: new Uint8Array(Buffer.from("Bought for " + asset_price)),
      suggestedParams,
    });

    const txnsToSign = [{ txn, message: "This transaction will Transfer the NFT" }];
    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: '4X7GN7RLOGAQH2E67CRBMVGVVBK4XI6S7BEKMGJBKAQHPDZTT4LRGCICVQ',
      to: address,
      amount: 1,
      assetIndex,
      note: new Uint8Array(Buffer.from("On sale for " + asset_price)),
      suggestedParams,
    });

    const signed_txn = txn2.signTxn(our_private_key.sk)
    const tx = (await algodClient.sendRawTransaction(signed_txn).do());
    sleep(5000)
    console.log("Transaction : " + tx.txId);

    return [txnsToSign];


  }


};

// const singleAssetCloseTxn: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);
//   const assetIndex = getAssetIndex(chain);

//   const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
//     from: address,
//     to: getAssetReserve(chain),
//     amount: 0,
//     assetIndex,
//     note: new Uint8Array(Buffer.from("example note value")),
//     closeRemainderTo: testAccounts[1].addr,
//     suggestedParams,
//   });

//   const txnsToSign = [
//     {
//       txn,
//       message:
//         "This transaction will opt you out of the USDC asset. DO NOT submit this to MainNet if you have more than 0 USDC.",
//     },
//   ];
//   return [txnsToSign];
// };

const singleAppOptIn: Scenario = async (
  chain: ChainType,
  address: string,
): Promise<ScenarioReturnType> => {

  const data = window.location.href;
  const dt = data.split('/');
  const params = new URLSearchParams(dt[3]);
  const asset_id = params.get('asset_id')
  console.log(asset_id)
  const suggestedParams = await algodClient.getTransactionParams().do();

  const assetIndex = Number(asset_id);

  // const txn = algosdk.makeApplicationOptInTxnFromObject({
  //   from: address,
  //   appIndex,
  //   note: new Uint8Array(Buffer.from("example note value")),
  //   appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
  //   suggestedParams,
  // });
  const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: address,
    to: address,
    amount: 0,
    assetIndex,
    note: new Uint8Array(Buffer.from("Optin asset  " + asset_id)),
    suggestedParams,
  });

  // const signed_txn = optin_txn.signTxn(our_private_key.sk)
  // const txn = (await algodClient.sendRawTransaction(signed_txn).do());
  console.log("Transaction : " + txn);

  const txnsToSign = [{ txn, message: "This transaction will opt you into a test app." }];
  return [txnsToSign];
};

// const singleAppCall: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);

//   const appIndex = getAppIndex(chain);

//   const txn = algosdk.makeApplicationNoOpTxnFromObject({
//     from: address,
//     appIndex,
//     note: new Uint8Array(Buffer.from("example note value")),
//     appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
//     suggestedParams,
//   });

//   const txnsToSign = [{ txn, message: "This transaction will invoke an app call on a test app." }];
//   return [txnsToSign];
// };

// const singleAppCloseOut: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);

//   const appIndex = getAppIndex(chain);

//   const txn = algosdk.makeApplicationCloseOutTxnFromObject({
//     from: address,
//     appIndex,
//     note: new Uint8Array(Buffer.from("example note value")),
//     appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
//     suggestedParams,
//   });

//   const txnsToSign = [{ txn, message: "This transaction will opt you out of the test app." }];
//   return [txnsToSign];
// };

// const singleAppClearState: Scenario = async (
//   chain: ChainType,
//   address: string,
// ): Promise<ScenarioReturnType> => {
//   const suggestedParams = await apiGetTxnParams(chain);

//   const appIndex = getAppIndex(chain);

//   const txn = algosdk.makeApplicationClearStateTxnFromObject({
//     from: address,
//     appIndex,
//     note: new Uint8Array(Buffer.from("example note value")),
//     appArgs: [Uint8Array.from([0]), Uint8Array.from([0, 1])],
//     suggestedParams,
//   });

//   const txnsToSign = [
//     { txn, message: "This transaction will forcibly opt you out of the test app." },
//   ];
//   return [txnsToSign];
// };

export const sellscenarios: Array<{ name: string; scenario: Scenario }> = [

  {
    name: "List NFT",
    scenario: singleAssetTransferTxn,
  }

];


export const buyscenarios: Array<{ name: string; scenario: Scenario }> = [

  {
    name: "Opt in",
    scenario: singleAppOptIn,
  },
  {
    name: "Buy NFT",
    scenario: singleAssetTransferTxn,
  }

];



