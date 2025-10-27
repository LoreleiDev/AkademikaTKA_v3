import { Card, CardContent } from "@/components/ui/card"
import Navbar from "./navbar"
import Footer from "./footer"
import contohGambar from "../assets/Alurtka.png" // sesuaikan path gambar kamu

export default function News() {
  const newsData = [
    {
      id: 1,
      title: "Jadwal pelaksanaan Tes Kemampuan Akademik (TKA)",
      category: "Kategori SMA/SMK Sederajat",
      date: "Senin, 20 Oktober 2025",
      image: contohGambar,
      description: (
        <>
          <span className="text-red-400 font-semibold">Perhatian! </span>
          Simulasi dan gladi bersih memiliki peran penting dalam mempersiapkan siswa menghadapi TKA.
          Melalui simulasi, siswa dapat mengenal lebih awal format soal serta sistem penilaian yang akan digunakan.
          Sementara itu, gladi bersih berfokus pada uji coba keseluruhan proses pelaksanaan TKA,
          mencakup aspek teknis seperti pendataan, distribusi kartu login, hingga prosedur tes yang sebenarnya.
          Dengan mengikuti kedua tahap ini, siswa akan lebih siap, terlatih, dan terhindar dari kendala teknis
          saat ujian berlangsung.
        </>
      ),
    },
    {
      id: 2,
      title: "Panduan Mengikuti Simulasi Ujian Online",
      category: "Kategori SMA/SMK Sederajat",
      date: "Selasa, 21 Oktober 2025",
      image: contohGambar,
      description: (
        <>
          Sebelum mengikuti simulasi, pastikan perangkat dan jaringan internet kamu dalam kondisi baik.
          <br />
          <span className="text-red-400 font-semibold">Tips: </span>
          gunakan browser terbaru dan login lebih awal agar tidak mengalami kendala teknis.
          Simulasi bertujuan untuk membiasakan siswa dengan sistem ujian berbasis komputer
          serta cara mengerjakan soal dalam waktu terbatas.
          Dengan latihan ini, diharapkan peserta bisa lebih percaya diri dan siap menghadapi TKA sebenarnya.
        </>
      ),
    },
    {
      id: 3,
      title: "Strategi Efektif Menghadapi Tes Akademik",
      category: "Kategori SMA/SMK Sederajat",
      date: "Rabu, 22 Oktober 2025",
      image: contohGambar,
      description: (
        <>
          Menghadapi ujian akademik tidak hanya membutuhkan kemampuan akademik,
          tetapi juga strategi belajar yang tepat. Pastikan kamu memiliki jadwal belajar yang konsisten
          dan gunakan waktu luang untuk mengerjakan latihan soal.
          <br />
          <span className="text-red-400 font-semibold">Saran: </span>
          fokus pada materi yang sering muncul, pahami pola soal, dan latih manajemen waktu.
          Dengan persiapan yang matang, hasil terbaik akan lebih mudah diraih.
        </>
      ),
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          {newsData.map((item) => (
            <Card
              key={item.id}
              className="bg-gradient-to-br from-[#0288D1] to-[#03A9F4] text-white shadow-xl rounded-2xl overflow-hidden border-none"
            >
              <CardContent className="p-8 flex flex-col space-y-6">
                {/* Judul dan subjudul di atas */}
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h2>
                  <p className="text-base text-white/90">{item.category}</p>
                  <p className="absolute top-0 right-0 text-sm text-white/80">
                    {item.date}
                  </p>
                </div>

                {/* Isi berita */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Gambar di kiri */}
                  <div className="md:w-1/2">
                    <img
                      src={item.image}
                      alt="Ilustrasi Berita"
                      className="object-cover w-full rounded-xl"
                    />
                  </div>

                  {/* Deskripsi di kanan */}
                  <div className="md:w-1/2 text-[15px] leading-relaxed text-white">
                    {item.description}
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
