import React from 'react';
// Import Link jika Anda ingin menavigasi ke halaman lain (misalnya detail resep atau kategori)
import { Link } from 'react-router-dom';

// --- Placeholder Data (Ganti dengan data asli dari API/state Anda) ---
const featuredRecipes = [
  { id: '1', title: 'Nasi Goreng Spesial', imageUrl: 'https://asset.kompas.com/crops/VcgvggZKE2VHqIAUp1pyHFXXYCs=/202x66:1000x599/1200x800/data/photo/2023/05/07/6456a450d2edd.jpg', description: 'Nasi goreng klasik dengan bumbu spesial.' },
  { id: '2', title: 'Rendang Daging Sapi', imageUrl: 'https://www.astronauts.id/blog/wp-content/uploads/2023/03/Resep-Rendang-Daging-Sapi-Untuk-Lebaran-Gurih-dan-Nikmat-1024x683.jpg', description: 'Rendang empuk kaya rempah khas Padang.' },
  { id: '3', title: 'Sup Ayam Kampung', imageUrl: 'https://www.masakapahariini.com/wp-content/uploads/2023/03/resep-sayur-sop-ayam-kampung.jpg', description: 'Sup ayam hangat dan menyehatkan.' },
];

const categories = [
  { name: 'Sarapan', slug: 'sarapan' },
  { name: 'Makan Siang', slug: 'makan-siang' },
  { name: 'Makan Malam', slug: 'makan-malam' },
  { name: 'Makanan Penutup', slug: 'makanan-penutup' },
  { name: 'Minuman', slug: 'minuman' },
  { name: 'Vegetarian', slug: 'vegetarian' },
];
// --- End Placeholder Data ---


// --- Placeholder Komponen (Idealnya ini adalah komponen terpisah) ---
interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ id, title, imageUrl, description }) => (
  <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
    <Link to={`/recipes/${id}`} className="block">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  </div>
);
// --- End Placeholder Komponen ---


const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8"> {/* Container Utama */}

      {/* Hero Section */}
      <section className="text-center mb-12 p-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg shadow-md text-white">
        {/* Anda bisa menambahkan gambar latar belakang di sini melalui CSS */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Selamat Datang di DapurKita!</h1>
        <p className="text-lg md:text-xl mb-6">Temukan ribuan resep lezat dari seluruh nusantara dan dunia.</p>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Cari resep favoritmu..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-700"
          />
          {/* Tambahkan fungsi pencarian di sini */}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Resep Unggulan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              imageUrl={recipe.imageUrl}
              description={recipe.description}
            />
          ))}
          {/* Tambahkan logika loading atau jika tidak ada resep */}
        </div>
        <div className="text-center mt-6">
            <Link to="/recipes" className="text-orange-600 hover:text-orange-800 font-medium">
              Lihat Semua Resep →
            </Link>
          </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Telusuri Berdasarkan Kategori</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/recipes/category/${category.slug}`} // Sesuaikan path jika perlu
              className="bg-white text-gray-700 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-full border border-gray-300 transition-colors duration-300 shadow-sm"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Optional: Latest Recipes Section (Strukturnya mirip Featured Recipes) */}
      {/*
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Resep Terbaru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map data resep terbaru di sini menggunakan RecipeCard */}
      {/*  </div>
      </section>
      */}

    </div>
  );
};

export default Home;