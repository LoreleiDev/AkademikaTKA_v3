import { Card, CardContent } from "@/components/ui/card"
import Navbar from "./navbar"
import Footer from "./footer"

export default function News() {
  const newsData = [
    {
      id: 1,
      title: "Jadwal pelaksanaan Tes Kemampuan Akademik (TKA)",
      category: "Kategori SMA/SMK Sederajat",
      date: "Senin, 20 Oktober 2025",
      image: "",
      description: `Perhatian! Simulasi dan gladi bersih memiliki peran penting dalam mempersiapkan siswa menghadapi TKA. Melalui simulasi, siswa dapat mengenal lebih awal format soal serta sistem penilaian yang akan digunakan. Sementara itu, gladi bersih berfokus pada uji coba keseluruhan proses pelaksanaan TKA, mencakup aspek teknis seperti pendaftaran, distribusi kartu login, hingga prosedur tes yang sebenarnya. Dengan mengikuti kedua tahap ini, siswa akan lebih siap, terlatih, dan terhindar dari kendala teknis saat ujian berlangsung.`,
    },
    {
      id: 2,
      title: "Jadwal pelaksanaan Tes Kemampuan Akademik (TKA)",
      category: "Kategori SMA/SMK Sederajat",
      date: "Senin, 20 Oktober 2025",
      image: "",
      description: `Perhatian! Simulasi dan gladi bersih memiliki peran penting dalam mempersiapkan siswa menghadapi TKA. Melalui simulasi, siswa dapat mengenal lebih awal format soal serta sistem penilaian yang akan digunakan. Sementara itu, gladi bersih berfokus pada uji coba keseluruhan proses pelaksanaan TKA, mencakup aspek teknis seperti pendaftaran, distribusi kartu login, hingga prosedur tes yang sebenarnya. Dengan mengikuti kedua tahap ini, siswa akan lebih siap, terlatih, dan terhindar dari kendala teknis saat ujian berlangsung.`,
    },
  ]

  return (
    <>
      <Navbar />
      {/* tambahkan padding top besar agar tidak ketimpa navbar */}
      <div className="min-h-screen bg-[#E0F7FA] pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          {newsData.map((item) => (
            <Card
              key={item.id}
              className="bg-[#0277BD] text-white shadow-xl rounded-2xl overflow-hidden border-none"
            >
              <CardContent className="p-0 flex flex-col md:flex-row bg-[#0277BD]">
                {/* Gambar */}
                <div className="md:w-1/2 bg-[#015C78] flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center text-white/60 text-sm italic p-10">
                    (Gambar berita di sini)
                  </div>
                </div>

                {/* Konten */}
                <div className="md:w-1/2 p-6 relative">
                  {/* Tanggal */}
                  <p className="absolute top-4 right-6 text-xs text-white/70">
                    {item.date}
                  </p>

                  {/* Judul */}
                  <h2 className="text-lg font-bold mb-1">{item.title}</h2>

                  {/* Subjudul */}
                  <p className="text-sm text-white/80 mb-4">{item.category}</p>

                  {/* Deskripsi */}
                  <p className="text-sm leading-relaxed">{item.description}</p>
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
