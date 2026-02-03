import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from "./components/hero";
import Login from "./components/login";
import Daftar from "./components/daftar";
import Materi from './components/MateriFetch';
import Materi2 from './components/materi';
import MateriDetail from './components/MateriDetail';
import News from './components/news';
import LupaPassword from './components/lupapassword';
import VerifikasiKode from './components/verifikasikode';
import AturPasswordBaru from './components/aturpasswordbaru'; 

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/Dashboard';
import NewsManagement from './components/admin/NewsManagement';
import IklanManagement from './components/admin/IklanManagement';
import MateriManagement from './components/admin/MateriManagement';
import FloatingWhatsApp from './components/floatingwhatsapp';
import Profile from './components/profile';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/daftar" element={<Daftar/>} />
        <Route path="/news" element={<News/>} />
        <Route path="/materi" element={<Materi/>} />
        <Route path="/materi2" element={<Materi2/>} />
        <Route path="/floatingwhatsapp" element={<FloatingWhatsApp/>} />
        <Route path="/materi/:id" element={<MateriDetail />} />
        {/* <Route path="matematikawajib" element={<MatematikaWajib/>} />
        <Route path="bahasainggriswajib" element={<BahasaInggrisWajib/>} />
        <Route path="bahasaindonesiawajib" element={<BahasaIndonesiaWajib/>} /> */}
        <Route path="/lupapassword" element={<LupaPassword/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/verifikasi-kode" element={<VerifikasiKode/>} />
        <Route path="/atur-password-baru" element={<AturPasswordBaru/>} />
        {/* <Route path="matematikalanjut" element={<MatematikaLanjut/>} /> */}

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/ads" element={<IklanManagement />} />
        <Route path="/admin/materi" element={<MateriManagement />} />
      </Routes>
      <FloatingWhatsApp />
    </BrowserRouter>
  </React.StrictMode>
);