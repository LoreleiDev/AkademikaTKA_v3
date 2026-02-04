import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function HomeUniversityStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try { setLoading(true); const res = await api.get('/university-stats'); setStats(res.data.stats || []); }
    catch (err) { console.error(err); setStats([]); }
    finally { setLoading(false); }
  };

  return (
    <section className="mt-6 p-6 bg-sky-800 rounded-xl shadow-sm">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-white">Statistik Rata-rata Nilai Diterima</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-white shadow border border-sky-200">
              <h3 className="font-semibold text-sky-700">{s.university_name}</h3>
              <p className="text-sm text-sky-500">{s.program_name}</p>
              <p className="mt-2 text-2xl font-bold text-sky-600">{parseFloat(s.average_score).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
