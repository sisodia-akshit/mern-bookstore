"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../../styles/layout.css";

export default function MainLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="layout">
      {showSidebar && (
        <div
          className="backdrop"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <Sidebar show={showSidebar} setShow={setShowSidebar} />

      <Navbar onMenuClick={() => setShowSidebar(!showSidebar)} />

      <div className="content container">
        {children}
      </div>

      <Footer />
    </div>
  );
}
