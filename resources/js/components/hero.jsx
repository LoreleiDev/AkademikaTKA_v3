import { Card, CardContent } from "@/components/ui/card"
import herobanner from "../assets/herobanner.png"

// contoh import gambar mapel (silakan ganti sesuai file kamu di assets)
import mapel1 from "../assets/1.png"
import mapel2 from "../assets/2.png"
import mapel3 from "../assets/3.png"
import mapel4 from "../assets/4.png"
import mapel5 from "../assets/5.png"
import mapel6 from "../assets/6.png"
import mapel7 from "../assets/7.png"
import mapel8 from "../assets/8.png"
import mapel9 from "../assets/9.png"
import mapel10 from "../assets/10.png"
import Navbar from "./navbar"
import Footer from "./footer"

export default function Hero() {
  const mapelList = [
    mapel1, mapel2, mapel3, mapel4, mapel5,
    mapel6, mapel7, mapel8, mapel9, mapel10
  ]

  return (
    <>
    <Navbar />
    <div className="w-full bg-[#0295CF] mt-[70px]">
      {/* ===== Bagian 1: Banner ===== */}
      <div className="w-full h-60 md:h-72 bg-[#0295CF] flex items-center justify-center shadow">
        <img
          src={herobanner}
          alt="Hero Banner"
          className="object-cover mt-6"
        />
      </div>

      {/* ===== Bagian 2: Carousel Mata Pelajaran ===== */}
      <section className="mt-6">
        <h2 className="text-lg md:text-xl font-bold text-white bg-sky-700 px-4 py-2">
          Mata pelajaran yang diujikan di TKA
        </h2>
        <div className="bg-sky-600 p-4 overflow-x-auto snap-x snap-mandatory flex space-x-6 scrollbar-thin">
          {mapelList.map((img, i) => (
            <Card
              key={i}
              className="min-w-[150px] h-[200px] flex-shrink-0 bg-[#0295CF] flex items-center justify-center shadow-lg snap-center"
            >
              <CardContent className="flex items-center justify-center p-0">
                <img
                  src={img}
                  alt={`Mapel ${i + 1}`}
                  className="h-[200px] w-[150px] rounded-lg"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== Bagian 3: Penjelasan TKA ===== */}
      <section className="mt-8 bg-sky-900 text-white p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4">
          Apa itu dari Tes Kemampuan Akademik (TKA)?
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
    <Footer/>
    </>
  )
}
