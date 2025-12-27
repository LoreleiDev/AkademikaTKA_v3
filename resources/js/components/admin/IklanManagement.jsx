import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Swal from "sweetalert2";

export default function IklanManagement() {
    const [iklan, setIklan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingIklan, setEditingIklan] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        image: null,
        start_date: "",
        end_date: "",
    });
    const [imagePreview, setImagePreview] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        fetchIklan();
    }, []);

    const fetchIklan = async () => {
    try {
        setLoading(true);
        const response = await api.get('/admin/iklan');
        
        
        if (response.data.success) {
            setIklan(response.data.iklan || []);
        } else {
            
            console.warn('API returned success: false, but setting empty array');
            setIklan([]);
        }
    } catch (err) {
        console.error('Error fetching iklan:', err);
        
        setIklan([]);
    } finally {
        setLoading(false);
    }
};

    const getStatusBadge = (iklanItem) => {
        const now = new Date();
        const startDate = iklanItem.start_date ? new Date(iklanItem.start_date) : null;
        const endDate = iklanItem.end_date ? new Date(iklanItem.end_date) : null;

        if (!startDate && !endDate) {
            return { text: 'Aktif', color: 'bg-green-100 text-green-800' };
        }

        if (startDate && now < startDate) {
            return { text: 'Akan Datang', color: 'bg-blue-100 text-blue-800' };
        }

        if (endDate && now > endDate) {
            return { text: 'Kadaluarsa', color: 'bg-red-100 text-red-800' };
        }

        if (startDate && endDate && now >= startDate && now <= endDate) {
            return { text: 'Aktif', color: 'bg-green-100 text-green-800' };
        }

        return { text: 'Aktif', color: 'bg-green-100 text-green-800' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image && !editingIklan) {
            Swal.fire('Error', 'Gambar iklan harus diisi', 'error');
            return;
        }

        try {
            setUploading(true);

            const submitData = new FormData();
            submitData.append('start_date', formData.start_date || '');
            submitData.append('end_date', formData.end_date || '');

            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            if (editingIklan) {
                submitData.append('_method', 'PUT');
                await api.post(`/admin/iklan/${editingIklan.id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                await api.post('/admin/iklan', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            Swal.fire('Success', `Iklan berhasil ${editingIklan ? 'diupdate' : 'dibuat'}`, 'success');
            resetForm();
            fetchIklan();
        } catch (err) {
            console.error('Submit error:', err);
            if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                Swal.fire('Error', errorMessages, 'error');
            } else {
                Swal.fire('Error', err.response?.data?.message || "Gagal menyimpan iklan", 'error');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (iklanItem) => {
        setEditingIklan(iklanItem);
        setFormData({
            image: null,
            start_date: iklanItem.start_date ? iklanItem.start_date.split('T')[0] : "",
            end_date: iklanItem.end_date ? iklanItem.end_date.split('T')[0] : "",
        });
        setImagePreview(iklanItem.image_url);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Yakin ingin hapus?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/iklan/${id}`);
                Swal.fire('Deleted!', 'Iklan berhasil dihapus', 'success');
                fetchIklan();
            } catch (err) {
                console.error('Delete error:', err);
                Swal.fire('Error', err.response?.data?.message || 'Gagal menghapus iklan', 'error');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('Error', 'Ukuran file maksimal 5MB', 'error');
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));

            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            image: null,
            start_date: "",
            end_date: "",
        });
        setImagePreview(null);
        setEditingIklan(null);
        setShowForm(false);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Logout!',
            cancelButtonText: 'Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                Swal.fire({
                    title: 'Logged Out!',
                    text: 'Anda berhasil logout.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/admin/login');
                });
            }
        });
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Kelola Berita', path: '/admin/news', icon: '📰' },
        { name: 'Kelola Iklan', path: '/admin/ads', icon: '📢' },
        { name: 'Materi', path: '/admin/materi', icon: '📚' },
    ];

    const isActive = (path) => location.pathname === path;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${isActive(item.path)
                                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-lg mr-3">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="font-medium">{item.name}</span>
                            )}
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
                            <h1 className="text-2xl font-bold text-gray-900">Kelola Iklan</h1>
                            <p className="text-gray-600">Manage iklan dan promosi</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Role: {user.role}</span>
                            <Button
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                + Tambah Iklan
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Iklan Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingIklan ? 'Edit Iklan' : 'Tambah Iklan Baru'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Mulai
                                        </label>
                                        <Input
                                            type="date"
                                            value={formData.start_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Kosongkan jika ingin langsung aktif
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tanggal Selesai
                                        </label>
                                        <Input
                                            type="date"
                                            value={formData.end_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Kosongkan jika ingin aktif selamanya
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gambar Iklan {!editingIklan && '*'}
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-48 h-32 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Format: JPG, PNG, GIF, WebP. Maksimal 5MB
                                        {editingIklan && " (Kosongkan jika tidak ingin mengubah gambar)"}
                                    </p>
                                </div>

                                <div className="flex space-x-4 pt-4 border-t">
                                    <Button
                                        type="submit"
                                        disabled={uploading}
                                        className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                                    >
                                        {uploading ? 'Menyimpan...' : (editingIklan ? 'Update Iklan' : 'Simpan Iklan')}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        className="bg-gray-500 hover:bg-gray-600 text-white"
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Iklan List */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Daftar Iklan ({iklan.length})</h2>
                        </div>

                        {iklan.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📢</div>
                                <p className="text-gray-500 text-lg">Belum ada iklan</p>
                                <Button
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(true);
                                    }}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Tambah Iklan Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dibuat Pada</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {iklan.map((item) => {
                                            const statusBadge = getStatusBadge(item);
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <img
                                                            src={item.image_url}
                                                            alt="Iklan"
                                                            className="w-24 h-16 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.start_date && item.end_date ? (
                                                            <div className="text-center">
                                                                <div>{new Date(item.start_date).toLocaleDateString('id-ID')}</div>
                                                                <div className="text-xs text-gray-400">s/d</div>
                                                                <div>{new Date(item.end_date).toLocaleDateString('id-ID')}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Selamanya</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${statusBadge.color}`}>
                                                            {statusBadge.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                onClick={() => handleEdit(item)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                                                            >
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}