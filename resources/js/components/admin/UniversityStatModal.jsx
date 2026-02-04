import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

export default function UniversityStatModal({ stat, onClose, onSave }) {
  const [form, setForm] = useState({ university_name: '', program_name: '', average_score: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stat) setForm({ university_name: stat.university_name || '', program_name: stat.program_name || '', average_score: stat.average_score || '' });
    else setForm({ university_name: '', program_name: '', average_score: '' });
  }, [stat]);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave({ university_name: form.university_name, program_name: form.program_name, average_score: form.average_score }); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold">{stat ? 'Edit Statistik' : 'Tambah Statistik'}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-600"/></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Universitas</label>
              <input name="university_name" value={form.university_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program / Jurusan</label>
              <input name="program_name" value={form.program_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rata-rata Nilai</label>
              <input name="average_score" value={form.average_score} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Batal</button>
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white">{loading ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
