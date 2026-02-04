<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UniversityStat;
use Illuminate\Support\Facades\Validator;

class AdminUniversityStatController extends Controller
{
    // Public index for home page
    public function publicIndex()
    {
        $stats = UniversityStat::orderBy('average_score', 'desc')->get();
        return response()->json(['success' => true, 'stats' => $stats], 200);
    }

    // Admin: list
    public function index()
    {
        $stats = UniversityStat::orderBy('created_at', 'desc')->get();
        return response()->json(['message' => 'Stats retrieved', 'stats' => $stats], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'university_name' => 'required|string|max:255',
            'program_name' => 'nullable|string|max:255',
            'average_score' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $stat = UniversityStat::create($request->only(['university_name', 'program_name', 'average_score']));

        return response()->json(['message' => 'Created', 'stat' => $stat], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'university_name' => 'sometimes|required|string|max:255',
            'program_name' => 'sometimes|nullable|string|max:255',
            'average_score' => 'sometimes|required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $stat = UniversityStat::findOrFail($id);
        $stat->update($request->only(['university_name', 'program_name', 'average_score']));

        return response()->json(['message' => 'Updated', 'stat' => $stat], 200);
    }

    public function destroy($id)
    {
        $stat = UniversityStat::findOrFail($id);
        $stat->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
