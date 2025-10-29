import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Daftar() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Daftar:", { username, password, confirmPassword })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans">
      <div className="w-full max-w-2xl text-white"> {/* ⬅️ Lebar sama kayak login */}
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Selamat datang di AkademikaTKA
          </h1>
          <p className="text-base text-white/80">
            Yuk daftar untuk dapat mengakses semua konten dari AkademikaTKA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username */}
          <div>
            <label className="block font-semibold mb-2">Create Username</label>
            <Input
              type="text"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-2">Create Password</label>
            <Input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block font-semibold mb-2">Confirm Password</label>
            <Input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
            />
          </div>

          {/* Tombol Daftar */}
          <Button
            type="submit"
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md text-lg"
          >
            Daftar
          </Button>
        </form>

        {/* Link Login */}
        <p className="text-center text-base mt-6">
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
