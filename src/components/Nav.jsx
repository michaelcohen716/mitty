import React from "react";
import "./Nav.css";

function NavItem({ text, active, setActiveTab, addressLoaded, idx }) {
  return (
    <div
      className={`${active ? "item-active" : "item-inactive"} ${
        !addressLoaded && idx !== 0 ? "item-disabled" : ""
      } my-auto nav-item d-flex justify-content-center`}
      onClick={addressLoaded ? () => setActiveTab(text) : null}
    >
      <div className="py-2">{text}</div>
    </div>
  );
}

function Nav({ tabs, activeTab, setActiveTab, address }) {
  return (
    <div className="d-flex nav">
      {tabs.map((t, i) => {
        return (
          <NavItem
            key={i}
            idx={i}
            setActiveTab={setActiveTab}
            active={t === activeTab}
            text={t}
            addressLoaded={address ? true : false}
          />
        );
      })}
    </div>
  );
}

export default Nav;
