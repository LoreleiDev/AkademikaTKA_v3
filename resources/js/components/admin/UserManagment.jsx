import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import UserModal from "./UserModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import Swal from "sweetalert2";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Gagal mengambil data user", error);
      Swal.fire('Error', 'Gagal mengambil data user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => { setSelectedUser(null); setShowModal(true); };
  const handleEditUser = (u) => { setSelectedUser(u); setShowModal(true); };
  const handleDeleteClick = (u) => { setSelectedUser(u); setShowDeleteDialog(true); };

  const handleSaveUser = async (data) => {
    try {
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser.id}`, data);
        Swal.fire('Success', 'User berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/users', data);
        Swal.fire('Success', 'User berhasil dibuat', 'success');
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan user', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/admin/users/${selectedUser.id}`);
      Swal.fire('Deleted', 'User berhasil dihapus', 'success');
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err.response?.data?.message || 'Gagal menghapus user', 'error');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Kelola Berita', path: '/admin/news', icon: '📰' },
    { name: 'Kelola Iklan', path: '/admin/ads', icon: '📢' },
    { name: 'Materi', path: '/admin/materi', icon: '📚' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Statistik Univ', path: '/admin/university-stats', icon: '🏫' },
  ];

  const isActive = (path) => location.pathname === path;

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
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

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Kelola seluruh akun user dan admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Role: {user.role}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Daftar Pengguna</h2>
                <p className="text-sm text-gray-500">Total: {filteredUsers.length}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau email..."
                  className="px-3 py-2 border rounded-lg w-64"
                />
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white">+ Tambah User</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left">Username</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-left">Role</th>
                      <th className="px-6 py-4 text-left">Tanggal Bergabung</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-6 text-center">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">Tidak ada user</td></tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{u.role}</span></td>
                          <td className="px-6 py-4 text-gray-600">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button onClick={() => handleEditUser(u)} variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Edit</Button>
                            <Button onClick={() => handleDeleteClick(u)} variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Hapus</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (<UserModal user={selectedUser} onClose={() => setShowModal(false)} onSave={handleSaveUser} />)}
      {showDeleteDialog && selectedUser && (<DeleteConfirmDialog user={selectedUser} onConfirm={handleConfirmDelete} onCancel={() => { setShowDeleteDialog(false); setSelectedUser(null); }} />)}
    </div>
  );
}
