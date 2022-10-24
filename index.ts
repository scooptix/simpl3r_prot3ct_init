import * as web3 from "@solana/web3.js";
import getMintIdsFromCMID from "./utils/get_mintIds_from_CMID";
import { updateMetadataUrls } from "./utils/theft_protection";

async function init() {
  console.log("Welcome to the Simpl3r Prot3ct initializer.");
  console.log("Feel free to review the code before executing it with your private information.");

  const cmID = process.env.CMID;
  const projectId = process.env.PROJECTID;
  const uaKey = process.env.UAKEY;
  const rpc = process.env.RPCNODE;

  if (!cmID || !projectId || !uaKey || !rpc) {
    console.log("Please provide all required values");
  } else {
    try {
      const connection = new web3.Connection(rpc);

      const mintIds = await getMintIdsFromCMID({ connection: connection, CMID: cmID });
      if (mintIds.length === 0) {
        console.log(
          "Couldn't load mint IDs from your Candy Machine. Please make sure your Candy Machine ID is correct."
        );
      } else {
        const result = await updateMetadataUrls({
          connection: connection,
          mintIds: mintIds,
          projectId: projectId,
          UAPrivateKey: new TextEncoder().encode(uaKey),
        });

        if (result) {
          console.log("Metadata URL update successful! You can now return to your Prot3ct setup on Simpl3r.");
        } else {
          console.log(
            "Something went wrong. Please try again, check your input in the env.local file and if the issue persists reach out to your Simpl3r representative"
          );
        }
      }
    } catch (_) {
      console.log("Couldn't connect to your RPC node. Please check your RPC node URL");
    }
  }
}

init();
