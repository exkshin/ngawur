import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import AXIOS from "../../Config/axiosRequest";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { PopupLoading } from "../CustomWidget/customPopup";
import { ChevronLeftSVG } from "../../assets/icon/SVGTSX/ChevronLeftSVG";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import ListColor from "../../Config/color";
import { ChevronRightSVG } from "../../assets/icon/SVGTSX/ChevronRightSVG";
import { DataBarangModel } from "../../classModels/barangModel";
import { DataItem, ListTagihanModel } from "../../classModels/detailClosingModel";
import { BarangClosingSupplier } from "../ClosingStock/DetailClosingPage";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { DetailDivStandard, VerticalAlignType } from "../GlobalWidget/DetailDivStandard";
import SearchNavbar from "../CustomWidget/searchNavbar";

const ListRekapTagihan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xSelectedDate, setXSelectedDate] = useState(moment());
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingTagihan, setXIsLoadingTagihan] = useState(false);
  const [xIsLoadingJual, setXIsLoadingJual] = useState(false);
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xDataBeli, setxDataBeli] = useState([] as DataItem[]);
  const [xDataJual, setxDataJual] = useState([] as DataItem[]);
  const [xDataRetur, setxDataRetur] = useState([] as DataItem[]);
  const [xSelectedTabIndex, setXSelectedTabIndex] = useState(0);
  const [xSearch, setXSearch] = useState("");
  const [xTotalTagihan,setXTotalTagihan]=useState("0");
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xListTagihan, setXListTagihan] = useState([] as ListTagihanModel[]);
  const [xListTagihanTemp, setXListTagihanTemp] = useState([] as ListTagihanModel[]);

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
  async function getListRekap(pTanggal: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", pTanggal.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");
      await AXIOS
        .post("api/Pembelian/ApiPembelianLangsung/getDataRekapHarian", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            // setxListKeuangan(responseData as TransaksiBeliModel[]);
            setxDataBeli(responseData.beli ?? [] as DataItem[]);
            setxDataRetur(responseData.retur ?? [] as DataItem[]);
            setXIsLoading(false);
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
  async function getListRekapJual(pTanggal: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", pTanggal.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");
      await AXIOS
        .post("umkm/ApiJual/getDataRekapHarian", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            // setxListKeuangan(responseData as TransaksiBeliModel[]);
            setxDataJual(responseData ?? [] as DataItem[]);
            setXIsLoading(false);
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

  async function getListTagihan() {
    setXIsLoadingTagihan(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");

      await AXIOS
        .post("umkm/ApiSupplier/getRekapTagihan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data?? [] as ListTagihanModel[];
            setXListTagihan(responseData );
            setXListTagihanTemp(responseData);
            let total=0;
            responseData.forEach((element:ListTagihanModel)=> {
              total+=parseInt((element.sisahutang??"0").split(".")[0]);
            });
            setXTotalTagihan(total.toString());
            setXIsLoadingTagihan(false);
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingTagihan(false);
  }

  useEffect(() => {
    getListRekap(xSelectedDate);
    getListRekapJual(xSelectedDate);
    getListTagihan()
  }, [])
  function getGrandTotal(pData: DataItem[], isJual: boolean) {
    let total = 0;
    for (let j = 0; j < pData.length; j++) {
      for (let i = 0; i < pData[j].daftarbarang.length; i++) {
        if (isJual) {
          total += parseInt((pData[j].daftarbarang[i].jml ?? "0.0").split('.')[0]) * parseInt((pData[j].daftarbarang[i].hargabeli ?? "0.0").split('.')[0]);
        }
        else {
          total += parseInt((pData[j].daftarbarang[i].subtotal ?? "0").split(".")[0]);
        }
      }
    }
    return total;
  }

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListRekap(moment(value));
        getListRekapJual(moment(value));
      }}
      maxDate={new Date()}
    />
    <PopupLoading key="loading" open={xIsLoadingTagihan || xIsLoading || xIsLoadingJual} />
    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={"Rekap Tagihan"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.dashboard)}
    />
    <div className="flex fixed top-14 w-full h-10 items-center bg-neutral-20">
      <div className={`w-1/2 h-10 border-r content-center text-center font-bold border-r-main-Main border-b ${xSelectedTabIndex == 0 ? "border-b-main-Main text-main-Pressed" : "border-b-neutral-60 text-neutral-60"}`} onClick={() => {
        setXSelectedTabIndex(0)
      }}
      >
        Tagihan Harian
      </div>

      <div className={`w-1/2  h-10 text-center content-center font-bold border-b ${xSelectedTabIndex == 1 ? "border-b-main-Main text-main-Pressed" : "border-b-neutral-60 text-neutral-60"}`} onClick={() => {
        setXSelectedTabIndex(1)
      }}
      >
        Saldo Tagihan
      </div>
    </div>
    {xSelectedTabIndex == 0
      ? <div className="flex justify-between fixed top-24 w-full h-10 px-4 items-center bg-neutral-20">
        <div onClick={() => {
          let tgl = moment(xSelectedDate).add(-1, "days");
          setXSelectedDate(tgl);
          getListRekap(tgl);
          getListRekapJual(tgl);
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
          getListRekap(tgl);
          getListRekapJual(tgl);
        }}
        >
          {ChevronRightSVG(24, ListColor.main.Main)}
        </div>
      </div>
      : <SearchNavbar
        showBack={false}
        backFunction={() => { }}
        showFrontIcon={false}
        frontIcon={undefined}
        frontFunction={() => { }}
        valueSearch={xSearch}
        placeholder={"Cari Supplier"}
        searchFunction={(value) => {
          setXSearch(value);
          setXListTagihanTemp(xListTagihan.filter((pTagihan) => (pTagihan.namasupplier ?? "").toUpperCase().includes(value.toUpperCase())))
        }}
        onChangeSearch={(value) => {
          setXSearch(value);
        }}
        className="top-24"
      />
    }
    <div className={"min-h-36"} />
    {xSelectedTabIndex == 0
      ? <div className="w-full px-4 pb-16 pt-2">
        <div className="mb-2 font-bold text-center">Barang Penjualan</div>
        {xDataJual.map((pSupplier, pIndex) => {
          return <BarangRekapPenjualan data={pSupplier} index={pIndex} key={"supplierJual" + pIndex} isJual={true} />
        })
        }
        <DetailDivStandard boldAll={true} widthTitle={null} title={"Grand Total Jual"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDataJual, true).toString())} verticalAlign={null} />
        <div className="mb-2 font-bold text-center">Barang Retur</div>
        {xDataRetur.map((pSupplier, pIndex) => {
          return <BarangClosingSupplier data={pSupplier} index={pIndex} key={"supplierRetur" + pIndex} isJual={true} />
        })
        }
        <DetailDivStandard boldAll={true} widthTitle={"140px"} title={"Grand Total Retur"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDataRetur, false).toString())} verticalAlign={null} />
      </div>
      : <div className="w-full px-4 pb-16 pt-2">
        {
          xListTagihanTemp.map((pTagihan, pIndex) => {
            return <div key={`tagihan${pIndex}`} onClick={() => {
              navigate(PageRoutes.listHutang, {
                state: {
                  from: PageRoutes.rekapTagihan,
                  idsupplier: pTagihan.idsupplier,
                }
              })
            }}>
              <DetailDivStandard boldAll={false} widthTitle={"70%"} title={pTagihan.namasupplier ?? ""} subtitle={"Rp" + numberSeparatorFromString((pTagihan.sisahutang ?? "0").split('.')[0])} verticalAlign={null} />
            </div>
          })
        }
      </div>
    }
    <div className="flex fixed bottom-0 w-full h-10 px-4 items-center bg-neutral-20 pt-2">
      <DetailDivStandard boldAll={true}widthTitle={null} title={"Total"} useBorderBottom={false} subtitle={"Rp" + numberSeparatorFromString(xTotalTagihan)} verticalAlign={VerticalAlignType.VerticalCenter} />
    </div>
  </div>;

}

