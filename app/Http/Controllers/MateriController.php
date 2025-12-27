<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class MateriController extends Controller
{
    public function index()
    {
        try {
            $mapels = Mapel::with('materis')->get();

            return response()->json([
                'success' => true,
                'mapels' => $mapels
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch materials: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal memuat materi'], 500);
        }
    }

    public function storeMapel(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:mapels',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'home_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Validasi untuk home_image
        ]);

        try {
            $data = ['name' => $request->input('name')];

            // Proses upload image mapel
            if ($request->hasFile('image')) {
                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/mapel',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['image_url'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            // Proses upload home_image
            if ($request->hasFile('home_image')) {
                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('home_image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/mapel_home', // Folder untuk home_image
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['home_image_url'] = $uploadResult['secure_url'];
                $data['home_public_id'] = $uploadResult['public_id']; // Simpan public_id untuk home_image
            }

            $mapel = Mapel::create($data);
            return response()->json(['success' => true, 'mapel' => $mapel], 201);
        } catch (\Exception $e) {
            Log::error('Gagal menyimpan mapel: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal membuat mapel'], 500);
        }
    }

    public function updateMapel(Request $request, $id)
    {
        $mapel = Mapel::find($id);
        if (!$mapel) {
            return response()->json(['success' => false, 'message' => 'Mapel tidak ditemukan'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:mapels,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'home_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Validasi untuk home_image
        ]);

        try {
            $data = ['name' => $request->input('name')];

            // Proses upload image mapel
            if ($request->hasFile('image')) {
                // Hapus image lama jika ada
                if ($mapel->public_id) {
                    try {
                        $cloudinary = app('cloudinary');
                        $cloudinary->uploadApi()->destroy($mapel->public_id);
                    } catch (\Exception $e) {
                        Log::warning('Gagal hapus gambar mapel lama: ' . $e->getMessage());
                    }
                }

                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/mapel',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['image_url'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            // Proses upload home_image
            if ($request->hasFile('home_image')) {
                // Hapus home_image lama jika ada
                if ($mapel->home_public_id) { // Gunakan field yang menyimpan public_id home_image
                    try {
                        $cloudinary = app('cloudinary');
                        $cloudinary->uploadApi()->destroy($mapel->home_public_id); // Hapus dengan public_id yang benar
                    } catch (\Exception $e) {
                        Log::warning('Gagal hapus gambar home lama: ' . $e->getMessage());
                    }
                }

                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('home_image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/mapel_home', // Folder untuk home_image
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['home_image_url'] = $uploadResult['secure_url'];
                $data['home_public_id'] = $uploadResult['public_id']; // Simpan public_id untuk home_image
            }

            $mapel->update($data);
            $mapel->refresh();
            return response()->json(['success' => true, 'mapel' => $mapel]);
        } catch (\Exception $e) {
            Log::error('Gagal update mapel: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal mengupdate mapel'], 500);
        }
    }

    public function uploadHomeImage(Request $request, $id)
    {
        $mapel = Mapel::find($id);
        if (!$mapel) {
            return response()->json(['success' => false, 'message' => 'Mapel tidak ditemukan'], 404);
        }

        $request->validate([
            'home_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {
            if ($request->hasFile('home_image')) {
                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('home_image');


                if ($mapel->home_image_url) {
                    try {
                        $urlParts = explode('/', $mapel->home_image_url);
                        $publicId = basename($urlParts[count($urlParts) - 1]);
                        $publicId = preg_replace('/\.[^.]+$/', '', $publicId);
                        $cloudinary->uploadApi()->destroy($publicId);
                    } catch (\Exception $e) {
                        Log::warning('Gagal hapus gambar home lama: ' . $e->getMessage());
                    }
                }


                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/mapel_home',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );


                $mapel->update(['home_image_url' => $uploadResult['secure_url']]);
            }

            return response()->json(['success' => true, 'mapel' => $mapel], 200);
        } catch (\Exception $e) {
            Log::error('Gagal upload home image: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal upload home image'], 500);
        }
    }

    public function storeMateri(Request $request)
    {
        $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {

            $content = json_decode($request->input('content'), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['success' => false, 'message' => 'Format content tidak valid'], 400);
            }

            $data = [
                'mapel_id' => $request->input('mapel_id'),
                'title' => $request->input('title'),
                'content' => $content,
            ];

            if ($request->hasFile('image')) {
                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/materi',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['image_url'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            $materi = Materi::create($data);
            return response()->json(['success' => true, 'materi' => $materi], 201);
        } catch (\Exception $e) {
            Log::error('Gagal menyimpan materi: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal menyimpan materi'], 500);
        }
    }

    public function updateMateri(Request $request, $id)
    {
        $materi = Materi::find($id);
        if (!$materi) {
            return response()->json(['success' => false, 'message' => 'Materi tidak ditemukan'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {

            $content = json_decode($request->input('content'), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['success' => false, 'message' => 'Format content tidak valid'], 400);
            }

            $data = [
                'title' => $request->input('title'),
                'content' => $content,
            ];

            if ($request->hasFile('image')) {
                if ($materi->public_id) {
                    try {
                        $cloudinary = app('cloudinary');
                        $cloudinary->uploadApi()->destroy($materi->public_id);
                    } catch (\Exception $e) {
                        Log::warning('Gagal hapus gambar lama: ' . $e->getMessage());
                    }
                }

                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/materi',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );
                $data['image_url'] = $uploadResult['secure_url'];
                $data['public_id'] = $uploadResult['public_id'];
            }

            $materi->update($data);
            $materi->refresh();

            return response()->json(['success' => true, 'materi' => $materi]);
        } catch (\Exception $e) {
            Log::error('Gagal update materi: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal mengupdate materi'], 500);
        }
    }

    public function destroyMateri($id)
    {
        $materi = Materi::find($id);
        if (!$materi) {
            return response()->json(['success' => false, 'message' => 'Materi tidak ditemukan'], 404);
        }

        if ($materi->public_id) {
            try {
                $cloudinary = app('cloudinary');
                $cloudinary->uploadApi()->destroy($materi->public_id);
            } catch (\Exception $e) {
                Log::warning('Gagal hapus gambar dari Cloudinary: ' . $e->getMessage());
            }
        }

        $materi->delete();
        return response()->json(['success' => true, 'message' => 'Materi berhasil dihapus']);
    }

    public function destroyMapel($id)
    {
        $mapel = Mapel::find($id);
        if (!$mapel) {
            return response()->json(['success' => false, 'message' => 'Mapel tidak ditemukan'], 404);
        }

        // Hapus semua materi dan gambarnya
        foreach ($mapel->materis as $materi) {
            if ($materi->public_id) {
                try {
                    $cloudinary = app('cloudinary');
                    $cloudinary->uploadApi()->destroy($materi->public_id);
                } catch (\Exception $e) {
                    Log::warning('Gagal hapus gambar: ' . $e->getMessage());
                }
            }
            $materi->delete();
        }

        // Hapus image mapel
        if ($mapel->public_id) {
            try {
                $cloudinary = app('cloudinary');
                $cloudinary->uploadApi()->destroy($mapel->public_id);
            } catch (\Exception $e) {
                Log::warning('Gagal hapus gambar mapel: ' . $e->getMessage());
            }
        }

        // Hapus home_image menggunakan home_public_id
        if ($mapel->home_public_id) { // Gunakan field yang menyimpan public_id home_image
            try {
                $cloudinary = app('cloudinary');
                $cloudinary->uploadApi()->destroy($mapel->home_public_id); // Hapus dengan public_id yang benar
            } catch (\Exception $e) {
                Log::warning('Gagal hapus gambar home mapel: ' . $e->getMessage());
            }
        }

        $mapel->delete();
        return response()->json(['success' => true, 'message' => 'Mapel dan materi berhasil dihapus']);
    }
}