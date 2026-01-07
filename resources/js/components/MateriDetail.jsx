import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import api from "../lib/api";
import useRequireAuth from "../../hooks/useRequireAuth";

export default function MateriDetail() {
  const { checkAuth } = useRequireAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [materi, setMateri] = useState(null);
  const [allMateris, setAllMateris] = useState([]);
  const [currentMateriIndex, setCurrentMateriIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth(async () => {
      try {
        // Ambil detail materi saat ini
        const response = await api.get(`/materi/display/materi/${id}`);
        if (!response.data.success) {
          setError(response.data.message || 'Materi tidak ditemukan');
          return;
        }
        const currentMateri = response.data.materi;

        // Ambil semua materi dalam mapel yang sama
        const mapelResponse = await api.get(`/materi/display/mapel/${currentMateri.mapel_id}`);
        if (!mapelResponse.data.success) {
          setError('Gagal memuat materi dalam mapel ini');
          return;
        }

        const materisInMapel = mapelResponse.data.mapel.materis;
        setAllMateris(materisInMapel);
        
        // Temukan index materi saat ini
        const currentIndex = materisInMapel.findIndex(m => m.id === currentMateri.id);
        setCurrentMateriIndex(currentIndex);
        setMateri(currentMateri);
      } catch (err) {
        console.error('Error fetching materi:', err);
        if (err.response && err.response.status === 404) {
          setError('Materi tidak ditemukan');
        } else {
          setError('Terjadi kesalahan saat memuat materi');
        }
      } finally {
        setLoading(false);
      }
    });
  }, [id, checkAuth]);

  const goToNext = () => {
    if (currentMateriIndex < allMateris.length - 1) {
      const nextMateri = allMateris[currentMateriIndex + 1];
      navigate(`/materi/${nextMateri.id}`);
    }
  };

  const goToPrevious = () => {
    if (currentMateriIndex > 0) {
      const prevMateri = allMateris[currentMateriIndex - 1];
      navigate(`/materi/${prevMateri.id}`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20 flex items-center justify-center">
          <div className="text-white text-xl">Memuat materi...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20 flex items-center justify-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!materi) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20 flex items-center justify-center">
          <div className="text-white text-xl">Materi tidak ditemukan</div>
        </div>
        <Footer />
      </>
    );
  }

  const hasMultipleMateri = allMateris.length > 1;
  const isFirst = currentMateriIndex === 0;
  const isLast = currentMateriIndex === allMateris.length - 1;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Judul Utama */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            {materi.title}
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Gambar di Kiri */}
            <div className="lg:w-1/2 w-full">
              {materi.image_url ? (
                <img
                  src={materi.image_url}
                  alt={materi.title}
                  className="rounded-2xl shadow-lg w-full"
                  onError={(e) => {
                    console.error('Materi image failed to load:', materi.image_url);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-80 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Penjelasan di Kanan */}
            <div className="lg:w-1/2 w-full text-white leading-relaxed space-y-10 text-lg md:text-xl">
              {materi.content?.map((section, index) => (
                <section key={index}>
                  <h2 className="text-3xl font-semibold mb-4">{String.fromCharCode(65 + index)}. {section.title}</h2>
                  <p className="text-white/90 mb-3 whitespace-pre-line">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>

          {/* Tombol navigasi materi */}
          {hasMultipleMateri && (
            <div className="mt-12 flex justify-between items-center">
              <button
                onClick={goToPrevious}
                disabled={isFirst}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isFirst 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                ← Sebelumnya
              </button>
              
              <div className="text-white text-center">
                <p className="text-sm text-white/80">
                  Materi {currentMateriIndex + 1} dari {allMateris.length}
                </p>
                <div className="mt-2 flex space-x-1">
                  {allMateris.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${
                        idx === currentMateriIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={goToNext}
                disabled={isLast}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isLast 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Berikutnya →
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}