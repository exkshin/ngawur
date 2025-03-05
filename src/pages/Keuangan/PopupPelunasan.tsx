import { useEffect, useState } from "react";
import { SupplierModel } from "../../classModels/supplierModel"
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { useLocation } from "react-router-dom";
import { LokasiModel } from "../../classModels/lokasiModel";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";
import { PlusSVG } from "../../assets/icon/SVGTSX/plusSVG";
import ListColor from "../../Config/color";
import moment from "moment";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { CheckboxSVG } from "../CustomWidget/checkboxCustom";
import AXIOS from "../../Config/axiosRequest";
import { HutangPelunasanModel } from "../../classModels/HutangPelunasanModel";
import { JurnalPelunasanModel, SelectedPerkiraanModel } from "../../classModels/perkiraanKasModel";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import { PinSVG } from "../../assets/icon/SVGTSX/PinSVG";
import { BottomSheetDetailHutang } from "../HutangPage/BottomSheetDetailHutang";
import { BottomSheetDetailPelunasanHutang } from "./BottomSheetDetailPelunasanHutang";
import { MoneyBillOSVG } from "../../assets/icon/SVGTSX/MoneyBillOSVG";

interface PopupPelunasanModel {
  open: boolean,
  onClose(value: boolean): void,
  onSave(supplier:SupplierModel,perkiraan:SelectedPerkiraanModel[], listHutang:HutangPelunasanModel[]): void,
  supplier:SupplierModel|null,
  daftarHutang:HutangPelunasanModel[];
}
export const PopupPelunasan = (pParameter: PopupPelunasanModel) => {
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as null | SupplierModel);
  const [xListHutang, setXListHutang] = useState([] as HutangPelunasanModel[]);
  const [xSelectedListHutang, setXSelectedListHutang] = useState([] as HutangPelunasanModel[]);
  const [xErrorSupplier,setXErrorSupplier]=useState(false);
  const [xErrorDaftarHutang,setXErrorDaftarHutang]=useState(false);
  const [xOpenDropdownSupplier,setXOpenDropdownSupplier]=useState(false);
  const [xShowDetailHutang, setxShowDetailHutang] = useState(false);
  const [xSelectedHutang, setxSelectedHutang] = useState(null as HutangPelunasanModel | null)

  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  useEffect(() => {
    if(pParameter.open){
      setXSelectedSupplier(pParameter.supplier);
      setXSelectedListHutang(pParameter.daftarHutang);
      if(pParameter.supplier!=null){
        getListHutang(pParameter.supplier.idsupplier??"");
      }
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
            setXListHutang(data.data as HutangPelunasanModel[]);
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

  async function getJurnalPelunasan() {
    let check=false;
    if(xSelectedSupplier==null){
      setXErrorSupplier(true);
      check=true;
    }else{setXErrorSupplier(false);}
    if(xSelectedListHutang.length<=0){
      setXErrorDaftarHutang(true);
      check=true;
    }else{setXErrorDaftarHutang(false);}
    if(check){
      return;
    }
    setXIsLoading(true);
    try {
      let url = "umkm/ApiKasPelunasan/getJurnalPelunasanHutang";
      let tempHutang =[] as {
        kodetrans:String | null,
        tgltrans:String | null,
        jenistransaksi:String | null,
        pelunasan:String | null,
        keterangan:String | null,
      }[];
      xSelectedListHutang.forEach((pHutang)=>{
        tempHutang.push({
          kodetrans:pHutang.kodetrans,
          tgltrans:pHutang.tgltrans,
          jenistransaksi:pHutang.jenistransaksi,
          pelunasan:pHutang.sisa,
          keterangan:"",
        })
      })
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("kodepelunasan", "");
      form.append("mode", "tambah");
      form.append("data_detail",JSON.stringify(tempHutang));

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData=data.data as JurnalPelunasanModel[];
            let temp=[]as SelectedPerkiraanModel[];
            responseData.forEach((value)=>{
              temp.push({
                amount:value.amount,
                amountkurs:value.amountkurs,
                idcurrency:value.idcurrency,
                idperkiraan:value.idperkiraan,
                keterangan:value.keterangan,
                nilaikurs:value.nilaikurs,
                saldo:value.saldo,
                namaperkiraan:value.namaperkiraan,
                kodeperkiraan:value.kodeperkiraan,
              });
            })
            pParameter.onSave(xSelectedSupplier!,temp,xSelectedListHutang);
            pParameter.onClose(false);
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

  return <>
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <BottomSheetDetailPelunasanHutang
          hutang={xSelectedHutang}
          onClose={(value) => setxShowDetailHutang(value)}
          open={xShowDetailHutang}
        />
    <CustomPopup
      maxHeight="90dvh"
      content={<div className='w-full'>
        <DropdownSupplier 
        value={xSelectedSupplier} 
        errorText="Supplier Wajib Diisi"
        onOpenDropdown={(value)=>setXOpenDropdownSupplier(value)}
        isError={xErrorSupplier}
        title="Supplier *"
        onChange={(value) => {
          getListHutang(value.idsupplier ?? "");
          setXSelectedSupplier(value);
          setXSelectedListHutang([]);
        }} />
        <div className="w-full justify-between items-center my-2.5">
          <p className="font-14px font-bold">Daftar Hutang Pelunasan *</p>
          {xErrorDaftarHutang&& <div className="text-12px text-danger-Main text-left">Daftar Hutang Pelunasan Wajib Diisi</div>}
        </div>
        <div className="w-full max-h-[60dvh] overflow-y-scroll">
          {
            xListHutang.map((value,index) => {
              return <div key={`hutang-${index}`} className="w-full pb-2 mb-2 flex gap-1 border-b border-b-neutral-40 text-12px">
                <div className="min-w-5 "onClick={() => {
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
                    setXSelectedListHutang([...xSelectedListHutang,value]);
                  }
                }}>
                  <CheckboxSVG 
                  backgroundColor={ListColor.neutral[10]} 
                  borderColor={ListColor.main.Border} 
                  checkColor={xSelectedListHutang.findIndex((hutang) => { return hutang.kodetrans == value.kodetrans }) >= 0 ? ListColor.main.Border : "transparent"} 
                  />
                </div>
                <div className="w-full">
                <p className="text-left w-full">{value.kodetrans}</p>
                <p className="text-left flex min-w-24 gap-1">{CalendarAltOSVG(18, ListColor.main.Main)} {moment(value.tgltrans).format("DD MMM YYYY")}</p>
                <p className="text-left flex min-w-24 gap-1">{PinSVG(18, ListColor.main.Main)} {value.namalokasi}</p>
                <button className=' py-1 px-2 rounded-full bg-main-Main text-white' onClick={()=>{setxShowDetailHutang(true)}}>Detail</button>
                </div>
                <p className="text-danger-Main">{numberSeparatorFromString((value.grandtotal ?? "0").split(".")[0])}</p>
              </div>
            })
          }
        </div>
      </div>}
      functionButtonRight={() => {
        if(!xOpenDropdownSupplier&&!xShowDetailHutang)
        pParameter.onClose(false);
      }}
      functionButtonLeft={async () => {
        getJurnalPelunasan();
      }}
      onClose={() => {
        if(!xOpenDropdownSupplier&&!xShowDetailHutang)
        pParameter.onClose(false);
      }}
      open={pParameter.open}
      textButtonRight="Kembali"
      textButtonLeft={"Simpan"}
      zIndex={22}
    />
  </>
}