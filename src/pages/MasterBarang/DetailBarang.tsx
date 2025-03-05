import { useLocation, useNavigate } from "react-router-dom";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import { DetailJualModel } from "../../classModels/detailJualModel";
import { useEffect, useState } from "react";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { DataBarangModel } from "../../classModels/barangModel";
import { DetailBarangModel } from "../../classModels/detailBarangModel";
import noImage from "../../assets/images/no-image-icon-0.png"
import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import AXIOS from "../../Config/axiosRequest";
import { PageRoutes } from "../../PageRoutes";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { AsyncImage } from 'loadable-image'

const DetailBarangPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xLoginAsSupplier = localStorage.getItem("loginAs") == "SUPPLIER";
  const [xDataBarang, setxDataBarang] = useState(null as DataBarangModel | null);
  const [xDetailBarang, setXDetailBarang] = useState(null as DetailBarangModel | null);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xShowImage, setXShowImage] = useState(false);
  const [xLinkFoto, setXLinkFoto] = useState("");
  const [xFrom, setXFrom] = useState(PageRoutes.masterBarang);
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

  const getNamaLokasi = () => {
    let namalokasi = "";
    if (xDetailBarang != null) {
      xDetailBarang.daftarlokasi.forEach((pLokasi, pIndex) => {
        if (pIndex !== 0) {
          namalokasi += ", ";
        }
        namalokasi += pLokasi.namalokasi;
      })
    }
    return namalokasi;
  }

  useEffect(() => {
    if (location.state != undefined && location.state != null) {
      let idBarang = "";
      if (location.state.dataBarang != undefined && location.state.dataBarang != null) {
        let databarang = location.state.dataBarang as DataBarangModel;
        setxDataBarang(location.state.dataBarang);
        idBarang = databarang.idbarang ?? "";
        getDetailBarang(idBarang);
      }
      if (location.state.from != undefined && location.state.from != null) {
        setXFrom(location.state.from);
      }
    }
  }, [])

  async function getDetailBarang(idBarang: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xLoginAsSupplier ? globalVariables.idPerusahaanGlobal : xDataLogin.idperusahaan ?? "");
      form.append("iduser", xLoginAsSupplier ? globalVariables.idUserGlobal : xDataLogin.iduser ?? "");
      form.append("idbarang", idBarang);
      await AXIOS
        .post("api/Master/ApiBarang/getDataBarang", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.data as DetailBarangModel;
          setXDetailBarang(responseData);
          setXLinkFoto((responseData.pathgambar ?? "") + "?t=" + Date.now());
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
  }

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start overflow-auto bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <CustomPopupOpsi content={
      <div className="w-full max-w-96 mb-2">
        <img
          src={xLinkFoto.substring(xLinkFoto.lastIndexOf('/') + 1).split('?')[0] == 'NO_IMAGE.jpg' ? noImage : xLinkFoto}
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
      title={"Detail Barang"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(xFrom)}
    />
    <div className="min-h-14" />
    {xDetailBarang != null &&
      <div className="w-full px-4 py-2">
        <div className="w-full max-w-96 mb-2">
          <img
            src={xLinkFoto.substring(xLinkFoto.lastIndexOf('/') + 1).split('?')[0] == 'NO_IMAGE.jpg' ? noImage : xLinkFoto}
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

        <DetailDivStandard widthTitle={null} title={"Nama Barang"} subtitle={xDetailBarang?.namabarang} verticalAlign={null} />
        <DetailDivStandard widthTitle={null} title={"Kode Barang"} subtitle={xDetailBarang?.kodebarang} verticalAlign={null} />
        <DetailDivStandard widthTitle={null} title={"Satuan"} subtitle={xDetailBarang?.satuan} verticalAlign={null} />
        {xFrom == PageRoutes.masterBarang && <>
          <DetailDivStandard widthTitle={null} title={"Harga Jual"} subtitle={"Rp" + numberSeparatorFromString((xDetailBarang?.hargajual ?? "0").split(".")[0])} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Harga Beli"} subtitle={"Rp" + numberSeparatorFromString((xDetailBarang?.hargabeli ?? "0").split(".")[0])} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Lokasi"} subtitle={getNamaLokasi()} verticalAlign={null} />
        </>}
        <DetailDivStandard widthTitle={null} title={"Supplier"} subtitle={xDetailBarang?.daftarsupplier[0].namasupplier} verticalAlign={null} />
        {xFrom == PageRoutes.masterBarang ?
          <DetailDivStandard widthTitle={null} title={"Catatan"} subtitle={xDetailBarang?.catatan} verticalAlign={null} />
          : <>
          <DetailDivStandard widthTitle={null} title={"Sisa H-1"} subtitle={numberSeparatorFromString((xDataBarang?.jmlsisakemarin??"0.0").split('.')[0])} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Beli"} subtitle={numberSeparatorFromString((xDataBarang?.jmlbeli??"0.0").split('.')[0])} verticalAlign={null} />
            <DetailDivStandard widthTitle={null} title={"Jual"} subtitle={numberSeparatorFromString((xDataBarang?.jmljual??"0.0").split('.')[0])} verticalAlign={null} />
            <DetailDivStandard widthTitle={null} title={"Retur"} subtitle={numberSeparatorFromString((xDataBarang?.jmlretur??"0.0").split('.')[0])} verticalAlign={null} />
            <DetailDivStandard widthTitle={null} title={"Sisa"} subtitle={numberSeparatorFromString((xDataBarang?.jmlsisa??"0.0").split('.')[0])} verticalAlign={null} />
            <DetailDivStandard widthTitle={null} title={"Stok"} subtitle={numberSeparatorFromString((xDataBarang?.stok??0.0).toString().split('.')[0])} verticalAlign={null} />
          </>
        }
      </div>
    }

  </div>
}
export default DetailBarangPage;