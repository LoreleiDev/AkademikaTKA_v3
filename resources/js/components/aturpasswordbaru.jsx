import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function AturPasswordBaru() {
  const [formData, setFormData] = useState({
    passwordBaru: "",
    konfirmasiPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail');
  const token = localStorage.getItem('resetCode'); // GANTI VARIABLE

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi manual di frontend
    if (!email || !token) {
      setError("Sesi telah berakhir. Silakan mulai ulang proses reset password.");
      return;
    }

    if (formData.passwordBaru.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (formData.passwordBaru !== formData.konfirmasiPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    try {
      console.log('Sending reset request:', {
        email: email,
        token: token, // UBAH code MENJADI token
        password: formData.passwordBaru,
        password_confirmation: formData.konfirmasiPassword
      });

      const res = await api.post("/auth/reset-password", {
        email: email,
        token: token, // UBAH code MENJADI token
        password: formData.passwordBaru,
        password_confirmation: formData.konfirmasiPassword
      });

      setSuccess("Password berhasil direset!");
      
      // Hapus data dari localStorage
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Reset password error:', err.response?.data);
      
      // Tampilkan error detail dari backend
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(err.response?.data?.message || "Gagal mereset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-3">
          Atur Password Baru
        </h1>
        <p className="text-center text-white/90 mb-10">
          Masukkan Password baru anda dan pastikan berbeda dengan sebelumnya
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-lg">
              Password Baru
            </label>
            <Input
              type="password"
              placeholder="Masukkan Password Baru (minimal 6 karakter)"
              value={formData.passwordBaru}
              onChange={(e) => handleChange('passwordBaru', e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
              required
              minLength={6}
            />
          </div>

          <div className="mb-10">
            <label className="block mb-2 font-medium text-lg">
              Konfirmasi Password Baru
            </label>
            <Input
              type="password"
              placeholder="Masukkan Kembali Password Baru"
              value={formData.konfirmasiPassword}
              onChange={(e) => handleChange('konfirmasiPassword', e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
              required
              minLength={6}
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md text-lg disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </Button>
        </form>
      </div>
    </div>
  );
}