<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class PasswordResetController extends Controller
{
    /**
     * Kirim kode reset password via email
     */
    public function sendResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email tidak ditemukan dalam sistem kami.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            $resetCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => $resetCode,
                    'created_at' => Carbon::now()
                ]
            );

            try {
                Mail::to($user->email)->send(new PasswordResetMail($resetCode, $user));
                Log::info('Password reset email sent to: ' . $user->email);
            } catch (\Exception $emailError) {
                Log::error('Failed to send password reset email: ' . $emailError->getMessage());
            }

            return response()->json([
                'message' => 'Kode verifikasi berhasil dikirim ke email Anda!',
                'email' => $user->email,
                'debug_code' => $resetCode 
            ], 200);

        } catch (\Exception $e) {
            Log::error('Send reset code error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal mengirim kode verifikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verifikasi kode reset password
     */
    public function verifyResetCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:password_reset_tokens,email',
            'token' => 'required|string|size:6', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // CEK DI TABEL password_reset_tokens
            $passwordReset = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->first();

            if (!$passwordReset) {
                return response()->json([
                    'message' => 'Kode verifikasi tidak valid'
                ], 422);
            }

            // Cek expiry (60 menit)
            if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
                // Hapus token yang expired
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return response()->json([
                    'message' => 'Kode verifikasi telah kadaluarsa'
                ], 422);
            }

            return response()->json([
                'message' => 'Kode verifikasi valid',
                'email' => $request->email
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memverifikasi kode',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset password dengan kode yang sudah terverifikasi
     */
    public function resetPassword(Request $request)
{
    Log::info('Reset Password Request:', $request->all());
    
    $validator = Validator::make($request->all(), [
        'email' => 'required|email|exists:users,email',
        'token' => 'required|string|size:6', 
        'password' => 'required|string|min:6|confirmed',
    ], [
        'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        'password.min' => 'Password minimal 6 karakter.'
    ]);

    if ($validator->fails()) {
        Log::error('Validation failed:', $validator->errors()->toArray());
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        Log::info('Checking reset token for email:', ['email' => $request->email]);
        
        // Verifikasi lagi kode di password_reset_tokens
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token) 
            ->first();

        Log::info('Password reset record:', (array)$passwordReset);

        if (!$passwordReset) {
            Log::error('Invalid reset code for email:', ['email' => $request->email]);
            return response()->json([
                'message' => 'Kode verifikasi tidak valid atau telah digunakan'
            ], 422);
        }

        // Cek expiry lagi
        if (Carbon::parse($passwordReset->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            Log::error('Reset code expired for email:', ['email' => $request->email]);
            return response()->json([
                'message' => 'Kode verifikasi telah kadaluarsa'
            ], 422);
        }

        Log::info('Updating password for user:', ['email' => $request->email]);

        // Update password user
        $user = User::where('email', $request->email)->first();
        $user->password = $request->password;
        $user->save();

        // Hapus token setelah digunakan
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        Log::info('Password reset successful for email:', ['email' => $request->email]);

        return response()->json([
            'message' => 'Password berhasil direset!'
        ], 200);

    } catch (\Exception $e) {
        Log::error('Reset password error:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        
        return response()->json([
            'message' => 'Gagal mereset password',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
