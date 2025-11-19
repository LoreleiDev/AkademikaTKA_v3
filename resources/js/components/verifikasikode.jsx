export default function VerifikasiKode() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans">
      <div className="w-full max-w-2xl text-center text-white">
        
        {/* Heading */}
        <h1 className="text-4xl font-semibold mb-3">Verifikasi Kode</h1>
        <p className="text-lg mb-10">
          Kami telah mengirimkan kode 6 digit ke <span className="font-semibold">naufal@gmail.com</span>
        </p>

        {/* Input Section */}
        <div className="text-left mb-6">
          <label className="text-xl font-semibold">Kode Verifikasi</label>
          <input
            type="text"
            placeholder="Masukkan Kode Verifikasi"
            className="w-full mt-2 p-4 rounded-md bg-[#054766] outline-none text-white placeholder-white/50 border border-white/30"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-6 mt-10">
          <button className="w-1/2 py-4 rounded-md bg-[#60C5FF] text-white text-lg font-semibold hover:opacity-90 transition">
            Kembali
          </button>

          <button className="w-1/2 py-4 rounded-md bg-[#0095E8] text-white text-lg font-semibold hover:opacity-90 transition">
            Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
}
