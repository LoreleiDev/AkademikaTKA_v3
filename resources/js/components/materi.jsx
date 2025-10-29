import { Card, CardContent } from "@/components/ui/card"
import Navbar from "./navbar"
import Footer from "./footer"

// Import gambar (ganti sesuai path kamu)
import mathWajib from "../assets/math-wajib.png"
import indoWajib from "../assets/indo-wajib.png"
import inggrisWajib from "../assets/inggris-wajib.png"
import mathLanjut from "../assets/math-lanjut.png"
import indoLanjut from "../assets/indo-lanjut.png"
import inggrisLanjut from "../assets/inggris-lanjut.png"

export default function Materi() {
  const wajibData = [
    {
      id: 1,
      title: "Matematika Wajib",
      image: mathWajib,
      desc: "Aljabar, Bilangan, data dan peluang",
    },
    {
      id: 2,
      title: "Bahasa Indonesia Wajib",
      image: indoWajib,
      desc: "Kata Serapan, Simpulan Teks",
    },
    {
      id: 3,
      title: "Bahasa Inggris Wajib",
      image: inggrisWajib,
      desc: "Main idea, Author purpose",
    },
  ]

  const pilihanData = [
    {
      id: 4,
      title: "Matematika Lanjut",
      image: mathLanjut,
      desc: "Matriks, Bangun Geometri",
    },
    {
      id: 5,
      title: "Bahasa Indonesia Lanjut",
      image: indoLanjut,
      desc: "EYD-V, Kata Turunan",
    },
    {
      id: 6,
      title: "Bahasa Inggris Lanjut",
      image: inggrisLanjut,
      desc: "Referent, Vocabulary Context",
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20 font-poppins">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Bagian Wajib */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
              Mata pelajaran Wajib TKA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wajibData.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl border-none overflow-hidden"
                >
                  <CardContent className="p-4 space-y-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg w-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Bagian Pilihan */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
              Mata pelajaran Pilihan TKA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pilihanData.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all rounded-2xl border-none overflow-hidden"
                >
                  <CardContent className="p-4 space-y-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg w-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
