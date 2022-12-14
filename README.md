# simpl3r_prot3ct_init

**INSTALL**

Install packages with npm or yarn

Install ts-node (https://www.npmjs.com/package/ts-node)

Enter required config value in `config.json`

Run `ts-node ./index`

-------------------

To use mint IDs (hashlist) instead of CMID, run `ts-node ./update_with_mintIds.ts` instead and provide the mint IDs in the contained array.


**TESTING & RESOLVING ERRORS**

If you want to test this on a single NFT before applying it to the entire collection, use `update_with_mintIds.ts` and provide a single mint ID in the array.

If you are encountering errors during the execution, note the logged mint Ids and use `update_with_mintIds.ts` to rerun speficic IDs.

If you encounter a large number of such errors, make sure you are using a RPC Node that can handle large quantities of requests, or reduce the `BATCH_SIZE` in `theft_protection.ts` and make sure you have sufficient funds in your Update Authority wallet (at least 0.1 SOL, transaction cost per NFT is 0.000005 SOL)


**CONFIG**

CMID: If unknown, this can be found in the first transaction of each of your NFTs. The Candy Machine account in the transaction is named "Candy Machine". Can be ommitted if mint IDs are provided in `update_with_mintIds.ts`

Project ID: Your Simpl3r project ID. You can copy it from the Prot3ct setup page. Make sure this is correct or your metadata might not load correctly.

Update Authority Private Key: The private key of your wallet that holds the Update Authority to all your NFTs. You can export it from your Phantom wallet in Security & Privacy.

RPC Node: Url to your solana mainnet-beta RPC node. If you do not have access to a RPC Node, please contact your Simpl3r representative.

Creator Wallet: Your Creator Wallet public key from which we will deduct 5% of the royalties as payment for Prot3ct. This can be reverted at any time.


**LIABILITY**

Executing this code will make changes to your NFT on-chain data. Inproper use might result in loss of data. Simpl3r stores a backup of your NFTs metadata and is taking precautions to safeguard your NFTs' data. However we recommend that you keep a copy of your metadata (which you might still have from your mint) to stay in full control of your NFTs. Simpl3r can provide assistence in making changes to your NFTs and reverting your NFTs to their original state, but Simpl3r takes no responsibility for the changes made by you or anyone else with access to your NFT collection.