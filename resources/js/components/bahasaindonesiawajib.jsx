import Navbar from "./navbar"
import Footer from "./footer"
import jenisKataImg from "../assets/jenisKata.png" // ganti sesuai nama file gambarmu

export default function BahasaIndonesiaWajib() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Judul Halaman */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Jenis Kata
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Gambar di Kiri */}
            <div className="lg:w-1/2 w-full">
              <img
                src={jenisKataImg}
                alt="Jenis Kata"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            {/* Penjelasan di Kanan */}
            <div className="lg:w-1/2 w-full text-white leading-relaxed space-y-10 text-lg md:text-xl">
              {/* I. Kata Benda */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">I. Kata Benda (Nomina)</h2>
                <p className="text-white/90 mb-3">
                  Menunjukkan nama orang, tempat, benda, atau hal.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-white/90">
                  <li>Bisa dihitung (banyak, beberapa, sedikit).</li>
                  <li>Negasi: bukan.</li>
                  <li>Norminalisasi: akhiran -an, -pe-, -per-, -ke-, -an, -isasi.</li>
                </ul>
                <p className="mt-3">Contoh: buku, guru, keindahan, pendidikan.</p>
              </section>

              {/* II. Kata Sifat */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">II. Kata Sifat (Adjektiva)</h2>
                <p className="text-white/90 mb-3">
                  Menunjukkan sifat atau keadaan suatu benda atau orang.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-white/90">
                  <li>Bisa dibandingkan (lebih, sangat, agak).</li>
                  <li>Negasi: tidak.</li>
                  <li>Norminalisasi: akhiran -wi, -iah, -i, -al, -if.</li>
                </ul>
                <p className="mt-3">Contoh: besar, cantik, bahagia, alami.</p>
              </section>

              {/* III. Kata Kerja */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">III. Kata Kerja (Verba)</h2>
                <p className="text-white/90 mb-3">
                  Menunjukkan tindakan, perbuatan, atau aktivitas.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-white/90">
                  <li>Sering disertai kata (sedang, belum, akan).</li>
                  <li>Negasi: tidak.</li>
                  <li>Awalan: me-, ber-, di-, ter-, ke-, an.</li>
                </ul>
                <p className="mt-3">Contoh: makan, berjalan, ditulis, tertidur.</p>
              </section>

              {/* IV. Kata Ganti */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">IV. Kata Ganti (Pronomina)</h2>
                <p className="text-white/90 mb-3">
                  Digunakan untuk menggantikan kata benda.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-white/90">
                  <li>Kata ganti orang: saya, kamu.</li>
                  <li>Kata ganti tempat: sana, situ.</li>
                  <li>Kata ganti penunjuk: ini, itu.</li>
                </ul>
                <p className="mt-3">Contoh: Buku ini punya saya.</p>
              </section>

              {/* V. Kata Tugas */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">V. Kata Tugas</h2>
                <p className="text-white/90 mb-3">
                  Berfungsi menghubungkan, menunjukkan hubungan, atau memperjelas makna kalimat.
                </p>
                <ul className="list-disc ml-6 space-y-1 text-white/90">
                  <li>Konjungsi (kata penghubung): dan, atau, tetapi.</li>
                  <li>Preposisi (kata depan): di, ke, dari, pada.</li>
                  <li>Modalitas: akan, ingin, telah, sedang.</li>
                </ul>
                <p className="mt-3">Contoh: Saya ingin belajar di sekolah.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
