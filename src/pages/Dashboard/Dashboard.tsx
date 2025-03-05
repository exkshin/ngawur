import { useEffect, useRef, useState } from "react";
import ListColor from "../../Config/color";
import { Icon } from "@iconify/react";
import MaleAvatar from "../../assets/images/male_avatar.png";
import { MapMarkerOSVG } from "../../assets/icon/SVGTSX/MapMarkerOSVG";
import { ClipboardAltSVG } from "../../assets/icon/SVGTSX/ClipboardAltSVG";
import { useNavigate } from "react-router-dom";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import { HakAksesModel, LoginModelClass } from "../../classModels/loginModelClass";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { numberSeparatorFromString, printNota } from "../../Config/globalVariables";
import { LokasiModel } from "../../classModels/lokasiModel";
import { ProfileModel } from "../../classModels/profileModel";
import { statistikBulanModel } from "../../classModels/statistikBulanModel";
import { PackageOSVG } from "../../assets/icon/SVGTSX/PackageOSVG";
import { DollarAltSVG } from "../../assets/icon/SVGTSX/DollarAltSVG";
import { ShoppingBag } from "../../assets/icon/SVGTSX/ShoppingBagSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { PageRoutes } from "../../PageRoutes";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";
import PopupRingkasan from "../GlobalWidget/RingkasanWidget";
import { CalculatorOSVG } from "../../assets/icon/SVGTSX/CalculatorOSVG";
import PopupVerifikasi from "../GlobalWidget/VerifikasiPelunasanSupplier";
import { NumericFormat } from "react-number-format";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import moment from "moment";
import { EditSVG } from "../../assets/icon/SVGTSX/EditSVG";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";

