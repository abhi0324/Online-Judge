import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Footer from "../components/footer.jsx";

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
