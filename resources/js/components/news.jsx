import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "./navbar"
import Footer from "./footer"
import api from "../lib/api"

export default function News() {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/news')
      if (response.data.success) {
        setNewsData(response.data.news || [])
      } else {
        setError('Gagal memuat berita')
      }
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Terjadi kesalahan saat memuat berita')
    } finally {
      setLoading(false)
    }
  }

  const HighlightedText = ({ text }) => {
    if (!text) return null;

    const parts = text.split(/(Perhatian!|Tips:|Saran:|Catatan:)/gi);

    return (
      <>
        {parts.map((part, index) => {
          if (part.match(/Perhatian!|Tips:|Saran:|Catatan:/gi)) {
            return (
              <span key={index} className="text-red-400 font-semibold">
                {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 space-y-10">
            <div className="text-center text-white text-xl">
              Memuat berita...
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 space-y-10">
            <div className="text-center text-white text-xl">
              {error}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (newsData.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 space-y-10">
            <div className="text-center text-white text-xl">
              Belum ada berita tersedia
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          {newsData.map((item) => (
            <Card
              key={item.id}
              className="bg-linear-to-br from-[#0288D1] to-[#03A9F4] text-white shadow-xl rounded-2xl overflow-hidden border-none"
            >
              <CardContent className="p-8 flex flex-col space-y-6">
                {/* Judul dan subjudul di atas */}
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h2>
                  <p className="text-base text-white/90">{item.category}</p>
                  <p className="absolute top-0 right-0 text-sm text-white/80">
                    {item.date || new Date(item.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Isi berita */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Gambar di kiri */}
                  <div className="md:w-1/2">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-60 rounded-xl" //gambar berita 
                    />
                  </div>

                  {/* Deskripsi di kanan */}
                  <div className="md:w-1/2 text-[15px] leading-relaxed whitespace-pre-line text-white">
                    <HighlightedText text={item.description} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}