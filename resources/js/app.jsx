import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from "./components/hero";
import Login from "./components/login";
import Daftar from "./components/daftar";
import Materi from './components/materi';
import News from './components/news';
import MatematikaWajib from './components/matematikawajib';
import BahasaInggrisWajib from './components/bahasainggriswajib';
import BahasaIndonesiaWajib from './components/bahasaindonesiawajib';
import LupaPassword from './components/lupapassword';
import VerifikasiKode from './components/verifikasikode';
import AturPasswordBaru from './components/aturpasswordbaru';
import MatematikaLanjut from './components/matematikalanjut';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/Dashboard';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="login" element={<Login/>} />
        <Route path="daftar" element={<Daftar/>} />
        <Route path="news" element={<News/>} />
        <Route path="materi" element={<Materi/>} />
        <Route path="matematikawajib" element={<MatematikaWajib/>} />
        <Route path="bahasainggriswajib" element={<BahasaInggrisWajib/>} />
        <Route path="bahasaindonesiawajib" element={<BahasaIndonesiaWajib/>} />
        <Route path="lupapassword" element={<LupaPassword/>} />
        <Route path="verifikasi-kode" element={<VerifikasiKode/>} />
        <Route path="atur-password-baru" element={<AturPasswordBaru/>} />
        <Route path="matematikalanjut" element={<MatematikaLanjut/>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);