import React from "react";
import "./Nav.css";

function NavItem({ text, active, setActiveTab }) {
  return (
    <div
      className={`${
        active ? "item-active" : "item-inactive"
      } nav-item d-flex justify-content-center`}
      onClick={() => setActiveTab(text)}
    >
      <div className="py-2">{text}</div>
    </div>
  );
}

function Nav({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="d-flex nav">
      {tabs.map((t, i) => {
        return (
          <NavItem
            key={i}
            setActiveTab={setActiveTab}
            active={t === activeTab}
            text={t}
          />
        );
      })}
    </div>
  );
}

export default Nav;
