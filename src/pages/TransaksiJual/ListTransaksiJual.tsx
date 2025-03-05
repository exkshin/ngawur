import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { CardBarangTransaksiJual } from "../GlobalWidget/cardBarangTransaksiJual";
import { ChevronLeftSVG } from "../../assets/icon/SVGTSX/ChevronLeftSVG";
import ListColor from "../../Config/color";
import { ChevronRightSVG } from "../../assets/icon/SVGTSX/ChevronRightSVG";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import moment, { duration } from "moment";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { BottomButton } from "../CustomWidget/bottomButton";
import { Navigate, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import { CardListTransaksiJual } from "../GlobalWidget/cardListTransaksiJual";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import globalVariables, { printNota } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";

const ListTransaksiJual = () => {
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xSelectedDate, setXSelectedDate] = useState(moment(new Date()));
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xOpenOpsiCard, setxOpenOpsiCard] = useState(false);
  const [xIsClosing, setXIsClosing] = useState(false);
  const [xIsClosingToday, setXIsClosingToday] = useState(false);
  const [xIsPostingToday, setXIsPostingToday] = useState(false);
  const [xDelete, setXDelete] = useState(false);
  const [xSelectedItem, setXSelectedItem] = useState({} as TransaksiJualModel);
  const [xShowSOJual, setXShowSOJual] = useState(false);
  const [xIsLoadingClosing, setxIsLoadingClosing] = useState(false);
  const [xShowToastCheck, setXShowToastCheck] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xAlasan, setXAlasan] = useState("");
  const [xAlasanError, setXAlasanError] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingSO, setXIsLoadingSO] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xSearchSO, setXSearchSO] = useState("");
  const [xSelectedTabIndex, setXSelectedTabIndex] = useState(0);
  const [xListransaksiJual, setxListransaksiJual] = useState([] as TransaksiJualModel[]);
  const [xListransaksiSO, setxListransaksiSO] = useState([] as TransaksiJualModel[]);

  function goToDetail(dataItem: TransaksiJualModel, isSO: boolean) {
    navigate(PageRoutes.detailTransaksiJual, {
      state: {
        from: PageRoutes.listTransaksiJual,
        dataTransaksi: dataItem,
        isSO: isSO,
      }
    })
  }

  function goToEdit(dataItem: any | null, mode: string, type: string) {
    navigate(PageRoutes.tambahTransaksiJual, {
      state: {
        from: PageRoutes.listTransaksiJual,
        dataTransaksi: dataItem,
        mode: mode,
        type: type
      }
    })
  }

  async function deleteItem(pDataItem: TransaksiJualModel | null) {
    setXIsLoading(true);
    try {
      let url = "umkm/ApiSalesOrder/batal";
      const form = new FormData();

      if ((pDataItem?.jenistransaksi ?? "") == "SO") {
        form.append("idso", pDataItem?.idtrans ?? "");
        form.append("kodeso", pDataItem?.kodetrans ?? "");
      } else {
        url = "umkm/ApiJual/batal";
        form.append("idjual", pDataItem?.idtrans ?? "");
        form.append("kodejual", pDataItem?.kodetrans ?? "");
      }
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("alasan", xAlasan);

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setSnackBar("Transaksi Berhasil Dibatalkan", false);
            getListTransaksiJual(xSearch, xSelectedDate);
            getListTransaksiSO(xSearchSO);
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

  function goToRingkasan(value: TransaksiJualModel) {
    navigate(PageRoutes.ringkasanPenjualan, {
      state: {
        isSO: true,
        isBayarSO: true,
        from: PageRoutes.listTransaksiJual,
        dataTransaksi: value,

      }
    })
  }

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

  async function getListTransaksiJual(pSearch: string, pTanggal: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", pTanggal.format("YYYY-MM-DD"));
      form.append("keyword", pSearch);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiJual/listJual", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            setxListransaksiJual(responseData as TransaksiJualModel[]);
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

  async function getListTransaksiSO(pSearch: string) {
    setXIsLoadingSO(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", moment(new Date()).format("YYYY-MM-DD"));
      form.append("keyword", pSearch);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiSalesOrder/listSalesOrder", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            setxListransaksiSO(responseData as TransaksiJualModel[]);
            setXIsLoadingSO(false);
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingSO(false);
  }

  async function getStatusClosing(pTanggal: moment.Moment) {
    setxIsLoadingClosing(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", pTanggal.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");
      await AXIOS
        .post("api/Penjualan/ApiClosingDate/cekTanggalClosingHarian", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setXIsClosing(data.sudahclosing == 1);
            if (pTanggal.format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD")) {
              setXIsClosingToday(data.sudahclosing == 1);
            }
            setXIsPostingToday(data.sudahposting == 1);
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setxIsLoadingClosing(false);
  }

  useEffect(() => {
    getListTransaksiJual("", xSelectedDate);
    getListTransaksiSO("");
    getStatusClosing(xSelectedDate);
  }, [])

  const checkAllTransactionClosingByBarang = async (pValue: TransaksiJualModel) => {
    setXIsLoading(true);
    let check = false;
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tanggal", moment().format("YYYY-MM-DD"));
      form.append("detail", JSON.stringify(pValue.detail))

      await AXIOS
        .post("umkm/ApiClosingDate/cekSudahClosingByBarang", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            check = true;
          } else {
            setXShowToastCheck({ text: data.message, isToastError: true, show: true });
            check = false;
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
    return check;
  }

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <CustomPopupOpsi
      content={
        <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: xShowToastCheck.text }}>
        </div>
      }
      open={xShowToastCheck.show}
      zIndex={99}
      onClose={() => {
        setXShowToastCheck({
          text: "",
          show: false,
          isToastError: false
        })
      }}
    />
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListTransaksiJual(xSearch, moment(value));
        getStatusClosing(moment(value));
      }}
      maxDate={new Date()}
    />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingSO || xIsLoadingClosing} />
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda yakin menghapus data transaksi jual ini?</p>
        <p className="text-left text-14px mt-2">Alasan</p>
        <textarea
          onChange={(e) => {
            setXAlasan(e.target.value);
          }}
          placeholder=""
          value={xAlasan}
          className={`${defaultInputCSS(
            xAlasan !== "" &&
            xAlasan !== undefined,
            xAlasanError,
            false
          )}`}
        />
        {xAlasanError && (
          <div className="mt-2 text-12px text-danger-Main text-left">
            {`Alasan wajib diisi`}
          </div>
        )}
      </div>}
      functionButtonRight={() => {
        setXDelete(false);
      }}
      functionButtonLeft={() => {
        if (xAlasan == "" || xAlasan == null || xAlasan == undefined) {
          setXAlasanError(true);
        } else {
          setXDelete(false);
          deleteItem(xSelectedItem);
        }
      }}
      onClose={() => {
        setXDelete(false);
      }}
      open={xDelete}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={22}
    />
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        Apakah jenis transaksi ini adalah Jual Tunai / Nota Pesanan?
      </div>}
      functionButtonRight={() => {
        setXShowSOJual(false);
        if (xIsPostingToday == false) {
          goToEdit({}, "add", "SO");
        } else {
          setSnackBar("Data Tidak Bisa Ditambahkan Karena Sudah Melakukan Posting Hari Ini", true);
        }
      }}
      functionButtonLeft={() => {
        setXShowSOJual(false);
        if (xIsPostingToday == false) {
          goToEdit({}, "add", "Jual");
        } else {
          setSnackBar("Data Tidak Bisa Ditambahkan Karena Sudah Melakukan Posting Hari Ini", true);
        }
      }}
      onClose={() => {
        setXShowSOJual(false);
      }}
      dismissible={true}
      open={xShowSOJual}
      textButtonRight="Nota Pesanan"
      textButtonLeft="Jual Tunai"
      zIndex={22}
    />
    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => { navigate(PageRoutes.dashboard) }}
      showFrontIcon={false}
      frontIcon={undefined}
      frontFunction={() => { }}
      valueSearch={xSelectedTabIndex == 0 ? xSearch : xSearchSO}
      placeholder={xSelectedTabIndex == 0 ? "Cari Transaksi Jual Tunai" : "Cari Transaksi Nota Pesanan"}
      searchFunction={(value) => {
        if (xSelectedTabIndex == 0) {
          setXSearch(value);
          getListTransaksiJual(value, xSelectedDate);
        } else {
          setXSearchSO(value);
          getListTransaksiSO(value);
        }
      }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />
    <div className="flex fixed top-14 w-full h-10 items-center bg-neutral-20">
      <div className={`w-1/2 h-10 border-r content-center text-center font-bold border-r-main-Main border-b ${xSelectedTabIndex == 0 ? "border-b-main-Main text-main-Pressed" : "border-b-neutral-60 text-neutral-60"}`} onClick={() => {
        setXSelectedTabIndex(0)
      }}
      >
        Jual Tunai
      </div>

      <div className={`w-1/2  h-10 text-center content-center font-bold border-b ${xSelectedTabIndex == 1 ? "border-b-main-Main text-main-Pressed" : "border-b-neutral-60 text-neutral-60"}`} onClick={() => {
        setXSelectedTabIndex(1)
      }}
      >
        Nota Pesanan
      </div>
    </div>
    {xSelectedTabIndex == 0 &&
      <div className="flex justify-between fixed top-24 w-full h-10 px-4 items-center bg-neutral-20">
        <div onClick={() => {
          let tgl = moment(xSelectedDate).add(-1, "days");
          setXSelectedDate(tgl);
          getListTransaksiJual(xSearch, moment(tgl));
          getStatusClosing(moment(tgl));
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
          getListTransaksiJual(xSearch, moment(tgl));
          getStatusClosing(moment(tgl));
        }}
        >
          {ChevronRightSVG(24, ListColor.main.Main)}
        </div>
      </div>
    }
    <div className="min-h-24" />
    {xSelectedTabIndex == 0 && <div className="min-h-10" />}
    <div className="w-full px-4 pb-16 pt-2">
      {xSelectedTabIndex == 0 && xListransaksiJual.map((pElement, pIndex) => {
        return <CardListTransaksiJual
          key={"jual" + pIndex.toString()}
          isSO={false}
          isOpenOpsi={xOpenOpsiCard}
          onChangeShowOpsi={(value) => { setxOpenOpsiCard(value); }}
          isClosing={xIsPostingToday}
          dataItem={pElement}
          onCancel={async (value) => {
            if (xHakAkses.jual?.hapus !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            if (await checkAllTransactionClosingByBarang(value)){
            setXDelete(true);
            setXSelectedItem(value);
            setXAlasan("");
            setXAlasanError(false);
            }
          }}
          onDetail={(value) => {
            goToDetail(value, false);
          }}
          onEdit={async (value) => {
            if (xHakAkses.jual?.ubah !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            if (await checkAllTransactionClosingByBarang(value)){
            goToEdit(value, "edit", "Jual");
            }
          }}
          onPrintNota={(value) => {

            if (xHakAkses.jual?.cetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idtrans ?? "",
              type: "JUAL"
            });
          }}
        />
      })}
      {xSelectedTabIndex == 1 && xListransaksiSO.map((pElement, pIndex) => {
        return <CardListTransaksiJual
          key={"SO" + pIndex.toString()}
          isSO={true}
          isOpenOpsi={xOpenOpsiCard}
          onChangeShowOpsi={(value) => { setxOpenOpsiCard(value); }}
          isClosing={xIsPostingToday}
          dataItem={pElement}
          onCancel={(value) => {
            if (xHakAkses.jual?.hapus !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXDelete(true);
            setXSelectedItem(value);
            setXAlasan("");
            setXAlasanError(false);
          }}
          onDetail={(value) => {
            goToDetail(value, true);
          }}
          onEdit={async (value) => {
            if (xHakAkses.jual?.ubah !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            if (xIsPostingToday) {
              setSnackBar("Sudah Posting Hari Ini", true);
              return;
            }
              goToEdit(value, "edit", "SO");
          }}
          onPembayaran={async (value) => {

            if (xHakAkses.jual?.tambah !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            if (xIsPostingToday) {
              setSnackBar("Tidak bisa melakukan pembayaran karena sudah closing", true);
              return;
            }
            if (await checkAllTransactionClosingByBarang(value)){
            goToRingkasan(value);
            }
          }}
          onPrintNota={(value) => {
            if (xHakAkses.jual?.cetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idtrans ?? "",
              type: "SO",
            });
          }}
        />
      })}
    </div>
    <BottomButton onClick={() => {
      if (xIsPostingToday) { return }
      if (xHakAkses.jual?.tambah !== "1") {
        setSnackBar("Tidak Punya Hak Akses", true);
        return;
      }
      setXShowSOJual(true);
    }} text={"Tambah Transaksi"} disabled={xIsPostingToday} />
  </div>
}

export default ListTransaksiJual;