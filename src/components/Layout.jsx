import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 mt-[64px] mb-[56px] overflow-y-auto bg-gray-50 px-4 py-6">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
