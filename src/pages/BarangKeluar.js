import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BarangKeluar = () => {
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({
    barang_id: "",
    jumlah: "",
    tanggal: "",
  });
  const [editId, setEditId] = useState(null); // To track which item is being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBarangKeluar();
    fetchBarangList();
  }, []);

  // Mengambil data barang keluar menggunakan API
  const fetchBarangKeluar = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/barang-keluar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBarangKeluar(data);
    } catch (err) {
      console.error("Gagal mengambil data barang keluar", err);
    }
  };

  // Menambil data barang menggunakan API
  const fetchBarangList = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/barang", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBarangList(data);
    } catch (err) {
      console.error("Gagal mengambil daftar barang", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Menambahkan data barang keluar menggunakan API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/barang-keluar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          barang_id: formData.barang_id,
          jumlah: parseInt(formData.jumlah, 10),
          tanggal: formData.tanggal,
        }),
      });

      if (response.ok) {
        await fetchBarangKeluar();
        setFormData({ barang_id: "", jumlah: "", tanggal: "" });
        document.getElementById("closeModal").click();
      } else {
        console.error("Gagal menambah barang keluar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Edit barang keluar menggunakan API
  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      barang_id: item.barang_id,
      jumlah: item.jumlah,
      tanggal: item.tanggal.split("T")[0], // Format date for input
    });
  };

  // Edit barang keluar menggunakan API
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang-keluar/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            barang_id: formData.barang_id,
            jumlah: parseInt(formData.jumlah, 10),
            tanggal: formData.tanggal,
          }),
        }
      );

      if (response.ok) {
        await fetchBarangKeluar();
        setFormData({ barang_id: "", jumlah: "", tanggal: "" });
        setEditId(null);
        document.getElementById("closeEditModal").click();
      } else {
        console.error("Gagal mengupdate barang keluar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Hapus barang keluar menggunakan API
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/barang-keluar/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          await fetchBarangKeluar();
        } else {
          console.error("Gagal menghapus barang keluar");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  // Filter data berdasarkan keyword pencarian
  const filteredItems = barangKeluar.filter((item) => {
    const searchMatch = item.nama_barang
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    return searchMatch;
  });

  // Paginasi
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Reset ke halaman 1 ketika search atau itemsPerPage berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, itemsPerPage]);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">BARANG KELUAR</h2>

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarangKeluar"
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang Keluar
            </button>

            {/* Dropdown untuk memilih jumlah data per halaman */}
            <div className="card mt-3 bg-light">
              {/* Dropdown Pilihan Jumlah Data */}
              <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                <div>
                  <label className="m-3">Tampilkan:</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="d-flex align-items-center w-25 me-3">
                  <label className="me-2 fw-semibold">Search:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama barang..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Tanggal Barang Keluar</th>
                      <th>Nama Barang</th>
                      <th>Jumlah Keluar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td>
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>{item.nama_barang}</td>
                          <td>{item.jumlah}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-warning me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarangKeluar"
                              onClick={() => handleEditClick(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          {searchKeyword
                            ? "Tidak ditemukan barang dengan nama tersebut"
                            : "Tidak ada data barang keluar"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredItems.length > 0 && (
                <div className="d-flex justify-content-between align-items-center m-3">
                  <span>
                    Menampilkan {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, filteredItems.length)} dari{" "}
                    {filteredItems.length} item
                  </span>
                  <div>
                    <button
                      className="btn btn-outline-primary me-3"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      &laquo; Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next &raquo;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang Keluar */}
      <div className="modal fade" id="modalTambahBarangKeluar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Barang Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeModal"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <select
                    className="form-control"
                    name="barang_id"
                    value={formData.barang_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Barang</option>
                    {barangList.map((barang) => (
                      <option key={barang.id} value={barang.id}>
                        {barang.nama_barang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Barang Keluar */}
      <div className="modal fade" id="modalEditBarangKeluar" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Barang Keluar</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="closeEditModal"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <select
                    className="form-control"
                    name="barang_id"
                    value={formData.barang_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Barang</option>
                    {barangList.map((barang) => (
                      <option key={barang.id} value={barang.id}>
                        {barang.nama_barang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Jumlah</label>
                  <input
                    type="number"
                    className="form-control"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangKeluar;
