import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from "./components/hero";
import Login from "./components/login";
import Daftar from "./components/daftar";
import News from './components/news';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="login" element={<Login/>} />
        <Route path="daftar" element={<Daftar/>} />
        <Route path="news" element={<News/>} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);