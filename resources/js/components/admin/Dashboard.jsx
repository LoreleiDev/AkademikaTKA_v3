import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { Button } from "../../components/ui/button";
import Swal from "sweetalert2";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard-stats'),
                api.get('/admin/users')
            ]);

            setStats(statsRes.data.stats);
            setUsers(usersRes.data.users);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard");
            if (err.response?.status === 403) {
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
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
        { name: 'User Management', path: '/admin/users', icon: '👥' },
        { name: 'Statistik Univ', path: '/admin/university-stats', icon: '🏫' },
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
                            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                                isActive(item.path)
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
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user.name}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Role: {user.role}</span>
                            <Button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Stats */}
                {stats && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                                        <span className="text-blue-600 text-xl">👥</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                                        <p className="text-3xl font-bold text-blue-600">{stats.total_users}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 mr-4">
                                        <span className="text-green-600 text-xl">🛡️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">Admins</h3>
                                        <p className="text-3xl font-bold text-green-600">{stats.total_admins}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                                        <span className="text-purple-600 text-xl">👤</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-600">Regular Users</h3>
                                        <p className="text-3xl font-bold text-purple-600">{stats.total_regular_users}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Users & Quick Actions */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold flex items-center">
                                <span className="mr-2">👥</span>
                                Recent Users
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.slice(0, 5).map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length > 5 && (
                            <div className="px-6 py-4 border-t">
                                <Button
                                    onClick={() => navigate('/admin/users')}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                    View All Users
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold flex items-center">
                                <span className="mr-2">⚡</span>
                                Quick Actions
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <Button
                                onClick={() => navigate('/admin/news')}
                                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                            >
                                <span className="mr-3">📰</span>
                                Kelola Berita
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/materi')}
                                className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                            >
                                <span className="mr-3">📚</span>
                                Kelola Materi
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/ads')}
                                className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200"
                            >
                                <span className="mr-3">📢</span>
                                Kelola Iklan
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/university-stats')}
                                className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                            >
                                <span className="mr-3">🏫</span>
                                Statistik Univ
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}