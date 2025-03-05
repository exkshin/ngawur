import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import globalVariables, { floatSeparator, numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ListClosingModel } from "../../classModels/listClosingModel";
import { DataItem, DetailClosingModel, DetailSetoranModel, KasBankModel } from "../../classModels/detailClosingModel";
import { PageRoutes } from "../../PageRoutes";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { PopupLoading } from "../CustomWidget/customPopup";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import ListColor from "../../Config/color";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import moment from "moment";
import { CardListKeuangan } from "../GlobalWidget/cardListKeuangan";
import { ListKasKeuanganModel } from "../../classModels/listKasKeuanganModel";

const DetailClosingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xModal, setXModal] = useState("0");
  const [xTransaksi, setXTransaksi] = useState(null as ListClosingModel | null)
  const [xDetailClosing, setXDetailClosing] = useState(null as DetailClosingModel | null);
  const [xIsLoadingModal, setXIsLoadingModal] = useState(false);
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
  useEffect(() => {
    if (location.state != undefined && location.state != null) {
      let id = "";
      if (location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTrans = location.state.dataTransaksi as ListClosingModel;
        setXTransaksi(location.state.dataTransaksi);
        id = dataTrans.idclosing ?? "";
        getDetailClosing(id);
      }
    }
  }, [])

  function getGrandTotal(pData: DataItem[], isJual: boolean) {
    let total = 0;
    for (let j = 0; j < pData.length; j++) {
      for (let i = 0; i < pData[j].daftarbarang.length; i++) {
        // if (isJual) {
        //   total += pData[j].daftarbarang[i].hspp ?? 0;
        // }
        // else {
        total += parseInt((pData[j].daftarbarang[i].subtotal ?? "0").split(".")[0]);
        // }
      }
    }
    return total;
  }
  async function getDetailClosing(idClosing: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idclosing", idClosing);
      await AXIOS
        .post("umkm/ApiClosingDate/getDetailClosing", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.data as DetailClosingModel;
          setXDetailClosing(responseData);
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
  }

  const getGrandTotalKas = (pKas: ListKasKeuanganModel[]) => {
    let total = 0.0;
    pKas.forEach((value) => {
      total += parseFloat(value.total ?? "0");
    })
    return total;
  }
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
            let modal = data.data ?? "0";
            setXModal((data.data ?? "0").split(".")[0]);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingModal(false);
  }
  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <CustomNavbar
      title={"Detail Closing"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listClosing)}
    />
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <div className="min-h-16" />
    {xDetailClosing != null && <div className="px-4 w-full pb-4">
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Kode Closing"} subtitle={xDetailClosing.header.kodeclosing ?? ""} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Kasir Closing"} subtitle={xDetailClosing.header.username ?? ""} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Tgl. Closing"} subtitle={moment(xDetailClosing.header.tglawal ?? "").format("DD MMM YYYY")} verticalAlign={null} />
      {/* <DetailDivStandard widthTitle={null} title={"Omzet"} subtitle={"Rp" + numberSeparatorFromString((xDetailClosing.header.omzet ?? "0").split(".")[0])} verticalAlign={null} /> */}
      <ListSetoran data={xDetailClosing.setoran} index={0} />
      <ListKasBank data={xDetailClosing.bank} index={0} />
      {(xDetailClosing.pelunasanhutang.length + xDetailClosing.pelunasanhutang.length) > 0 && <div className="mb-2 font-bold text-center">Pelunasan Hutang</div>}
      {xDetailClosing.pelunasanhutang.map((pKasKeluar, pIndex) => {
        return <CardListKeuangan key={"PelunasanHutang" + pIndex} dataItem={pKasKeluar} isClosing={true} isOpenOpsi={false} forClosing={true} />
      })}
      <DetailDivStandard boldAll={true} widthTitle={'190px'} title={"Total Pelunasan Hutang"} subtitle={"Rp" + numberSeparator(getGrandTotalKas(xDetailClosing.pelunasanhutang))} verticalAlign={null} />
      {(xDetailClosing.pelunasanhutang.length + xDetailClosing.pelunasanhutang.length) > 0 && <div className="mb-2 font-bold text-center">Kas Keluar</div>}
      {xDetailClosing.kaskeluar.map((pKasKeluar, pIndex) => {
        return <CardListKeuangan key={"KasKeluar" + pIndex} dataItem={pKasKeluar} isClosing={true} isOpenOpsi={false} forClosing={true} />
      })}
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Total Kas Keluar"} subtitle={"Rp" + numberSeparator(getGrandTotalKas(xDetailClosing.kaskeluar))} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={'180px'} title={"Grand Total Kas Keluar"} subtitle={"Rp" + numberSeparator(getGrandTotalKas([...xDetailClosing.pelunasanhutang, ...xDetailClosing.kaskeluar]))} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={'160px'} title={"Grand Total Setoran"} subtitle={"Rp" + numberSeparator(xDetailClosing.grandtotalsetoran ?? 0)} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Selisih Kasir"} subtitle={"Rp" + numberSeparator(xDetailClosing.header.selisihsetoran ?? 0)} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Modal"} subtitle={"Rp" + numberSeparatorFromString(xDetailClosing.modalawal==null?"0":(xDetailClosing.modalawal.amount ?? "0").split(".")[0])} verticalAlign={null} />
      {xDetailClosing.kasmasuk.length > 0 && <div className="mb-2 font-bold text-center">Kas Masuk</div>}
      {xDetailClosing.kasmasuk.map((pKasKeluar, pIndex) => {
        return <CardListKeuangan key={"KasMasuk" + pIndex} dataItem={pKasKeluar} isClosing={true} isOpenOpsi={false} forClosing={true} />
      })}
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Total Kas Masuk"} subtitle={"Rp" + numberSeparator(getGrandTotalKas(xDetailClosing.kasmasuk))} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Total Penjualan"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDetailClosing.datajual, true).toString())} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Total Retur"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDetailClosing.dataretur, false).toString())} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={"160px"} title={"Uang Muka Hari Ini"} subtitle={"Rp" + numberSeparatorFromString((xDetailClosing.uangmukahariini??"0").split('.')[0])} verticalAlign={null} />
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Uang Muka Sebelumnya"} subtitle={"Rp-" + numberSeparatorFromString((xDetailClosing.uangmukasebelumnya??"0").split('.')[0])} verticalAlign={null} />

      <div className="mb-2 font-bold text-center">Rekap Penjualan</div>
      {xDetailClosing.datajual.map((pSupplier, pIndex) => {
        return <BarangClosingSupplier data={pSupplier} index={pIndex} key={"supplierJual" + pIndex} isJual={true} />
      })
      }
      <DetailDivStandard boldAll={true} widthTitle={null} title={"Grand Total Jual"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDetailClosing.datajual, true).toString())} verticalAlign={null} />
      <div className="mb-2 font-bold text-center">Rekap Retur</div>
      {xDetailClosing.dataretur.map((pSupplier, pIndex) => {
        return <BarangClosingSupplier data={pSupplier} index={pIndex} key={"supplierRetur" + pIndex} isJual={false} />
      })
      }
      <DetailDivStandard boldAll={true} widthTitle={"140px"} title={"Grand Total Retur"} subtitle={"Rp" + numberSeparatorFromString(getGrandTotal(xDetailClosing.dataretur, false).toString())} verticalAlign={null} />

    </div>
    }
  </div>
}
export default DetailClosingPage;

