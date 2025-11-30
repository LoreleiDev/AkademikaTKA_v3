<?php

namespace App\Http\Controllers;

use App\Models\Iklan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class IklanController extends Controller
{
    public function index()
    {
        try {
            $iklan = Iklan::orderBy('created_at', 'desc')->get();


            return response()->json([
                'success' => true,
                'iklan' => $iklan,
                'message' => $iklan->isEmpty() ? 'Tidak ada iklan aktif!' : 'Mengumpulkan iklan berhasil!'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch iklan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch iklan',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function publicIndex()
    {
        try {
            $iklan = Iklan::active()
                ->orderBy('created_at', 'desc')
                ->get();


            return response()->json([
                'success' => true,
                'iklan' => $iklan,
                'message' => $iklan->isEmpty() ? 'Tidak ada iklan aktif!' : 'Mengumpulkan iklan berhasil!'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch public iklan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch advertisements',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('=== START IKLAN CREATION ===');

            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            Log::info('Validation passed');


            $cloudinary = app('cloudinary');
            $uploadedFile = $request->file('image');

            Log::info('File details', [
                'name' => $uploadedFile->getClientOriginalName(),
                'size' => $uploadedFile->getSize(),
                'mime' => $uploadedFile->getMimeType()
            ]);


            $uploadResult = $cloudinary->uploadApi()->upload(
                $uploadedFile->getRealPath(),
                [
                    'folder' => 'akademika_tka/iklan',
                    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                ]
            );

            Log::info('Upload result', ['result' => $uploadResult]);

            $iklan = Iklan::create([
                'image_url' => $uploadResult['secure_url'],
                'public_id' => $uploadResult['public_id'],
                'start_date' => $request->start_date ? Carbon::parse($request->start_date) : null,
                'end_date' => $request->end_date ? Carbon::parse($request->end_date) : null,
            ]);

            Log::info('Iklan created successfully', ['id' => $iklan->id]);

            return response()->json([
                'success' => true,
                'message' => 'Iklan created successfully',
                'iklan' => $iklan
            ], 201);
        } catch (\Exception $e) {
            Log::error('IKLAN CREATION FAILED: ' . $e->getMessage());
            Log::error('TRACE: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create iklan: ' . $e->getMessage(),
                'debug' => 'Check laravel.log for details'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Updating iklan', ['iklan_id' => $id]);

            $request->validate([
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $iklan = Iklan::find($id);

            if (!$iklan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Iklan not found'
                ], 404);
            }

            $updateData = [
                'start_date' => $request->start_date ? Carbon::parse($request->start_date) : null,
                'end_date' => $request->end_date ? Carbon::parse($request->end_date) : null,
            ];

            if ($request->hasFile('image')) {
                Log::info('Updating iklan image', ['iklan_id' => $id]);


                if ($iklan->public_id) {
                    try {
                        $cloudinary = app('cloudinary');
                        $cloudinary->uploadApi()->destroy($iklan->public_id);
                        Log::info('Old image deleted from Cloudinary', ['public_id' => $iklan->public_id]);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete old image from Cloudinary: ' . $e->getMessage());
                    }
                }


                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/iklan',
                        'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                    ]
                );

                $updateData['image_url'] = $uploadResult['secure_url'];
                $updateData['public_id'] = $uploadResult['public_id'];

                Log::info('New image uploaded to Cloudinary', [
                    'secure_url' => $uploadResult['secure_url'],
                    'public_id' => $uploadResult['public_id']
                ]);
            }

            $iklan->update($updateData);
            Log::info('Iklan updated successfully', ['iklan_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Iklan updated successfully',
                'iklan' => $iklan
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update iklan: ' . $e->getMessage(), [
                'iklan_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update iklan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('Deleting iklan', ['iklan_id' => $id]);

            $iklan = Iklan::find($id);

            if (!$iklan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Iklan not found'
                ], 404);
            }


            if ($iklan->public_id) {
                try {
                    $cloudinary = app('cloudinary');
                    $cloudinary->uploadApi()->destroy($iklan->public_id);
                    Log::info('Image deleted from Cloudinary', ['public_id' => $iklan->public_id]);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete image from Cloudinary: ' . $e->getMessage());
                }
            }

            $iklan->delete();
            Log::info('Iklan deleted successfully', ['iklan_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Iklan deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete iklan: ' . $e->getMessage(), [
                'iklan_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete iklan: ' . $e->getMessage()
            ], 500);
        }
    }
}
