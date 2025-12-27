import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import useRequireAuth from "../../hooks/useRequireAuth";
import herobanner from "../assets/herobanner.png"; 
import Navbar from "./navbar";
import Footer from "./footer";
import api from "../lib/api"; 

export default function Hero() {
    const navigate = useNavigate();
    const { checkAuth } = useRequireAuth();
    const [iklan, setIklan] = useState([]);
    const [mapels, setMapels] = useState([]); // State untuk menyimpan data mapel
    const [loading, setLoading] = useState(true);
    const [loadingMapels, setLoadingMapels] = useState(true); // Loading state terpisah untuk mapel

    useEffect(() => {
        fetchIklan();
        fetchMapels(); // Panggil fungsi untuk mengambil mapel
    }, []);

    const fetchIklan = async () => {
        try {
            setLoading(true);
            const response = await api.get('/iklan'); 
            setIklan(response.data.iklan || []);
        } catch (err) {
            console.error('Error fetching iklan:', err);
            setIklan([]); 
        } finally {
            setLoading(false);
        }
    };

    const fetchMapels = async () => {
        try {
            setLoadingMapels(true);
            // Gunakan endpoint yang sudah Anda siapkan untuk menampilkan mapel
            const response = await api.get('/materi/display/mapels'); 
            if (response.data.success) {
                setMapels(response.data.mapels || []);
            } else {
                console.error('API error:', response.data.message);
                setMapels([]);
            }
        } catch (err) {
            console.error('Error fetching mapels:', err);
            setMapels([]);
        } finally {
            setLoadingMapels(false);
        }
    };

    const activeIklan = iklan.length > 0 ? iklan[0] : null;

    return (
        <>
            <Navbar />
            <div className="w-full bg-linear-to-t from-[#014B69] to-[#0295CF] mt-[70px]"> 
                {/* Banner - Ambil dari Iklan */}
                <div className="w-full h-60 md:h-72 bg-[#0295CF] flex items-center justify-center shadow">
                    {loading ? (
                        <div className="text-white">Loading banner...</div>
                    ) : activeIklan ? (
                        <img
                            src={activeIklan.image_url}
                            alt="Hero Banner"
                            className="w-full h-full object-cover mt-6"
                            onError={(e) => {
                                e.target.src = herobanner;
                            }}
                        />
                    ) : (
                        <img
                            src={herobanner}
                            alt="Hero Banner"
                            className="object-cover mt-6"
                        />
                    )}
                </div>

                {/* Carousel Mapel - Sekarang dinamis */}
                <section className="mt-6">
                    <h2 className="text-lg md:text-xl font-bold text-white bg-sky-700 px-4 py-2">
                        Mata pelajaran yang diujikan di TKA
                    </h2>
                    <div className="bg-sky-600 p-4 overflow-x-auto snap-x snap-mandatory flex space-x-6 scrollbar-thin">
                        {loadingMapels ? (
                            <div className="text-white text-center w-full py-8">Loading mapel...</div>
                        ) : mapels.length === 0 ? (
                            <p className="text-white text-center w-full py-8">Belum ada mapel yang tersedia.</p>
                        ) : (
                            mapels.map((mapel) => (
                                <Card
                                    key={mapel.id}
                                    onClick={() =>
                                        checkAuth(() => {
                                            // Arahkan ke halaman daftar materi untuk mapel ini atau ke halaman pertama jika ada materi
                                            if (mapel.materis && mapel.materis.length > 0) {
                                                // Misalnya, arahkan ke materi pertama
                                                navigate(`/materi/${mapel.materis[0].id}`);
                                            } else {
                                                // Atau ke halaman detail mapel jika tidak ada materi spesifik
                                                // navigate(`/materi/mapel/${mapel.id}`); 
                                                // Untuk sekarang, kita hanya tampilkan loading jika tidak ada materi
                                            }
                                        })
                                    }
                                    className="min-w-[150px] h-[200px] shrink-0 bg-[#0295CF] flex items-center justify-center shadow-lg snap-center cursor-pointer hover:scale-105 transition-transform duration-200"
                                >
                                    <CardContent className="flex items-center justify-center p-0">
                                        {mapel.home_image_url ? ( // Gunakan home_image_url
                                            <img
                                                src={mapel.home_image_url}
                                                alt={mapel.name}
                                                className="h-[200px] w-[150px] object-cover rounded-lg"
                                                onError={(e) => {
                                                    // Jika gambar gagal dimuat, bisa tampilkan placeholder
                                                    e.target.src = "https://placehold.co/150x200?text=No+Image"; // Placeholder
                                                }}
                                            />
                                        ) : (
                                            // Placeholder jika home_image_url kosong
                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-[150px] h-[200px] flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Iklan Lainnya (jika ada lebih dari 1) */}
                {iklan.length > 1 && (
                    <section className="mt-6">
                        <h2 className="text-lg md:text-xl font-bold text-white bg-sky-700 px-4 py-2">
                            Iklan & Promosi
                        </h2>
                        <div className="bg-sky-600 p-4 overflow-x-auto snap-x snap-mandatory flex space-x-6 scrollbar-thin">
                            {iklan.slice(1).map((iklanItem, index) => (
                                <Card
                                    key={iklanItem.id || index}
                                    className="min-w-[300px] h-[150px] shrink-0 bg-[#0295CF] flex items-center justify-center shadow-lg snap-center"
                                >
                                    <CardContent className="flex items-center justify-center p-0 w-full h-full">
                                        <img
                                            src={iklanItem.image_url}
                                            alt={`Iklan ${index + 2}`}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Penjelasan TKA */}
                <section className="mt-8 bg-sky-900 text-white p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-4">
                        Apa itu Tes Kemampuan Akademik (TKA)?
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-gray-100">
                        Tes Kemampuan Akademik (TKA) dilatarbelakangi oleh kebutuhan adanya
                        pelaporan capaian akademik individu murid dari penilaian yang
                        terstandar. Tidak tersedianya laporan capaian akademik individu dari
                        penilaian terstandar pada beberapa tahun terakhir menimbulkan beberapa
                        permasalahan. Permasalahan muncul terutama pada situasi ketika
                        perbandingan capaian akademik murid yang berasal dari satuan
                        pendidikan dilakukan, seperti pada proses seleksi. Pada situasi seleksi
                        yang didasarkan pada data dari hasil penilaian masing-masing satuan
                        pendidikan misalnya data rapor, menimbulkan masalah dalam hal
                        objektivitas dan keadilan.
                    </p>
                </section>
            </div>
            <Footer />
        </>
    );
}