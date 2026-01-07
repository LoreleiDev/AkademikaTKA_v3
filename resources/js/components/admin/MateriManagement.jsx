import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Swal from "sweetalert2";

export default function MateriManagement() {
    const [mapels, setMapels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showMapelForm, setShowMapelForm] = useState(false);
    const [showMateriForm, setShowMateriForm] = useState(false);
    const [editingMateri, setEditingMateri] = useState(null);
    const [editingMapel, setEditingMapel] = useState(null);

    const [mapelFormData, setMapelFormData] = useState({
        name: "",
        image: null,
        home_image: null
    });
    const [materiFormData, setMateriFormData] = useState({
        mapel_id: "",
        title: "",
        content: [{ id: 1, title: "", content: "" }],
        image: null,
    });
    const [mapelImagePreview, setMapelImagePreview] = useState(null);
    const [homeImagePreview, setHomeImagePreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/materials');
            setMapels(res.data.mapels || []);
        } catch (err) {
            Swal.fire('Error', 'Gagal memuat materi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMapel = async (e) => {
    e.preventDefault();
    if (!mapelFormData.name.trim()) return Swal.fire('Error', 'Nama mapel wajib diisi', 'error');
    try {
        setUploading(true);
        const fd = new FormData();
        fd.append('name', mapelFormData.name);
        if (mapelFormData.image) fd.append('image', mapelFormData.image);
        // Tambahkan ini untuk home_image
        if (mapelFormData.home_image) fd.append('home_image', mapelFormData.home_image);

        console.log('Sending data:', {
            name: mapelFormData.name,
            hasImage: !!mapelFormData.image,
            hasHomeImage: !!mapelFormData.home_image, // Log ini harus menunjukkan true jika home_image dipilih
        });

        let response;
        if (editingMapel) {
            fd.append('_method', 'PUT');
            response = await api.post(`/admin/materials/mapel/${editingMapel.id}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            response = await api.post('/admin/materials/mapel', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        console.log('Response:', response.data);

        if (response.data.success) {

            Swal.fire('Sukses', editingMapel ? 'Mapel berhasil diupdate' : 'Mapel berhasil dibuat', 'success');
            setMapelFormData({ name: "", image: null, home_image: null });
            setMapelImagePreview(null);
            setHomeImagePreview(null);
            setEditingMapel(null);
            setShowMapelForm(false);
            fetchMaterials();
        } else {
            Swal.fire('Error', response.data.message || 'Gagal membuat mapel', 'error');
        }
    } catch (err) {
        console.error('Error:', err);
        const msg = err.response?.data?.message || "Gagal membuat mapel";
        Swal.fire('Error', msg, 'error');
    } finally {
        setUploading(false);
    }
};

    const handleCreateMateri = async (e) => {
        e.preventDefault();

        if (!materiFormData.title.trim()) {
            return Swal.fire('Error', 'Judul materi wajib diisi', 'error');
        }

        
        const validContent = materiFormData.content.filter(s => s.title.trim() && s.content.trim());
        if (validContent.length === 0) {
            return Swal.fire('Error', 'Minimal satu bagian harus diisi', 'error');
        }

        try {
            setUploading(true);
            const fd = new FormData();
            fd.append('mapel_id', materiFormData.mapel_id);
            fd.append('title', materiFormData.title);
            fd.append('content', JSON.stringify(validContent));
            if (materiFormData.image) fd.append('image', materiFormData.image);

            if (editingMateri) {
                fd.append('_method', 'PUT');
                await api.post(`/admin/materials/materi/${editingMateri.id}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Sukses', 'Materi berhasil diupdate', 'success');
            } else {
                await api.post('/admin/materials/materi', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('Sukses', 'Materi berhasil dibuat', 'success');
            }

            resetMateriForm();
            fetchMaterials();
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal menyimpan materi";
            Swal.fire('Error', msg, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleEditMapel = (mapel) => {
        setEditingMapel(mapel);
        setMapelFormData({ name: mapel.name, image: null, home_image: null });
        setMapelImagePreview(mapel.image_url);
        setHomeImagePreview(mapel.home_image_url);
        setShowMapelForm(true);
    };

    const handleEditMateri = (materi, mapelId) => {
        setEditingMateri(materi);
        setMateriFormData({
            mapel_id: mapelId,
            title: materi.title,
            content: materi.content || [{ id: 1, title: "", content: "" }],
            image: null,
        });
        setImagePreview(materi.image_url);
        setShowMateriForm(true);
    };

    const handleDeleteMateri = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Hapus materi?',
            text: "Tindakan ini tidak bisa dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
        });
        if (!confirmed.isConfirmed) return;

        try {
            await api.delete(`/admin/materials/materi/${id}`);
            Swal.fire('Dihapus!', 'Materi berhasil dihapus', 'success');
            fetchMaterials();
        } catch (err) {
            Swal.fire('Error', 'Gagal menghapus materi', 'error');
        }
    };

    const handleDeleteMapel = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Hapus mapel beserta seluruh materi?',
            text: "Semua materi dalam mapel ini akan ikut terhapus!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus Semua!',
            confirmButtonColor: '#d33',
        });
        if (!confirmed.isConfirmed) return;

        try {
            await api.delete(`/admin/materials/mapel/${id}`);
            Swal.fire('Dihapus!', 'Mapel dan materi berhasil dihapus', 'success');
            fetchMaterials();
        } catch (err) {
            Swal.fire('Error', 'Gagal menghapus mapel', 'error');
        }
    };

    const handleMapelFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'Ukuran maksimal 5MB', 'error');
            return;
        }
        setMapelFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => setMapelImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleHomeImageChange = (e) => { // Handler untuk home_image
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'Ukuran maksimal 5MB', 'error');
            return;
        }
        setMapelFormData(prev => ({ ...prev, home_image: file }));
        const reader = new FileReader();
        reader.onload = (e) => setHomeImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'Ukuran maksimal 5MB', 'error');
            return;
        }
        setMateriFormData(prev => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const resetMateriForm = () => {
        setMateriFormData({
            mapel_id: "",
            title: "",
            content: [{ id: 1, title: "", content: "" }],
            image: null,
        });
        setImagePreview(null);
        setEditingMateri(null);
        setShowMateriForm(false);
    };

    const addSection = () => {
        setMateriFormData(prev => ({
            ...prev,
            content: [...prev.content, { id: Date.now(), title: "", content: "" }]
        }));
    };

    const removeSection = (id) => {
        if (materiFormData.content.length <= 1) return;
        setMateriFormData(prev => ({
            ...prev,
            content: prev.content.filter(s => s.id !== id)
        }));
    };

    const updateSection = (id, field, value) => {
        setMateriFormData(prev => ({
            ...prev,
            content: prev.content.map(s => 
                s.id === id ? { ...s, [field]: value } : s
            )
        }));
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            icon: 'question',
            showCancelButton: true,
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                navigate('/admin/login');
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
                <div className="text-xl">Loading materi...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-gray-100" disabled={loading}>
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>
                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            disabled={loading}
                        >
                            <span className="text-lg mr-3">{item.icon}</span>
                            {sidebarOpen && <span>{item.name}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Kelola Materi</h1>
                        <p className="text-gray-600">Buat mapel & materi pembelajaran</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Role: {user.role}</span>
                        <Button onClick={() => {
                            setEditingMapel(null);
                            setShowMapelForm(true);
                        }} className="bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                            + Tambah Mapel
                        </Button>
                        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Tambah/Update Mapel Modal */}
                {showMapelForm && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                {editingMapel ? 'Edit Mapel' : 'Tambah Mapel Baru'}
                            </h2>
                            <form onSubmit={handleCreateMapel}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Nama Mapel *</label>
                                    <Input
                                        value={mapelFormData.name}
                                        onChange={(e) => setMapelFormData({ ...mapelFormData, name: e.target.value })}
                                        placeholder="Contoh: Matematika"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Gambar Mapel (Opsional)</label>
                                    <Input type="file" accept="image/*" onChange={handleMapelFileChange} disabled={loading} />
                                    {mapelImagePreview && (
                                        <div className="mt-2">
                                            <img src={mapelImagePreview} alt="Preview" className="w-24 h-24 object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Gambar Home (Opsional)</label>
                                    <Input type="file" accept="image/*" onChange={handleHomeImageChange} disabled={loading} /> {/* Handler ditambahkan */}
                                    {homeImagePreview && (
                                        <div className="mt-2">
                                            <img src={homeImagePreview} alt="Preview Home" className="w-24 h-24 object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <Button type="submit" disabled={loading || uploading} className="bg-blue-500 hover:bg-blue-600 text-white">
                                        {uploading ? 'Menyimpan...' : (editingMapel ? 'Update' : 'Simpan')}
                                    </Button>
                                    <Button type="button" onClick={() => {
                                        setShowMapelForm(false);
                                        setEditingMapel(null);
                                    }} className="bg-gray-500" disabled={loading}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tambah/Update Materi Modal */}
                {showMateriForm && (
                    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                {editingMateri ? 'Edit Materi' : 'Tambah Materi Baru'}
                            </h2>
                            <form onSubmit={handleCreateMateri}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Mapel *</label>
                                    <select
                                        value={materiFormData.mapel_id}
                                        onChange={(e) => setMateriFormData(prev => ({ ...prev, mapel_id: e.target.value }))}
                                        className="w-full p-2 border rounded"
                                        disabled={!!editingMateri || loading}
                                        required
                                    >
                                        <option value="">Pilih Mapel</option>
                                        {mapels.map(mp => (
                                            <option key={mp.id} value={mp.id}>{mp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Judul Materi *</label>
                                    <Input
                                        value={materiFormData.title}
                                        onChange={(e) => setMateriFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Contoh: Jenis Kata"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Form Dinamis Bagian Materi */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Bagian Materi *</label>
                                    {materiFormData.content.map((section, index) => (
                                        <div key={section.id} className="mb-6 p-4 border rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold">Bagian {index + 1}</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(section.id)}
                                                    className="text-red-500"
                                                    disabled={materiFormData.content.length <= 1 || loading}
                                                >
                                                    Hapus
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-1">Judul Bagian</label>
                                                <Input
                                                    value={section.title}
                                                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                                    placeholder="Contoh: Kata Benda"
                                                    disabled={loading}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-1">Isi Bagian</label>
                                                <textarea
                                                    value={section.content}
                                                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                                                    className="w-full p-2 border rounded h-32"
                                                    placeholder="Contoh: Menunjukkan nama orang, tempat, benda..."
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        onClick={addSection}
                                        className="bg-gray-200 hover:bg-gray-300 text-black"
                                        disabled={loading}
                                    >
                                        + Tambah Bagian
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Gambar (Opsional)</label>
                                    <Input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img src={imagePreview} alt="Preview" className="w-32 h-24 object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex space-x-3">
                                    <Button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        {uploading ? 'Menyimpan...' : (editingMateri ? 'Update' : 'Simpan')}
                                    </Button>
                                    <Button type="button" onClick={resetMateriForm} className="bg-gray-500" disabled={loading}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Daftar Mapel & Materi */}
                <div className="p-6">
                    {mapels.length === 0 ? (
                        <div className="text-center py-12 bg-white shadow">
                            <p className="text-gray-500">Belum ada mapel. Tambahkan mapel terlebih dahulu.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {mapels.map((mapel) => (
                                <div key={mapel.id} className="bg-white shadow p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-3">
                                            {mapel.image_url ? (
                                                <img
                                                    src={mapel.image_url}
                                                    alt={mapel.name}
                                                    className="w-12 h-12 object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    📚
                                                </div>
                                            )}
                                            <h3 className="text-xl font-bold">{mapel.name}</h3>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => handleEditMapel(mapel)}
                                                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1"
                                                disabled={loading}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setMateriFormData(prev => ({ ...prev, mapel_id: mapel.id }));
                                                    setShowMateriForm(true);
                                                }}
                                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1"
                                                disabled={loading}
                                            >
                                                + Tambah Materi
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteMapel(mapel.id)}
                                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1"
                                                disabled={loading}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>

                                    {mapel.materis.length === 0 ? (
                                        <p className="text-gray-500 italic">Belum ada materi dalam mapel ini.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {mapel.materis.map((materi) => (
                                                <div key={materi.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                                                    {/* Judul di tengah */}
                                                    <div className="flex justify-center mb-2">
                                                        <h4 className="font-semibold text-3xl">{materi.title}</h4>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        {/* Gambar di kiri */}
                                                        {materi.image_url && (
                                                            <div className="w-1/3 bg-gray-200 rounded flex items-center justify-center h-auto">
                                                                <img src={materi.image_url} alt={materi.title} className="w-full object-cover" />
                                                            </div>
                                                        )}
                                                        {/* Teks di kanan */}
                                                        <div className="w-2/3">
                                                            <div className="flex justify-end">
                                                                <div className="space-x-2">
                                                                    <Button
                                                                        onClick={() => handleEditMateri(materi, mapel.id)}
                                                                        className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1"
                                                                        disabled={loading}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleDeleteMateri(materi.id)}
                                                                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1"
                                                                        disabled={loading}
                                                                    >
                                                                        Hapus
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className=" text-lg text-gray-700">
                                                                {materi.content?.map((section, i) => (
                                                                    <section key={i} className="mb-6">
                                                                        <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                                                                        <p className="whitespace-pre-line">{section.content}</p>
                                                                    </section>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}