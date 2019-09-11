import React, { useEffect, useState } from "react";

function Countdown() {
  const [withdrawTimeRemaining, setWithdrawTimeRemaining] = useState(5 * 60);

  useEffect(() => {
    const timer = setInterval(() => tick(), 1200);

    return () => {
      clearInterval(timer);
    };
  });

  const tick = () => {
    setWithdrawTimeRemaining(withdrawTimeRemaining - 1);
  };

  return (
    <div className="success-text">
      {withdrawTimeRemaining} seconds until withdraw
    </div>
  );
}

export default Countdown;
