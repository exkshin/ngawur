import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { AngleDownSVG } from '../../assets/icon/SVGTSX/AngleDownSVG';
import ListColor from '../../Config/color';
import Sheet from 'react-modal-sheet';
import { PopupLoading } from '../CustomWidget/customPopup';
import moment from 'moment';
import { ToastSnackbar, ToastSnackbarModel } from '../CustomWidget/toastSnackbar';
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from '../../classModels/loginModelClass';
import { LokasiModel } from '../../classModels/lokasiModel';
import { DatePickerPopup } from '../CustomWidget/datePickerPopup';
import { defaultInputCSS } from '../../baseCSSModel/inputCssModel';
import { numberSeparator, numberSeparatorFromString } from '../../Config/globalVariables';

interface PopupRingkasanModel {
  openPopup: boolean;
  onClose(): void,
}

const PopupRingkasan: React.FC<PopupRingkasanModel> = (pParameter) => {
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xLoadingOmzet, setXLoadingOmzet] = useState(true);
  const [xLoadingHutang, setXLoadingHutang] = useState(true);
  const [xDataOmzet, setxDataOmzet] = useState([] as RingkasanOmzetModel[]);
  const [xDataHutang, setxDataHutang] = useState([] as RingkasanHutangModel[]);
  const [xOption, setXOption] = useState(null as null | ApexOptions);
  const [xSeries, setXSeries] = useState(undefined as ApexAxisChartSeries | ApexNonAxisChartSeries | undefined);
  const [xAwal, setXAwal] = useState(moment().add(-7, 'days'));
  const [xAkhir, setXAkhir] = useState(moment());
  const [xOpenAwal, setXOpenAwal] = useState(false);
  const [xOpenAkhir, setXOpenAkhir] = useState(false);
  const [xTotalHutang, setXTotalHutang] = useState(0.0);
  const [xTotalOmzet, setXTotalOmzet] = useState(0.0);
  const [xTotalLaba, setXTotalLaba] = useState(0.0);
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

  function createApexSeries(pData: RingkasanOmzetModel[], pHutang: RingkasanHutangModel[]) {
    const series = [{
      name: "Omzet",
      color: "blue",
      data: pData.map(item => item.omzet)
    }, {
      name: "HPP",
      color: "red",
      data: pHutang.map(item => item.hutang)
    }];

    return series
  }

  function createApexOption(pData: RingkasanOmzetModel[]) {

    const options: ApexOptions = {
      chart: {
        type: 'line', // Ensure this is a valid type
        height: 350,
        toolbar: {
          show: false // Menonaktifkan toolbar
        },
        zoom: { enabled: false }
      },
      xaxis: {
        labels: {
          formatter: (val) => formatDate(val),
        },
        categories: pData.map(item => item.tgltrans),
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => formatNumber(val), // Menggunakan formatNumber untuk data labels
      },
      yaxis: {
        labels: {
          formatter: (val: number) => formatNumber(val), // Menggunakan formatNumber untuk sumbu Y
        }
      }
    };
    return options;
  }

  const formatDate = (pVal: string) => {
    return moment(pVal).format("DD MMM YYYY");
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'; // Jutaan
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'; // Ribuan
    }
    return num.toString(); // Angka di bawah 1000
  };

  const getDataHutang = async (pAwal: moment.Moment, pAkhir: moment.Moment) => {
    setXLoadingHutang(true);
    let url = "umkm/ApiSupplier/getDataHutangUmkm";
    const form = new FormData();
    form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
    form.append("idlokasi", xDataLokasi.id ?? "")
    form.append("iduser", xDataLogin.iduser ?? "");
    form.append("tglawal", pAwal.format("YYYY-MM-DD"));
    form.append("tglakhir", pAkhir.format("YYYY-MM-DD"));

    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            const responseData = data.data;
            let temp = [] as RingkasanHutangModel[];
            responseData.forEach((value: any) => {
              temp.push({
                tgltrans: value.tgltrans,
                hutang: parseInt(value.hutang.toString().split(".")[0]),
              })
            })
            setxDataHutang(temp);
            let total = 0;
            temp.forEach((data) => total += data.hutang);
            setXTotalHutang(total);
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
  const getDataOmzet = async (pAwal: moment.Moment, pAkhir: moment.Moment) => {
    setXLoadingOmzet(true);
    let url = "umkm/ApiJual/getDataOmzet";
    const form = new FormData();
    form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
    form.append("idlokasi", xDataLokasi.id ?? "")
    form.append("iduser", xDataLogin.iduser ?? "");
    form.append("tglawal", pAwal.format("YYYY-MM-DD"));
    form.append("tglakhir", pAkhir.format("YYYY-MM-DD"));
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            const responseData = data.data;
            let temp = [] as RingkasanOmzetModel[];
            responseData.forEach((value: any) => {
              temp.push({
                tgltrans: value.tgltrans,
                omzet: parseInt(value.omzet.toString().split(".")[0]),
                laba:value.laba,
              })
            })
            setxDataOmzet(temp);
            let total = 0;
            let totalLaba=0;
            temp.forEach((data) =>{ 
              total += data.omzet;
              totalLaba +=data.laba;
            });
            setXTotalOmzet(total);
            setXTotalLaba(totalLaba);
          } else {
            setSnackBar(data.message, true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    setXLoadingOmzet(false);

  };

  useEffect(() => {
    if (!xLoadingHutang && !xLoadingOmzet) {

      setXOption(createApexOption(xDataOmzet));
      setXSeries(createApexSeries(xDataOmzet, xDataHutang));
    }
  }, [xLoadingHutang, xLoadingOmzet])

  useEffect(() => {
    getDataHutang(xAwal, xAkhir);
    getDataOmzet(xAwal, xAkhir);
  }, [])



  return <>
    <DatePickerPopup
      open={xOpenAkhir}
      onClose={(value) => { setXOpenAkhir(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXAkhir(moment(value));
        getDataHutang(xAwal, moment(value));
        getDataOmzet(xAwal, moment(value));
      }}
      minDate={xAwal.toDate()}
      value={xAkhir.toDate()}
      maxDate={new Date()}
    />
    <DatePickerPopup
      open={xOpenAwal}
      onClose={(value) => { setXOpenAwal(value) }}
      useTimeWidget={false}
      onChange={(value) => {
        setXAwal(moment(value));
        getDataHutang(moment(value), xAkhir);
        getDataOmzet(moment(value), xAkhir);
      }}
      minDate={new Date("1900-01-01")}
      maxDate={xAkhir.toDate()}
      value={xAwal.toDate()}
    />
    <PopupLoading key="loading" open={xLoadingHutang || xLoadingOmzet} />
    {ToastSnackbar(xShowToast)}
    {pParameter.openPopup && <div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => pParameter.onClose()} />}
    <Sheet
      isOpen={pParameter.openPopup}
      onClose={() => pParameter.onClose()}
      snapPoints={[0.9]}
      detent='content-height'
      style={{ zIndex: 53 }}
      key={"filter"}
    >
      <Sheet.Container>
        <Sheet.Content>
          <div className='w-full mt-1.5 mb-3'>
            <div className='w-full mb-4 '>
              <div className='w-full justify-items-center' onClick={() => pParameter.onClose()}>{AngleDownSVG(24, ListColor.main.Main)}</div>
              <p className="text-h5 font-bold text-neutral-90 text-center">Laporan Omzet & HPP</p>
            </div>
            <div className=" mb-2.5 flex gap-1 w-full px-4">
              <div >
                <div className="font-semibold text-14px text-left mb-2.5">Dari</div>
                <div className="relative w-full mt-2.5">
                  <input
                    onClick={(e) => {
                      setXOpenAwal(true);
                    }}
                    value={xAwal.format("DD MMM YYYY")}
                    readOnly={true}
                    type={"text"}
                    className={`${defaultInputCSS(true, false, true)}`}
                  />
                </div>
              </div>
              <div >
                <div className="font-semibold text-14px text-right mb-2.5">Sampai</div>
                <div className="relative w-full mt-2.5">
                  <input
                    onClick={(e) => {
                      setXOpenAkhir(true);
                    }}
                    value={xAkhir.format("DD MMM YYYY")}
                    readOnly={true}
                    type={"text"}
                    className={`${defaultInputCSS(true, false, true)} text-right`}
                  />
                </div>
              </div>
            </div>
          </div>
          <Sheet.Scroller>
            <div className='px-4' style={{ maxHeight: "80vh" }}>

              <div className="py-4">
                {xOption !== null && xSeries != null &&
                  <ReactApexChart options={xOption} series={xSeries} type="line" height={350} />
                }
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Omzet</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HPP</th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laba</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {xDataHutang.map((pHutang,pIndex) => {
                    let dataOmzet = xDataOmzet.find((value) => pHutang.tgltrans == value.tgltrans);
                    let omzet = dataOmzet == undefined || dataOmzet == null ? 0.0 : dataOmzet.omzet ?? 0.0;
                    let laba = dataOmzet == undefined || dataOmzet == null ? 0.0 : dataOmzet.laba ?? 0.0;
                    return <tr key={"row"+pIndex}>
                      <td className="px-2 py-2 whitespace-nowrap">{moment(pHutang.tgltrans).format("DD MMM YYYY")}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{numberSeparatorFromString(omzet.toString().split(".")[0])}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{numberSeparatorFromString(pHutang.hutang.toString().split(".")[0])}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{numberSeparatorFromString(laba.toString().split(".")[0])}</td>
                    </tr>
                  })
                  }
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-2 py-2 font-bold text-gray-700">Total</td>
                    <td className="px-2 py-2 font-bold text-gray-700">{numberSeparator(xTotalHutang)}</td>
                    <td className="px-2 py-2 font-bold text-gray-700">{numberSeparator(xTotalOmzet)}</td>
                    <td className="px-2 py-2 font-bold text-gray-700">{numberSeparator(xTotalLaba)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  </>;
}

export default PopupRingkasan;

interface RingkasanOmzetModel {
  tgltrans: string, omzet: number, laba:number,
}
interface RingkasanHutangModel {
  tgltrans: string, hutang: number,
}
