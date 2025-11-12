import Navbar from "./navbar"
import Footer from "./footer"
import presentTenseImg from "../assets/presentTense.png" // ganti sesuai nama file kamu

export default function BahasaInggrisWajib() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-t from-[#014B69] to-[#03A9F4] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Judul Utama */}
          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            Present Tense
          </h1>

          <div className="flex flex-col lg:flex-row items-start gap-10">
            {/* Gambar di Kiri */}
            <div className="lg:w-1/2 w-full">
              <img
                src={presentTenseImg}
                alt="Present Tense"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            {/* Penjelasan di Kanan */}
            <div className="lg:w-1/2 w-full text-white leading-relaxed space-y-10 text-lg md:text-xl">
              {/* I. Simple Present */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">I. Simple Present</h2>
                <p className="text-white/90 mb-3">
                  Digunakan untuk menyatakan kebiasaan, fakta, atau rutinitas sehari-hari.
                </p>
                <div>
                  <p className="font-semibold mb-2">Contoh:</p>
                  <ul className="list-disc ml-6 space-y-1 text-white/90">
                    <li>I go to school every day.</li>
                    <li>She is a teacher.</li>
                  </ul>
                </div>
              </section>

              {/* II. Present Continuous */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">II. Present Continuous</h2>
                <p className="text-white/90 mb-3">
                  Digunakan untuk menyatakan kegiatan yang sedang berlangsung sekarang.
                </p>
                <div>
                  <p className="font-semibold mb-2">Contoh:</p>
                  <ul className="list-disc ml-6 space-y-1 text-white/90">
                    <li>I am studying now.</li>
                    <li>They are playing football at the moment.</li>
                  </ul>
                </div>
              </section>

              {/* III. Present Perfect */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">III. Present Perfect</h2>
                <p className="text-white/90 mb-3">
                  Digunakan untuk menyatakan kejadian yang sudah terjadi dan masih ada hubungannya dengan sekarang.
                </p>
                <div>
                  <p className="font-semibold mb-2">Contoh:</p>
                  <ul className="list-disc ml-6 space-y-1 text-white/90">
                    <li>I have finished my homework.</li>
                    <li>She has lived here for five years.</li>
                  </ul>
                </div>
              </section>

              {/* IV. Present Perfect Continuous */}
              <section>
                <h2 className="text-3xl font-semibold mb-4">
                  IV. Present Perfect Continuous
                </h2>
                <p className="text-white/90 mb-3">
                  Digunakan untuk menyatakan kegiatan yang dimulai di masa lalu dan masih berlangsung sampai sekarang.
                </p>
                <div>
                  <p className="font-semibold mb-2">Contoh:</p>
                  <ul className="list-disc ml-6 space-y-1 text-white/90">
                    <li>I have been studying English for three years.</li>
                    <li>He has been working since morning.</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
