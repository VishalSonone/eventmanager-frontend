import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto mt-16 mb-14 px-4 py-6 bg-gray-50">
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
