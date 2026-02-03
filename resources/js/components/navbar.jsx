import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const name = localStorage.getItem("user_name");
    const avatarUrl = localStorage.getItem("user_avatar");

    setIsLoggedIn(!!token);
    setUserName(name || "");
    setAvatar(
      avatarUrl ||
        "https://res.cloudinary.com/dq9kxzzxi/image/upload/v1700000000/default-avatar.png"
    );
  }, []);

  const handleLogout = async () => {
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
    });

    if (result.isConfirmed) {
      localStorage.clear();
      setIsLoggedIn(false);
      setUserName("");
      setAvatar("");

      await Swal.fire({
        title: "Berhasil logout!",
        text: "Sampai jumpa lagi 👋",
        icon: "success",
        background: "#E1F5FE",
        color: "#01579B",
        confirmButtonColor: "#0288D1",
      });

      navigate("/");
    }
  };

  return (
    <nav className="z-50 w-full bg-linear-to-r from-sky-400 to-sky-500 px-6 py-3 flex items-center justify-between fixed top-0">
      {/* ===== KIRI ===== */}
      <div className="flex items-center space-x-8">
        <img
          src={logo}
          alt="Akademika TKA"
          className="h-[50px] w-[120px] object-contain"
        />

        <div className="flex space-x-8 font-semibold text-white">
          <Link to="/" className="hover:opacity-50">Home</Link>
          <Link to="/news" className="hover:opacity-50">News</Link>
          <Link to="/materi" className="hover:opacity-50">Materi</Link>
        </div>
      </div>

      {/* ===== KANAN ===== */}
      {isLoggedIn ? (
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Avatar */}
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
          />

          {/* Nama */}
          <span className="text-white font-semibold hover:opacity-50">
            {userName}
          </span>

          {/* Logout tetap terpisah */}
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation(); // biar gak ikut ke profile
              handleLogout();
            }}
            className="ml-4 text-white border-white bg-[#0288D1] hover:bg-[#0277BD]/80"
          >
            Logout
          </Button>
        </div>
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
