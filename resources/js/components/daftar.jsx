import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom" // 🔹 tambahkan ini!

export default function Daftar() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("") // 🔹 tambahkan state untuk konfirmasi password

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Daftar:", { username, password, confirmPassword })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#03A9F4] to-[#015C78] px-4">
      <div className="w-full max-w-md text-white">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Selamat datang di AkademikaTKA
          </h1>
          <p className="text-sm text-white/80">
            Yuk daftar untuk dapat mengakses semua konten dari AkademikaTKA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block font-semibold mb-1">Create Username</label>
            <Input
              type="text"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-1">Create Password</label>
            <Input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4]"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block font-semibold mb-1">Confirm Password</label>
            <Input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4]"
            />
          </div>

          {/* Tombol Daftar */}
          <Button
            type="submit"
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md"
          >
            Daftar
          </Button>
        </form>

        {/* Link Login */}
        <p className="text-center text-sm mt-4">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-[#B3E5FC] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
