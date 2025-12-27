import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import Swal from "sweetalert2";

export default function NewsManagement() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        category: "Kategori SMA/SMK Sederajat",
        description: "",
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
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/news');
            setNews(response.data.news || []);
        } catch (err) {
            console.error('Error fetching news:', err);
            Swal.fire('Error', 'Gagal memuat berita', 'error');
        } finally {
            setLoading(false);
        }
    };


    const getStatusBadge = (newsItem) => {
        const now = new Date();
        const startDate = newsItem.start_date ? new Date(newsItem.start_date) : null;
        const endDate = newsItem.end_date ? new Date(newsItem.end_date) : null;

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


        if (!formData.title.trim()) {
            Swal.fire('Error', 'Judul berita harus diisi', 'error');
            return;
        }
        if (!formData.category.trim()) {
            Swal.fire('Error', 'Kategori harus diisi', 'error');
            return;
        }
        if (!formData.description.trim()) {
            Swal.fire('Error', 'Deskripsi harus diisi', 'error');
            return;
        }

        try {
            setUploading(true);

            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('category', formData.category);
            submitData.append('description', formData.description);
            submitData.append('start_date', formData.start_date || '');
            submitData.append('end_date', formData.end_date || '');

            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            console.log('Submitting form data:');
            for (let [key, value] of submitData.entries()) {
                console.log(key + ': ', value);
            }

            if (editingNews) {
                console.log('Updating news:', editingNews.id);


                submitData.append('_method', 'PUT');
                await api.post(`/admin/news/${editingNews.id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            } else {
                console.log('Creating new news');
                await api.post('/admin/news', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            Swal.fire('Success', `Berita berhasil ${editingNews ? 'diupdate' : 'dibuat'}`, 'success');
            resetForm();
            fetchNews();
        } catch (err) {
            console.error('Submit error:', err);
            console.error('Error response:', err.response?.data);

            if (err.response?.data?.errors) {

                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                Swal.fire('Error', errorMessages, 'error');
            } else {
                Swal.fire('Error', err.response?.data?.message || "Gagal menyimpan berita", 'error');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (newsItem) => {
        console.log('Editing news item:', newsItem);
        setEditingNews(newsItem);
        setFormData({
            title: newsItem.title || "",
            category: newsItem.category || "Kategori SMA/SMK Sederajat",
            description: newsItem.description || "",
            image: null,
            start_date: newsItem.start_date ? newsItem.start_date.split('T')[0] : "",
            end_date: newsItem.end_date ? newsItem.end_date.split('T')[0] : "",
        });
        setImagePreview(newsItem.image_url);
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
                await api.delete(`/admin/news/${id}`);
                Swal.fire('Deleted!', 'Berita berhasil dihapus', 'success');
                fetchNews();
            } catch (err) {
                console.error('Delete error:', err);
                Swal.fire('Error', err.response?.data?.message || 'Gagal menghapus berita', 'error');
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
            title: "",
            category: "Kategori SMA/SMK Sederajat",
            description: "",
            image: null,
            start_date: "",
            end_date: "",
        });
        setImagePreview(null);
        setEditingNews(null);
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
        { name: 'Iklan', path: '/admin/ads', icon: '📢' },
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
                            <h1 className="text-2xl font-bold text-gray-900">Kelola Berita</h1>
                            <p className="text-gray-600">Manage berita dan pengumuman</p>
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
                                + Tambah Berita
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

                {/* News Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Judul Berita *
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Masukkan judul berita"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori *
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Masukkan kategori"
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

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
                                            atau isi di tanggal berikutnya setelah tanggal akhir yang diinginkan jika ingin sesuai tanggal yang diinginkan (misal: isi 2024-12-02 jika ingin berakhir di 2024-12-01)
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi * 
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tulisan yang ditandai : 'Perhatian! ', 'Tips: ', 'Saran: ', 'Catatan: '
                                    </p>
                                    <Textarea
                                        placeholder="Masukkan deskripsi berita"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={8}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gambar {!editingNews && '*'}
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
                                        {editingNews && " (Kosongkan jika tidak ingin mengubah gambar)"}
                                    </p>
                                </div>

                                <div className="flex space-x-4 pt-4 border-t">
                                    <Button
                                        type="submit"
                                        disabled={uploading}
                                        className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                                    >
                                        {uploading ? 'Menyimpan...' : (editingNews ? 'Update Berita' : 'Simpan Berita')}
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

                {/* News List */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Daftar Berita ({news.length})</h2>
                        </div>

                        {news.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📰</div>
                                <p className="text-gray-500 text-lg">Belum ada berita</p>
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Tambah Berita Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {news.map((item) => {
                                            const statusBadge = getStatusBadge(item);
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.title}
                                                            className="w-16 h-12 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs">
                                                            <p className="font-medium text-gray-900 line-clamp-2">{item.title}</p>
                                                            <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {item.category}
                                                        </span>
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