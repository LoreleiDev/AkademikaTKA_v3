// src/pages/Login.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api"; 

export default function Login() {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login gagal. Cek username/email dan password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans">
      <div className="w-full max-w-2xl text-white">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Selamat datang di AkademikaTKA</h1>
          <p className="text-base text-white/80">
            Yuk login untuk dapat mengakses semua konten dari AkademikaTKA
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/30 rounded text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-semibold mb-2">Username atau Email</label>
            <Input
              type="text"
              placeholder="Masukkan Username atau Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <Input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md text-lg"
          >
            Masuk
          </Button>
        </form>

        <p className="text-center text-base mt-6">
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
  );
}
