import React, { useEffect, useState } from "react";
import { getInventory, getBarangMasuk, getBarangKeluar } from "../api";
import BarangChart from "../components/BarangChart";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Variabel pada halaman dashboard
function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [chartDataMasuk, setChartDataMasuk] = useState([]);
  const [chartDataKeluar, setChartDataKeluar] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data inventory, barang masuk, dan barang keluar menggunakan API
        const dataInventory = await getInventory(token);
        const dataBarangMasuk = await getBarangMasuk(token);
        const dataBarangKeluar = await getBarangKeluar(token);

        setInventory(dataInventory);
        setBarangMasuk(dataBarangMasuk);
        setBarangKeluar(dataBarangKeluar);

        // Kelompokkan data per bulan
        const groupedDataMasuk = groupDataByMonth(dataBarangMasuk, "masuk");
        const groupedDataKeluar = groupDataByMonth(dataBarangKeluar, "keluar");

        // Format data untuk chart barang masuk
        const chartDataMasukFormatted = Object.keys(groupedDataMasuk).map(
          (month) => ({
            tanggal: month,
            jumlah: groupedDataMasuk[month],
          })
        );

        // Format data untuk chart barang keluar
        const chartDataKeluarFormatted = Object.keys(groupedDataKeluar).map(
          (month) => ({
            tanggal: month,
            jumlah: groupedDataKeluar[month],
          })
        );

        setChartDataMasuk(chartDataMasukFormatted);
        setChartDataKeluar(chartDataKeluarFormatted);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Fungsi untuk mengelompokkan data per bulan
  const groupDataByMonth = (data, jenis) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = new Date(item.tanggal);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // Format: "YYYY-MM"

      if (!groupedData[monthYear]) {
        groupedData[monthYear] = 0;
      }

      groupedData[monthYear] += item.jumlah;
    });

    return groupedData;
  };

  // Hitung total barang, barang masuk, dan barang keluar
  const totalBarang = inventory.length;
  const totalBarangMasuk = barangMasuk.reduce(
    (total, item) => total + item.jumlah,
    0
  );
  const totalBarangKeluar = barangKeluar.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  // Konten utama halaman dashboard
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-md-10 p-4">
          <Navbar />
          <div className="card p-3 mt-3 bg-light vh-100 border-0">
            <h2 className="mb-4">DASHBOARD</h2>

            {/* Card Informasi */}
            <div className="row">
              {/* Card Total Barang */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/DB.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    {/* <i className="bi bi-boxes bg-warning p-3 rounded-end-circle display-5 me-3"></i> */}
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Data Barang
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarang}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Total Barang Masuk */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/BM.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Barang Masuk
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarangMasuk}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Total Barang Keluar */}
              <div className="col-md-4 mb-4">
                <div className="card bg-light shadow">
                  <div className="card-body d-flex align-items-center">
                    <img
                      className="me-3"
                      src="/BK.png"
                      alt="Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="ms-3">
                      <h6 className="card-title text-uppercase fw-bold">
                        Barang Keluar
                      </h6>
                      <p className="card-text display-5 fw-bold">
                        {totalBarangKeluar}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Barang Masuk dan Barang Keluar */}
            <div className="row mt-4">
              {/* Chart Barang Masuk */}
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataMasuk}
                      title="Barang Masuk"
                      backgroundColor="rgba(75, 192, 192, 0.6)"
                      borderColor="rgba(75, 192, 192, 1)"
                    />
                  </div>
                </div>
              </div>

              {/* Chart Barang Keluar */}
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    <BarangChart
                      data={chartDataKeluar}
                      title="Barang Keluar"
                      backgroundColor="rgba(255, 99, 132, 0.6)"
                      borderColor="rgba(255, 99, 132, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
