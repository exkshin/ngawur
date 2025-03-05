import { useEffect, useState } from "react";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup"
import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { PageRoutes } from "../../PageRoutes";
import { BottomButton } from "../CustomWidget/bottomButton";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { CardListClosing } from "../GlobalWidget/cardListClosing";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import globalVariables, { printNota } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import moment from "moment";
import ListColor from "../../Config/color";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { Icon } from "@iconify/react";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { ListClosingModel } from "../../classModels/listClosingModel";
import PopupTambahClosing from "./PopupTambahClosing";
import { SupplierModel } from "../../classModels/supplierModel";
import { NumericFormat } from "react-number-format";
import { HakAksesLoginModel } from "../../classModels/hakAksesModel";
import { DropdownSupplierClosing } from "../GlobalWidget/dropdownSupplierClosing";

const ListClosingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xParser = new DOMParser();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xHakAkses = JSON.parse(localStorage.getItem("hakAkses") ?? "{}") as HakAksesLoginModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xListClosing, setXListClosing] = useState([] as ListClosingModel[]);
  const [xOpenOpsi, setXOpenOpsi] = useState(false);
  const [xAlasan, setXAlasan] = useState("");
  const [xAlasanError, setXAlasanError] = useState(false);
  const [xSelectedItem, setXSelectedItem] = useState(null as ListClosingModel | null);
  const [xSelectedDateAwal, setxSelectedDateAwal] = useState(moment());
  const [xSelectedDateAkhir, setxSelectedDateAkhir] = useState(moment());
  const [xSelectedDateAwalTemp, setxSelectedDateAwalTemp] = useState(moment());
  const [xSelectedDateAkhirTemp, setxSelectedDateAkhirTemp] = useState(moment());
  const [xOpenRange, setxOpenRange] = useState(false);
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xIsAwal, setXIsAwal] = useState(true);
  const [xDelete, setXDelete] = useState(false);
  const [xShowKonfirmasiPosting, setxShowKonfirmasiPosting] = useState(false);
  const [xIsBatalPosting, setxIsBatalPosting] = useState(false);
  const [xIsShowPopupTambahClosing, setxIsShowPopupTambahClosing] = useState(false);
  const [xIsEdit, setXIsEdit] = useState(false);
  const [xTanggalEdit, setXTanggalEdit] = useState(moment());
  const [xJumlahSetoran, setXJumlahSetoran] = useState("0");
  const [xErrorJumlahSetoran, setXErrorJumlahSetoran] = useState(false);
  const [xSelectedSupplierBatal, setXSelectedSupplierBatal] = useState(null as SupplierModel | null);
  const [xSelectedDateBatal, setXSelectedDateBatal] = useState(moment());
  const [xOpenBatalSupplier, setXOpenBatalSupplier] = useState(false);
  const [xErrorSupplierBatal, setXErrorSupplierBatal] = useState(false);
  const [xOpenDropdownSupplierBatal, setXOpenDropdownSupplierBatal] = useState(false);
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

  function goToEdit(pParameter: { dataItem: ListClosingModel | null, isEdit: boolean, tanggal: moment.Moment, supplier: SupplierModel }) {
    navigate(PageRoutes.formClosing, {
      state: {
        from: PageRoutes.listClosing,
        dataTransaksi: pParameter.dataItem,
        isEdit: pParameter.isEdit,
        tanggal: pParameter.tanggal.format("YYYY-MM-DD"),
        supplier: pParameter.supplier,
      }
    })
  }

  async function deleteItem(pDataItem: ListClosingModel | null) {
    setXIsLoading(true);
    try {
      let url = "umkm/ApiClosingDate/batal";
      const form = new FormData();
      form.append("tglomzet", pDataItem?.tanggal ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("lokasi", xDataLokasi.id ?? "");
      form.append("alasan", xAlasan);

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setSnackBar("Transaksi Berhasil Dibatalkan", false);
            getListTransaksiClosing(xSelectedDateAwal, xSelectedDateAkhir);
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

  async function deleteItemSupplier(pDataItem: ListClosingModel | null, pSupplier: SupplierModel | null) {
    setXIsLoading(true);
    try {
      let url = "/umkm/ApiClosingDate/batalSupplier";
      const form = new FormData();
      form.append("tglomzet", pDataItem?.tanggal ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("lokasi", xDataLokasi.id ?? "");
      form.append("alasan", xAlasan);
      form.append("idsupplier", pSupplier!.idsupplier ?? "");

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setSnackBar("Transaksi Berhasil Dibatalkan berdasarkan supplier", false);
            getListTransaksiClosing(xSelectedDateAwal, xSelectedDateAkhir);

            setXOpenBatalSupplier(false)
            setXSelectedDateBatal(moment());
            setXErrorSupplierBatal(false);
            setXOpenBatalSupplier(false);
            setXAlasanError(false);
            setXAlasan("");
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


  function goToDetail(dataItem: ListClosingModel) {
    navigate(PageRoutes.detailClosing, {
      state: {
        from: PageRoutes.listTransaksiBeli,
        dataTransaksi: dataItem,
      }
    })
  }

  async function getListTransaksiClosing(pTglAwal: moment.Moment, pTglAkhir: moment.Moment) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tglawal", pTglAwal.format("YYYY-MM-DD"));
      form.append("tglakhir", pTglAkhir.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiClosingDate/listClosing", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            setXListClosing(responseData as ListClosingModel[]);
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

  const checkCanClosing = async (pTgl: string) => {
    setXIsLoading(true);
    let check = false;
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tanggal", pTgl);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiClosingDate/getDaftarSupplierBelumClosing", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data ?? [];
            if (responseData.length <= 0) {
              check = true;
            }
          } else {
            throw ("error success==false");
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

  const checkAllTransaction = async (pTgl: string) => {
    setXIsLoading(true);
    let check = false;
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tanggal", pTgl);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiClosingDate/validSebelumClosing", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data ?? [];
            if (responseData.length <= 0) {
              check = true;
            }
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

  useEffect(() => {
    let tglAwal = moment().startOf("month");
    let tglAkhir = moment().endOf("month");
    setxSelectedDateAwal(tglAwal);
    getListTransaksiClosing(tglAwal, xSelectedDateAkhir);
  }, [])

  async function postingClosing(tglomzet: string, idclosing: string) {
    let check = await checkCanClosing(tglomzet);
    if (!check) {
      setSnackBar("Terdapat Data Barang Supplier Yang Belum Dimasukkan", true);
      return;
    }
    navigate(PageRoutes.formPosting, {
      state: {
        tglomzet: tglomzet,
        idclosing: idclosing,
      }
    });
    // setXIsLoading(true);
    // try {
    //   const form = new FormData();
    //   form.append("iduser", xDataLogin.iduser ?? "");
    //   form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
    //   form.append("idlokasi", xDataLokasi.id ?? "");
    //   form.append("tgltrans", tglomzet);
    //   form.append("setoran",xJumlahSetoran);

    //   await AXIOS
    //     .post("umkm/ApiClosingDate/posting", form)
    //     .then((res) => res.data)
    //     .then((data) => {
    //       if (data.success == true) {
    //         getListTransaksiClosing(xSelectedDateAwal, xSelectedDateAkhir);
    //       } else {
    //         // throw ("error success==false");
    //         setSnackBar(data.message,true);
    //       }
    //     }
    //     );
    // } catch (error) {
    //   console.log(error);
    //   setSnackBar(globalVariables.errorMsg, true)
    // }
    // setXIsLoading(false);
  }

  async function batalPostingClosing(tglomzet: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tgltrans", tglomzet);

      await AXIOS
        .post("umkm/ApiClosingDate/batalPosting", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            getListTransaksiClosing(xSelectedDateAwal, xSelectedDateAkhir);
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

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
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
    <CustomPopup
      content={<div>
        <p>Apakah anda mau batal closing supplier pada tanggal {xSelectedDateBatal.format("DD MMM YYYY")}?</p>
        <DropdownSupplierClosing
          isEdit={true}
          value={xSelectedSupplierBatal}
          tanggal={xSelectedDateBatal.format("YYYY-MM-DD")}
          canSetInitialValue={false}
          onChange={(value) => setXSelectedSupplierBatal(value)}
          errorText="Supplier Wajib Diisi"
          title="Supplier"
          useTitle={true}
          onOpenDropdown={(value) => setXOpenDropdownSupplierBatal(value)}
          isError={xErrorSupplierBatal}
        />
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

      onClose={() => {
        if (xOpenDropdownSupplierBatal) return;
        setXOpenBatalSupplier(false)
        setXSelectedDateBatal(moment());
        setXErrorSupplierBatal(false);
        setXOpenBatalSupplier(false);
        setXAlasanError(false);
        setXAlasan("");
      }}
      open={xOpenBatalSupplier}
      textButtonRight="Tidak"
      textButtonLeft={"Ya"}
      zIndex={22}
      functionButtonLeft={() => {
        if (xOpenDropdownSupplierBatal) return;
        let check = true;
        if (xSelectedSupplierBatal == null) {
          setXErrorSupplierBatal(true);
          check = false;
        } else {
          setXErrorSupplierBatal(false);
        }
        if (xAlasan == "" || xAlasan == null || xAlasan == undefined) {
          check = false;
          setXAlasanError(true);
        } else {
          setXAlasanError(false);
        }

        if (check) {
          deleteItemSupplier(xSelectedItem, xSelectedSupplierBatal)
        }
      }}
      functionButtonRight={() => {
        if (xOpenDropdownSupplierBatal) return;
        setXOpenBatalSupplier(false)
        setXSelectedDateBatal(moment());
        setXErrorSupplierBatal(false);
        setXOpenBatalSupplier(false);
        setXAlasanError(false);
        setXAlasan("");
      }}
    />
    <PopupTambahClosing open={xIsShowPopupTambahClosing} onClose={(value: boolean) => {
      setxIsShowPopupTambahClosing(value);
    }} onSave={async function (supplier: SupplierModel, tanggal: moment.Moment): Promise<void> {

      if (!await checkAllTransaction(tanggal.format("YYYY-MM-DD"))) {
        return;
      }
      goToEdit({
        dataItem: xSelectedItem,
        isEdit: xIsEdit,
        supplier: supplier,
        tanggal: tanggal,
      });
    }} isEdit={xIsEdit} tanggal={xTanggalEdit} />
    {ToastSnackbar(xShowToast)}
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => {
      }}
      zIndex={72}
      maxDate={xIsAwal ? new Date(xSelectedDateAkhirTemp.format("YYYY-MM-DD")) : new Date()}
      minDate={xIsAwal ? new Date("1-1-1990") : new Date(xSelectedDateAwalTemp.format("YYYY-MM-DD"))}
      onChange={(value) => {
        setXOpenDatePicker(false);
        if (xIsAwal) {
          setxSelectedDateAwalTemp(moment(value));
        } else {
          setxSelectedDateAkhirTemp(moment(value));
        }
      }}
    />
    <CustomPopup
      content={<div className='flex gap-1 w-full'>
        <div className="w-full">
          <div className='text-14px font-bold mb-2.5'>Dari</div>
          <div className="relative w-full"
            onClick={() => {
              setXIsAwal(true);
              setXOpenDatePicker(true);
            }}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
            </div>
            <input
              readOnly={true}
              value={xSelectedDateAwalTemp.format("DD MMM YYYY")}
              className={`pl-10 ${defaultInputCSS(true, false, true)} `}
            />
          </div>
        </div>
        <div className="w-full">
          <div className='text-14px font-bold mb-2.5'>Sampai</div>
          <div className="relative w-full"
            onClick={() => {
              setXIsAwal(false);
              setXOpenDatePicker(true);
            }}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
            </div>
            <input
              readOnly={true}
              value={xSelectedDateAkhirTemp.format("DD MMM YYYY")}
              className={`pl-10 ${defaultInputCSS(true, false, true)} `}
            />
          </div>
        </div>
      </div>}
      functionButtonRight={() => {
        if (!xOpenDatePicker)
          setxOpenRange(false);
      }}
      functionButtonLeft={() => {
        setxOpenRange(false);
        setxSelectedDateAwal(xSelectedDateAwalTemp);
        setxSelectedDateAkhir(xSelectedDateAkhirTemp);
        getListTransaksiClosing(xSelectedDateAwalTemp, xSelectedDateAkhirTemp);
      }}
      onClose={() => {
        if (!xOpenDatePicker)
          setxOpenRange(false);
      }}
      open={xOpenRange}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={22}
    />
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda yakin membatalkan data closing ini?</p>
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
          deleteItem(xSelectedItem ?? {} as ListClosingModel);
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
      content={<div className="whitespace-pre-line text-center mb-2 font-semibold text-sm">
        <p>{
          xIsBatalPosting ? "Apakah anda yakin membatalkan posting data closing ini?"
            : "Apakah anda yakin mau posting data closing ini?"
        }</p>

        {!xIsBatalPosting && <div className="">
          <div className="font-semibold text-14px text-left mb-2.5">Uang Setoran(Rp)</div>
          <div className="relative w-full mt-2.5">
            <NumericFormat
              className={`inset-y-0 h-10 ${defaultInputCSS(
                true,
                xErrorJumlahSetoran,
                false
              )} text-left`}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              thousandsGroupStyle="thousand"
              value={xJumlahSetoran}
              isAllowed={(values) => {
                let jumlah = values.floatValue ?? 0;
                return jumlah >= 0;
              }}
              allowLeadingZeros={false}
              onChange={(e) => {
                let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
                if (jumlah >= 0) {
                  setXJumlahSetoran((jumlah).toString());
                }
              }}
            />
          </div>
          {xErrorJumlahSetoran && <div className="text-12px text-danger-Main text-left">Uang setoran wajib diisi</div>}
        </div>}
      </div>}
      functionButtonRight={() => {
        setxShowKonfirmasiPosting(false);
      }}
      functionButtonLeft={() => {
        setxShowKonfirmasiPosting(false);
        if (xIsBatalPosting) {
          batalPostingClosing((xSelectedItem ?? {} as ListClosingModel).tanggal ?? "")
        } else {
          postingClosing((xSelectedItem ?? {} as ListClosingModel).tanggal ?? "", xSelectedItem?.idclosing ?? "");
        }
      }}
      onClose={() => {
        setxShowKonfirmasiPosting(false);
      }}
      open={xShowKonfirmasiPosting}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={22}
    />
    {/* <SearchNavbar
      showBack={true}
      backFunction={() => { navigate(PageRoutes.dashboard) }}
      showFrontIcon={false}
      frontIcon={undefined}
      frontFunction={() => { }}
      valueSearch={xSearch}
      placeholder={"Cari nama user / tanggal"}
      searchFunction={(value) => {
        setXSearch(value);
        // getListTransaksiBeli(value, xSelectedDate);
      }}
      onChangeSearch={(value) => { setXSearch(value) }}
    /> */}
    <CustomNavbar
      title={"Closing"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.dashboard)}
    />
    <div className="flex justify-center fixed top-14 w-full h-10 px-4 items-center bg-neutral-20">
      <div className="flex items-center gap-2" onClick={() => { setxOpenRange(true); setxSelectedDateAkhirTemp(xSelectedDateAkhir); setxSelectedDateAwalTemp(xSelectedDateAwal); }}>
        {CalendarAltOSVG(18, ListColor.main.Main)}
        <p>{xSelectedDateAwal.format("DD MMM YYYY")} - {xSelectedDateAkhir.format("DD MMM YYYY")}</p>
      </div>
    </div>
    <div className="min-h-24" />
    <div className="w-full px-4 pb-16 pt-2">
      {xListClosing.map((pElement, pIndex) => {
        return <CardListClosing
          key={"Beli" + pIndex.toString()}
          isOpenOpsi={xOpenOpsi}
          onChangeShowOpsi={(value) => { setXOpenOpsi(value); }}
          isClosing={false}
          dataItem={pElement}
          onCancel={(value) => {
            if (xHakAkses.closing?.hapus !== "1") {
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
            if (xHakAkses.closing?.ubah !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXIsEdit(true);
            setxIsShowPopupTambahClosing(true);
            setXSelectedItem(pElement);
            setXTanggalEdit(moment(pElement.tanggal));
          }}
          onPrintNotaClosing={(value, jenisClosing) => {
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idclosing ?? "",
              type: "CLOSING",
              jenisClosing: jenisClosing,
            });
          }}
          onPrintNotaJual={(value) => {
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: value.idjual ?? "",
              type: "JUAL"
            });
          }
          }
          onPosting={(value) => {
            if (xHakAkses.closing?.cetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            // setXJumlahSetoran(value.setoran??"0");
            // setxShowKonfirmasiPosting(true);
            // setxIsBatalPosting(false);
            // setXSelectedItem(value);
            postingClosing(value.tanggal ?? "", value.idclosing ?? "");
          }}
          onBatalPosting={(value) => {
            if (xHakAkses.closing?.batalcetak !== "1") {
              setSnackBar("Tidak Punya Hak Akses", true);
              return;
            }
            setXSelectedItem(value);
            setxShowKonfirmasiPosting(true);
            setxIsBatalPosting(true);
          }}
          onBatalSupplier={(pElement) => {

            setXSelectedItem(pElement);
            setXSelectedDateBatal(moment(pElement.tanggal));
            setXSelectedSupplierBatal(null);
            setXOpenBatalSupplier(true);
          }}
        />
      })}
    </div>
    <div className="min-h-16" />
    <BottomButton onClick={async () => {

      if (xHakAkses.closing?.tambah !== "1") {
        setSnackBar("Tidak Punya Hak Akses", true);
        return;
      }
      setXIsEdit(false);
      setXTanggalEdit(moment());
      setxIsShowPopupTambahClosing(true);
    }} text={"Tutup Transaksi"} />
  </div>
}

export default ListClosingPage;