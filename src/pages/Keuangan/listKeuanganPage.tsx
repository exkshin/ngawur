import { BottomButton } from "../CustomWidget/bottomButton";
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
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import globalVariables, { printNota } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { CardListTransaksiBeli } from "../GlobalWidget/cardListTransaksiBeli";
import { UnselectedRadioButtonSVG } from "../../assets/icon/SVGTSX/UnselectedRadioButtonSVG";
import { SelectedRadioButtonSVG } from "../../assets/icon/SVGTSX/SelectedRadioButtonSVG";
import { ListKasKeuanganModel } from "../../classModels/listKasKeuanganModel";
import { CardListKeuangan } from "../GlobalWidget/cardListKeuangan";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";
import { KeySkeletonSVG } from "../../assets/icon/SVGTSX/KeySkeletonSVG";
import { EyeSVG } from "../../assets/icon/SVGTSX/EyeSVG";
import { EyeSplashSVG } from "../../assets/icon/SVGTSX/EyeSplashSVG";

const ListKeuanganPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xSelectedDate, setXSelectedDate] = useState(moment(new Date()));
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xOpenOpsiCard, setxOpenOpsiCard] = useState(false);
  const [xDelete, setXDelete] = useState(false);
  const [xSelectedItem, setXSelectedItem] = useState({} as ListKasKeuanganModel);
  const [xIsLoadingClosing, setxIsLoadingClosing] = useState(false);
  const [xOpenPopupJenisKeuangan, setxOpenPopupJenisKeuangan] = useState(false);
  const [xKonfirmasi, setXKonfirmasi] = useState(false);
  const [xIsKasKeluar, setxIsKasKeluar] = useState(false);
  const [xIsPostingToday, setXIsPostingToday] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xAlasan, setXAlasan] = useState("");
  const [xAlasanError, setXAlasanError] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xListKeuangan, setxListKeuangan] = useState([] as ListKasKeuanganModel[]);
  const [xPassword, setXPassword] = useState("");
  const [xErrorPassword, setXErrorPassword] = useState("");
  const [xIsVisiblePassword, setXIsVisiblePassword] = useState(false);

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
    let message = "";
    let isToastError = false;

    if (location.state != undefined && location.state != null) {
    if (location.state.message != undefined && location.state.message != null) {
        message = location.state.message;
      }
      if (location.state.isToastError != undefined && location.state.isToastError != null) {
        isToastError = location.state.isToastError;
      }
      if (location.state.showToast != undefined && location.state.showToast != null && location.state.showToast == true) {
        setSnackBar(message, isToastError);
      }
    }
    getStatusClosing(moment());
  }, [])

  function goToDetail(dataItem: ListKasKeuanganModel) {
    navigate(PageRoutes.detailKeuangan, {
      state: {
        from: PageRoutes.listTransaksiBeli,
        dataTransaksi: dataItem,
      }
    })
  }

  function goToEdit(dataItem: TransaksiBeliModel | null, isEdit: boolean, isKasKeluar: boolean) {
    navigate(PageRoutes.formKeuangan, {
      state: {
        from: PageRoutes.listKeuangan,
        dataTransaksi: dataItem,
        isEdit: isEdit,
        isKasKeluar: isKasKeluar,
      }
    })
  }

  async function deleteItem(pDataItem: ListKasKeuanganModel | null) {
    setXIsLoading(true);
    try {
      let url = "umkm/ApiKasPelunasan/batalKas";
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("alasan", xAlasan);
      if (pDataItem?.jenistrans == "PELUNASAN HUTANG") {
        url = "umkm/ApiKasPelunasan/batalPelunasanHutang";
        form.append("idpelunasan", pDataItem?.idtrans ?? "");
        form.append("kodepelunasan", pDataItem?.kodetrans ?? "");
      } else {
        form.append("idkas", pDataItem?.idtrans ?? "");
        form.append("kodekas", pDataItem?.kodetrans ?? "");
      }

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setSnackBar("Transaksi Berhasil Dibatalkan", false);
            getListKeuangan(xSearch, xSelectedDate);
          } else {      
            setSnackBar(data.message, true);
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

  async function getListKeuangan(pSearch: string, pTanggal: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tglawal", pTanggal.format("YYYY-MM-DD"));
      form.append("tglakhir", pTanggal.format("YYYY-MM-DD"));
      form.append("keyword", pSearch);
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("page", "1");
      form.append("perpage", "10000");

      await AXIOS
        .post("umkm/ApiKasPelunasan/listKasPelunasan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            setxListKeuangan(responseData as TransaksiBeliModel[]);
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
    getListKeuangan("", xSelectedDate);
  }, [])

  const simpanOtorisasi = async () => {
    setXIsLoading(true);
    let url = "umkm/ApiKasPelunasan/otorisasiKas";
    const form = new FormData();
    form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
    form.append("iduser", globalVariables.idUserGlobal);
    form.append("idkas", xSelectedItem.idtrans ?? "");
    form.append("kodekas", xSelectedItem.kodetrans ?? "");

    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            setSnackBar("Kas Keluar Berhasil Diotorisasi", false);
            setXKonfirmasi(false);
            // getListKeuangan(xSearch, xSelectedDate);
            let temp= xListKeuangan;
            for(let i=0;i<temp.length;i++){
              if(temp[i].idtrans==xSelectedItem.idtrans&&xSelectedItem.jenistrans==temp[i].jenistrans){
                temp[i].status="S";
              }
            }
            setxListKeuangan(temp);
          } else {
            setSnackBar(data.message, true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    setXIsLoading(false);
  }

  const simpanVerifikasi = async () => {
    setXIsLoading(true);
    let url = "umkm/ApiKasPelunasan/verifikasiPelunasanHutang";
    const form = new FormData();
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    form.append("iduser", globalVariables.idUserGlobal);
    form.append("idpelunasan", xSelectedItem.idtrans ?? "");
    form.append("kodepelunasan", xSelectedItem.kodetrans ?? "");
    form.append("password", xPassword);
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            setSnackBar("Pelunasan Berhasil Diverifikasi", false);
            setXKonfirmasi(false);
            // getListPelunasan(xSelectedDate);
            let temp= xListKeuangan;
            for(let i=0;i<temp.length;i++){
              if(temp[i].idtrans==xSelectedItem.idtrans&&xSelectedItem.jenistrans==temp[i].jenistrans){
                temp[i].status="P";
              }
            }
            setxListKeuangan(temp);
          } else {
            setSnackBar(data.message??"Pelunasan Gagal Diverifikasi", true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    setXIsLoading(false);
  }

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda mau {xSelectedItem.jenistrans == "KAS KELUAR" ? "otorisasi data keuangan ini" : "verifikasi data pelunasan ini"}?</p>
        {xSelectedItem.jenistrans == "PELUNASAN HUTANG"&& <div className=" mt-2.5 w-full">
          <div className="font-semibold text-14px text-left mb-2.5">Password Supplier *</div>
          <div className="w-full block">
            <div className="relative w-full mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {KeySkeletonSVG(24, ListColor.neutral[90])}
              </div>
              <input
                onChange={(e) => {
                  setXPassword(e.target.value);
                }}
                autoComplete="false"
                value={xPassword}
                type={xIsVisiblePassword ? "text" : "password"}
                className={`${defaultInputCSS((xPassword !== "" && xPassword !== undefined), xErrorPassword !== "", false)} px-10`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                onClick={() => setXIsVisiblePassword(!xIsVisiblePassword)}
              >
                {!xIsVisiblePassword
                  ? EyeSVG(24, ListColor.neutral[90])
                  : EyeSplashSVG(24, ListColor.neutral[90])}
                {/* <FontAwesomeIcon className="w-5 h-5 text-[#50555B]" icon={xIsPasswordVisible ? faEye : faEyeSlash} /> */}
              </button>
            </div>
            {xErrorPassword != "" && <div className="text-12px text-danger-Main text-left">Password Wajib Diisi</div>}
          </div>
        </div>}
      </div>}
      functionButtonRight={() => {
        setXKonfirmasi(false);
      }}
      functionButtonLeft={() => {
        if (xSelectedItem.jenistrans == "KAS KELUAR") {
          simpanOtorisasi();
        } else {
          if(xPassword==""){
            setXErrorPassword("error");
          }else{
            setXErrorPassword("");
          simpanVerifikasi();
        }
        }
      }}
      onClose={() => {
        setXKonfirmasi(false);
      }}
      open={xKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={60}
    />
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListKeuangan(xSearch, moment(value));
      }}
      maxDate={new Date()}
    />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingClosing} />
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Jenis Kas</div>
        <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => { setxIsKasKeluar(false); }}>
          {!xIsKasKeluar ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Kas Masuk
        </div>
        <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => setxIsKasKeluar(true)}>
          {xIsKasKeluar ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Kas Keluar
        </div>
      </div>}
      functionButtonRight={() => {
        setxOpenPopupJenisKeuangan(false);
        setxIsKasKeluar(false);
      }}
      functionButtonLeft={() => {
        goToEdit(null, false, xIsKasKeluar);
      }}
      onClose={() => {
        setxOpenPopupJenisKeuangan(false);
        setxIsKasKeluar(false);
      }}
      dismissible={true}
      open={xOpenPopupJenisKeuangan}
      textButtonRight="Kembali"
      textButtonLeft="Tambah"
      zIndex={40}
    />
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda yakin menghapus data keuangan ini?</p>
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
      placeholder={"Cari Transaksi Keuangan"}
      searchFunction={(value) => {
        setXSearch(value);
        getListKeuangan(value, xSelectedDate);
      }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />

    <div className="flex justify-between fixed top-14 z-20 w-full h-10 px-4 items-center bg-neutral-20">
      <div onClick={() => {
        let tgl = moment(xSelectedDate).add(-1, "days");
        setXSelectedDate(tgl);
        getListKeuangan(xSearch, moment(tgl));
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
        getListKeuangan(xSearch, moment(tgl));
      }}
      >
        {ChevronRightSVG(24, ListColor.main.Main)}
      </div>
    </div>

    <div className="min-h-24" />
    <div className="w-full px-4 pb-16 pt-2">
      {xListKeuangan.map((pElement, pIndex) => {
        return <CardListKeuangan
          key={"kas" + pIndex.toString()}
          isOpenOpsi={xOpenOpsiCard}
          onChangeShowOpsi={(value) => { setxOpenOpsiCard(value); }}
          isClosing={xIsPostingToday}
          dataItem={pElement}
          onCancel={(value) => {
            if ((value.jenistrans == "PELUNASAN HUTANG" && xHakAkses.pelunasanhutang?.hapus !== "1") || (value.jenistrans !== "PELUNASAN HUTANG" && xHakAkses.kas?.hapus !== "1")) {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXDelete(true);
            setXSelectedItem(value);
            setXAlasan("");
            setXAlasanError(false);
          }}
          onOtorisasi={(value) => {
            if (xHakAkses.kas?.cetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXKonfirmasi(true);
            setXSelectedItem(value);
          }}
          onVerifikasi={(value) => {
            setXKonfirmasi(true);
            setXErrorPassword("");
            setXPassword("");
            setXIsVisiblePassword(false);
            setXSelectedItem(value);
          }}
          onDetail={(value) => {
            goToDetail(value);
          }}
          onCetak={(value) => {
            if ((value.jenistrans == "PELUNASAN HUTANG" && xHakAkses.pelunasanhutang?.tambah !== "1") || (value.jenistrans !== "PELUNASAN HUTANG" && xHakAkses.kas?.tambah !== "1")) {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idtrans ?? "",
              type: value.jenistrans == "PELUNASAN HUTANG" ? "PELUNASAN" : "KAS",
              kode: value.kodetrans ?? "",
            });
          }}
        />
      })}
    </div>
    <div className="min-h-16" />
    <BottomButton onClick={() => {
      if(xIsPostingToday){return}
      if (xHakAkses.kas?.tambah !== "1") {
        setSnackBar("Tidak Punya Hak Akses", true);
        return;
      }
      setxOpenPopupJenisKeuangan(true);
    }} text={"Tambah Transaksi"} disabled={xIsPostingToday} />
  </div>
}
export default ListKeuanganPage;