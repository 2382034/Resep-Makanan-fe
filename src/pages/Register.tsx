import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import axios from "../utils/AxiosInstance";

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
  // Optional: Tambahkan konfirmasi password jika diperlukan backend
  // password_confirmation: string;
};

// Nama komponen diubah agar konsisten dengan export default
const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // Optional: Tambahkan watch jika perlu validasi konfirmasi password
    // watch
  } = useForm<RegisterInput>();

  // Optional: Watch password untuk validasi konfirmasi
  // const password = watch("password");

  const handleRegister = async (data: RegisterInput) => {
    try {
      // Kirim data yang diperlukan oleh endpoint register Anda
      await axios.post("/api/auth/register", { // Pastikan endpoint ini benar
        email: data.email,
        username: data.username,
        password: data.password
      });
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login"); // Arahkan ke login setelah registrasi
    } catch (err: any) { // Tangkap error lebih spesifik
      console.error("Registration error:", err);
      // Berikan feedback error yang lebih baik berdasarkan response server jika memungkinkan
      if (err.response && err.response.data && err.response.data.message) {
         alert(`Registrasi gagal: ${err.response.data.message}`);
      } else {
         alert("Registrasi gagal. Username atau email mungkin sudah terdaftar.");
      }
    }
  };

  const { mutate, isPending } = useMutation({ // Ganti nama state ke isPending agar lebih jelas
    mutationFn: handleRegister,
    onError: (error) => {
        console.error("Mutation error:", error);
        // Tidak perlu alert lagi di sini karena sudah ditangani di handleRegister (atau pindah ke sini)
    }
   });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Branding & Info */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-gradient-to-br from-orange-400 to-red-500 text-white">
         {/* Optional: Tambahkan gambar/logo */}
         {/* <img src="/path/to/your/logo.png" alt="DapurKita Logo" className="w-24 h-24 mb-6"/> */}
         <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Bergabung dengan DapurKita</h1>
         <p className="text-lg md:text-xl text-center mb-8 max-w-md">
           Daftar gratis untuk mulai menyimpan resep favorit, membagikan kreasi masakanmu, dan terhubung dengan pecinta kuliner lainnya!
         </p>
         <Link
            to="/login"
            className="flex items-center bg-white text-orange-600 font-semibold rounded-full py-3 px-6 hover:bg-gray-100 transition-colors shadow-md"
          >
            <span className="mr-2">Sudah punya akun? Masuk</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
         </Link>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12">
        <div className="bg-white w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Buat Akun Baru
          </h2>

          <form
            className="space-y-5"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`mt-1 block w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                {...register("username", { required: "Username wajib diisi" })}
              />
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`mt-1 block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                {...register("email", {
                    required: "Email wajib diisi",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Format email tidak valid"
                    }
                 })}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`mt-1 block w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                {...register("password", {
                    required: "Password wajib diisi",
                    minLength: { value: 6, message: "Password minimal 6 karakter" } // Contoh validasi panjang
                })}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Optional: Confirm Password Field */}
            {/* <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                className={`mt-1 block w-full px-4 py-3 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-orange-500 focus:border-orange-500 focus:outline-none`}
                {...register("password_confirmation", {
                    required: "Konfirmasi password wajib diisi",
                    validate: value =>
                        value === password || "Konfirmasi password tidak cocok"
                })}
                autoComplete="new-password"
              />
              {errors.password_confirmation && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div> */}

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              disabled={isPending} // Gunakan isPending
            >
              {isPending ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link // Gunakan Link
              to="/login"
              className="text-orange-600 font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; // Pastikan export default menggunakan nama yang sama