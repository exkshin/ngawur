import { useLocation, useNavigate } from "react-router-dom";
import { CustomNavbar } from "../CustomWidget/customNavbar"
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import { DetailSOModel } from "../../classModels/detailSOModel";
import { DetailJualModel } from "../../classModels/detailJualModel";
import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import { PopupLoading } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import { ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";

const DetailTransaksiJual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xTransaksi, setXTransaksi] = useState({} as TransaksiJualModel);
  const [xDetailSO, setXDetailSO] = useState(null as DetailSOModel | null);
  const [xDetailJual, setXDetailJual] = useState(null as DetailJualModel | null);
  const [xIsSO, setxIsSO] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsBayarSO, setXIsBayarSO] = useState(false);
  const [xDetailPembayaran, setXDetailPembayaran] = useState({
    total: "0",
    dpp: "0",
    ppn: "0",
    alatBayar: "CASH",
    diskon: "0",
    uangMuka: '0',
    grandTotal: "0",
    pembayaran: "0",
  });
  const [xCustomerSO, SetXCustomerSO] = useState({
    nama: "",
    telp: "",
    alamat: "",
    isDiambil: true,
    catatan: "",
    tanggal:"" as string|null,
  })
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  useEffect(() => {
    let isSO = false;
    let idtrans = "";
    if (location.state.isSO != undefined && location.state.isSO != null) {
      setxIsSO(location.state.isSO);
      isSO = location.state.isSO;
    }
    if (location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
      let dataTransaksi = location.state.dataTransaksi as TransaksiJualModel;
      idtrans = dataTransaksi.idtrans ?? "0";
      setXTransaksi(dataTransaksi);

    }
    initState(isSO, idtrans);
  }, [])


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

  async function initState(pIsSO: boolean, pIdTrans: string) {
    if (pIsSO) {
      await getDetailSO(pIdTrans);
    } else {
      await getDetailJual(pIdTrans);
    }
  }

  async function getDetailSO(idSO: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idso", idSO);
      await AXIOS
        .post("umkm/ApiSalesOrder/getDataSO", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailSOModel;
            setXDetailSO(responseData);
            let dpp = parseInt((responseData.header.total ?? "0").split(".")[0]);
            if (xDataLogin.pakaippn == "INCL") {
              dpp -= parseInt((responseData.header.ppnrp ?? "0").split(".")[0]);
            }
            setXDetailPembayaran({
              total: (responseData.header.total ?? "0").split(".")[0],
              dpp: dpp.toString(),
              ppn: (responseData.header.ppnrp ?? "0").split(".")[0],
              alatBayar: responseData.pembayaran.namaalatbayar ?? "",
              diskon: "0",
              uangMuka: (responseData.pembayaran.amount ?? "0").split(".")[0],
              grandTotal: (responseData.header.grandtotal ?? "0").split(".")[0],
              pembayaran: "0",
            })
            let catatan = (responseData.header.catatan ?? "DIAMBIL\\").split("\\");
            SetXCustomerSO({
              nama: responseData.header.namacustomer ?? "",
              telp: responseData.header.telp ?? "",
              alamat: responseData.header.alamatkirim ?? "",
              isDiambil: (catatan[0]) == "DIAMBIL",
              catatan: catatan.length > 1 ? catatan[1] : "",
              tanggal:responseData.header.tglkirim,
            });
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

  async function getDetailJual(idjual: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idjual", idjual);
      await AXIOS
        .post("umkm/ApiJual/getDataJual", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailJualModel;
            setXDetailJual(responseData);
            let dpp = parseInt((responseData.header.total ?? "0").split(".")[0]) - parseInt((responseData.header.discrp ?? "0").split(".")[0]);;
            if (xDataLogin.pakaippn == "INCL") {
              dpp -= parseInt((responseData.header.ppnrp ?? "0").split(".")[0]);
            }
            setXDetailPembayaran({
              total: (responseData.header.total ?? "0").split(".")[0],
              dpp: dpp.toString(),
              ppn: (responseData.header.ppnrp ?? "0").split(".")[0],
              alatBayar: responseData.pembayaran.namaalatbayar ?? "",
              diskon: (responseData.header.discrp ?? "0").split(".")[0],
              uangMuka: (responseData.header.uangmuka ?? "0").split(".")[0],
              grandTotal: (responseData.header.grandtotal ?? "0").split(".")[0],
              pembayaran: (responseData.pembayaran.amount ?? "0").split(".")[0],
            })
            if (xTransaksi.idso != undefined && xTransaksi.idso != null && xTransaksi.idso != "" && parseInt(xTransaksi.idso) > 0) {
              setxIsSO(false);
              setXIsBayarSO(true);
              let catatan = (responseData.header.catatan ?? "DIAMBIL\\").split("\\");
              SetXCustomerSO({
                nama: responseData.header.namacustomer ?? "",
                telp: responseData.header.telp ?? "",
                alamat: responseData.header.alamat ?? "",
                isDiambil: (catatan[0]) == "DIAMBIL",
                catatan: catatan.length > 1 ? catatan[1] : "",
                tanggal:null,
              });
            }
          } else {
            throw ("error success==false");
          }
        });
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
    <CustomNavbar
      title={"Detail Transaksi Jual"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listTransaksiJual)}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      <DetailDivStandard widthTitle={null} title={"Jenis Transaksi"} subtitle={(!xIsSO&&xDetailJual!=null&&xDetailJual!.header.kodeso!="")?"Bayar SO": xIsSO ? "Pesanan" : "Jual Tunai"} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Kode Transaksi"} subtitle={xTransaksi.kodetrans} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Tanggal Transaksi"} subtitle={moment( xTransaksi.tgltrans).format("DD MMM YYYY")} verticalAlign={null} />
      {(!xIsSO&&xDetailJual!=null&&xDetailJual!.header.kodeso!="")&&xDetailJual!=null&& <DetailDivStandard widthTitle={null} title={"Kode SO"} subtitle={xDetailJual.header.kodeso} verticalAlign={null} />}
      {xIsSO && <>
        <div className="mb-1"><p>Data Customer</p></div>
        <div className="border border-neutral-70 rounded-lg w-full p-2 mb-2">
          <DetailDivStandard widthTitle={null} title={"Nama Customer"} subtitle={xCustomerSO.nama} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"No WA"} subtitle={xCustomerSO.telp} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Alamat"} subtitle={xCustomerSO.alamat} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Diantar / Diambil"} subtitle={xCustomerSO.isDiambil?"Diambil":"Diantar"} verticalAlign={null} />
          {xCustomerSO.tanggal!==null&&
            <DetailDivStandard widthTitle={null} title={"Tgl. Ambil/Antar"} subtitle={moment(xCustomerSO.tanggal??"").format("DD MMM YYYY HH:mm") } verticalAlign={null} />
          }
          <DetailDivStandard widthTitle={null} title={"Catatan"} subtitle={xCustomerSO.catatan} useBorderBottom={false} verticalAlign={null} />
        </div>
      </>}
      <div className="mb-1"><p>List Barang</p></div>
      <div className="border border-neutral-70 rounded-lg w-full p-2 mb-2" >
        {(xTransaksi.detail ?? []).map((pElement, pIndex) => {
          return <div key={`itemJual${pIndex}`}>
            <p>{pElement.namabarang} </p>
            <div className="flex justify-between">
              <div className="text-12px font-normal" >{numberSeparatorFromString((pElement.jml ?? "").split(".")[0])} x Rp{numberSeparatorFromString((pElement.harga ?? "").split(".")[0])}</div>
              <div className="text-12px font-bold">Rp{numberSeparatorFromString((pElement.subtotal ?? "").split(".")[0])}</div>
            </div>
          </div>;
        })}
      </div>

      <DetailDivStandard widthTitle={null} title={"Total"} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.total)} verticalAlign={null} />
      {/* <DetailDivStandard widthTitle={null} title={"Diskon"} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.diskon)} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"DPP"} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.dpp)} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={`PPN(${xDataLogin.pakaippn})`} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.ppn)} verticalAlign={null} /> */}
      <DetailDivStandard widthTitle={null} title={"Uang Muka"} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.uangMuka)} verticalAlign={null} />
      {!xIsSO&&xDetailJual!=null&&xDetailJual!.header.kodeso!=""&& <DetailDivStandard widthTitle={null} title={"Pelunasan"} subtitle={"Rp"+numberSeparatorFromString((parseFloat(xDetailPembayaran.grandTotal)- parseFloat( xDetailPembayaran.uangMuka)).toString().split('.')[0])} verticalAlign={null} />}
      <DetailDivStandard widthTitle={null} title={"Grand Total"} subtitle={"Rp" + numberSeparatorFromString(xDetailPembayaran.grandTotal)} verticalAlign={null} />      
      {xIsSO ? xDetailSO !== null && <>
      </> :(!xIsSO&&xDetailJual!=null&&xDetailJual!.header.kodeso!="")==false&& xDetailJual != null && <>
        <DetailDivStandard widthTitle={null} title={"Pembayaran"} subtitle={"Rp"+numberSeparatorFromString(xDetailPembayaran.pembayaran)} verticalAlign={null} />
      </>}
    </div>

  </div>
}
export default DetailTransaksiJual