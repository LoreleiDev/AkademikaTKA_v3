import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });

      setSuccess(res.data.message || "Kode verifikasi berhasil dikirim!");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim kode verifikasi.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#03A9F4] to-[#015C78] px-6 font-sans">
      <div className="w-full max-w-2xl text-center text-white">
        {/* Judul */}
        <h1 className="text-4xl font-bold mb-3">Lupa Password?</h1>
        <p className="text-white/90 text-lg leading-relaxed mb-10">
          Masukkan email anda untuk mereset password anda. <br />
          Kami akan mengirimkan kode verifikasi ke email tersebut
        </p>

        {/* Notifikasi */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/30 rounded text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/30 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <label className="block font-semibold text-white text-lg">
            Email
          </label>

          <Input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 h-12"
          />

          <Button
            type="submit"
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white text-lg py-3 rounded-md"
          >
            Kirim Kode Verifikasi
          </Button>
        </form>

        {/* Link kembali */}
        <Link
          to="/login"
          className="block mt-10 text-[#B3E5FC] font-semibold hover:text-white text-lg"
        >
          Kembali ke Halaman Login
        </Link>
      </div>
    </div>
  );
}
