import Navbar from "./navbar"
import Footer from "./footer"
import aljabarDasar from "../assets/aljabarDasar.png"

export default function MatematikaWajib() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Judul Utama */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Aljabar Dasar
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Gambar di Kiri */}
            <div className="lg:w-1/2 w-full">
              <img
                src={aljabarDasar}
                alt="Materi Aljabar Dasar"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            {/* Penjelasan di Kanan */}
            <div className="lg:w-1/2 w-full text-white leading-relaxed space-y-10 text-lg md:text-xl">
              {/* I. Urutan Prioritas */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  I. Urutan Prioritas Perhitungan
                </h2>
                <ol className="list-decimal ml-6 space-y-3 text-white/90">
                  <li>Kurung → kerjakan yang di dalam tanda kurung terlebih dahulu.</li>
                  <li>Pangkat / Akar → operasi berpangkat atau berakar dikerjakan setelah kurung.</li>
                  <li>Perkalian / Pembagian (× / :) → dikerjakan dari kiri ke kanan.</li>
                  <li>Penjumlahan / Pengurangan (+ / −) → dilakukan terakhir, juga dari kiri ke kanan.</li>
                </ol>
              </section>

              {/* II. Operasi Pangkat */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  II. Operasi Pangkat
                </h2>
                <ol className="list-decimal ml-6 space-y-3 text-white/90">
                  <li>a pangkat n = a × a × a (sebanyak n kali).</li>
                  <li>Semua yang di pangkat 1 adalah bilangan itu sendiri.</li>
                  <li>Semua yang di pangkat 0 hasilnya 1.</li>
                  <li>Jika pangkatnya negatif, maka hasilnya adalah 1 dibagi bilangan tersebut berpangkat positif.</li>
                  <li>Bilangan berpangkat dipangkatkan lagi, maka pangkatnya dikalikan.</li>
                  <li>Bilangan berpangkat sama dikalikan, maka pangkatnya dijumlahkan.</li>
                  <li>Bilangan berpangkat sama dibagi, maka pangkatnya dikurangkan.</li>
                </ol>
              </section>

              {/* III. Operasi Akar */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  III. Operasi Akar
                </h2>
                <ol className="list-decimal ml-6 space-y-3 text-white/90">
                  <li>Perkalian akar maka kalikan akar di dalamnya.</li>
                  <li>Penjumlahan akar maka masing-masing akar di dalamnya ditambah, 2 × kali akar tersebut.</li>
                  <li>Pembagian akar maka harus dikali sekawan dengan akar yang menjadi penyebutnya.</li>
                </ol>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
