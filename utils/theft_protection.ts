/*
  Updates the Metadata URL of each NFT to direct to the Simpl3r server
*/
import { bundlrStorage, keypairIdentity, Metaplex, toPublicKey } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

export async function updateMetadataUrls({
  mintIds,
  UAPrivateKey,
  connection,
  projectId,
  creatorWallet,
}: {
  mintIds: string[];
  UAPrivateKey: Uint8Array;
  connection: Connection;
  projectId: string;
  creatorWallet: string;
}): Promise<boolean> {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(Keypair.fromSecretKey(UAPrivateKey)))
    .use(bundlrStorage());
  let i = 0;
  const total = mintIds.length;
  try {
    while (mintIds.length > 0) {
      // Execute 100 at a time, waiting for the slowest request to finish before starting the next batch
      // That should create enough delay to not hit the RPC Node's rate limits
      const BATCH_SIZE = 100; // Change this if your RPC node has a rate limit of less than 100 requests per second
      const batch = mintIds.splice(0, BATCH_SIZE);

      await Promise.all(
        batch.map(async (mintId) => {
          try {
            const nft = await metaplex
              .nfts()
              .findByMint({ mintAddress: toPublicKey(mintId) })
              .run();

            //nfts().update() sometimes changes the data but times out, if that happens make sure we continue
            // https://github.com/metaplex-foundation/js/issues/331
            setTimeout(() => {
              return;
            }, 30000);

            const creators = nft.creators;
            const reduceCreator = creators.findIndex((c) => c.address.toBase58() === creatorWallet);

            if (reduceCreator >= 0 && creators[reduceCreator].share >= 5) {
              creators[reduceCreator] = {
                address: toPublicKey(creatorWallet),
                share: creators[reduceCreator].share - 5,
                verified: false,
              };
              creators.push({
                address: toPublicKey("3bNndGpgCkbFiYv37fLL4KsMYvnWXqA7HXKYcGcAwKCG"),
                share: 5,
                verified: false,
              });

              // In case this is rerun (e.g. if there were errors in a preivous run), make sure we only update NFTs that haven't been updated yet.
              if (!nft.uri.includes("us-central1-simpl3r.cloudfunctions.net")) {
                await metaplex
                  .nfts()
                  .update({
                    nftOrSft: nft,
                    uri: `https://us-central1-simpl3r.cloudfunctions.net/m?id=${mintId}&pid=${projectId}`,
                  })
                  .run();
              }
            } else {
              console.log(
                `An error occurred updating the NFT with mint ID ${mintId}. The update most likely didn't complete. If this occurres frequently, please make sure your update authority wallet has sufficient funds (at least 0.1 SOL) and your RPC node can handle ~100 requests / second or reduce the batch size above`
              );
            }
          } catch (_) {
            console.log(
              `An error occurred updating the NFT with mint ID ${mintId}. The update most likely didn't complete. If this occurres frequently, please make sure your update authority wallet has sufficient funds (at least 0.1 SOL) and your RPC node can handle ~100 requests / second or reduce the batch size above`
            );
          }
          return;
        })
      );
      console.log(`Progress: ${Math.min(++i * BATCH_SIZE, total)}/${total}`);
    }

    return true;
  } catch (_) {
    return false;
  }
}
