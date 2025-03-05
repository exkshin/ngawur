import moment from "moment"
import { SupplierModel } from "../../classModels/supplierModel"
import { useLocation } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { ListClosingModel } from "../../classModels/listClosingModel";
import globalVariables from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { Icon } from "@iconify/react";
import { DropdownSupplierClosing } from "../GlobalWidget/dropdownSupplierClosing";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";

interface PopupTambahClosingModel {
  open: boolean,
  onClose(value: boolean): void,
  onSave(supplier: SupplierModel, tanggal: moment.Moment): void,
  isEdit: boolean,
  tanggal?: moment.Moment,
}
const PopupTambahClosing = (pParameter: PopupTambahClosingModel) => {
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSelectedDate, setXSelectedDate] = useState(pParameter.tanggal ?? moment());
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  // let xTempSupplier={
  //   alamat: "",
  //   idperusahaan: "",
  //   idsupplier: "",
  //   idsyaratbayar: "",
  //   kodesupplier: "",
  //   namasupplier: `Semua Supplier(total : 0)`,
  //   selisihharibayar: "",
  // }as SupplierModel
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  useEffect(() => {
    if (pParameter.open) {
      setXSelectedDate(pParameter.tanggal ?? moment());
    }
  }, [pParameter.open])


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

  async function getListTransaksiClosing(pTglAwal: moment.Moment) {
    setXIsLoading(true);
    let check = true;
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tglawal", pTglAwal.format("YYYY-MM-DD"));
      form.append("tglakhir", pTglAwal.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("umkm/ApiClosingDate/listClosing", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data as ListClosingModel[];
            setXIsLoading(false);
            if (responseData.length > 0 && (responseData[0].catatan ?? "").toUpperCase() == "POSTING") {
              check = false;
            }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      check = false;
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    console.log(check);
    setXIsLoading(false);
    return check;
  }
  return <>
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => {
        setXOpenDatePicker(value);
      }}
      zIndex={72}
      maxDate={new Date()}
      minDate={new Date("1-1-1990")}
      onChange={(value) => {
        setXOpenDatePicker(false);
        setXSelectedDate(moment(value));
      }}
    />
    <CustomPopup
      content={<div className='gap-1 w-full'>
        <div className="w-full">
          <div className='text-14px font-bold mb-2.5'>Tanggal Closing</div>
          <div className="relative w-full"
            onClick={() => {
              if (!pParameter.isEdit)
                setXOpenDatePicker(true);
            }}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
            </div>
            <input
              readOnly={true}
              disabled={pParameter.isEdit}
              value={xSelectedDate.format("DD MMM YYYY")}
              className={`pl-10 ${defaultInputCSS(true, false, true)} `}
            />
          </div>
        </div>
        <DropdownSupplierClosing isEdit={pParameter.isEdit} value={xSelectedSupplier} tanggal={xSelectedDate.format("YYYY-MM-DD")} canSetInitialValue={true} onChange={(value) => setXSelectedSupplier(value)} />
      </div>}
      functionButtonRight={() => {
        if (!xOpenDatePicker)
          pParameter.onClose(false);
      }}
      functionButtonLeft={async () => {
        if (!xOpenDatePicker) {
          if (pParameter.isEdit) {
            pParameter.onSave(xSelectedSupplier ?? {} as SupplierModel, xSelectedDate);
          } else {
            let check = await getListTransaksiClosing(xSelectedDate);
            if (check) {
              if (xSelectedSupplier == null) {
                pParameter.onClose(false);
                setSnackBar("Supplier wajib diisi", true);
              } else {
                pParameter.onSave(xSelectedSupplier!, xSelectedDate);
              }
            } else {
              pParameter.onClose(false);
              setSnackBar("Data Pada Tanggal " + xSelectedDate.format("DD MMM YYYY") + " Sudah Diposting", true);
            }
          }
        }
      }}
      onClose={() => {
        if (!xOpenDatePicker)
          pParameter.onClose(false);
      }}
      open={pParameter.open}
      textButtonRight="Kembali"
      textButtonLeft={pParameter.isEdit ? "Edit" : "Tambah"}
      zIndex={22}
    />
  </>
}

export default PopupTambahClosing