export const BarangClosingSupplier = (pParameter: { index: number, data: DataItem, isJual: boolean }) => {
  const [xExpand, setXExpand] = useState(true)
  let getTotal = (data: DataItem) => {
    let total = 0;
    for (let i = 0; i < data.daftarbarang.length; i++) {
      // if (pParameter.isJual) {
      //   total +=parseInt(( data.daftarbarang[i]. ?? "0").split(".")[0]);
      // }
      // else {
      total += parseInt((data.daftarbarang[i].subtotal ?? "0").split(".")[0]);
      // }
    }
    return total;
  }
  return <>
    <div key={(pParameter.isJual ? "barangjual" : "barangsupplier") + pParameter.index} className="flex w-full justify-between items-center"
      onClick={() => {
        setXExpand(!xExpand)
      }}
    >
      <p className="font-14px font-semibold ">{pParameter.data.namasupplier}</p>
      <div>{xExpand ? AngleUpSVG(24, ListColor.main.Main) : AngleDownSVG(24, ListColor.main.Main)}</div>
    </div>
    <div className="w-full justify-between items-center mb-2">
      {pParameter.data.hutang != null && pParameter.data.hutang != undefined && <p className="text-12px">Hutang : Rp{numberSeparatorFromString((pParameter.data.hutang ?? "").replaceAll("-", "").split(".")[0])}</p>}
      {pParameter.data.hutang != null && pParameter.data.hutang != undefined && <p className="text-12px">Omzet  : Rp{numberSeparatorFromString((pParameter.data.omzet ?? "").split(".")[0])}</p>}
    </div>

    {xExpand ?
      <div className="flex-wrap flex justify-between w-full">
        {pParameter.data.daftarbarang.map((pElement, pIndexBarang) => {
          let jml = pElement.jml ?? "";
          let harga = pParameter.isJual ? pElement.harga : pElement.harga;
          let subtotal = pParameter.isJual ? (pElement.subtotal ?? 0).toString() : pElement.subtotal;
          return <div key={`itemJual${pIndexBarang}`} className="mb-2 w-full rounded-lg p-2 bg-main-Surface">
            <p className="text-16px font-bold">{pElement.namabarang} </p>
            <div className="flex justify-between">
              <div className="text-12px font-normal" >{numberSeparatorFromString((jml ?? "").split(".")[0])} x Rp{numberSeparatorFromString((harga ?? "").split(".")[0])}</div>
              <div className="text-12px font-bold">Rp{numberSeparatorFromString((subtotal ?? "").split(".")[0])}</div>
            </div>
          </div>;
        })
        }
      </div> : <></>
    }
    <div key={`totalitemJual${pParameter.index}`} className="mb-2 w-full flex justify-between rounded-lg p-2 bg-main-Surface">
      <div className="text-14px font-bold" >Total</div>
      <div className="text-14px font-bold">Rp{numberSeparatorFromString(getTotal(pParameter.data).toString())}</div>
    </div>
  </>;
}

