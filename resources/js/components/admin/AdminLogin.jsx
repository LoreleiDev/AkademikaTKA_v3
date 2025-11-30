import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function AdminLogin() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                identifier,
                password,
            });


            if (response.data.user.role !== 'admin') {
                setError("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }


            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));


            navigate("/admin/dashboard");

        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03A9F4] to-[#015C78] px-4 font-sans">
            <div className="w-full max-w-2xl text-white">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2">Admin Login</h1>
                    <p className="text-base text-white/80">
                        Administrator access only
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/30 rounded text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block font-semibold mb-2">Username atau Email</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Username atau Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Password</label>
                        <Input
                            type="password"
                            placeholder="Masukkan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#004D67] border-white/30 text-white placeholder:text-white/60 focus-visible:ring-[#03A9F4] h-12"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#03A9F4] hover:bg-[#0288D1] text-white font-semibold py-3 rounded-md text-lg disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login as Admin"}
                    </Button>
                </form>
            </div>
        </div>
    );
}