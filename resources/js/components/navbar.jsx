import { Button } from "@/components/ui/button"   // shadcn/ui button
import { Link } from "react-router-dom"           // jika pakai react-router
import logo from "../assets/logo.png"             // pastikan file logo ada

export default function Navbar() {
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

      {/* ====== Kanan: Login Button ====== */}
      <Link to="/login">
      <Button
        variant="outline"
        className="text-white border-white bg-[#0295CF] hover:bg-[#0295CF]/80"
      >
        Login
      </Button>
      </Link>
    </nav>
  )
}
