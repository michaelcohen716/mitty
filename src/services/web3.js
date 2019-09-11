import Web3 from "web3";
import { ethers } from "ethers";
import ERC20ABI from "../contracts/ERC20ABI.json";

const infuraRopstenUrl =
  "https://ropsten.infura.io/v3/b520d227f8e1479ab2bf09aebb9ea6db";

export const web3 = new Web3(new Web3.providers.HttpProvider(infuraRopstenUrl));

export const web3RopstenProvider = new ethers.providers.JsonRpcProvider(
  infuraRopstenUrl
);

export const _getAccountFromPrivateKey = async _privateKey => {
  const keystore = await web3.eth.accounts.privateKeyToAccount(
    "0x" + _privateKey
  );
  return keystore;
};

export const _getMainnetETHBalance = async _address => {
  let bal = await web3.eth.getBalance(_address);
  bal = web3.utils.fromWei(bal);
  return bal;
};

export const _getMainnetERC20Balance = async (tokenAddr, userAddr) => {
  const ropstenContract = new ethers.Contract(
    tokenAddr,
    ERC20ABI,
    web3RopstenProvider
  );
  const ropstenBalance = await ropstenContract.balanceOf(userAddr);
  return ropstenBalance.toString();
};
