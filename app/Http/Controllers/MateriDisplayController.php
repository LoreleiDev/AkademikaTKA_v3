<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MateriDisplayController extends Controller
{
    public function getAllMapelsWithMateri()
    {
        try {
            $mapels = Mapel::with(['materis:id,mapel_id,title,content,image_url,created_at'])
                ->select('id', 'name', 'image_url', 'home_image_url')
                ->get();

            return response()->json([
                'success' => true,
                'mapels' => $mapels
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil data mapel dan materi: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal mengambil data'], 500);
        }
    }

    public function getMapelDetail($id)
    {
        try {
            $mapel = Mapel::with(['materis:id,mapel_id,title,content,image_url,created_at'])
                ->select('id', 'name', 'image_url', 'home_image_url')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'mapel' => $mapel
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil detail mapel: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Mapel tidak ditemukan'], 404);
        }
    }

    public function getMateriDetail($id)
{
    try {
        $materi = Materi::with('mapel:id,name,image_url')
            ->select('id', 'mapel_id', 'title', 'content', 'image_url', 'created_at')
            ->findOrFail($id);

        // Pastikan content adalah array
        if (is_string($materi->content)) {
            $materi->content = json_decode($materi, true);
        }

        // Gunakan clean_image_url jika diperlukan
        $materi->image_url = $materi->clean_image_url;

        return response()->json([
            'success' => true,
            'materi' => $materi
        ]);
    } catch (\Exception $e) {
        Log::error('Gagal mengambil detail materi: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Materi tidak ditemukan'], 404);
    }
}

    public function getMateriByMapel($mapelId)
    {
        try {
            $mapel = Mapel::select('id', 'name', 'image_url')->findOrFail($mapelId);

            $materis = Materi::where('mapel_id', $mapelId)
                ->select('id', 'mapel_id', 'title', 'image_url', 'created_at')
                ->get();

            return response()->json([
                'success' => true,
                'mapel' => $mapel,
                'materis' => $materis
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil materi berdasarkan mapel: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }
    }

    public function getAllMateri()
    {
        try {
            $materis = Materi::with('mapel:id,name,image_url')
                ->select('id', 'mapel_id', 'title', 'content', 'image_url', 'created_at')
                ->paginate(10); 

            return response()->json([
                'success' => true,
                'materis' => $materis
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengambil semua materi: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal mengambil data'], 500);
        }
    }
}