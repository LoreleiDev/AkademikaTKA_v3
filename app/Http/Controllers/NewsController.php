<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Carbon;

class NewsController extends Controller
{
    public function publicIndex()
    {
        try {

            $news = News::active()
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'news' => $news
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch public news: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch news'
            ], 500);
        }
    }

    public function index()
    {
        try {

            $news = News::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'news' => $news
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch news: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch news'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('=== START NEWS CREATION ===');

            $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
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
                    'folder' => 'akademika_tka/news',
                    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', 'akademika_tka_berita')
                ]
            );

            Log::info('Upload result', ['result' => $uploadResult]);

            $date = Carbon::now()->locale('id')->translatedFormat('l, d F Y');

            $news = News::create([
                'title' => $request->title,
                'category' => $request->category,
                'description' => $request->description,
                'image_url' => $uploadResult['secure_url'],
                'public_id' => $uploadResult['public_id'],
                'date' => $date,
                'start_date' => $request->start_date ? Carbon::parse($request->start_date) : null,
                'end_date' => $request->end_date ? Carbon::parse($request->end_date) : null,
            ]);

            Log::info('News created successfully', ['id' => $news->id]);

            return response()->json([
                'success' => true,
                'message' => 'News created successfully',
                'news' => $news
            ], 201);
        } catch (\Exception $e) {
            Log::error('NEWS CREATION FAILED: ' . $e->getMessage());
            Log::error('TRACE: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create news: ' . $e->getMessage(),
                'debug' => 'Check laravel.log for details'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Updating news', ['news_id' => $id]);

            $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            $news = News::find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'News not found'
                ], 404);
            }

            $updateData = [
                'title' => $request->title,
                'category' => $request->category,
                'description' => $request->description,
                'start_date' => $request->start_date ? Carbon::parse($request->start_date) : null,
                'end_date' => $request->end_date ? Carbon::parse($request->end_date) : null,
            ];

            if ($request->hasFile('image')) {
                Log::info('Updating news image', ['news_id' => $id]);


                if ($news->public_id) {
                    try {
                        Cloudinary::destroy($news->public_id);
                        Log::info('Old image deleted from Cloudinary', ['public_id' => $news->public_id]);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete old image from Cloudinary: ' . $e->getMessage());
                    }
                }


                $cloudinary = app('cloudinary');
                $uploadedFile = $request->file('image');
                $uploadResult = $cloudinary->uploadApi()->upload(
                    $uploadedFile->getRealPath(),
                    [
                        'folder' => 'akademika_tka/news',
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

            $news->update($updateData);
            Log::info('News updated successfully', ['news_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'News updated successfully',
                'news' => $news
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update news: ' . $e->getMessage(), [
                'news_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update news: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            Log::info('Deleting news', ['news_id' => $id]);

            $news = News::find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'News not found'
                ], 404);
            }


            if ($news->public_id) {
                try {
                    $cloudinary = app('cloudinary');
                    $cloudinary->uploadApi()->destroy($news->public_id);
                    Log::info('Image deleted from Cloudinary', ['public_id' => $news->public_id]);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete image from Cloudinary: ' . $e->getMessage());
                }
            }

            $news->delete();
            Log::info('News deleted successfully', ['news_id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'News deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete news: ' . $e->getMessage(), [
                'news_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete news: ' . $e->getMessage()
            ], 500);
        }
    }
}
