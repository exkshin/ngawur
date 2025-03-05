import {
  Route, Routes, BrowserRouter,
} from "react-router-dom";
import LoginPage from "./pages/Login/loginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import SelectLocationPage from "./pages/Lokasi/selectLocationPage";
import { PageRoutes } from "./PageRoutes";
import ListTransaksiJual from "./pages/TransaksiJual/ListTransaksiJual";
import DetailTransaksiJual from "./pages/TransaksiJual/DetailTraksaksiJual";
import TambahTransaksiJual from "./pages/TransaksiJual/TambahTransaksiJual";
import RingkasanPenjualan from "./pages/RingkasanPenjualan/RingkasanPenjualan";
import BayarPenjualanPage from "./pages/BayarPenjualan/BayarPenjualanPage";
import PaymentSuccess from "./pages/BayarPenjualan/PaymentSuccess";
import ListBarang from "./pages/MasterBarang/ListBarang";
import FormBarang from "./pages/MasterBarang/FormBarang";
import DetailBarangPage from "./pages/MasterBarang/DetailBarang";
import ListTransaksiBeli from "./pages/TransaksiBeli/ListTransaksiBeli";
import DetailTransaksiBeli from "./pages/TransaksiBeli/DetailTraksaksiBeli";
import TambahTransaksiBeli from "./pages/TransaksiBeli/TambahTransaksiBeli";
import RingkasanPembelian from "./pages/TransaksiBeli/RingkasanPembelian";
import BayarPembelianPage from "./pages/TransaksiBeli/BayarPembelianPage";
import ListClosingPage from "./pages/ClosingStock/ListClosingPage";
import FormClosingPage from "./pages/ClosingStock/FormClosingPage";
import DetailClosingPage from "./pages/ClosingStock/DetailClosingPage";
import ListStokBarang from "./pages/StokBarang/ListStokBarang";
import ListHutangPage from "./pages/HutangPage/ListHutangPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import FormProfilePage from "./pages/Profile/FormProfilePage";
import ListKeuanganPage from "./pages/Keuangan/listKeuanganPage";
import FormKeuanganPage from "./pages/Keuangan/formKeuanganPage";
import DetailKeuanganPage from "./pages/Keuangan/detailKeuanganPage";
import PostingPage from "./pages/ClosingStock/PostingPage";
import ListRekapTagihan from "./pages/Rekap Tagihan/ListRekapTagihan";
import Ngawur from "./pages/ngawur";

/**
 * @date 12/3/2024 - 3:13:08 PM
 * @author Michael
 * @description variable untuk menyimpan semua data rute
 * **/
const Rute = (props: any) => {
  return (
    <>
      <BrowserRouter>
        <Routes >
          <Route path="/" element={<Ngawur />} />
          <Route path="" element={<Ngawur />} />
          {/* <Route path={PageRoutes.login} element={<LoginPage />} />
          <Route path={PageRoutes.dashboard} element={<Dashboard />} />
          <Route path={PageRoutes.selectLocation} element={<SelectLocationPage />} />
          <Route path={PageRoutes.listTransaksiJual} element={<ListTransaksiJual />} />
          <Route path={PageRoutes.detailTransaksiJual} element={<DetailTransaksiJual />} />
          <Route path={PageRoutes.tambahTransaksiJual} element={<TambahTransaksiJual />} />
          <Route path={PageRoutes.ringkasanPenjualan} element={<RingkasanPenjualan />} />
          <Route path={PageRoutes.bayarPenjualan} element={<BayarPenjualanPage />} />
          <Route path={PageRoutes.paymentSuccess} element={<PaymentSuccess />} />
          <Route path={PageRoutes.masterBarang} element={<ListBarang />} />
          <Route path={PageRoutes.formBarang} element={<FormBarang />} />
          <Route path={PageRoutes.detailBarang} element={<DetailBarangPage />} />
          <Route path={PageRoutes.listTransaksiBeli} element={<ListTransaksiBeli />} />
          <Route path={PageRoutes.detailTransaksiBeli} element={<DetailTransaksiBeli />} />
          <Route path={PageRoutes.tambahTransaksiBeli} element={<TambahTransaksiBeli />} />
          <Route path={PageRoutes.ringkasanTransaksiBeli} element={<RingkasanPembelian />} />
          <Route path={PageRoutes.bayarPembelian} element={<BayarPembelianPage />} />
          <Route path={PageRoutes.listClosing} element={<ListClosingPage />} />
          <Route path={PageRoutes.formClosing} element={<FormClosingPage />} />
          <Route path={PageRoutes.detailClosing} element={<DetailClosingPage />} />
          <Route path={PageRoutes.stokBarang} element={<ListStokBarang />} />
          <Route path={PageRoutes.listHutang} element={<ListHutangPage />} />
          <Route path={PageRoutes.profile} element={<ProfilePage />} />
          <Route path={PageRoutes.formKeuangan} element={<FormKeuanganPage />} />
          <Route path={PageRoutes.listKeuangan} element={<ListKeuanganPage />} />
          <Route path={PageRoutes.detailKeuangan} element={<DetailKeuanganPage />} />
          <Route path={PageRoutes.formPosting} element={<PostingPage />} />
          <Route path={PageRoutes.rekapTagihan} element={<ListRekapTagihan />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Rute;