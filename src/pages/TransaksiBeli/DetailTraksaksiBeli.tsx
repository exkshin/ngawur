import { useLocation, useNavigate } from "react-router-dom";
import { CustomNavbar } from "../CustomWidget/customNavbar"
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import { CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { DetailBeliModel } from "../../classModels/detailBeliModel";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import noImage from "../../assets/images/no-image-icon-0.png"
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";
import { AsyncImage } from 'loadable-image'

const DetailTransaksiBeli = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xTransaksi, setXTransaksi] = useState({} as TransaksiBeliModel);
  const [xDetailBeli, setXDetailBeli] = useState(null as DetailBeliModel | null);
  const [xIsSO, setxIsSO] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsBayarSO, setXIsBayarSO] = useState(false);
  const [xTotal, setXTotal] = useState("0");
  const [xLinkFoto, setXLinkFoto] = useState("");
  const [xShowImage, setXShowImage] = useState(false);
  const [xIsPembelian,setxIsPembelian]=useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  useEffect(() => {
    let isSO = false;
    let idtrans = "";
    let jenis=false;
    if (location.state.isSO != undefined && location.state.isSO != null) {
      setxIsSO(location.state.isSO);
      isSO = location.state.isSO;
    }
    if (location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
      let dataTransaksi = location.state.dataTransaksi as TransaksiBeliModel;
      idtrans = dataTransaksi.idtrans ?? "0";
      jenis=dataTransaksi.jenistransaksi=="PEMBELIAN";
      setXTransaksi(dataTransaksi);
    }
    setxIsPembelian(jenis)
    initState(idtrans,jenis);
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

  async function initState(pIdTrans: string,pIsPembelian:boolean) {
    await getDetailJual(pIdTrans,pIsPembelian);
  }

  async function getDetailJual(idbeli: string,pIsPembelian:boolean) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      let url="api/Pembelian/ApiPembelianLangsung/getDataBeli"
      if(pIsPembelian){
      form.append("idbeli", idbeli);
    }else{
      url="umkm/ApiReturBeli/getDataReturBeli";
      form.append("idreturbeli",idbeli);
    }
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailBeliModel;
            setXDetailBeli(responseData);
            setXLinkFoto((responseData.header.pathgambar ?? "")+ "?t=" + Date.now());
            setXTotal((responseData.header.total ?? "0").split(".")[0]);
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

        {ToastSnackbar(xShowToast)}
    <CustomPopupOpsi content={
      <div className="w-full max-w-96 mb-2">
        <img
          src={xLinkFoto}
          alt={"no image"}
          style={{
            width: "100%",
            objectFit: "cover",
          }}
loading="lazy"
          onError={() => {
            setXLinkFoto(noImage)
          }}
        />
      </div>
    } onClose={() => setXShowImage(false)} open={xShowImage} zIndex={0} />
    <CustomNavbar
      title={"Detail Transaksi Beli"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listTransaksiBeli)}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      <div className="w-full max-w-96 mb-2" onClick={() => { setXShowImage(true) }}>
        <img
          src={xLinkFoto}
          alt={"no image"}
          style={{
            width: "100%",
            aspectRatio: 4 / 3,
            objectFit: "cover",
          }}
loading="lazy"
          onError={() => {
            setXLinkFoto(noImage)
          }}
        />
      </div>
      <DetailDivStandard widthTitle={null} title={"Jenis Transaksi"} subtitle={xTransaksi.jenistransaksi} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Kode Transaksi"} subtitle={xTransaksi.kodetrans} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Tanggal Transaksi"} subtitle={moment( xTransaksi.tgltrans).format("DD MMM YYYY")} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Supplier"} subtitle={xTransaksi.namasupplier} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Kode Supplier"} subtitle={xTransaksi.kodesupplier} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Tgl. Jatuh Tempo"} subtitle={moment( xTransaksi.tgljatuhtempo).format("DD MMM YYYY")} verticalAlign={null} />
      <div className="mb-1"><p>List Barang</p></div>
      <div className="border border-neutral-70 rounded-lg w-full p-2 mb-2" >
        {xDetailBeli !== null && (xDetailBeli.detail ?? []).map((pElement, pIndex) => {
          return <div key={`itemJual${pIndex}`}>
            <p>{pElement.namabarang} </p>
            <div className="flex justify-between">
              <div className="text-12px font-normal" >{numberSeparatorFromString((pElement.jml ?? "").split(".")[0])} x Rp{numberSeparatorFromString((pElement.harga ?? "").split(".")[0])}</div>
              <div className="text-12px font-bold">Rp{numberSeparatorFromString((pElement.subtotal ?? "").split(".")[0])}</div>
            </div>
          </div>;
        })}
      </div>
      <DetailDivStandard widthTitle={null} title={"Total"} subtitle={"Rp" + numberSeparatorFromString(xTotal)} verticalAlign={null} />
    </div>

  </div>
}
export default DetailTransaksiBeli