export const ListSetoran = (pParameter: { index: number, data: DetailSetoranModel[] }) => {
  const [xExpand, setXExpand] = useState(true)
  let total = 0.0;
  pParameter.data.forEach(element => {
    total += parseFloat(element.amountclosing ?? "0");
  });
  return pParameter.data.length <= 0 ? <></> : <>
    <div key={"barangsupplier" + pParameter.index} className="flex w-full justify-between items-center"
      onClick={() => {
        setXExpand(!xExpand)
      }}
    >
      <p className="font-14px font-semibold ">Setoran</p>
      <div>{xExpand ? AngleUpSVG(24, ListColor.main.Main) : AngleDownSVG(24, ListColor.main.Main)}</div>
    </div>
    {xExpand && <div className="overflow-x-auto my-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denominasi</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pParameter.data.map((pHutang, pIndex) => {
            return <tr key={"row" + pIndex}>
              <td className="px-2 py-2 whitespace-nowrap">{numberSeparatorFromString(pHutang.denominasi ?? '0')}</td>
              <td className="px-2 py-2 text-right whitespace-nowrap">Rp{numberSeparatorFromString((pHutang.amountclosing ?? "0").toString().split(".")[0])}</td>
            </tr>
          })
          }
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-2 py-2 font-bold text-gray-700">Total</td>
            <td className="px-2 py-2 text-right font-bold text-gray-700">Rp{numberSeparatorFromString(total.toString().split(".")[0])}</td>
          </tr>
        </tfoot>
      </table>
    </div>}
  </>;
}

export const ListKasBank = (pParameter: { index: number, data: KasBankModel[] }) => {
  const [xExpand, setXExpand] = useState(true)
  let total = 0.0;
  let totalTrans = 0.0;
  pParameter.data.forEach(element => {
    total += parseFloat(element.amount ?? "0");
    totalTrans += parseFloat(element.jmltrans ?? "0");
  });
  return pParameter.data.length <= 0 ? <></> : <>
    <div key={"barangsupplier" + pParameter.index} className="flex w-full justify-between items-center"
      onClick={() => {
        setXExpand(!xExpand)
      }}
    >
      <p className="font-14px font-semibold ">BANK</p>
      <div>{xExpand ? AngleUpSVG(24, ListColor.main.Main) : AngleDownSVG(24, ListColor.main.Main)}</div>
    </div>
    {xExpand && <div className="overflow-x-auto my-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jml. Trans</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pParameter.data.map((pHutang, pIndex) => {
            return <tr key={"row" + pIndex}>
              <td className="px-2 py-2 whitespace-nowrap">{pHutang.namabank}</td>
              <td className="px-2 py-2 whitespace-nowrap text-center">{numberSeparatorFromString(pHutang.jmltrans ?? '0')}X</td>
              <td className="px-2 py-2 text-right whitespace-nowrap">Rp{numberSeparatorFromString((pHutang.amount ?? "0").toString().split(".")[0])}</td>
            </tr>
          })
          }
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-2 py-2 font-bold text-gray-700">Total Bank</td>
            <td className="px-2 py-2  font-bold text-center text-gray-700">{numberSeparatorFromString(totalTrans.toString().split(".")[0])}X</td>
            <td className="px-2 py-2 text-right font-bold text-gray-700">Rp{numberSeparatorFromString(total.toString().split(".")[0])}</td>
          </tr>
        </tfoot>
      </table>
    </div>}
  </>;
}