const Dashboard = () => {
  const navigate = useNavigate();
  const [xDataUser, setXDataUser] = useState({} as ProfileModel);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingModal, setXIsLoadingModal] = useState(false);
  const [xIsLoadingBlokirKelas, setXIsLoadingBlokirKelas] = useState(false);
  const [xIsLoadingStatistikBulan, setXIsLoadingStatistikBulan] = useState(false);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xLoginAsSupplier = localStorage.getItem("loginAs") == "SUPPLIER";
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xDataStatistik, setXDataStatistik] = useState({} as statistikBulanModel);
  const [xModal, setXModal] = useState("0");
  const [xModalTemp, setXModalTemp] = useState("0");
  const [xErrorModal, setxErrorModal] = useState(false);
  const [xOpenModal, setXOpenModal] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xOpenRingkasan, setXOpenRingkasan] = useState(false);
  const [xPhoto, setXPhoto] = useState(MaleAvatar);
  const [xOpenVerifikasi, setXOpenVerifikasi] = useState(false);

  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  const [xListMenu, setXListMenu] = useState(
    xLoginAsSupplier ? [
      {
        nama: "Stok Barang",
        onClick: () => {
          navigate(PageRoutes.stokBarang);
        },
        icon: PackageOSVG(40, ListColor.main.Main),
      },
      {
        nama: "Daftar Tagihan",
        onClick: () => {
          navigate(PageRoutes.listHutang);
        },
        icon: ClipboardAltSVG(40, ListColor.main.Main),
      },
    ]
      : [{
        nama: "Master Barang",
        onClick: () => {
          if (xHakAkses.barang?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.masterBarang);
        },
        icon: PackageOSVG(40, ListColor.main.Main),
      }, {
        nama: "Transaksi Beli",
        onClick: () => {
          if (xHakAkses.beli?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.listTransaksiBeli);
        },
        icon: ShoppingBag(40, ListColor.main.Main),
      }, {
        nama: "Transaksi Jual",
        onClick: () => {
          if (xHakAkses.jual?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.listTransaksiJual);
        },
        icon: DollarAltSVG(40, ListColor.main.Main),
      }, {
        nama: "Keuangan",
        onClick: () => {
          if (xHakAkses.kas?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.listKeuangan);
        },
        icon: CalculatorOSVG(40, ListColor.main.Main),
      }, {
        nama: "Closing",
        onClick: () => {
          if (xHakAkses.closing?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.listClosing);
        },
        icon: ClipboardAltSVG(40, ListColor.main.Main),
      }, {
        nama: "Setting Printer",
        onClick: () => {
          window.flutter_inappwebview.callHandler(
            "SettingPrinter",
          );
        },
        icon: <Icon fontSize={"40px"} icon={"uil:print"} color={ListColor.main.Main} />
      },
      {
        nama: "Rekap Tagihan",
        onClick: () => {
          if (xHakAkses.laporanhutang?.hakakses !== "1") {
            setSnackBar("Tidak Punya Hak Akses", true);
            return;
          }
          navigate(PageRoutes.rekapTagihan)
        },
        icon: <Icon fontSize={"40px"} icon={"uil:wallet"} color={ListColor.main.Main} />
      }
      ]);

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
  const initState = async () => {
    if (!xLoginAsSupplier) {
      getProfile();
      getModal();
    }
  }

  async function getProfile() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      await AXIOS
        .post("api/Master/ApiUser/getDataProfile", form)
        .then((res) => res.data)
        .then((data) => {
          setXPhoto((data.data.gambarpath ?? "") + "?t=" + Date.now());
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  useEffect(() => {
    initState();
  }, [])

  const [xGoBack, setXGoBack] = useState(false);
  const detectBack = (event: MessageEvent) => {
    if (event.data === "GoBack") {
      setXGoBack(true);
    }
  };

  /**
 * @description untuk tambahkan listener ketika user klik back di hp
 */
  useEffect(() => {
    window.addEventListener("message", detectBack, true);
    // cleanup this component
    return () => {
      window.removeEventListener("message", detectBack, true);
    };
  }, []);

  async function getModal() {
    setXIsLoadingModal(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append('idlokasi', xDataLokasi.id ?? "");
      form.append("tanggal", moment().format("YYYY-MM-DD"))
      await AXIOS
        .post("umkm/ApiKasir/getModalAwal", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let modal = (data.data ?? "-1").toString();
            setXModal((data.data ?? "0").toString().split(".")[0]);
            if (parseFloat(modal) >= 0) {
            } else {
              setXOpenModal(true);
            }
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingModal(false);
  }

  async function simpanModal() {
    setXIsLoadingModal(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append('idlokasi', xDataLokasi.id ?? "");
      form.append("tanggal", moment().format("YYYY-MM-DD"))
      form.append('amount', xModalTemp);
      await AXIOS
        .post("umkm/ApiKasir/simpanModalAwal", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setXModal(xModalTemp);
          } else {
            throw ("success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingModal(false);
  }

  useEffect(() => {
    if (xGoBack) {
      setXGoBack(false);
      if (xIsLoadingBlokirKelas || xIsLoadingStatistikBulan || xIsLoading) return;
      //! SET CONFIRMATION TO GO BACK TO LOGIN
      if (xOpenRingkasan) {
        setXOpenRingkasan(false);
        return;
      }
      if (xShowKonfirmasi) {
        setXShowkonfirmasi(false);
        return;
      }

      if (xOpenModal && parseFloat(xModal) > 0) {
        setXOpenModal(true);
        return;
      }
    }
  }, [xGoBack]);

  return (
    <div className="app w-screen h-screen bg-background gap-3 flex flex-col font-Asap overflow-y-auto">
      <CustomPopup
        content={<div className="whitespace-pre-line text-center mb-2 font-semibold text-sm">
          <p>Silahkan masukkan uang modal</p>

          <div className="">
            <div className="font-semibold text-14px text-left mb-2.5">Uang Modal(Rp)</div>
            <div className="relative w-full mt-2.5">
              <NumericFormat
                className={`inset-y-0 h-10 ${defaultInputCSS(
                  true,
                  xErrorModal,
                  false
                )} text-left`}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                thousandsGroupStyle="thousand"
                value={xModalTemp}
                isAllowed={(values) => {
                  let jumlah = values.floatValue ?? 0;
                  return jumlah >= 0;
                }}
                allowLeadingZeros={false}
                onChange={(e) => {
                  let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
                  if (jumlah >= 0) {
                    setXModalTemp((jumlah).toString());
                  }
                }}
              />
            </div>
            {xErrorModal && <div className="text-12px text-danger-Main text-left">Modal harus lebih besar dari 0</div>}
          </div>
        </div>}
        functionButtonRight={() => {
          // if (parseFloat(xModal) < 0) {
          //   setxErrorModal(true);
          // } else {
            setXOpenModal(false);
          // }
        }}
        functionButtonLeft={() => {
          // if (parseFloat(xModalTemp) < 0) {
          //   setxErrorModal(true);
          // } else {
            setXOpenModal(false);
            simpanModal();
          // }
        }}
        onClose={() => {
          // if (parseFloat(xModal) < 0) {
          //   setxErrorModal(true);
          // } else {
            setXOpenModal(false);
          // }
        }}
        dismissible={parseFloat(xModal) > 0}
        open={xOpenModal}
        textButtonRight="Kembali"
        textButtonLeft="Simpan"
        zIndex={22}
      />
      {!xLoginAsSupplier
        ? <PopupRingkasan openPopup={xOpenRingkasan} onClose={() => setXOpenRingkasan(false)} />
        : <PopupVerifikasi openPopup={xOpenVerifikasi} onClose={() => setXOpenVerifikasi(false)} />
      }
      <CustomPopup
        content={<div className="">
          <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin mau keluar?</div>
        </div>}
        functionButtonRight={() => {
          setXShowkonfirmasi(false);
        }}
        functionButtonLeft={() => {
          setXShowkonfirmasi(false);
          localStorage.removeItem("dataLogin");
          localStorage.removeItem("dataLoginSupplier");
          navigate(PageRoutes.login);
          try {
            window.flutter_inappwebview.callHandler(
              "HapusPref",
            );
          } catch (e) { }
        }}
        onClose={() => { setXShowkonfirmasi(false); }}
        dismissible={xModal == "0"}
        open={xShowKonfirmasi}
        textButtonRight="Tidak"
        textButtonLeft="Ya"
        zIndex={81}
      />
      <PopupLoading key="loadingDashboard" open={xIsLoadingModal || xIsLoadingBlokirKelas || xIsLoadingStatistikBulan || xIsLoading} />
      {ToastSnackbar(xShowToast)}
      <div className="px-2 mx-4 my-2 py-2 gap-3 flex flex-col bg-main-Surface rounded-xl ">
        <div className="w-full gap-[11px] flex flex-row items-center">
          <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] overflow-hidden rounded-full flex drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" onClick={() => navigate(PageRoutes.profile)}>
            <img
              src={xPhoto}
              alt="person"
              onError={() => { setXPhoto(MaleAvatar) }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          </div>
          <div className="w-full">
            <div className="flex flex-col text-14px mb-1 w-full">
              <div className="flex justify-between">
                <p>Selamat Bekerja</p>
                <Icon fontSize={"18px"} icon={"uil:exit"} onClick={() => {
                  setXShowkonfirmasi(true);
                }} />
              </div>
              <div className="font-bold">{xLoginAsSupplier ? xDataSupplierLogin.namasupplier : xDataLogin.namauser}</div>
            </div>
            <div className="text-12px flex mt-2 flex-row gap-1 font-semibold text-neutral-70" onClick={() => { navigate(PageRoutes.selectLocation, { state: { fromPage: PageRoutes.dashboard } }) }}>
              {MapMarkerOSVG(16, ListColor.main.Main)} {xDataLokasi.nama}
            </div>
            {!xLoginAsSupplier && <div className="text-14px font-bold mt-2 flex flex-row gap-1 text-neutral-70" onClick={() => { setXModalTemp(xModal); setXOpenModal(true) }}>
              {EditSVG(16, ListColor.main.Main)} {numberSeparatorFromString(xModal)}
            </div>}
          </div>
        </div>
      </div>
      <div className="flex-wrap flex justify-between w-full px-4">
        {xListMenu.map((element, pIndex) =>
          <div key={`menu${pIndex}`} onClick={element.onClick} className="min-w-24 max-w-24 rounded-lg mb-2 min-h-28 max-h-28 bg-success-Surface shadow-lg p-2 text-center justify-items-center ">
            {element.icon}
            <p className="text-14px font-semibold mt-2">{element.nama}</p>
          </div>
        )
        }
        <div className="min-w-24 max-w-24" />
      </div>
      {xLoginAsSupplier == true
        ? <div className="fixed bottom-0 bg-neutral-20 shadow-xl w-full rounded-lg justify-items-center pb-2" onClick={() => setXOpenVerifikasi(true)}>
          {AngleUpSVG(24, ListColor.main.Main)}
          <p className="text-h5 text-center font-bold text-neutral-90">Verifikasi Pelunasan</p>
        </div>
        : xHakAkses.laporanpenjualan?.hakakses=="1"&& <div className="fixed bottom-0 bg-neutral-20 shadow-xl w-full rounded-lg justify-items-center pb-2" onClick={() => setXOpenRingkasan(true)}>
          {AngleUpSVG(24, ListColor.main.Main)}
          <p className="text-h5 font-bold text-neutral-90">Laporan Omzet & Hutang</p>
        </div>}
    </div>
  );
}

export default Dashboard;