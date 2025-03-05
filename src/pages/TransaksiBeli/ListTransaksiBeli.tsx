import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { ChevronLeftSVG } from "../../assets/icon/SVGTSX/ChevronLeftSVG";
import ListColor from "../../Config/color";
import { ChevronRightSVG } from "../../assets/icon/SVGTSX/ChevronRightSVG";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import moment, { duration } from "moment";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { BottomButton } from "../CustomWidget/bottomButton";
import { Navigate, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import globalVariables, { printNota } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { CardListTransaksiBeli } from "../GlobalWidget/cardListTransaksiBeli";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";

const ListTransaksiBeli = () => {
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xSelectedDate, setXSelectedDate] = useState(moment(new Date()));
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xOpenOpsiCard, setxOpenOpsiCard] = useState(false);
  const [xIsClosingToday, setXIsClosingToday] = useState(false);
  const [xDelete, setXDelete] = useState(false);
  const [xSelectedItem, setXSelectedItem] = useState({} as TransaksiBeliModel);
  const [xIsLoadingClosing, setxIsLoadingClosing] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xAlasan, setXAlasan] = useState("");
  const [xAlasanError, setXAlasanError] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xListransaksiBeli, setxListransaksiBeli] = useState([] as TransaksiBeliModel[]);

  function goToDetail(dataItem: TransaksiBeliModel) {
    navigate(PageRoutes.detailTransaksiBeli, {
      state: {
        from: PageRoutes.listTransaksiBeli,
        dataTransaksi: dataItem,
      }
    })
  }

  function goToEdit(dataItem: TransaksiBeliModel | null, isEdit: boolean) {
    navigate(PageRoutes.tambahTransaksiBeli, {
      state: {
        from: PageRoutes.listTransaksiBeli,
        dataTransaksi: dataItem,
        isEdit: isEdit,
      }
    })
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
            setXIsClosingToday(data.sudahclosing == 1);
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

  async function deleteItem(pDataItem: TransaksiBeliModel | null) {
    setXIsLoading(true);
    try {
      let url = "api/Pembelian/ApiPembelianLangsung/batal";
      const form = new FormData();
      form.append("idbeli", pDataItem?.idtrans ?? "");
      form.append("kodebeli", pDataItem?.kodetrans ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("alasan", xAlasan);

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setSnackBar("Transaksi Berhasil Dibatalkan", false);
            getListTransaksiBeli(xSearch, xSelectedDate);
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

  async function getListTransaksiBeli(pSearch: string, pTanggal: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tgltrans", pTanggal.format("YYYY-MM-DD"));
      form.append("keyword", pSearch);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("api/Pembelian/ApiPembelianLangsung/listBeli", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.rows;
            setxListransaksiBeli(responseData as TransaksiBeliModel[]);
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

  useEffect(() => {
    getListTransaksiBeli("", xSelectedDate);
    getStatusClosing(moment());
  }, [])


  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListTransaksiBeli(xSearch, moment(value));
        getStatusClosing(moment(value));
      }}
      maxDate={new Date()}
    />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingClosing} />
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda yakin menghapus data transaksi beli ini?</p>
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

    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => { navigate(PageRoutes.dashboard) }}
      showFrontIcon={false}
      frontIcon={undefined}
      frontFunction={() => { }}
      valueSearch={xSearch}
      placeholder={"Cari Transaksi Beli"}
      searchFunction={(value) => {
        setXSearch(value);
        getListTransaksiBeli(value, xSelectedDate);
      }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />

    <div className="flex justify-between fixed top-14 w-full h-10 px-4 items-center bg-neutral-20">
      <div onClick={() => {
        let tgl = moment(xSelectedDate).add(-1, "days");
        setXSelectedDate(tgl);
        getListTransaksiBeli(xSearch, moment(tgl));
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
        getStatusClosing(moment(tgl));
        getListTransaksiBeli(xSearch, moment(tgl));
      }}
      >
        {ChevronRightSVG(24, ListColor.main.Main)}
      </div>
    </div>

    <div className="min-h-24" />
    <div className="w-full px-4 pb-16 pt-2">
      {xListransaksiBeli.map((pElement, pIndex) => {
        return <CardListTransaksiBeli
          key={"Beli" + pIndex.toString()}
          isOpenOpsi={xOpenOpsiCard}
          onChangeShowOpsi={(value) => { setxOpenOpsiCard(value); }}
          isClosing={xIsClosingToday}
          dataItem={pElement}
          onCancel={(value) => {
            if (xHakAkses.beli?.hapus !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXDelete(true);
            setXSelectedItem(value);
            setXAlasan("");
            setXAlasanError(false);
          }}
          onDetail={(value) => {
            goToDetail(value);
          }}
          onEdit={(value) => {
            if (xHakAkses.beli?.ubah !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            goToEdit(value, true);
          }}
          onPrintNota={(value) => {
            if (xHakAkses.beli?.cetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idtrans ?? "",
              type: "BELI"
            });
          }}
        />
      })}
    </div>
    <div className="min-h-16" />
    <BottomButton onClick={() => {
      if (xHakAkses.beli?.tambah !== "1") {
        setSnackBar("Tidak Punya Hak Akses", true);
        return;
      }
      goToEdit(null, false);
    }} text={"Tambah Transaksi"} disabled={xIsClosingToday} />
  </div>
}

export default ListTransaksiBeli;