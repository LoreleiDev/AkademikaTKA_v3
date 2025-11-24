import Navbar from "./navbar"
import Footer from "./footer"
import matriks from "../assets/mat-lanjut.png"

export default function MatematikaLanjut() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Judul Utama */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Matriks
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-10">

            {/* Gambar Kiri (1 gambar panjang) */}
            <div className="lg:w-1/2 w-full">
              <img
                src={matriks}
                alt="Materi Matriks"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            {/* Penjelasan Kanan */}
            <div className="lg:w-1/2 w-full text-white leading-relaxed space-y-10 text-lg md:text-xl">

              {/* I. Pengenalan Matriks */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  I. Pengenalan Matriks
                </h2>
                <p className="text-white/90">
                  Matriks adalah susunan bilangan berbentuk baris dan kolom.
                  Bagian horizontal disebut baris, sedangkan bagian vertikal
                  disebut kolom. Ordo matriks menunjukkan jumlah baris × kolom.
                  Contoh matriks berordo 2×2 memiliki 2 baris dan 2 kolom.
                </p>
              </section>

              {/* II. Penjumlahan Matriks */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  II. Operasi Penjumlahan Matriks
                </h2>
                <p className="text-white/90">
                  Penjumlahan matriks hanya dapat dilakukan jika kedua matriks
                  memiliki ordo yang sama. Elemen yang berada pada posisi sama
                  ditambahkan satu sama lain untuk menghasilkan matriks baru.
                </p>
              </section>

              {/* III. Perkalian Matriks */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  III. Operasi Perkalian Matriks
                </h2>
                <p className="text-white/90">
                  Matriks A bisa dikalikan dengan matriks B jika jumlah kolom A
                  sama dengan jumlah baris B. Perkalian dilakukan dengan cara
                  mengalikan setiap baris pada A dengan kolom pada B, lalu
                  menjumlahkan hasilnya.
                </p>
              </section>


            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
