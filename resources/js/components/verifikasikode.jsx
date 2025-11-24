import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function VerifikasiKode() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const email = localStorage.getItem('resetEmail');

  const handleVerifikasi = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-reset-code", {
        email: email,
        token: token
      });

      // SIMPAN TOKEN KE LOCALSTORAGE UNTUK HALAMAN BERIKUTNYA
      localStorage.setItem('resetCode', token); // TAMBAH BARIS INI
      
      // Jika verifikasi berhasil, redirect ke halaman reset password
      navigate('/atur-password-baru');
      
    } catch (err) {
      setError(err.response?.data?.message || "Kode verifikasi tidak valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleKembali = () => {
    navigate('/lupa-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans">
      <div className="w-full max-w-2xl text-center text-white">
        
        <h1 className="text-4xl font-semibold mb-3">Verifikasi Kode</h1>
        <p className="text-lg mb-10">
          Kami telah mengirimkan kode 6 digit ke <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/30 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifikasi}>
          <div className="text-left mb-6">
            <label className="text-xl font-semibold">Kode Verifikasi</label>
            <input
              type="text"
              placeholder="Masukkan Kode Verifikasi"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full mt-2 p-4 rounded-md bg-[#054766] outline-none text-white placeholder-white/50 border border-white/30 text-center text-xl tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-6 mt-10">
            <button 
              type="button"
              onClick={handleKembali}
              className="w-1/2 py-4 rounded-md bg-[#60C5FF] text-white text-lg font-semibold hover:opacity-90 transition"
            >
              Kembali
            </button>

            <button 
              type="submit"
              disabled={loading || token.length !== 6}
              className="w-1/2 py-4 rounded-md bg-[#0095E8] text-white text-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Verifikasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}