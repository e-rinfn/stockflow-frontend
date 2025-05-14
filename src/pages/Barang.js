import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getInventory } from "../api";
import Navbar from "../components/Navbar";

// Dashboard Component
function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nama_barang: "",
    stok: "",
    harga: "",
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem("token");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  // Fungsi untuk menampilkan data barang
  const fetchInventory = async () => {
    try {
      const data = await getInventory(token);
      setInventory(data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    }
  };

  // Fungsi Memunculkan Modal
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      modal.style.display = "none";

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }

      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menbambahkan barang menggunakan API
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/barang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_barang: formData.nama_barang,
          stok: formData.stok,
          harga: formData.harga,
        }),
      });

      if (response.ok) {
        setFormData({ nama_barang: "", stok: "", harga: "" });
        fetchInventory();
        closeModal("modalTambahBarang");
      } else {
        console.error("Gagal menambahkan barang");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi untuk edit barang menggunakan API
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama_barang: formData.nama_barang,
            stok: formData.stok,
            harga: formData.harga,
          }),
        }
      );

      if (response.ok) {
        fetchInventory();
        closeModal("modalEditBarang");
      } else {
        console.error("Gagal memperbarui barang");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi untuk menghapus data barang
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/barang/${selectedItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchInventory();
        closeModal("modalHapusBarang");
      } else {
        console.error("Gagal menghapus barang");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi paginasi tabel barang
  const filteredItems = inventory.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Konten halaman utama barang
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />

        <div className="col-md-10 p-4">
          <Navbar />

          <div className="card p-3 mt-3 bg-light vh-auto border-0">
            <h2 className="mb-4">DATA BARANG</h2>

            <button
              className="btn mb-3 w-25"
              style={{ backgroundColor: "#7E3AF2", color: "white" }}
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBarang"
            >
              <i className="bi bi-plus-lg"></i> Tambah Barang
            </button>

            <div className="card mt-3 bg-light">
              <div className="d-flex mt-2 justify-content-between align-items-center mb-3">
                <div>
                  <label className="m-3">Tampilkan:</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* <span className="fw-semibold me-5">Total Data: {inventory.length}</span> */}
                <div className="d-flex align-items-center w-25 me-3">
                  <label className="me-2 mb-0 fw-semibold">Search:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama barang..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Nama Barang</th>
                      <th>Harga</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-center">
                            {startIndex + index + 1}
                          </td>
                          <td>{item.nama_barang}</td>
                          <td className="text-end">
                            Rp. {item.harga.toLocaleString()}
                          </td>
                          <td className="text-center">{item.stok}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-success me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#modalEditBarang"
                              onClick={() => setFormData(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#modalHapusBarang"
                              onClick={() => setSelectedItem(item)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center m-3">
                <span>
                  Halaman {currentPage} dari {totalPages}
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
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Barang */}
      <div
        className="modal fade"
        id="modalTambahBarang"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Barang</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalTambahBarang")}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Barang */}
      <div
        className="modal fade"
        id="modalEditBarang"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Barang</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalEditBarang")}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label className="form-label">Nama Barang</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    className="form-control"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stok</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Hapus Barang */}
      <div
        className="modal fade"
        id="modalHapusBarang"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeModal("modalHapusBarang")}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Apakah Anda yakin ingin menghapus{" "}
                <b>{selectedItem?.nama_barang}</b>?
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => closeModal("modalHapusBarang")}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
