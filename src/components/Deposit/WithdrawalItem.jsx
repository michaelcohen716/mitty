import React, { useEffect, useState } from "react";
import firebase from "firebase";
import clipboard from "../../assets/clipboard.png";
import arrow from "../../assets/arrow.png";
import { _continueWithdrawERC0, _processERC20Exit } from "../../services/matic";
import "./Withdrawal.css";

function WithdrawalItem({
  address,
  privateKey,
  withdrawal: { txId, timestamp, amount }
}) {
  const [statusObj, setStatusObj] = useState({});

  useEffect(() => {
    const getStatus = async () => {
      firebase
        .database()
        .ref(`/address/${address}/withdrawalIds/${txId}`)
        .on("value", snapshot => {
          setStatusObj(snapshot.val());
        });
    };
    getStatus();
  }, []);

  const readyTime = timestamp + 90 * 60;
  const rightNow = Date.now() / 1000;

  const since = (readyTime - Date.now() / 1000) / 60;

  const copyId = () => {
    navigator.clipboard.writeText(txId);
  };

  const continueWithdrawERC20 = async () => {
    firebase
      .database()
      .ref(`/address/${address}/withdrawalIds/${txId}`)
      .set({
        status: "continued",
        timestamp: Date.now() / 1000
      });
    const retVal = await _continueWithdrawERC0(privateKey, txId);
  };

  const getView = () => {
      if (timestamp + 90 * 60 < rightNow && statusObj.status === "started") {
      // can press continue
      return (
        <div className="d-flex" onClick={continueWithdrawERC20}>
          <div>Withdraw</div>
          <img
            onClick={continueWithdrawERC20}
            src={arrow}
            className="img-fluid ml-2 tx-clip"
          />
        </div>
      );
    }

    if (timestamp + 90 * 60 > rightNow && statusObj.status === "continued") {
      // exit soon
      if (timestamp + 90 * 60 > rightNow + 10 * 60) {
        // ready for exit
        return (
          <div className="d-flex">
            <div>Ready for Exit</div>
          </div>
        );
      } else {
        return <div className="font-weight-bold">Exit momentarily</div>;
      }
    }

    if(since < 0 && statusObj.status === "continued"){
      return (
        <div className="font-weight-bold">Exited</div>
      );
    }

    return (
      <div className="font-weight-bold">{since.toFixed(0)} min to withdraw</div>
    );
  };

  return (
    <div className="d-flex justify-content-between withdrawal-item py-2  pr-3">
      <div className="d-flex">
        <div className="tx-id">
          <span className="font-weight-bold">ID:</span>
          {txId.slice(0, 6) + "..."}
        </div>
        <img
          onClick={copyId}
          src={clipboard}
          className="img-fluid tx-clip ml-1"
        />
        <div className="ml-3">
          <span className="font-weight-bold">Amount: </span>
          {Number(amount).toFixed(2)}
        </div>
      </div>
      <div className="ml-2">{getView()}</div>
    </div>
  );
}

export default WithdrawalItem;
