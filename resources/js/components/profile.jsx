// src/pages/Profile.jsx
import { useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Profile() {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(
    localStorage.getItem("user_avatar") ||
      "https://res.cloudinary.com/dq9kxzzxi/image/upload/v1700000000/default-avatar.png"
  );

  const username = localStorage.getItem("user_name") || "Username";
  const email = localStorage.getItem("user_email") || "-";

  // Upload Avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "akademika_tka_berita");

    try {
      Swal.fire({
        title: "Mengupload...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dq9kxzzxi/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      localStorage.setItem("user_avatar", data.secure_url);
      setAvatar(data.secure_url);

      Swal.fire("Berhasil!", "Foto profil berhasil diubah", "success");
    } catch {
      Swal.fire("Gagal", "Upload foto gagal", "error");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari akun ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0288D1",
      cancelButtonColor: "#81D4FA",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");
      // ❌ user_avatar tetap disimpan

      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-b from-[#03A9F4] to-[#014B69] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#0495CF] rounded-3xl p-10 shadow-xl text-white">
            <h1 className="text-3xl font-bold text-center mb-10">
              Profile Saya
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Avatar */}
              <label className="cursor-pointer relative group">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-40 w-50 rounded-full object-cover border-4 border-white shadow-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-semibold transition">
                  Ganti Foto
                </div>
              </label>

              {/* Info */}
              <div className="space-y-6 text-lg w-full">
                <div>
                  <p className="font-semibold">Username</p>
                  <p className="text-white/90">{username}</p>
                </div>

                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-white/90">{email}</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Button
                onClick={handleLogout}
                className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white py-3 text-lg rounded-xl"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
