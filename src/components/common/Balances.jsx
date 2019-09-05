import React from "react";
import "./common.css";

function Balances({ maticERC20Balance, mainnetERC20Balance, hideMainnet }) {
  return (
    <div className="d-flex flex-column mt-2">
      {!hideMainnet && (
        <div className="d-flex flex-column">
          <div className="balance-headline">Mainnet Bal</div>
          <div className="balance-value">
            {mainnetERC20Balance / 10 ** 18} Dai
          </div>
        </div>
      )}
      <div className={`d-flex flex-column ${hideMainnet ? "" : "mt-2"}`}>
        <div className="balance-headline">Matic Bal</div>
        <div className="balance-value">{maticERC20Balance / 10 ** 18} Dai</div>
      </div>
    </div>
  );
}

export default Balances;
