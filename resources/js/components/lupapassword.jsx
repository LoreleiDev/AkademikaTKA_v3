import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function LupaPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || "Kode verifikasi berhasil dikirim!");
      
      // Simpan email untuk digunakan di halaman berikutnya
      localStorage.setItem('resetEmail', email);
      
      // Redirect ke halaman verifikasi setelah 2 detik
      setTimeout(() => {
        window.location.href = '/verifikasi-kode';
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim kode verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-6 font-sans">
      <div className="w-full max-w-2xl text-center text-white">
        <h1 className="text-4xl font-bold mb-3">Lupa Password?</h1>
        <p className="text-white/90 text-lg leading-relaxed mb-10">
          Masukkan email anda untuk mereset password anda. <br />
          Kami akan mengirimkan kode verifikasi ke email tersebut
        </p>

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
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white text-lg py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Kode Verifikasi"}
          </Button>
        </form>

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