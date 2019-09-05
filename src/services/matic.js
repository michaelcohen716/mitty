import Matic from "maticjs";
import { _getAccountFromPrivateKey } from "./web3";
const config = require("../config");

const matic = new Matic({
  maticProvider: config.MATIC_PROVIDER,
  parentProvider: config.PARENT_PROVIDER,
  rootChainAddress: config.ROOTCHAIN_ADDRESS,
  syncerUrl: config.SYNCER_URL,
  watcherUrl: config.WATCHER_URL
});

const token = "0x70459e550254b9d3520a56ee95b78ee4f2dbd846";
const maticTestToken = "0xc82c13004c06E4c627cF2518612A55CE7a3Db699";
// const from = "0xcC4c3FBfA2716D74B3ED6514ca8Ba99d7f941dF9";
// const amount = "10000000000000000";
// const amount = "1000000000000000000000";
// const recipient = "0x5fC4630B22539c1853920c5bE0539b8Ed60EE039";

const getFromAdddress = async(pk) => {
  const account = await _getAccountFromPrivateKey(pk);
  return account.address;
}

export const deposit = async (pk, amount) => {
  matic.wallet = "0x" + pk;
  const from = await getFromAdddress(pk);
  matic.depositEthers({
    from,
    value: amount,
    onTransactionHash: hash => {
      // action on Transaction success
      console.log("deposit ether", hash); 
    }
  });
};

export const _depositERC20 = async(pk, amount) => {
  matic.wallet = "0x" + pk;
  const from = await getFromAdddress(pk);
  return matic
    .approveERC20TokensForDeposit(token, amount, {
      from,
      onTransactionHash: hash => {
        console.log("approve erc20", hash);
      }
    })
    .then(() => {
      return matic.depositERC20Tokens(token, from, amount, {
        from,
        onTransactionHash: hash => {
          console.log("deposit erc20", hash); 
          return hash;
        }
      });
    });
};

export const _transferERC20 = async(pk, amount, recipient) => {
  matic.wallet = "0x" + pk;
  const from = await getFromAdddress(pk);
  return matic.transferTokens(maticTestToken, recipient, amount, {
    from,
    onTransactionHash: resp => {
      console.log("transfer hash:", resp);
      return resp;
    }
  });
};

export const _getMaticERC20Balance = async(pk) => {
  matic.wallet = "0x" + pk;
  const from = await getFromAdddress(pk);
  return matic
    .balanceOfERC20(from, maticTestToken, {
      // parent: true, // For token balance on Main network (false for Matic Network)
    })
    .then(hash => {
      // action on Transaction success
      return hash;
    });
};
