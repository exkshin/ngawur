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
import { CardListStokBarang } from "../GlobalWidget/cardListStokBarang";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";
import moment from "moment";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { ChevronLeftSVG } from "../../assets/icon/SVGTSX/ChevronLeftSVG";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import { ChevronRightSVG } from "../../assets/icon/SVGTSX/ChevronRightSVG";

const ListStokBarang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xLoginAsSupplier = localStorage.getItem("loginAs") == "SUPPLIER";
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsSortBySupplier, setxIsSortBySupplier] = useState(false);
  const [xIsSortBySupplierTemp, setxIsSortBySupplierTemp] = useState(false);
  const [xShowSort, setxShowSort] = useState(false);
  const [xSelectedLokasi, setXSelectedLokasi] = useState(JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  const [xListBarangBySupplier, setXListBarangBySupplier] = useState([] as BarangBySupplierModel[]);
  const [xListBarang, setXListBarang] = useState([] as DataBarangModel[]);
  const [xExpand, setXExpand] = useState([] as boolean[]);
  const [xSearch, setXSearch] = useState("");
  const [xOpenOpsi, setXOpenOpsi] = useState(false);
  const [xSelectedDate,setXSelectedDate]=useState(moment());
  const[xOpenDatePicker,setXOpenDatePicker]=useState(false);
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
    getListBarang("",xSelectedLokasi.id??"",xSelectedDate);
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

  async function getListBarang(pSearch: string, pIdLokasi: string, pTanggal:moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xLoginAsSupplier?globalVariables.idUserGlobal: xDataLogin.iduser ?? "");
      form.append("idperusahaan",xLoginAsSupplier?globalVariables.idPerusahaanGlobal: xDataLogin.idperusahaan ?? "");
      form.append("keyword", pSearch);
      form.append("idsupplier", xDataSupplierLogin.idsupplier??"");
      form.append("idlokasi", pIdLokasi);
      form.append("infostok", "1");
      form.append("infotransaksi", "1");
      form.append("tglinfotransaksi", pTanggal.format("YYYY-MM-DD"));
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
        from:PageRoutes.stokBarang,
      }
    });
  }
  function goToEdit(pData: DataBarangModel) {
    navigate(PageRoutes.formBarang, { state: { dataBarang: pData, isEdit: true } });
  }
  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
<DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListBarang(xSearch, xSelectedLokasi.id??"",moment(value));
      }}
      maxDate={new Date()}
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
      searchFunction={(value) => { getListBarang(value, xSelectedLokasi.id ?? "",xSelectedDate); }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />
    <div className="flex justify-between fixed top-14 w-full h-10 px-4 z-10 items-center bg-neutral-20">
      <div onClick={() => {
        let tgl = moment(xSelectedDate).add(-1, "days");
        setXSelectedDate(tgl);
        getListBarang(xSearch, xSelectedLokasi.id??"",tgl);
      }}
      >
        {ChevronLeftSVG(24, ListColor.main.Main)}
      </div>
      <div className="flex items-center gap-2" onClick={() => { setXOpenDatePicker(true); }}>
        {CalendarAltOSVG(18, ListColor.main.Main)}
        <p>{xSelectedDate.format("DD MMM YYYY")}</p>
      </div>
      <div onClick={() => {
        let tgl = moment(xSelectedDate).add(1, "days");
        setXSelectedDate(tgl);
        getListBarang(xSearch, xSelectedLokasi.id??"",tgl);
      }}
      >
        {ChevronRightSVG(24, ListColor.main.Main)}
      </div>
    </div>
    <div className="min-h-24" />
    <div className="w-full px-4 py-2">
      <DropdownLokasi
        value={xSelectedLokasi}
        className="mb-2"
        isSupplier={true}
        onChange={(pLokasi) => {
          setXSelectedLokasi(pLokasi);
          getListBarang(xSearch, pLokasi.id ?? "",xSelectedDate);
        }} />
      <div className={`flex-wrap flex  justify-between w-full`}>
        {!xIsLoading&& xListBarang.map((pBarang, pIndex) => {
          return <CardListStokBarang
            key={`barang-${pIndex}`}
            dataBarang={pBarang}
            onDetail={(pValue) => { goToDetail(pValue) }}
          />
        })}
      </div>
    </div>
  </div>;

}

export default ListStokBarang;