import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { useMutation } from "@tanstack/react-query";

export type LoginInput = {
  email: string;
  password: string;
};

// Nama komponen diubah agar konsisten dengan export default
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>();

  const handleLogin = async (data: LoginInput) => {
    try {
      // Pastikan tipe data response sesuai dengan yang diharapkan dari backend Anda
      const res = await axios.post<{ access_token: string; user: { id: number; username: string; email: string } }>(
        "/api/auth/login", // Pastikan endpoint ini benar
        {
          email: data.email,
          password: data.password
        }
      );

      if (res.data && res.data.access_token && res.data.user) {
        login(res.data.access_token, res.data.user);
        navigate("/"); // Arahkan ke Home setelah login berhasil
      } else {
        // Berikan pesan error yang lebih spesifik jika memungkinkan
        console.error("Login response missing data:", res);
        alert("Email atau password salah.");
      }
    } catch (err: any) { // Tangkap error lebih spesifik jika perlu (misal error 401)
      console.error("Login error:", err);
      alert("Email atau password salah."); // Pesan error generik
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin,
    // Anda bisa menambahkan onError di sini untuk menangani error dari mutation
    onError: (error) => {
        console.error("Mutation error:", error);
        // Tidak perlu alert lagi di sini karena sudah ditangani di handleLogin (atau bisa dipindah ke sini)
    }
  });

  // Tidak perlu fungsi handleGetStarted terpisah, bisa langsung pakai Link
  // const handleGetStarted = () => {
  //   navigate("/register");
  // };

  return (
    <div className="flex min-h-screen bg-gray-100"> {/* Ubah warna background utama jika perlu */}
      {/* Left Side - Branding & Info */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-gradient-to-br from-orange-400 to-red-500 text-white">
        {/* Optional: Tambahkan gambar/logo */}
         {/* <img src="/path/to/your/logo.png" alt="DapurKita Logo" className="w-24 h-24 mb-6"/> */}
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">DapurKita</h1>
         <p className="text-lg md:text-xl text-center mb-8 max-w-md">
            Masuk untuk menyimpan resep favoritmu, bagikan kreasimu, dan jelajahi dunia kuliner tanpa batas!
         </p>
         <Link
           to="/register"
           className="flex items-center bg-white text-orange-600 font-semibold rounded-full py-3 px-6 hover:bg-gray-100 transition-colors shadow-md"
         >
           <span className="mr-2">Belum punya akun? Daftar</span>
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M5 12h14M12 5l7 7-7 7"/>
           </svg>
         </Link>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">Masuk ke Akun Anda</h2>

          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                {...register("email", { required: "Email wajib diisi" })}
                autoComplete="username" // Keep for browser autofill hint
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                {...register("password", { required: "Password wajib diisi" })}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
               {/* Optional: Forgot password link */}
               {/* <div className="text-right mt-1">
                 <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
                   Lupa Password?
                 </Link>
               </div> */}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link // Gunakan Link untuk navigasi internal
              to="/register"
              className="text-orange-600 font-semibold hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; // Pastikan export default menggunakan nama yang sama