export default ListRekapTagihan;


export const BarangRekapPenjualan = (pParameter: { index: number, data: DataItem, isJual: boolean }) => {
  const [xExpand, setXExpand] = useState(true)
  let getTotal = (data: DataItem) => {
    let total = 0;
    for (let i = 0; i < data.daftarbarang.length; i++) {
      let totalharga = parseInt((data.daftarbarang[i].hargabeli ?? "0").split(".")[0]) * parseInt((data.daftarbarang[i].jml ?? "0").split(".")[0])
      total += totalharga;
    }
    return total;
  }
  return <>
    <div key={(pParameter.isJual ? "barangjual" : "barangsupplier") + pParameter.index} className="flex w-full justify-between items-center"
      onClick={() => {
        setXExpand(!xExpand)
      }}
    >
      <p className="font-14px font-semibold ">{pParameter.data.namasupplier}</p>
      <div>{xExpand ? AngleUpSVG(24, ListColor.main.Main) : AngleDownSVG(24, ListColor.main.Main)}</div>
    </div>
    <div className="w-full justify-between items-center mb-2">
      {pParameter.data.hutang != null && pParameter.data.hutang != undefined && <p className="text-12px">Hutang : Rp{numberSeparatorFromString((pParameter.data.hutang ?? "").replaceAll("-", "").split(".")[0])}</p>}
      {pParameter.data.hutang != null && pParameter.data.hutang != undefined && <p className="text-12px">Omzet  : Rp{numberSeparatorFromString((pParameter.data.omzet ?? "").split(".")[0])}</p>}
    </div>

    {xExpand ?
      <div className="flex-wrap flex justify-between w-full">
        {pParameter.data.daftarbarang.map((pElement, pIndexBarang) => {
          let jml = pElement.jml ?? "0";
          let harga = pElement.hargabeli ?? "0";
          let subtotal = parseFloat(jml) * parseFloat(harga);
          return <div key={`itemJual${pIndexBarang}`} className="mb-2 w-full rounded-lg p-2 bg-main-Surface">
            <p className="text-16px font-bold">{pElement.namabarang} </p>
            <div className="flex justify-between">
              <div className="text-12px font-normal" >{numberSeparatorFromString((jml ?? "").split(".")[0])} x Rp{numberSeparatorFromString((harga ?? "").split(".")[0])}</div>
              <div className="text-12px font-bold">Rp{numberSeparatorFromString((subtotal ?? "").toString().split(".")[0])}</div>
            </div>
          </div>;
        })
        }
      </div> : <></>
    }
    <div key={`totalitemJual${pParameter.index}`} className="mb-2 w-full flex justify-between rounded-lg p-2 bg-main-Surface">
      <div className="text-14px font-bold" >Total</div>
      <div className="text-14px font-bold">Rp{numberSeparatorFromString(getTotal(pParameter.data).toString())}</div>
    </div>
  </>;
}
