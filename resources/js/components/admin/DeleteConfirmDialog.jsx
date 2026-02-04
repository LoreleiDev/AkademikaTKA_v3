import { Button } from "../../components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DeleteConfirmDialog({ user, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-10 z-40" onClick={onCancel}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-sm w-full">
          <div className="p-6 border-b text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Hapus User?</h2>
            <p className="text-gray-600 text-sm">Anda akan menghapus user <strong>{user?.name}</strong> ({user?.email}).<br />Tindakan ini tidak dapat dibatalkan.</p>
          </div>

          <div className="p-6 flex gap-3">
            <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">Batal</button>
            <Button onClick={handleConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">{loading ? 'Menghapus...' : 'Hapus Sekarang'}</Button>
          </div>
        </div>
      </div>
    </>
  );
}
