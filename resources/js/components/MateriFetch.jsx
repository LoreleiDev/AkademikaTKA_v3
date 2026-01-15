import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "./navbar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import useRequireAuth from "../../hooks/useRequireAuth";

export default function Materi() {
  const { checkAuth } = useRequireAuth();
  const navigate = useNavigate();
  const [mapels, setMapels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapels = async () => {
      try {
        console.log('Fetching mapels...');
        const response = await api.get('/materi/display/mapels');
        console.log('Response:', response.data);
        
        if (response.data.success) {
          setMapels(response.data.mapels);
          console.log('Mapels set:', response.data.mapels);
        } else {
          setError('Gagal memuat data mapel');
        }
      } catch (err) {
        console.error('Error fetching mapels:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchMapels();
  }, []);

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

  // Pisahkan mapel menjadi wajib dan pilihan
  const wajibMapels = mapels.filter(mapel => 
    mapel.name.toLowerCase().includes('wajib')
  );

  const pilihanMapels = mapels.filter(mapel => 
    !mapel.name.toLowerCase().includes('wajib')
  );

  // Fungsi untuk mendapatkan daftar topik dari semua materi dalam mapel
  const getTopicsList = (materis) => {
    if (!materis || materis.length === 0) {
      return 'Belum ada materi';
    }
    
    // Ambil judul dari setiap materi
    const topics = materis.map(materi => {
      // Jika materi memiliki content, ambil judul bagian pertama
      if (materi.content && materi.content.length > 0) {
        return materi.content[0].title || 'Materi';
      }
      // Jika tidak, gunakan judul materi itu sendiri
      return materi.title || 'Materi';
    });
    
    // Gabungkan dengan koma
    return topics.join(', ');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20 font-poppins">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          {/* Bagian Wajib */}
          {wajibMapels.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
                Mata pelajaran Wajib TKA
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wajibMapels.map((mapel) => (
                  <Card
                    key={mapel.id}
                    className="bg-white/10 backdrop-blur-sm text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all rounded-2xl border-none overflow-hidden cursor-pointer"
                    onClick={() =>
                      checkAuth(() => {
                        // Arahkan ke halaman daftar materi untuk mapel ini
                        if (mapel.materis && mapel.materis.length > 0) {
                          navigate(`/materi/${mapel.materis[0].id}`);
                        }
                      })
                    }
                  >
                    <CardContent className="p-4 space-y-3">
                      {mapel.image_url ? (
                        <img
                          src={mapel.image_url}
                          alt={mapel.name}
                          className="rounded-lg w-full h-40 object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', mapel.image_url);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{mapel.name}</h3>
                        <p className="text-sm text-white/80">
                          {getTopicsList(mapel.materis)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Bagian Pilihan */}
          {pilihanMapels.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
                Mata pelajaran Pilihan TKA
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pilihanMapels.map((mapel) => (
                  <Card
                    key={mapel.id}
                    className="bg-white/10 backdrop-blur-sm text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all rounded-2xl border-none overflow-hidden cursor-pointer"
                    onClick={() =>
                      checkAuth(() => {
                        if (mapel.materis && mapel.materis.length > 0) {
                          navigate(`/materi/${mapel.materis[0].id}`);
                        }
                      })
                    }
                  >
                    <CardContent className="p-4 space-y-3">
                      {mapel.image_url ? (
                        <img
                          src={mapel.image_url}
                          alt={mapel.name}
                          className="rounded-lg w-full h-40 object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', mapel.image_url);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40                                                                                                                                                                     flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{mapel.name}</h3>
                        <p className="text-sm text-white/80">
                          {getTopicsList(mapel.materis)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Pesan jika tidak ada mapel sama sekali */}
          {mapels.length === 0 && (
            <div className="text-center py-12 text-white">
              <div className="text-2xl mb-4">Belum ada mata pelajaran</div>
              <p>Admin belum menambahkan mata pelajaran atau materi.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}