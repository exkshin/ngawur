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
import { DropdownKas } from "../GlobalWidget/dropdownKas";
import { KasModel } from "../../classModels/perkiraanKasModel";
import { SelectedRadioButtonSVG } from "../../assets/icon/SVGTSX/SelectedRadioButtonSVG";
import ListColor from "../../Config/color";
import { UnselectedRadioButtonSVG } from "../../assets/icon/SVGTSX/UnselectedRadioButtonSVG";
import { NumericFormat } from "react-number-format";

interface PopupPerkiraanModel {
  open: boolean,
  onClose(value: boolean): void,
  onSave(perkiraan: KasModel, saldo: string, amount: string, keterangan: string): void,
  isKasMasuk: boolean,
}
const PopupPerkiraan = (pParameter: PopupPerkiraanModel) => {
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xOpenDDKAS, setxOpenDDKAS] = useState(false);
  const [xSelectedKas, setXSelectedKas] = useState(null as KasModel | null);
  const [xErrorKas, setXErrorKas] = useState(false);
  const [xSaldo, setXSaldo] = useState("DEBET");
  const [xKeterangan, setXKeterangan] = useState("");
  const [xErrorKeterangan, setXErrorKeterangan] = useState(false);
  const [xAmount, setXAmount] = useState("0");
  const [xErrorAmount, setXErrorAmount] = useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  useEffect(() => {
    if (pParameter.open) {
      setxOpenDDKAS(false);
      setXSaldo(pParameter.isKasMasuk ? "KREDIT" : "DEBET");
      setXAmount('0');
      setXSelectedKas(null);
      setXKeterangan("");
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
            check = responseData.length <= 0
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
    return check;
  }
  return <>
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <CustomPopup
      content={<div className='gap-1 w-full'>
        <div className="w-full">
          <div className="w-full my-2">
            <div className="font-semibold text-left text-16px mb-2.5">Jenis Saldo : {xSaldo}</div>
            {/* <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => {  }}>
              {xSaldo == "DEBET" ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} DEBET
            </div>
            <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => {}}>
              {xSaldo != "DEBET" ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} KREDIT
            </div> */}
          </div>
          <DropdownKas
            jenisIsKas={false}
            value={xSelectedKas}
            onChange={(value) => setXSelectedKas(value)}
            onOpenDropdown={(value) => { setxOpenDDKAS(value) }}
            errorText="Perkiraan Wajib Diisi"
            isError={xErrorKas}
          />
          <div>
            <div className="font-semibold text-14px text-left mb-2.5">Jumlah*</div>
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
                {`Jumlah Tidak Boleh 0`}
              </div>
            )}
            </div>
          </div>
          <div className="mt-2">
            <div className="font-semibold text-14px text-left mb-2.5">Keterangan*</div>
            <textarea
              onChange={(e) => {
                setXKeterangan(e.target.value);
              }}
              placeholder=""
              value={xKeterangan}
              className={`${defaultInputCSS(
                xKeterangan !== "" &&
                xKeterangan !== undefined,
                xErrorKeterangan,
                false
              )}`}
            />
            {xErrorKeterangan && (
              <div className="mt-2 text-12px text-danger-Main text-left">
                {`Keterangan wajib diisi`}
              </div>
            )}
          </div>
        </div>
      </div>}
      functionButtonRight={() => {
        if (!xOpenDDKAS)
          pParameter.onClose(false);
      }}
      functionButtonLeft={async () => {
        if (!xOpenDDKAS) {
          let check=true;
          if (xSelectedKas == null) {
            setXErrorKas(true);
            check=false;
          }
          if (xKeterangan == "") {
            setXErrorKeterangan(true);
            check=false;
          } 
          if(parseFloat(xAmount)<=0){
            check=false;
            setXErrorAmount(true);
          }
          
          if(check) {
            setXErrorKas(false);
            setXErrorAmount(false);
            setXErrorKeterangan(false);
            pParameter.onSave(xSelectedKas??{}as KasModel, xSaldo, xAmount, xKeterangan);
            pParameter.onClose(false);
          }
        }
      }}
      onClose={() => {
        if (!xOpenDDKAS)
          pParameter.onClose(false);
      }}
      open={pParameter.open}
      textButtonRight="Kembali"
      textButtonLeft={"Tambah"}
      zIndex={22}
    />
  </>
}

export default PopupPerkiraan