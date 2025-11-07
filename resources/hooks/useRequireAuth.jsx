import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function useRequireAuth() {
    const navigate = useNavigate();

    const checkAuth = (callback) => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            Swal.fire({
                title: "Butuh Login",
                text: "Silakan login dulu untuk mengakses halaman ini.",
                icon: "info",
                confirmButtonText: "Login Sekarang",
                confirmButtonColor: "#0284c7", 
                background: "#e0f2fe", 
                color: "#0369a1", 
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
        } else {
            callback?.();
        }
    };

    return { checkAuth };
}
