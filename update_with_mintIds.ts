/*
  Instead of providing your CMID you can use this file by providing your mint Ids (hashlist) at the bottom of this file.
  You can also use this to test the change with a single NFT before changing your entire collection.
  NOTE: Please make sure the provided projectId is correct, otherwise your NFT will no longer show any metadata.
  All changes are revertable, we store your original metadata as well as the original links, however we recommend a backup of your own.
*/

import * as web3 from "@solana/web3.js";
import bs58 from "bs58";
import { updateMetadataUrls } from "./utils/theft_protection";
import { PROJECTID, UAKEY, RPCNODE, CREATOR_WALLET } from "./config.json";

async function init() {
  console.log("Welcome to the Simpl3r Prot3ct initializer.");
  console.log("Feel free to review the code before executing it with your private information.");

  if (!PROJECTID || !UAKEY || !RPCNODE) {
    console.log("Please provide all required values");
  } else {
    try {
      const connection = new web3.Connection(RPCNODE);

      const base58Key = bs58.decode(UAKEY!);
      console.log("Updating metadata, this will take a while, please don't close this window.");

      const result = await updateMetadataUrls({
        connection: connection,
        mintIds: mintIds,
        projectId: PROJECTID,
        UAPrivateKey: base58Key,
        creatorWallet: CREATOR_WALLET,
      });

      if (result) {
        console.log("Metadata URL update successful! You can now return to your Prot3ct setup on Simpl3r.");
      } else {
        console.log(
          "Something went wrong. Please try again, check your input in the env.local file and if the issue persists reach out to your Simpl3r representative"
        );
      }
    } catch (e) {
      console.log(e);
      console.log("An error occurred. Please check your RPC node URL and Update Authority Private key");
    }
  }
}

const mintIds: string[] = []; // ADD YOUR MINT IDS HERE

init();
