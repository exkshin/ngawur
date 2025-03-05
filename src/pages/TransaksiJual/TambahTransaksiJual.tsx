import { useEffect, useState } from "react";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import { CardBarangTransaksiJual } from "../GlobalWidget/cardBarangTransaksiJual"
import { useLocation, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";
import { SelectedRadioButtonSVG } from "../../assets/icon/SVGTSX/SelectedRadioButtonSVG";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { UnselectedRadioButtonSVG } from "../../assets/icon/SVGTSX/UnselectedRadioButtonSVG";
import ListColor from "../../Config/color";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { NumericFormat } from "react-number-format";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { EditSVG } from "../../assets/icon/SVGTSX/EditSVG";
import { BottomButton } from "../CustomWidget/bottomButton";
import globalVariables, { numberSeparator } from "../../Config/globalVariables";
import { BottomNavbarJual } from "../GlobalWidget/bottomNavbarJual";
import { PopupRangkuman } from "../GlobalWidget/popupRangkuman";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { FilterSVG } from "../../assets/icon/SVGTSX/FilterSVG";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { BarangBySupplierModel, DataBarangModel, HitungBarangModel } from "../../classModels/barangModel";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import BarangBySupplierWidget from "../GlobalWidget/barangBySupplierWidget";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import { DetailSOModel } from "../../classModels/detailSOModel";
import { DetailJualModel } from "../../classModels/detailJualModel";

const TambahTransaksiJual = () => {
  const [xShowFormSO, setxShowFormSO] = useState(false);
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xIsSO, setxIsSO] = useState(false);
  const [xFrom, setxFrom] = useState(PageRoutes.listTransaksiJual);
  const location = useLocation();
  const [xTransaksi, setXTransaksi] = useState({});
  const [xNamaCustomer, setXNamaCustomer] = useState("");
  const [xWA, setXWA] = useState("");
  const [xAlamat, setXAlamat] = useState("");
  const [xTanggalKirim, setXTanggalKirim] = useState(moment(new Date()));
  const [xIsDiambil, setXIsDiambil] = useState(true);
  const [xCatatan, setXCatatan] = useState("");
  const [xErrorNamaCustomer, setXerrorNamaCustomer] = useState(false);
  const [xErrorWA, setXerrorWA] = useState(false);
  const [xErrorAlamat, setXerrorAlamat] = useState(false);
  const [xErrorTanggal, setXErrorTanggal] = useState(false);
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingJual, setXIsLoadingJual] = useState(true);
  const [xIsLoadingSO, setXIsLoadingSO] = useState(true);
  const [xModeCustomerAdd, setxModeCustomerAdd] = useState(true);
  const [xKodeTransaksi, setXKodeTransaksi] = useState("");
  const [xTotal, setXTotal] = useState(0);
  const [xDetailSO, setXDetailSO] = useState({} as DetailSOModel);
  const [xDetailJual, setXDetailJual] = useState({} as DetailJualModel);
  const [xShowPopupRangkuman, setXShowPopupRangkuman] = useState(false);
  const [xIsSortBySupplier, setxIsSortBySupplier] = useState(false);
  const [xIsSortBySupplierTemp, setxIsSortBySupplierTemp] = useState(false);
  const [xShowSort, setxShowSort] = useState(false);
  const [xDataCustomerSO, setXDataCustomerSO] = useState(null as DataCustomerSOModel | null);
  const [xCart, setXCart] = useState([] as HitungBarangModel[]);
  const [xListBarangBySupplier, setXListBarangBySupplier] = useState([] as BarangBySupplierModel[]);
  const [xListBarang, setXListBarang] = useState([] as DataBarangModel[]);
  const [xListBarangComplete, setXListBaranComplete] = useState([] as DataBarangModel[]);
  const [xExpand, setXExpand] = useState([] as boolean[]);
  const [xDisableRingkasan, setXDisableRingkasan] = useState(true);
  const [xReady, setXReady] = useState(false);
  const [xHasEditCustomer, setxHasEditCustomer] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xSearch, setXSearch] = useState("");

  function setSnackBar(text: string, isToastError: boolean) {
    setXShowToast({
      text: text,
      show: true,
      isToastError: isToastError, //error/success
    });
    setTimeout(function () {
      setXShowToast({
        text: "",
        show: false,
        isToastError: false, //error/success
      });
    }, 3000);
  }

  useEffect(() => {
    let from = "";
    let idtrans = "";
    let isEdit = false;
    let isSO = false;
    if (location.state != undefined && location.state != null) {
      if (location.state.from != undefined && location.state.from != null && location.state.from != PageRoutes.listTransaksiJual) {
        setxFrom(location.state.from);
        from = location.state.from
      }
      if (location.state.type != undefined && location.state.type != null && location.state.type == "SO") {
        setxIsSO(true);
        setxShowFormSO(true);
        isSO = true;
      }
      if (location.state.mode != undefined && location.state.mode != null && location.state.mode == "edit") {
        setxIsEdit(true);
        isEdit = true
      }
      if (location.state.hasEditCustomerSO != undefined && location.state.hasEditCustomerSO != null) {
        setxHasEditCustomer(location.state.hasEditCustomerSO);
      }
      if (isEdit && location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi = location.state.dataTransaksi as TransaksiJualModel;
        idtrans = dataTransaksi.idtrans ?? "0";
        setXTransaksi(dataTransaksi);
        // if(location.state.type == "SO"){
        //   getDetailSO(dataTransaksi.idtrans??"0");}
        // else{getDetailJual(dataTransaksi.idtrans??"0")}
      }
    }
    initState(isEdit, isSO, idtrans, from);
    // getListBarang(xSearch, xIsSortBySupplier);
  }, [])

  async function initState(pIsEdit: boolean, pIsSO: boolean, pIdTrans: string, pFrom: string) {
    if (pIsEdit) {
      if (pIsSO) {
        setXIsLoadingJual(false);
        await getDetailSO(pIdTrans, pFrom);
      } else {
        setXIsLoadingSO(false);
        await getDetailJual(pIdTrans, pFrom);
      }
    } else {
      await getListBarang(xSearch, xIsSortBySupplier);
      setXIsLoadingJual(false);
      setXIsLoadingSO(false);
    }
    setXReady(false);
  }

  async function getDetailSO(idSO: string, from: string) {
    setXIsLoadingSO(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idso", idSO);
      await AXIOS
        .post("umkm/ApiSalesOrder/getDataSO", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailSOModel;
            let item = [] as HitungBarangModel[];
            responseData.detail.forEach((pItem, pIndex) => {
              item.push({
                data: {
                  gambar: "",
                  hargajualmaxsatuan: pItem.harga,
                  idbarang: pItem.idbarang,
                  satuan: pItem.satuan,
                  namabarang: pItem.namabarang,
                  kodebarang: pItem.kodebarang,
                  idsupplier: "",
                  namasupplier: "",
                  satuan2: "",
                  satuan3: "",
                  hargajualminsatuan: "",
                  hargajualminsatuan2: "",
                  hargajualmaxsatuan2: "",
                  hargajualminsatuan3: "",
                  hargajualmaxsatuan3: "",
                  hargabeli: ""
                },
                idbarang: pItem.idbarang,
                jumlahBarang: parseInt((pItem.jml ?? "0").split(".")[0]),
                subtotal: parseInt((pItem.subtotal ?? "0").split(".")[0]),
              });
            })
            setXTotal(parseInt((responseData.header.total ?? "0").split(".")[0]));
            setXDetailSO(responseData);
            setXDisableRingkasan(item.length > 0);
            getListBarang("", false);
            setXKodeTransaksi(responseData.header.kodeso ?? "");
            if (from == PageRoutes.ringkasanPenjualan) {
              if (location.state.customer != undefined && location.state.customer != null) {
                setXDataCustomerSO(location.state.customer as DataCustomerSOModel);
              }
              if (location.state.items != undefined && location.state.items != null) {
                let items = (location.state.items as HitungBarangModel[]);
                setXCart(location.state.items as HitungBarangModel[]);
                setXDisableRingkasan(items.length <= 0)
              }
              if (location.state.total != undefined && location.state.total != null) {
                setXTotal(location.state.total);
              }
              setxModeCustomerAdd(false);
              setxShowFormSO(false);
            } else {
              setXCart(item);
              let listcatatan = (responseData.header.catatan ?? "DIAMBIL\\").split('\\');
              let catatan = listcatatan.length > 1 ? listcatatan[1] : "";
              let isDiambil = listcatatan[0] == "DIAMBIL";
              let dataCustomer = {
                alamat: responseData.header.alamatkirim,
                catatan: catatan,
                isDiambil: isDiambil,
                nama: responseData.header.namacustomer,
                tanggal: responseData.header.tglkirim,
                wa: responseData.header.telp,
              } as DataCustomerSOModel;
              setXDataCustomerSO(dataCustomer);
            }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setxShowFormSO(false);
    setXIsLoadingSO(false);
  }

  async function getDetailJual(idjual: string, from: string) {
    setXIsLoadingJual(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idjual", idjual);
      await AXIOS
        .post("umkm/ApiJual/getDataJual", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailJualModel;
            let item = [] as HitungBarangModel[];
            responseData.detail.forEach((pItem, pIndex) => {
              item.push({
                data: {
                  gambar: "",
                  hargajualmaxsatuan: pItem.harga,
                  idbarang: pItem.idbarang,
                  satuan: pItem.satuan,
                  namabarang: pItem.namabarang,
                  kodebarang: pItem.kodebarang,
                  idsupplier: "",
                  namasupplier: "",
                  satuan2: "",
                  satuan3: "",
                  hargajualminsatuan: "",
                  hargajualminsatuan2: "",
                  hargajualmaxsatuan2: "",
                  hargajualminsatuan3: "",
                  hargajualmaxsatuan3: "",
                  hargabeli: "",
                },
                idbarang: pItem.idbarang,
                jumlahBarang: parseInt((pItem.jml ?? "0").split(".")[0]),
                subtotal: parseInt((pItem.subtotal ?? "0").split(".")[0]),
              });
            })
            setXTotal(parseInt((responseData.header.total ?? "0").split(".")[0]));
            setXDetailJual(responseData);
            getListBarang("", false);
            setXKodeTransaksi(responseData.header.kodejual ?? "");

            if (from == PageRoutes.ringkasanPenjualan) {
              if (location.state.customer != undefined && location.state.customer != null) {
                setXDataCustomerSO(location.state.customer as DataCustomerSOModel);
              }
              if (location.state.items != undefined && location.state.items != null) {
                let items = (location.state.items as HitungBarangModel[]);
                setXCart(location.state.items as HitungBarangModel[]);
                setXDisableRingkasan(items.length <= 0)
              }
              if (location.state.total != undefined && location.state.total != null) {
                setXTotal(location.state.total);
              }
              setxModeCustomerAdd(false);
              setxShowFormSO(false);
            } else {
              setXCart(item);
            }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingJual(false);
  }

  function validasiFormCustomer() {
    setXerrorNamaCustomer(xNamaCustomer == "");
    setXerrorAlamat(xAlamat == "");
    setXerrorWA(xWA == "");
    let tanggalerror = xTanggalKirim.isAfter(new Date());
    setXErrorTanggal(!tanggalerror);
    if (!(xNamaCustomer == "" || xAlamat == "" || xWA == "" || !tanggalerror)) {
      setxShowFormSO(false);
      setxModeCustomerAdd(false);
      if (!(xWA == xDataCustomerSO?.wa &&
        xAlamat == xDataCustomerSO.alamat &&
        xCatatan == xDataCustomerSO.catatan &&
        xIsDiambil == xDataCustomerSO.isDiambil &&
        xTanggalKirim.format("YYYY MM DD HH:mm") == xDataCustomerSO.tanggal &&
        xNamaCustomer == xDataCustomerSO.nama)) {
        setxHasEditCustomer(true)
      }
      setXDataCustomerSO({
        alamat: xAlamat,
        catatan: xCatatan,
        isDiambil: xIsDiambil,
        nama: xNamaCustomer,
        wa: xWA,
        tanggal: xTanggalKirim.format("YYYY MM DD HH:mm"),
      });
    }
  }

  async function getListBarang(pSearch: string, pIsSortSupplier: boolean) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("keyword", pSearch);
      form.append("orderby", pIsSortSupplier ? "supplier" : "barang");
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("api/Master/ApiBarang/listBarangJual", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            if (pIsSortSupplier) {
              setXListBarangBySupplier(responseData as BarangBySupplierModel[]);
              let expand = [];
              for (let i = 0; i < responseData.length; i++) {
                expand.push(true);
              }
              setXExpand(expand);
            } else {
              setXListBarang(responseData as DataBarangModel[]);
              if(pSearch!=""){
                setXListBaranComplete(responseData as DataBarangModel[]);
              }
            }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  useEffect(() => {
    if (xShowFormSO && xDataCustomerSO != null && !xOpenDatePicker) {
      setXNamaCustomer(xDataCustomerSO?.nama);
      setXWA(xDataCustomerSO.wa);
      setXIsDiambil(xDataCustomerSO.isDiambil);
      setXAlamat(xDataCustomerSO.alamat);
      setXCatatan(xDataCustomerSO.catatan);
      setXTanggalKirim(moment(new Date(xDataCustomerSO.tanggal)))
      setXerrorAlamat(false);
      setXerrorNamaCustomer(false);
      setXerrorWA(false);
      setXErrorTanggal(false)
    }
  }, [xShowFormSO])

  const cariJumlahBarang = (pIdBarang: string) => {
    let jumlah = 0;
    xCart.forEach((pElementCart, pIndexCart) => {
      if (pElementCart.idbarang == pIdBarang) {
        jumlah = pElementCart.jumlahBarang;
      }
    });
    return jumlah;
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupRangkuman openOpsi={xShowPopupRangkuman} onClose={() => {
      setXShowPopupRangkuman(false);
    }} item={xCart} />
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => {
        console.log(value);
        setXOpenDatePicker(value);
        setxShowFormSO(true);
      }}
      useTimeWidget={true}
      zIndex={72}
      minDate={new Date()}
      onChange={(value) => {
        setXTanggalKirim(moment(value));
      }}
    />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingSO || xIsLoadingJual} />
    <CustomPopup
      content={<div>
        <div className="font-semibold text-center text-16px mb-2.5">Sort By</div>
        <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => { setxIsSortBySupplierTemp(false); }}>
          {!xIsSortBySupplierTemp ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Nama Barang
        </div>
        <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => setxIsSortBySupplierTemp(true)}>
          {xIsSortBySupplierTemp ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Supplier
        </div>
      </div>}
      open={xShowSort}
      textButtonRight="Kembali"
      textButtonLeft="Ubah"
      functionButtonRight={() => { setxShowSort(false); }}
      functionButtonLeft={() => {
        setxShowSort(false);
        setxIsSortBySupplier(xIsSortBySupplierTemp);
        getListBarang(xSearch, xIsSortBySupplierTemp);
      }}
      zIndex={80}
      onClose={() => { setxShowSort(false); }}
    />

    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Data Customer</div>
        <div className=" mb-2.5">
          <div className="font-semibold text-sm text-left mb-2.5">Apakah diantar / diambil?</div>
          <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => { setXIsDiambil(false); }}>
            {!xIsDiambil ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Diantar
          </div>
          <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => setXIsDiambil(true)}>
            {xIsDiambil ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Diambil
          </div>
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Nama Customer *</div>
          <div className="relative w-full mt-2.5">
            <input
              onChange={(e) => {
                setXNamaCustomer(e.target.value);
              }}
              placeholder={""}
              value={xNamaCustomer}
              type={"text"}
              className={`${defaultInputCSS((xNamaCustomer !== "" && xNamaCustomer !== undefined), xErrorNamaCustomer, false)}`}
            />
          </div>
          {xErrorNamaCustomer && <div className="text-12px text-danger-Main text-left">Nama customer wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">No WA *</div>
          <div className="relative w-full mt-2.5">
            <NumericFormat
              onChange={(e) => {
                setXWA(e.target.value);
              }}
              decimalScale={0}
              allowLeadingZeros={true}
              placeholder={""}
              value={xWA}
              type={"tel"}
              className={`${defaultInputCSS((xWA !== "" && xWA !== undefined), xErrorWA, false)}`}
            />
          </div>
          {xErrorWA && <div className="text-12px text-danger-Main text-left">No WA wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Alamat Kirim / Customer *</div>
          <div className="relative w-full mt-2.5">
            <textarea
              onChange={(e) => {
                setXAlamat(e.target.value);
              }}
              placeholder={""}
              value={xAlamat}
              className={`${defaultInputCSS((xAlamat !== "" && xAlamat !== undefined), xErrorAlamat, false)}`}
            />
          </div>
          {xErrorAlamat && <div className="text-12px text-danger-Main text-left">Alamat kirim / customer wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Tanggal Ambil / Kirim *</div>
          <div className="relative w-full mt-2.5">
            <input
              onClick={(e) => {
                setXOpenDatePicker(true);
              }}
              value={xTanggalKirim.format("DD MMM YYYY HH:mm")}
              readOnly={true}
              type={"text"}
              className={`${defaultInputCSS(true, xErrorTanggal, true)}`}
            />
          </div>
          {xErrorTanggal && <div className="text-12px text-danger-Main text-left">Tanggal ambil / kirim wajib melebihi tanggal & jam saat ini</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Catatan</div>
          <div className="relative w-full mt-2.5">
            <textarea
              onChange={(e) => {
                setXCatatan(e.target.value);
              }}
              placeholder={""}
              value={xCatatan}
              className={`${defaultInputCSS((xCatatan !== "" && xCatatan !== undefined), false, false)}`}
            />
          </div>
        </div>
      </div>}
      functionButtonRight={() => {
        if (xModeCustomerAdd) {
          navigate(PageRoutes.listTransaksiJual);
        } else {
          setxShowFormSO(false);
        }
      }}
      functionButtonLeft={() => {
        validasiFormCustomer();
      }}
      onClose={() => {
        if (!xModeCustomerAdd && !xOpenDatePicker) {
          setxShowFormSO(false);
        }
      }}
      dismissible={!xModeCustomerAdd}
      open={xShowFormSO}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={70}
    />
    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => {
        navigate(PageRoutes.listTransaksiJual)
      }}
      showFrontIcon={true}
      frontIcon={FilterSVG(24, ListColor.main.Main)}
      frontFunction={() => { setxShowSort(true); setxIsSortBySupplierTemp(xIsSortBySupplier); }}
      valueSearch={xSearch}
      placeholder={"Cari Barang"}
      searchFunction={(value) => { getListBarang(value, xIsSortBySupplier); }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />
    <div className="min-h-16" />
    <div className="w-full px-4 mb-2 ">
      <div className="border py-1 px-2 rounded-lg border-neutral-70 w-full">
        <div className="flex justify-between text-14px font-bold">
          <div>Jenis Transaksi : {xIsSO ? "Nota Pesanan" : "Jual Tunai"}</div>
          {xIsSO && <div onClick={() => { setxShowFormSO(true) }}>
            {EditSVG(18, ListColor.main.Main)}
          </div>}
        </div>
        <p className="text-14px font-bold">{xIsSO ? xDataCustomerSO?.nama : "Cash"}</p>
        {xIsEdit && <p className="text-14px">Kode Transaksi : {xKodeTransaksi}</p>}
        {xIsSO && <>
          <p className="text-14px">No WA : {xDataCustomerSO?.wa}</p>
          <p className="text-14px">Alamat {xDataCustomerSO?.isDiambil ? "Customer" : "Kirim"} : {xDataCustomerSO?.alamat}</p>
          <p className="text-14px">Tanggal {xDataCustomerSO?.isDiambil ? "Ambil" : "Kirim"} : {moment(xDataCustomerSO?.tanggal).format("YYYY MMM DD HH:mm")}</p>
          <p className="text-14px">Catatan : {xDataCustomerSO?.catatan}</p>
        </>
        }
      </div>
    </div>
    {xIsLoadingJual || xIsLoadingSO ? <></>
      : xIsSortBySupplier ?
        xListBarangBySupplier.map((pElement, pIndex) => {
          return <BarangBySupplierWidget
            data={pElement}
            key={"bysupplier" + pIndex}
            index={pIndex}
            cart={xCart}
            onExpand={() => {
              let expand = xExpand;
              expand[pIndex] = !expand[pIndex];
              setXExpand(expand);
            }}
            onChangeJumlah={(pIndexSupplier, pIndexBarang, pJumlah) => {
              let jumlahBarang = pJumlah == "" ? 0 : parseInt(pJumlah);
              let cart = xCart;
              let isFound = false;
              let indexCart = 0;
              xCart.forEach((pElementCart, pIndexCart) => {
                if (pElementCart.idbarang == pElement.daftarbarang[pIndexBarang].idbarang) {
                  isFound = true;
                  indexCart = pIndexCart;
                }
              });
              if (jumlahBarang > 0) {
                let subtotal = jumlahBarang * parseInt((pElement.daftarbarang[pIndexBarang].hargajualmaxsatuan ?? "0").split(".")[0]);
                if (isFound) {
                  cart[indexCart].jumlahBarang = jumlahBarang;
                  cart[indexCart].subtotal = subtotal;
                } else {
                  cart.push({
                    idbarang: pElement.daftarbarang[pIndexBarang].idbarang ?? "",
                    jumlahBarang: jumlahBarang,
                    subtotal: subtotal,
                    data: pElement.daftarbarang[pIndexBarang],
                  });
                }
                let total = 0;
                cart.forEach((pCart) => {
                  total += pCart.subtotal;
                });
                setXTotal(total);
                setXDisableRingkasan(cart.length <= 0);
                setXCart(cart);
              } else {
                if (isFound) {
                  let cartTemp = [] as HitungBarangModel[];
                  cart.forEach((pValue, pIndexCart) => {
                    if (pIndexCart != indexCart) {
                      cartTemp.push(pValue);
                    }
                  })
                  let total = 0;
                  cartTemp.forEach((pCart) => {
                    total += pCart.subtotal;
                  });
                  setXTotal(total);
                  setXDisableRingkasan(cartTemp.length <= 0);
                  setXCart(cartTemp);
                }
              }
            }}
          />;
        })
        : <div className="flex-wrap flex justify-between w-full px-4">
          {xListBarang.map((pElement, pIndex) => {
            return <CardBarangTransaksiJual
              dataBarang={pElement}
              initialJumlah={cariJumlahBarang(pElement.idbarang ?? "").toString()}
              key={`databarang${pIndex}`}
              onChangeJumlah={(pJumlah) => {
                let jumlahBarang = pJumlah == "" ? 0 : parseInt(pJumlah);
                let cart = xCart;
                let isFound = false;
                let indexCart = 0;
                xCart.forEach((pElementCart, pIndexCart) => {
                  if (pElementCart.idbarang == pElement.idbarang) {
                    isFound = true;
                    indexCart = pIndexCart;
                  }
                });
                if (!xReady) {
                  if (jumlahBarang > 0) {
                    let subtotal = jumlahBarang * parseInt((pElement.hargajualmaxsatuan ?? "0").split(".")[0]);
                    if (isFound) {
                      cart[indexCart].jumlahBarang = jumlahBarang;
                      cart[indexCart].subtotal = subtotal;
                    } else {
                      cart.push({
                        idbarang: pElement.idbarang ?? "",
                        jumlahBarang: jumlahBarang,
                        subtotal: subtotal,
                        data: pElement,
                      });
                    }
                    let total = 0;
                    cart.forEach((pCart) => {
                      total += pCart.subtotal;
                    });
                    setXTotal(total);

                    setXDisableRingkasan(cart.length <= 0);
                    setXCart(cart);
                  } else {
                    if (isFound) {
                      let cartTemp = [] as HitungBarangModel[];
                      cart.forEach((pValue, pIndexCart) => {
                        if (pIndexCart != indexCart) {
                          cartTemp.push(pValue);
                        }
                      })

                      let total = 0;
                      cartTemp.forEach((pCart) => {
                        total += pCart.subtotal;
                      });
                      setXTotal(total);

                      setXDisableRingkasan(cartTemp.length <= 0);
                      setXCart(cartTemp);
                    }
                  }
                }
              }
              }
            />;
          })}
        </div>
    }
    <div className="min-h-20" />
    <BottomNavbarJual
      textButton={"Ringkasan"}
      total={xTotal.toString()}
      onClickButton={() => {
        let temp = [] as HitungBarangModel[];
        let total=0;
        xCart.forEach(pCart => {
          xListBarangComplete.forEach(pBarang => {
            if (pCart.idbarang == pBarang.idbarang) {
              let subtotal = pCart.jumlahBarang * parseInt((pBarang.hargajualmaxsatuan ?? "0").split(".")[0]);
              total+=subtotal;
              temp.push({
                data: pBarang,
                idbarang: pBarang.idbarang,
                jumlahBarang: pCart.jumlahBarang,
                subtotal: subtotal,
              });
            }
          });
        })
        navigate(PageRoutes.ringkasanPenjualan, {
          state: {
            customer: xDataCustomerSO,
            items: temp,
            isSO: xIsSO,
            from: PageRoutes.tambahTransaksiJual,
            isEdit: xIsEdit,
            dataTransaksi: xTransaksi,
            total: total,
            detailTransaksiJual: xDetailJual,
            detailTransaksiSO: xDetailSO,
            hasEditCustomerSO: xHasEditCustomer,
          }
        })
      }}
      onClickTotal={() => { setXShowPopupRangkuman(!xShowPopupRangkuman); }}
      disable={xDisableRingkasan}
    />
  </div>
}

export default TambahTransaksiJual;

export interface DataCustomerSOModel {
  nama: string,
  wa: string,
  alamat: string,
  catatan: string,
  isDiambil: boolean
  tanggal: string,
}