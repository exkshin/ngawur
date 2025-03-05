import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { AngleDownSVG } from '../../assets/icon/SVGTSX/AngleDownSVG';
import ListColor from '../../Config/color';
import Sheet from 'react-modal-sheet';
import { CustomPopup, PopupLoading } from '../CustomWidget/customPopup';
import moment from 'moment';
import { ToastSnackbar, ToastSnackbarModel } from '../CustomWidget/toastSnackbar';
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from '../../classModels/loginModelClass';
import { LokasiModel } from '../../classModels/lokasiModel';
import { DatePickerPopup } from '../CustomWidget/datePickerPopup';
import { defaultInputCSS } from '../../baseCSSModel/inputCssModel';
import globalVariables, { numberSeparator, numberSeparatorFromString } from '../../Config/globalVariables';
import { LoginSupplierModel } from '../../classModels/loginSupplierModel';
import { VerifikasiPelunasanModel } from '../../classModels/verifikasiPelunasanModel';
import { ChevronLeftSVG } from '../../assets/icon/SVGTSX/ChevronLeftSVG';
import { CalendarAltOSVG } from '../../assets/icon/SVGTSX/CalendarAltOSVG';
import { ChevronRightSVG } from '../../assets/icon/SVGTSX/ChevronRightSVG';
import { MoneyBillOSVG } from '../../assets/icon/SVGTSX/MoneyBillOSVG';
import { MultiplySVG } from '../../assets/icon/SVGTSX/MultiplySVG';
import { CheckSVG } from '../../assets/icon/SVGTSX/CheckSVG';
import { SelectedRadioButtonSVG } from '../../assets/icon/SVGTSX/SelectedRadioButtonSVG';
import { UnselectedRadioButtonSVG } from '../../assets/icon/SVGTSX/UnselectedRadioButtonSVG';
import { EyeSVG } from '../../assets/icon/SVGTSX/EyeSVG';
import { EyeSplashSVG } from '../../assets/icon/SVGTSX/EyeSplashSVG';
import { KeySkeletonSVG } from '../../assets/icon/SVGTSX/KeySkeletonSVG';

interface PopupVerifikasiModel {
  openPopup: boolean;
  onClose(): void,
}

