import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AturPasswordBaru() {
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans text-white">
      <div className="w-full max-w-2xl">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-3">
          Atur Password Baru
        </h1>
        <p className="text-center text-white/90 mb-10">
          Masukkan Password baru anda dan pastikan berbeda dengan sebelumnya
        </p>

        {/* Password Baru */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-lg">
            Password Baru
          </label>
          <Input
            type="password"
            placeholder="Masukkan Password Baru"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
          />
        </div>

        {/* Konfirmasi Password */}
        <div className="mb-10">
          <label className="block mb-2 font-medium text-lg">
            Konfirmasi Password Baru
          </label>
          <Input
            type="password"
            placeholder="Masukkan Kembali Password Baru"
            value={konfirmasiPassword}
            onChange={(e) => setKonfirmasiPassword(e.target.value)}
            className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
          />
        </div>

        {/* Button */}
        <Button className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md text-lg">
          Simpan Password Baru
        </Button>
      </div>
    </div>
  );
}
