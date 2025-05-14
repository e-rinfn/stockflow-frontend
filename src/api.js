import axios from "axios";

// API pada aplikasi StokFlow Inventory Management System
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ganti dengan endpoint API Anda
});

// Fungsi untuk login
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Fungsi untuk logout
export const logout = async (token) => {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Fungsi untuk mendapatkan data inventory
export const getInventory = async (token) => {
  const response = await api.get("/barang", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fungsi untuk mendapatkan data barang masuk
export const getBarangMasuk = async (token) => {
  const response = await api.get("/barang-masuk", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fungsi untuk mendapatkan data barang keluar
export const getBarangKeluar = async (token) => {
  const response = await api.get("/barang-keluar", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