const PopupVerifikasi: React.FC<PopupVerifikasiModel> = (pParameter) => {
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xLoadingHutang, setXLoadingHutang] = useState(false);
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  const [xListPelunasan, setXListPelunasan] = useState([] as VerifikasiPelunasanModel[])
  const [xSelectedDate, setXSelectedDate] = useState(moment());
  const [xOpenAwal, setXOpenAwal] = useState(false);
  const [xKonfirmasi, setXKonfirmasi] = useState(false);
  const [xAlasan, setXAlasan] = useState("");
  const [xVerifikasi, setXVerifikasi] = useState(true);
  const [xAlasanError, setXAlasanError] = useState(false);
  const [xSelectedPelunasan, setXSelectedPelunasan] = useState({} as VerifikasiPelunasanModel);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  const [xPassword, setXPassword] = useState("");
  const [xErrorPassword, setXErrorPassword] = useState("");
  const [xIsVisiblePassword, setXIsVisiblePassword] = useState(false);

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


  const getListPelunasan = async (pAwal: moment.Moment) => {
    setXLoadingHutang(true);
    let url = "umkm/ApiKasPelunasan/listPelunasanBelumVerifikasi";
    const form = new FormData();
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal ?? "");
    form.append("idsupplier", xDataSupplierLogin.idsupplier ?? "");
    form.append("iduser", globalVariables.idUserGlobal);
    form.append("tanggal", pAwal.format("YYYY-MM-DD"));

    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            const responseData = data.data as VerifikasiPelunasanModel[];
            setXListPelunasan(responseData);
          } else {
            setSnackBar(data.message, true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    setXLoadingHutang(false);
  };

  useEffect(() => {
    if (pParameter.openPopup) {
      getListPelunasan(xSelectedDate);
    }
  }, [pParameter.openPopup])

  const simpanVerifikasi = async () => {
    setXLoadingHutang(true);
    let url = "umkm/ApiKasPelunasan/verifikasiPelunasanHutang";
    const form = new FormData();
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    form.append("iduser", globalVariables.idUserGlobal);
    form.append("idpelunasan", xSelectedPelunasan.idpelunasan ?? "");
    form.append("kodepelunasan", xSelectedPelunasan.kodepelunasan ?? "");
    form.append("password",xPassword);
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            setSnackBar("Pelunasan Berhasil Diverifikasi", false);
            setXKonfirmasi(false);
            getListPelunasan(xSelectedDate);
          } else {
            setSnackBar(data.message??"Pelunasan Gagal Diverifikasi", true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    setXLoadingHutang(false);
  }

  return <>
    <CustomPopup
      content={<div className="whitespace-pre-line text-center mb-4 font-semibold text-sm">
        <p>Apakah anda mau verifikasi data pelunasan ini?</p>
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
      }}
      open={xKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={60}
    />
    <DatePickerPopup
      open={xOpenAwal}
      onClose={(value) => { setXOpenAwal(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXSelectedDate(moment(value));
        getListPelunasan(moment(value));
      }}
      minDate={new Date("1900-01-01")}
      maxDate={new Date()}
      value={xSelectedDate.toDate()}
    />
    <PopupLoading key="loading" open={xLoadingHutang} />
    {ToastSnackbar(xShowToast)}
    {pParameter.openPopup && <div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => {
      if (!xKonfirmasi && !xLoadingHutang)
        pParameter.onClose()
    }} />}
    <Sheet
      isOpen={pParameter.openPopup}
      onClose={() => {
        if (!xKonfirmasi && !xLoadingHutang)
          pParameter.onClose()
      }}
      snapPoints={[0.9]}
      detent='content-height'
      style={{ zIndex: 53 }}
      key={"filter"}
    >
      <Sheet.Container>
        <Sheet.Content>
          <div className='w-full mt-1.5 mb-3'>
            <div className='w-full mb-2 '>
              <div className='w-full justify-items-center' onClick={() => { if (!xKonfirmasi && !xLoadingHutang) pParameter.onClose() }}>{AngleDownSVG(24, ListColor.main.Main)}</div>
              <p className="text-h5 font-bold text-neutral-90 text-center">Verifikasi Pelunasan</p>
            </div>
            <div className="flex justify-between w-full h-10 px-4 items-center bg-neutral-10">
              <div onClick={() => {
                let tgl = moment(xSelectedDate).add(-1, "days");
                setXSelectedDate(tgl);
                getListPelunasan(tgl);
              }}
              >
                {ChevronLeftSVG(24, ListColor.main.Main)}
              </div>
              <div className="flex items-center gap-2" onClick={() => { setXOpenAwal(true); }}>
                {CalendarAltOSVG(18, ListColor.main.Main)}
                <p>{xSelectedDate.format("DD MMM YYYY")}</p>
              </div>
              <div onClick={() => {
                let tgl = moment(xSelectedDate).add(1, "days");
                setXSelectedDate(tgl);
                getListPelunasan(tgl);
              }}
              >
                {ChevronRightSVG(24, ListColor.main.Main)}
              </div>
            </div>
          </div>
          <Sheet.Scroller>
            {xListPelunasan.map((pPelunasan, pIndex) => {
              let border = 'neutral-90';
              let bg = 'neutral-10';
              let text = 'neutral-100';
              let colortext = ListColor.neutral[100];
              let status = "Menunggu Verifikasi";
              let icon = <div></div>;
              if (pPelunasan.status == "D") {
                border = "danger-pressed";
                bg = "danger-surface";
                text = 'danger-pressed';
                colortext = ListColor.danger.Pressed;
                status = "Verifikasi Ditolak";
                icon = MultiplySVG(14, ListColor.neutral[10]);
              } else if (pPelunasan.status == "P") {
                status = "Terverifikasi";
                border = "main-pressed";
                bg = "main-surface";
                text = 'main-pressed';
                colortext = ListColor.main.Pressed;
                icon = CheckSVG(14, ListColor.neutral[10]);
              }
              return <div key={'pelunasan' + pIndex} className={`w-full mb-2 px-4 text-${text}`} >
                <div className={`flex rounded-t-lg gap-1 border border-${border} bg-${bg} py-1 px-2 items-center`}>
                  <div className='w-full'>{pPelunasan.kodepelunasan}</div>
                  {pPelunasan.status == "S" && <div className=' py-1 px-2 rounded-full bg-main-Main text-white' onClick={() => {
                    setXKonfirmasi(true);
                    setXAlasan("");
                    setXVerifikasi(true);
                    setXSelectedPelunasan(pPelunasan);
                    setXErrorPassword("");
                    setXIsVisiblePassword(false);
                    setXPassword("");

                  }}>Verifikasi</div>}
                </div>
                <div className={`border border-${border} bg-${bg} rounded-b-lg border-t-0 px-2 py-1`}>
                  <div className='flex items-center gap-1'>
                    <div>{CalendarAltOSVG(18, colortext)}</div>
                    <div>{moment(pPelunasan.tglentry).format("DD MMM YYYY HH:mm")}</div>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div>{MoneyBillOSVG(18, colortext)}</div>
                    <div>{numberSeparatorFromString((pPelunasan.total ?? "0").toString().split(".")[0])}</div>
                  </div>
                  <div className=" flex items-center gap-1">
                    <div className={`size-[18px] rounded-full bg-${text} content-center justify-items-center`}>
                      {icon}
                    </div>
                    <div>{status}</div>
                  </div>
                </div>
              </div>
            })}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  </>;
}

export default PopupVerifikasi;

