import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");

  // Oddiy login
  const handleLogin = () => {
    if (password === "admin123") {
      setIsLogged(true);
      localStorage.setItem("logged", "true");
    } else {
      alert("❌ Parol noto‘g‘ri!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("logged")) setIsLogged(true);
    fetchImages();
  }, []);

  // Barcha rasmlarni olish
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API}/images`);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Rasm yuklash
  const handleUpload = async () => {
    if (!file || !title) return alert("Rasm va sarlavha kiriting!");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await axios.post(`${API}/upload`, { base64, title });
        if (res.data.success) {
          setTitle("");
          setFile(null);
          fetchImages();
          alert("✅ Rasm yuklandi!");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Rasm yuklashda xatolik!");
      }
    };
  };

  // Rasm o‘chirish
  const handleDelete = async (id) => {
    if (!confirm("Rostdan ham o‘chirilsinmi?")) return;
    try {
      await axios.delete(`${API}/images/${id}`);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  // Login oynasi
  if (!isLogged) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
            🔐 Login
          </h2>
          <input
            type="password"
            placeholder="Parol kiriting"
            className="w-full border rounded p-2 mb-4"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  // Galereya oynasi
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        🖼️ Guruh Rasm Galereyasi
      </h1>

      <div className="max-w-xl mx-auto mb-8 bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          placeholder="Rasm nomini yozing.."
          className="border w-full p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="rasmini belgilang"
          type="file"
          accept="image"
          className="mb-3 border p-2 mr-10 font-bold"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Yuklash
        </button>

        <p>rasmini shu maydonga joylang 👆👆</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition"
          >
            <img
              src={img.url}
              alt={img.title}
              className="rounded-xl w-full h-40 object-cover"
            />
            <h3 className="mt-2 text-center font-semibold">{img.title}</h3>
            <button
              onClick={() => handleDelete(img.id)}
              className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white rounded py-1"
            >
              🗑️ O‘chirish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
