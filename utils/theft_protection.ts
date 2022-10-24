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
}: {
  mintIds: string[];
  UAPrivateKey: Uint8Array;
  connection: Connection;
  projectId: string;
}): Promise<boolean> {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(Keypair.fromSecretKey(UAPrivateKey)))
    .use(bundlrStorage());

  try {
    await Promise.all(
      mintIds.map(async (mintId) => {
        const nft = await metaplex
          .nfts()
          .findByMint({ mintAddress: toPublicKey(mintId) })
          .run();

        //nfts().update() sometimes changes the data but times out, if that happens make sure we continue
        // https://github.com/metaplex-foundation/js/issues/331
        setTimeout(() => {
          return;
        }, 30000);

        await metaplex
          .nfts()
          .update({
            nftOrSft: nft,
            uri: `https://us-central1-simpl3r.cloudfunctions.net/m?id=${mintId}&pid=${projectId}`,
          })
          .run();

        return;
      })
    );

    return true;
  } catch (_) {
    return false;
  }
}
