
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import UniversityStatModal from "./UniversityStatModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import Swal from "sweetalert2";

export default function UniversityStatsManagement() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') { navigate('/admin/login'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try { setLoading(true); const res = await api.get('/university-stats'); setStats(res.data.stats || []); }
    catch (err) { console.error(err); Swal.fire('Error', 'Gagal memuat data', 'error'); }
    finally { setLoading(false); }
  };

  const handleAdd = () => { setSelected(null); setShowModal(true); };
  const handleEdit = (s) => { setSelected(s); setShowModal(true); };
  const handleDelete = async (s) => {
    const r = await Swal.fire({ title: 'Yakin ingin hapus?', icon: 'warning', showCancelButton: true });
    if (r.isConfirmed) {
      try { await api.delete(`/admin/university-stats/${s.id}`); Swal.fire('Deleted', '', 'success'); fetchStats(); }
      catch (err) { console.error(err); Swal.fire('Error', 'Gagal menghapus', 'error'); }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selected) await api.put(`/admin/university-stats/${selected.id}`, data);
      else await api.post('/admin/university-stats', data);
      setShowModal(false);
      fetchStats();
      Swal.fire('Success', 'Data disimpan', 'success');
    } catch (err) { console.error(err); Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error'); }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Kelola Berita', path: '/admin/news', icon: '📰' },
    { name: 'Iklan', path: '/admin/ads', icon: '📢' },
    { name: 'Materi', path: '/admin/materi', icon: '📚' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Statistik Univ', path: '/admin/university-stats', icon: '🏫' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (<h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>)}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">{sidebarOpen ? '◀' : '▶'}</button>
          </div>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center px-4 py-3 text-left transition-colors ${isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className="text-lg mr-3">{item.icon}</span>
              {sidebarOpen && (<span className="font-medium">{item.name}</span>)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistik Univ</h1>
              <p className="text-gray-600">Daftar rata-rata nilai diterima per universitas/program</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Role: {user.role}</span>
              <Button onClick={handleAdd} className="bg-blue-600 text-white">+ Tambah</Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Universitas</th>
                  <th className="px-6 py-4 text-left">Program</th>
                  <th className="px-6 py-4 text-left">Rata-rata</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-6 text-center">Loading...</td></tr>
                ) : stats.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Belum ada data</td></tr>
                ) : (
                  stats.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{s.university_name}</td>
                      <td className="px-6 py-4">{s.program_name}</td>
                      <td className="px-6 py-4">{parseFloat(s.average_score).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button onClick={() => handleEdit(s)} variant="outline" size="sm" className="text-blue-600">Edit</Button>
                        <Button onClick={() => handleDelete(s)} variant="outline" size="sm" className="text-red-600">Hapus</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && <UniversityStatModal stat={selected} onClose={() => setShowModal(false)} onSave={handleSave} />}
      </div>
    </div>
  );
}
