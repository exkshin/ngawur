import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { PageRoutes } from "../../PageRoutes";
import { BottomButton } from "../CustomWidget/bottomButton";
import globalVariables, { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import PopupPerkiraan from "./PopupPerkiraan";
import { SupplierModel } from "../../classModels/supplierModel";
import { PopupPelunasan } from "./PopupPelunasan";
import { DropdownKas } from "../GlobalWidget/dropdownKas";
import { KasModel, SelectedPerkiraanModel } from "../../classModels/perkiraanKasModel";
import { EditSVG } from "../../assets/icon/SVGTSX/EditSVG";
import ListColor from "../../Config/color";
import { HutangPelunasanModel } from "../../classModels/HutangPelunasanModel";
import { TrashAltSVG } from "../../assets/icon/SVGTSX/TrashAltSVG";
import AXIOS from "../../Config/axiosRequest";
import moment from "moment";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { CheckboxSVG } from "../CustomWidget/checkboxCustom";
import { BottomSheetDetailPelunasanHutang } from "./BottomSheetDetailPelunasanHutang";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import { PinSVG } from "../../assets/icon/SVGTSX/PinSVG";
import { NumericFormat } from "react-number-format";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";
import { KeySkeletonSVG } from "../../assets/icon/SVGTSX/KeySkeletonSVG";
import { EyeSVG } from "../../assets/icon/SVGTSX/EyeSVG";
import { EyeSplashSVG } from "../../assets/icon/SVGTSX/EyeSplashSVG";

const FormKeuanganPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xIsEdit, setXIsEdit] = useState(false);
  const [xIsKasKeluar, setxIsKasKeluar] = useState(false);
  const [xAkunKas, setXAkunKas] = useState(null as KasModel | null);
  const [xShowDelete, setXshowDelete] = useState(false);
  const [xOpenDDKas, setxOpenDDKas] = useState(false);
  const [xErrorKas, setXErrorKas] = useState(false);
  const [xTotalDebet, setXTotalDebet] = useState(0);
  const [xTotalKredit, setXTotalKredit] = useState(0);
  const [xIndexPerkiraan, setxIndexPerkiraan] = useState(0);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as null | SupplierModel);
  const [xSelectedListHutang, setXSelectedListHutang] = useState([] as HutangPelunasanModel[]);
  const [xListSelectedPerkiraan, setxListSelectedPerkiraan] = useState([] as SelectedPerkiraanModel[]);
  const [xDisableButtonSimpan, setxDisableButtonSimpan] = useState(false);
  const [xCatatan, setXCatatan] = useState("");
  const [xKonfirmasi, setXKonfirmasi] = useState(false);
  const [xPassword, setXPassword] = useState("");
  const [xErrorPassword, setXErrorPassword] = useState("");
  const [xIsVisiblePassword, setXIsVisiblePassword] = useState(false);
  const [xErrorCatatan, setXErrorCatatan] = useState(false);
  const [xListHutang, setXListHutang] = useState([] as HutangPelunasanModel[]);
  const [xListHutangReal, setXListHutangReal] = useState([] as HutangPelunasanModel[]);
  const [xErrorSupplier, setXErrorSupplier] = useState(false);
  const [xErrorDaftarHutang, setXErrorDaftarHutang] = useState(false);
  const [xOpenDropdownSupplier, setXOpenDropdownSupplier] = useState(false);
  const [xShowDetailHutang, setxShowDetailHutang] = useState(false);
  const [xSelectedHutang, setxSelectedHutang] = useState(null as HutangPelunasanModel | null)
  const [xAmount, setXAmount] = useState("0");
  const [xErrorAmount, setXErrorAmount] = useState(false);
  const [xErrorAmountText, setXErrorAmountText] = useState("");
    const [xidpelunasan,setxidpelunasan]=useState("0");
    const [xkodepelunasan,setxkodepelunasan]=useState("0");
  const [xPopupPerkiraan, setXPopupPerkiraan] = useState({
    open: false,
    isEdit: false,
  });
  const [xOpenPopupPelunasan, setXOpenPopupPelunasan] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  /**
  * @description untuk menampilkan toast
  * @param text text yang mau ditampilkan dalam toast
  * @param isToastError true, tampilan akan berubah menjadi toast error dan false, akan menjadi toast success
  */
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
        isToastError: false //error/success
      });
    }, 3000);
  }

  useEffect(() => {
    let from = "";
    let idtrans = "";
    let isKasKeluar = false;
    let isEdit = false;
    if (location.state != undefined && location.state != null) {
      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        setXIsEdit(location.state.isEdit);
        isEdit = location.state.isEdit;
      }
      if (location.state.isKasKeluar != undefined && location.state.isKasKeluar != null) {
        setxIsKasKeluar(location.state.isKasKeluar);
        isKasKeluar = location.state.isKasKeluar;
      }
    }
  }, [])

  useEffect(() => {
    let totaldebet = 0;
    let totalkredit = 0;
    xListSelectedPerkiraan.forEach((value) => {
      // if (value.saldo == "DEBET") {
      totaldebet += parseInt((value.amount ?? "0").toString().split(".")[0]);
      // } else {
      //   totalkredit += parseInt((value.amount ?? "0").toString().split(".")[0]);
      // }
    })

    setXTotalDebet(totaldebet);
    setXTotalKredit(totaldebet);
    // setXTotalKredit(totalkredit);
  }, [xListSelectedPerkiraan])


  async function simpanKas() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      let url = "umkm/ApiKasPelunasan/simpanKas"
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("nilaikurs", "1");
      form.append("idcurrency", xAkunKas?.idcurrency ?? "");
      form.append("kodekas", "");
      form.append("idkas", "");
      form.append("tgltrans", moment().format("YYYY-MM-DD"));
      form.append("jeniskas", xIsKasKeluar ? "KAS KELUAR" : "KAS MASUK");
      form.append("idperkiraankas", xAkunKas?.id ?? "");
      form.append("mode", "tambah");
      if (xOpenPopupPelunasan) {
        url = "umkm/ApiKasPelunasan/simpanPelunasanHutang";
        let temp = [] as {
          kodetrans: String | null,
          tgltrans: String | null,
          jenistransaksi: String | null,
          sisa: String | null,
          keterangan: String | null,
        }[];
        let unselected = [] as HutangPelunasanModel[];
        xListHutang.forEach(pHutang => {
          let isSelected = false;
          (xSelectedListHutang).forEach(pSelected => {
            if (pSelected.idtrans == pHutang.idtrans) {
              isSelected = true;
            }
          });
          if (!isSelected) {
            unselected.push(pHutang);
          }
        })

        let ListReturBeli=[]as {
          kodetrans: String | null,
          tgltrans: String | null,
          jenistransaksi: String | null,
          sisa: String | null,
          keterangan: String | null,
        }[];
        let ListBeli=[]as {
          kodetrans: String | null,
          tgltrans: String | null,
          jenistransaksi: String | null,
          sisa: String | null,
          keterangan: String | null,
        }[];
        xListHutangReal.sort()
        xListHutangReal.forEach(pHutang => {
          let isSelected = true;
          unselected.forEach(element => {
            if (pHutang.tgltrans == element.tgltrans&& pHutang.idlokasi==element.idlokasi) {
              isSelected = false;
            }
          });
          if (isSelected) {
            if(pHutang.jenistransaksi=="RETUR BELI"){
              ListReturBeli.push({
                kodetrans: pHutang.kodetrans,
                tgltrans: pHutang.tgltrans,
                jenistransaksi: pHutang.jenistransaksi,
                sisa: pHutang.sisa,
                keterangan: "",
              })
            }else{
              ListBeli.push({
                kodetrans: pHutang.kodetrans,
                tgltrans: pHutang.tgltrans,
                jenistransaksi: pHutang.jenistransaksi,
                sisa: pHutang.sisa,
                keterangan: "",
              })
            }
            // temp.push({
            //   kodetrans: pHutang.kodetrans,
            //   tgltrans: pHutang.tgltrans,
            //   jenistransaksi: pHutang.jenistransaksi,
            //   sisa: pHutang.sisa,
            //   keterangan: "",
            // })
          }
        });
        ListReturBeli= ListReturBeli.sort((a, b) => {
          if (a.tgltrans === null || b.tgltrans === null) {
            // Jika salah satu tgltrans adalah null, taruh di akhir
            return a.tgltrans === null ? 1 : -1;
          }
          const dateA = new Date(a.tgltrans.toString());
          const dateB = new Date(b.tgltrans.toString());
          return dateA.getTime() - dateB.getTime();
        });
        ListBeli= ListBeli.sort((a, b) => {
          if (a.tgltrans === null || b.tgltrans === null) {
            // Jika salah satu tgltrans adalah null, taruh di akhir
            return a.tgltrans === null ? 1 : -1;
          }
          const dateA = new Date(a.tgltrans.toString());
          const dateB = new Date(b.tgltrans.toString());
          return dateA.getTime() - dateB.getTime();
        });
        temp=[...ListReturBeli,...ListBeli];
        form.append("idsupplier", xSelectedSupplier!.idsupplier ?? "");
        form.append("catatan", xCatatan);
        form.append("amount", xAmount.toString());
        form.append("amountkurs", xAmount.toString());
        form.append("totaldebet", xAmount.toString());
        form.append("totalkredit", xAmount.toString());
        form.append('data_detail', JSON.stringify(temp));
        form.append("data_detail_perkiraan", JSON.stringify(xListSelectedPerkiraan));

      } else {

        form.append("amount", xTotalKredit.toString());
        form.append("amountkurs", xTotalKredit.toString());
        form.append("totaldebet", xTotalDebet.toString());
        form.append("totalkredit", xTotalKredit.toString());
        form.append("keterangan", xCatatan);
        form.append("jenissimpan", xIsKasKeluar ? "simpan" : "simpan_cetak");
        form.append("data_detail", JSON.stringify(xListSelectedPerkiraan));
      }


      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            if(xOpenPopupPelunasan){
              setxidpelunasan(data.data.idpelunasan);
              setxkodepelunasan(data.data.kodepelunasan);
              setXKonfirmasi(true);
            }else{
            navigate(PageRoutes.listKeuangan, {
              state: {
                message: "Berhasil Ditambahkan",
                isToastError: false,
                showToast: true,
              }
            })}
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

  async function getListHutang(pIdSupplier: string) {
    setXIsLoading(true);
    try {
      let url = "umkm/ApiKasPelunasan/getListHutangPelunasanUmkm";
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idsupplier", pIdSupplier);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setXListHutang(data.data.datadisplay as HutangPelunasanModel[]);
            setXSelectedListHutang(data.data.datadisplay as HutangPelunasanModel[]);
            setXListHutangReal(data.data.datareal as HutangPelunasanModel[]);
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

  const getTotalHutang = () => {
    let total = 0;
    xSelectedListHutang.forEach((value) => {
      total += parseInt((value.sisa ?? "0").split(".")[0]);
    })
    return total;
  }

  const simpanVerifikasi = async () => {
    setXIsLoading(true);
    let url = "umkm/ApiKasPelunasan/verifikasiPelunasanHutang";
    const form = new FormData();
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    form.append("iduser", globalVariables.idUserGlobal);
    form.append("idpelunasan", xidpelunasan);
    form.append("kodepelunasan",xkodepelunasan);
    form.append("password", xPassword);
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            navigate(PageRoutes.listKeuangan, {
              state: {
                message: "Berhasil Ditambahkan & Verifikasi",
                isToastError: false,
                showToast: true,
              }
            })
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

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda mau verifikasi data pelunasan ini sekarang?</p>
         <div className=" mt-2.5 w-full">
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
        </div>
      </div>}
      functionButtonRight={() => {
        setXKonfirmasi(false);
        navigate(PageRoutes.listKeuangan, {
          state: {
            message: "Berhasil Ditambahkan",
            isToastError: false,
            showToast: true,
          }
        });
      }}
      functionButtonLeft={() => {
          if(xPassword==""){
            setXErrorPassword("error");
          }else{
            setXErrorPassword("");
          simpanVerifikasi();
        
        }
      }}
      onClose={() => {
        setXKonfirmasi(false);
        navigate(PageRoutes.listKeuangan, {
          state: {
            message: "Berhasil Ditambahkan",
            isToastError: false,
            showToast: true,
          }
        });
      }}
      dismissible={false}
      open={xKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={60}
    />
    <BottomSheetDetailPelunasanHutang
      hutang={xSelectedHutang}
      onClose={(value) => setxShowDetailHutang(value)}
      open={xShowDetailHutang}
    />
    <PopupLoading key="loading" open={xIsLoading} />
    {/* konfirmasi delete  */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin mau menghapus {xListSelectedPerkiraan.length > 0 && (xListSelectedPerkiraan[xIndexPerkiraan].kodeperkiraan ?? "")}-{xListSelectedPerkiraan.length > 0 && (xListSelectedPerkiraan[xIndexPerkiraan].namaperkiraan ?? "")}?</div>
      </div>}
      functionButtonRight={() => {
        setXshowDelete(false);
      }}
      functionButtonLeft={() => {
        setXshowDelete(false);
        let temp = [] as SelectedPerkiraanModel[];
        xListSelectedPerkiraan.forEach((pPerkiraan, pIndex) => {
          if (pIndex != xIndexPerkiraan) {
            temp.push(pPerkiraan);
          }
        })
        setxIndexPerkiraan(0);
        setxListSelectedPerkiraan(temp);
      }}
      onClose={() => { setXshowDelete(false); }}
      dismissible={true}
      open={xShowDelete}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {/* <PopupPelunasan
      open={xOpenPopupPelunasan}
      supplier={xSelectedSupplier}
      daftarHutang={xSelectedListHutang}
      onClose={(value) => {
        setXOpenPopupPelunasan(value)
      }}
      onSave={function (pSupplier, pListPerkiraan, pDaftarHutang): void {
        setXSelectedSupplier(pSupplier);
        setXSelectedListHutang(pDaftarHutang);
        setxListSelectedPerkiraan(pListPerkiraan);
      }}
    /> */}
    <PopupPerkiraan open={xPopupPerkiraan.open}
      onClose={(value) => {
        setXPopupPerkiraan({
          ...xPopupPerkiraan,
          open: value,
        })
      }}
      onSave={(pPerkiraan, pSaldo, pAmount, pKeterangan) => {
        setxListSelectedPerkiraan([...xListSelectedPerkiraan, {
          amount: pAmount,
          amountkurs: pAmount,
          idcurrency: pPerkiraan.idcurrency,
          idperkiraan: pPerkiraan.id,
          keterangan: pKeterangan,
          kodeperkiraan: pPerkiraan.kode,
          saldo: pSaldo,
          nilaikurs: "1",
          namaperkiraan: pPerkiraan.nama,
        }])
      }}
      isKasMasuk={!xIsKasKeluar}
    />
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin data barang yang dimasukkan sudah betul?</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
      }}
      onClose={() => { setXShowkonfirmasi(false); }}
      dismissible={false}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={`${!xIsEdit ? "Tambah" : "Ubah"} ${xIsKasKeluar ? "Kas Keluar" : "Kas Masuk"}`}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listKeuangan)}
    />
    <div className="min-h-16" />
    <div className=" w-full px-4 mb-2">
      <DropdownKas
        jenisIsKas={true}
        value={xAkunKas}
        errorText="Akun Kas/Bank Wajib Diisi"
        isError={xErrorKas}
        onChange={(value) => {
          setXAkunKas(value);
        }}
        onOpenDropdown={(value) => { setxOpenDDKas(value) }}
      />
      <div className="mt-2">
        <div className="font-semibold text-14px text-left mb-2.5">Keterangan*</div>
        <textarea
          onChange={(e) => {
            setXCatatan(e.target.value);
          }}
          placeholder=""
          value={xCatatan}
          className={`${defaultInputCSS(
            xCatatan !== "" &&
            xCatatan !== undefined,
            xErrorCatatan,
            false
          )}`}
        />
        {xErrorCatatan && <div className="text-12px text-danger-Main text-left">Keterangan Wajib Diisi</div>}
      </div>

      {xIsKasKeluar && <div className="flex w-full mt-2 gap-1" onClick={() => {
        if (xHakAkses.pelunasanhutang?.tambah !== "1") {
          setSnackBar("Tidak Punya Hak Akses", true);
          return;
        }
        setXOpenPopupPelunasan(!xOpenPopupPelunasan)
      }}>
        <div className="content-center">
          {/* {EditSVG(24, ListColor.main.Main)} */}
          <CheckboxSVG
            backgroundColor={ListColor.neutral[10]}
            borderColor={ListColor.main.Border}
            checkColor={xOpenPopupPelunasan ? ListColor.main.Border : "transparent"}
          />
        </div>
        <p>Pelunasan</p>
        {/* <p className="w-full">{xSelectedSupplier == null ? "-" : xSelectedSupplier.namasupplier} </p> */}
      </div>}
    </div>
    {xOpenPopupPelunasan ? <>
      <div className='w-full px-4'>
        <DropdownSupplier
          value={xSelectedSupplier}
          errorText="Supplier Wajib Diisi"
          onOpenDropdown={(value) => setXOpenDropdownSupplier(value)}
          isError={xErrorSupplier}
          title="Supplier *"
          onChange={(value) => {
            getListHutang(value.idsupplier ?? "");
            setXCatatan("Pelunasan " + value.namasupplier);
            setXSelectedSupplier(value);
            setXSelectedListHutang([]);
          }} />
        <div className="mt-2">
          <div className="font-semibold text-14px text-left mb-2.5">Jumlah Yang Dibayar*</div>
          <div className="relative w-full mt-2.5">
            <NumericFormat
              className={`inset-y-0 h-10 ${defaultInputCSS(
                true,
                xErrorAmount,
                false
              )} text-left`}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              thousandsGroupStyle="thousand"
              value={xAmount}
              isAllowed={(values) => {
                let jumlah = values.floatValue ?? 0;
                return jumlah >= 0;
              }}
              allowLeadingZeros={false}
              onChange={(e) => {
                let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
                if (jumlah >= 0) {
                  setXAmount((jumlah).toString());
                }
              }}
            />
            {xErrorAmount && (
              <div className="mt-2 text-12px text-danger-Main text-left">
                {xErrorAmountText}
              </div>
            )}
          </div>
        </div>
        <div className="w-full justify-between items-center my-2.5">
          <p className="font-14px font-bold">Daftar Hutang Pelunasan *</p>
          {xErrorDaftarHutang && <div className="text-12px text-danger-Main text-left">Daftar Hutang Pelunasan Wajib Diisi</div>}
        </div>
        <div className="w-full ">
          {
            xListHutang.map((value, index) => {
              const selectHutang = () => {
                let indexSelected = xSelectedListHutang.findIndex((hutang) => { return hutang.kodetrans == value.kodetrans });
                if (indexSelected >= 0) {
                  let temp = [] as HutangPelunasanModel[];
                  xSelectedListHutang.forEach((valueHutang, index) => {
                    if (index != indexSelected) {
                      temp.push(valueHutang);
                    }
                  })
                  setXSelectedListHutang(temp);
                } else {
                  setXSelectedListHutang([...xSelectedListHutang, value]);
                }
              }
              let xTotal=0.0;
              value.daftar_barang.forEach((pBarang)=>{
                xTotal+= parseFloat(pBarang.harga ?? "0.0") * parseFloat(pBarang.jml ?? "0.0");
              })
              return <div key={`hutang-${index}`} className="w-full pb-2 mb-2 flex gap-1 border-b border-b-neutral-40 text-12px">
                <div className="min-w-5 " onClick={() => selectHutang()}>
                  <CheckboxSVG
                    backgroundColor={ListColor.neutral[10]}
                    borderColor={ListColor.main.Border}
                    checkColor={xSelectedListHutang.findIndex((hutang) => { return hutang.kodetrans == value.kodetrans }) >= 0 ? ListColor.main.Border : "transparent"}
                  />
                </div>
                <div className="w-full">
                  {/* <p className="text-left w-full" onClick={() => selectHutang()}>{value.kodetrans}</p> */}
                  <p className="text-left flex min-w-24 gap-1" onClick={() => selectHutang()}>{CalendarAltOSVG(18, ListColor.main.Main)} {moment(value.tgltrans).format("DD MMM YYYY")}</p>
                  <p className="text-left flex min-w-24 gap-1" onClick={() => selectHutang()}>{PinSVG(18, ListColor.main.Main)} {value.namalokasi}</p>
                  {/* <button className=' py-1 px-2 rounded-full bg-main-Main text-white' onClick={() => { setxShowDetailHutang(true); setxSelectedHutang(value) }}>Detail</button> */}
                  <div className=" border p-2 rounded-sm bg-white ">
                    <div className="text-14px font-bold text-center pb-2">Daftar Tagihan</div>
                    {value.daftar_barang?.map((pBarang, pIndex) => {
                      return <div
                        key={pIndex.toString()}
                        className={`pb-2.5 border-b border-Grey text-14px ${pIndex == 0 ? "" : "pt-2.5"} $text-neutral-100`}
                      >
                        <div>
                          <p className='font-bold'>{pBarang.namabarang}</p>

                        </div>
                        <div className='flex justify-between' >
                          <p>{numberSeparatorFromString((pBarang.jml ?? "0").split(".")[0])} X {numberSeparatorFromString((pBarang.harga ?? "0").split(".")[0])}</p>
                          {numberSeparatorFromString((parseFloat(pBarang.harga ?? "0.0") * parseFloat(pBarang.jml ?? "0.0")).toString().split(".")[0])}
                        </div>
                      </div>;
                    })}
                    <div
                      className={`text-14px justify-between font-bold pt-2.5 text-neutral-100 flex
              `}
                    >
                      <div>
                        Total
                      </div>
                      <div className='text-danger-Main' >
                        {numberSeparatorFromString(xTotal.toString().split('.')[0])}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-danger-Main" onClick={() => selectHutang()}>{numberSeparatorFromString((value.sisa ?? "0").split(".")[0])}</p>
              </div>
            })
          }
        </div>
      </div></>
      : <>
        <div className="w-full justify-between items-center my-2 mx-4">
          <p className="font-14px font-bold">Detail Perkiraan *</p>
        </div>
        <div className="px-4 w-full mb-2">
          <div
            className={`w-full shadow-md rounded-full py-2 px-5 text-center text-16px font-bold text-neutral-10 bg-main-Main `}
            onClick={() => {
              setXPopupPerkiraan({
                isEdit: false,
                open: true,
              });
            }}
          >
            Tambah Perkiraan
          </div>
        </div>
        <div className="w-full max-h-full overflow-scroll">
          {
            xListSelectedPerkiraan.map((pValue, pIndex) => {
              return <div
                className={`w-full px-4 flex gap-1 ${pValue.saldo == "DEBET" ? "bg-main-Surface" : "bg-danger-Surface"} pb-2.5 border-b border-Grey text-neutral-100  text-14px ${pIndex == 0 ? "" : "pt-2.5"}`}
              >
                <div onClick={() => {
                  setxIndexPerkiraan(pIndex);
                  setXshowDelete(true);
                }}>{TrashAltSVG(24, ListColor.danger.Main)}</div>
                <div className="w-full">
                  <p>{pValue.kodeperkiraan + "-" + pValue.namaperkiraan}</p>
                  <p>({pValue.saldo})</p>
                  <p className="font-semibold">{pValue.keterangan}</p>
                </div>
                <div>{numberSeparatorFromString((pValue.amount ?? "0").toString().split(".")[0])}</div>
              </div>
            })
          }
        </div>
      </>}

    <div className="min-h-20" />

    <div className="w-full px-4 py-2.5 min-h-20 max-h-20 fixed bottom-0 bg-white border-t justify-between"
      style={{ zIndex: 20 }}
    >
      {xOpenPopupPelunasan ? <>
        <div className="text-14px mb-1 font-semibold flex justify-between"><p>Total </p><p>Rp{numberSeparator(getTotalHutang())}</p></div>
      </> : <>
        <div className="text-14px mb-1 font-semibold flex justify-between"><p>Total </p><p>Rp{xIsKasKeluar ? numberSeparator(xTotalDebet) : numberSeparator(xTotalKredit)}</p></div>
        {/* <div className="text-14px mb-2 font-semibold flex justify-between"><p>Kredit </p><p>Rp{numberSeparator(xTotalKredit)}</p></div> */}
      </>
      }
      <div
        className={`w-full shadow-md rounded-full py-2 px-5 text-center text-16px font-bold ${((xOpenPopupPelunasan && xSelectedListHutang.length <= 0) || (!xOpenPopupPelunasan && xListSelectedPerkiraan.length <= 0)) ? "text-neutral-70 bg-neutral-30" : "text-neutral-10 bg-main-Main "}`}
        onClick={() => {
          if ((xOpenPopupPelunasan && xSelectedListHutang.length <= 0) || (!xOpenPopupPelunasan && xListSelectedPerkiraan.length <= 0)) {
            return
          }
          let check = true;
          if (xOpenPopupPelunasan) {
            if (parseInt(xAmount) < 1) {
              setXErrorAmount(true);
              setXErrorAmountText('Jumlah Tidak Boleh 0');
              check = false;
            }else if(getTotalHutang()<parseInt(xAmount)){
              setXErrorAmount(true);
              setXErrorAmountText('Jumlah Tidak Bisa Lebih Dari Total Hutang');
              check=false;
            } else {
              setXErrorAmount(false);
            }
            if (xSelectedSupplier == null) {
              setXErrorSupplier(true);
              check = false
            } else {
              setXErrorSupplier(false);
            }
          } else {
            if (xTotalDebet == 0 || xTotalKredit == 0) {
              setSnackBar("Nominal Debet / Kredit Tidak Boleh 0", true);
              check = false;
            } else if (xTotalDebet != xTotalKredit) {
              setSnackBar("Nominal Kredit dan Debet Harus Sama", true);
              check = false;
            }
          }
          if (xAkunKas == null) {
            setXErrorKas(true);
            check = false;
          } else {
            setXErrorKas(false);
          }
          if (xCatatan == "") {
            check = false;
            setXErrorCatatan(true);
          } else {
            setXErrorCatatan(false);
          }
          if (check) {
            simpanKas();
          }
        }}
      >
        Simpan
      </div>
    </div>
  </div>
}
export default FormKeuanganPage;