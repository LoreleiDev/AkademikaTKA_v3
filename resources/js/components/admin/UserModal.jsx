import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

export default function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role: user.role || "user",
      });
    } else {
      setFormData({ name: "", email: "", password: "", password_confirmation: "", role: "user" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: null }));
  };

  const isEditMode = !!user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
      };

      if (!isEditMode) dataToSend.role = formData.role;

      if (formData.password) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      } else if (!isEditMode) {
        setErrors({ password: ["Password harus diisi"] });
        setLoading(false);
        return;
      }

      await onSave(dataToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? "Edit User" : "Tambah User Baru"}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={20} className="text-gray-600"/></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama <span className="text-red-500">*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password {!isEditMode && <span className="text-red-500">*</span>}</label>
              <p className="text-xs text-gray-500 mb-2">{isEditMode ? 'Kosongkan jika tidak ingin mengubah password' : ''}</p>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>}
            </div>

            {formData.password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password <span className="text-red-500">*</span></label>
                <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password_confirmation ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`} />
                {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation[0]}</p>}
              </div>
            )}

            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role <span className="text-red-500">*</span></label>
                <select name="role" value={formData.role} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.role ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role[0]}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Batal</button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">{loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Buat User'}</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
