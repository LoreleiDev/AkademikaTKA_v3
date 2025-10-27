import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom" // ← ganti ini!

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login:", { username, password })
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
            Yuk login untuk dapat mengakses semua konten dari AkademikaTKA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <Input
              type="text"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4]"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <Input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md"
          >
            Masuk
          </Button>
        </form>

        {/* Link Daftar */}
        <p className="text-center text-sm mt-4">
          Tidak punya akun?{" "}
          <Link
            to="/daftar"
            className="text-[#B3E5FC] font-semibold hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  )
}
