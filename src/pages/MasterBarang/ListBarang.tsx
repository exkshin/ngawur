import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { BottomButton } from "../CustomWidget/bottomButton";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { PageRoutes } from "../../PageRoutes";
import { FilterSVG } from "../../assets/icon/SVGTSX/FilterSVG";
import { BarangBySupplierModel, DataBarangModel } from "../../classModels/barangModel";
import { SupplierModel } from "../../classModels/supplierModel";
import { SelectedRadioButtonSVG } from "../../assets/icon/SVGTSX/SelectedRadioButtonSVG";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { UnselectedRadioButtonSVG } from "../../assets/icon/SVGTSX/UnselectedRadioButtonSVG";
import ListColor from "../../Config/color";
import AXIOS from "../../Config/axiosRequest";
import globalVariables, { numberSeparator } from "../../Config/globalVariables";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";
import { DropdownLokasi } from "../GlobalWidget/dropdownLokasi";
import { WidgetDropdownBox } from "../GlobalWidget/filter";
import { DataBoxDropdownModel, ValueListModel } from "../../classModels/filterModel";
import { CardListBarang } from "../GlobalWidget/cardListBarang";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";

const ListBarang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsSortBySupplier, setxIsSortBySupplier] = useState(false);
  const [xIsSortBySupplierTemp, setxIsSortBySupplierTemp] = useState(false);
  const [xShowSort, setxShowSort] = useState(false);
  const [xSelectedLokasi, setXSelectedLokasi] = useState(JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel);
  const [xSelectedSupplier, setXSelectedSupplier] = useState({
    alamat: "",
    idperusahaan: "",
    idsupplier: "",
    idsyaratbayar: "",
    kodesupplier: "",
    namasupplier: "Semua Supplier",
    selisihharibayar: "",
  } as SupplierModel);
  const [xListBarangBySupplier, setXListBarangBySupplier] = useState([] as BarangBySupplierModel[]);
  const [xListBarang, setXListBarang] = useState([] as DataBarangModel[]);
  const [xExpand, setXExpand] = useState([] as boolean[]);
  const [xSearch, setXSearch] = useState("");
  const [xOpenOpsi, setXOpenOpsi] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

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
    initState();
  }, [])

  async function initState() {
    // await getListSupplier();
    await getListBarang(xSearch, "", xSelectedLokasi.id ?? "");
    if (location.state != undefined && location.state != null) {
      let showdialog = false;
      let text = "";
      let isError = false;
      if (location.state.showdialog != undefined && location.state.showdialog != null) {
        showdialog = location.state.showdialog;
      }
      if (location.state.text != undefined && location.state.text != null) {
        text = location.state.text;
      }
      if (location.state.isError != undefined && location.state.isError != null) {
        isError = location.state.isError;
      }
      if (showdialog) {
        setSnackBar(text, isError);
      }
    }
  }

  async function getListSupplier() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("mode", "TAMBAH");

      await AXIOS
        .post("api/Master/ApiSupplier/comboGridApi", form)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.success == true) {
            const responseData = data.rows as SupplierModel[];
            let idsupplier = "";
            if (responseData.length > 0) {
              setXSelectedSupplier(responseData[0]);
              idsupplier = responseData[0].idsupplier ?? "";
            }
            await getListBarang(xSearch, idsupplier, xSelectedLokasi.id ?? "");
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setXIsLoading(false);
    }
  }

  async function getListBarang(pSearch: string, pIdSupplier: string, pIdLokasi: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("keyword", pSearch);
      form.append("idsupplier", pIdSupplier);
      form.append("idlokasi", pIdLokasi);
      form.append("infostok", "0");
      await AXIOS
        .post("api/Master/ApiBarang/listBarang", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data as DataBarangModel[];
            setXListBarang(responseData);
            console.log(responseData);
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

  function goToDetail(pData: DataBarangModel) {
    navigate(PageRoutes.detailBarang, {
      state: {
        dataBarang: pData,
      }
    });
  }
  function goToEdit(pData: DataBarangModel) {
    navigate(PageRoutes.formBarang, { state: { dataBarang: pData, isEdit: true } });
  }
  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
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
        getListBarang(xSearch, xSelectedSupplier == null ? "" : xSelectedSupplier.idsupplier ?? "", xSelectedLokasi.id ?? "");
      }}
      zIndex={80}
      onClose={() => { setxShowSort(false); }}
    />
    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => {
        navigate(PageRoutes.dashboard);
      }}
      showFrontIcon={false}
      frontIcon={FilterSVG(24, ListColor.main.Main)}
      frontFunction={() => { setxShowSort(true); setxIsSortBySupplierTemp(xIsSortBySupplier); }}
      valueSearch={xSearch}
      placeholder={"Cari Barang"}
      searchFunction={(value) => { getListBarang(value, xSelectedSupplier == null ? "" : xSelectedSupplier.idsupplier ?? "", xSelectedLokasi.id ?? ""); }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      <DropdownLokasi
        value={xSelectedLokasi}
        className="mb-2"
        onChange={(pLokasi) => {
          setXSelectedLokasi(pLokasi);
          getListBarang(xSearch, xSelectedSupplier == null ? "" : xSelectedSupplier.idsupplier ?? "", pLokasi.id ?? "");
        }} />
      <DropdownSupplier
        className="mb-2"
        value={xSelectedSupplier}
        showAllSupplierOption={true}
        onChange={(pSupplier) => {
          setXSelectedSupplier(pSupplier);
          getListBarang(xSearch, pSupplier.idsupplier ?? "", xSelectedLokasi.id ?? "");
        }} />
      <div className={`flex-wrap flex  justify-between w-full`}>
        {!xIsLoading&& xListBarang.map((pBarang, pIndex) => {
          return <CardListBarang
            key={`barang-${pIndex}`}
            dataBarang={pBarang}
            isOpenOpsi={xOpenOpsi}
            onChangeShowOpsi={(value) => { setXOpenOpsi(value) }}
            onDetail={(pValue) => { goToDetail(pValue) }}
            onEdit={(pValue) => {
              if (xHakAkses.barang?.ubah !== "1") {
                setSnackBar("Tidak Punya Hak Akses", true);
                return;
              }
              goToEdit(pValue)
            }}
          />
        })}
      </div>
    </div>
    <div className="min-h-16" />
    <BottomButton onClick={() => {
      if (xHakAkses.barang?.tambah !== "1") {
        setSnackBar("Tidak Punya Hak Akses", true);
        return;
      }
      navigate(PageRoutes.formBarang, { state: { isEdit: false } });
    }} text={"Tambah Barang"} />
  </div>;

}

export default ListBarang;