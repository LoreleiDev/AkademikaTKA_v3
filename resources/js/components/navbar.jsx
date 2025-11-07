import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");

    
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari sesi ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      background: "#E0F7FA",
      color: "#01579B",
      confirmButtonColor: "#0288D1",
      cancelButtonColor: "#81D4FA",
      customClass: {
        popup: "rounded-xl shadow-lg border border-sky-200",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);

          await Swal.fire({
            title: "Berhasil logout!",
            text: "Sampai jumpa lagi 👋",
            icon: "success",
            background: "#E1F5FE",
            color: "#01579B",
            confirmButtonColor: "#0288D1",
          });

          navigate("/login");
        } else {
          throw new Error("Logout gagal");
        }
      } catch (error) {
        Swal.fire({
          title: "Terjadi kesalahan!",
          text: error.message,
          icon: "error",
          background: "#E1F5FE",
          color: "#01579B",
          confirmButtonColor: "#0288D1",
        });
      }
    }
  };

  return (
    <nav className="z-50 w-full bg-linear-to-r from-sky-400 to-sky-500 px-6 py-3 flex items-center justify-between fixed top-0">
      {/* ====== Kiri: Logo + Menu Links ====== */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Akademika TKA"
            className="h-[50px] w-[120px] object-contain"
          />
          <span className="sr-only">Akademika TKA</span>
        </div>

        {/* Menu Links */}
        <div className="flex space-x-8 font-semibold text-white">
          <Link to="/" className="hover:opacity-50">Home</Link>
          <Link to="/news" className="hover:opacity-50">News</Link>
          <Link to="/materi" className="hover:opacity-50">Materi</Link>
        </div>
      </div>

      {/* ====== Kanan: Login / Logout Button ====== */}
      {isLoggedIn ? (
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-white border-white bg-[#0288D1] hover:bg-[#0277BD]/80"
        >
          Logout
        </Button>
      ) : (
        <Link to="/login">
          <Button
            variant="outline"
            className="text-white border-white bg-[#0295CF] hover:bg-[#0295CF]/80"
          >
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
}
