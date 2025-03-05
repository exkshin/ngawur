import { useLocation, useNavigate } from "react-router-dom";
import { ListKasKeuanganModel } from "../../classModels/listKasKeuanganModel";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { DetailHutangModel, DetailKasModel, DetailPerkiraanModel, HeaderKasModel } from "../../classModels/detailKasModel";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { PopupLoading } from "../CustomWidget/customPopup";
import { PageRoutes } from "../../PageRoutes";
import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import moment from "moment";
import ListColor from "../../Config/color";
import { PinSVG } from "../../assets/icon/SVGTSX/PinSVG";
import { BottomSheetDetailPelunasanHutang } from "./BottomSheetDetailPelunasanHutang";
import { BottomSheetDetailPelunasanHutangKas } from "./BottomSheetDetailPelunasanHutangKas";

const DetailKeuanganPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xTransaksi, setXTransaksi] = useState({} as ListKasKeuanganModel);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xDetailKas, setXDetailKas] = useState(null as DetailKasModel | null);
  const [xIsPelunasan, setXIsPelunasan] = useState(false);
  const [xSelectedHutang, setxSelectedHutang] = useState(null as DetailHutangModel | null);
  const [xShowDetailHutang, setxShowDetailHutang] = useState(false);
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

  async function initState(pIdTrans: string, pIsPelunasan: boolean, pKode: string) {
    setXIsPelunasan(pIsPelunasan);
    await getDetailKas(pIdTrans, pIsPelunasan, pKode);
  }

  useEffect(() => {
    let isPelunasan = false;
    let idtrans = "";
    let kode = "";
    if (location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
      let dataTransaksi = location.state.dataTransaksi as ListKasKeuanganModel;
      idtrans = dataTransaksi.idtrans ?? "";
      isPelunasan = dataTransaksi.jenistrans == "PELUNASAN HUTANG";
      kode = dataTransaksi.kodetrans ?? "";
      setXTransaksi(dataTransaksi);
    }
    initState(idtrans, isPelunasan, kode);
  }, [])

  async function getDetailKas(pIdTrans: string, pIsPelunasan: boolean, pKode: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      let url = "umkm/ApiKasPelunasan/loadDataKas";
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      if (pIsPelunasan) {
        url = "umkm/ApiKasPelunasan/LoadDataPelunasanHutang";
        form.append("idpelunasan", pIdTrans);
        form.append("kodepelunasan", pKode);
      } else {
        form.append("idkas", pIdTrans);
      }
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data;
            setXDetailKas({
              header: responseData.header as HeaderKasModel,
              detailHutang: (pIsPelunasan ? responseData.detail : []) as DetailHutangModel[],
              detailPerkiraan: (pIsPelunasan ? responseData.detail_perkiraan : responseData.detail) as DetailPerkiraanModel[],
            });
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
    <BottomSheetDetailPelunasanHutangKas
      hutang={xSelectedHutang}
      onClose={(value) => setxShowDetailHutang(value)}
      open={xShowDetailHutang}
    />
    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={"Detail Keuangan"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listKeuangan)}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      <DetailDivStandard widthTitle={null} title={"Jenis Transaksi"} subtitle={xTransaksi.jenistrans ?? ""} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Kode Transaksi"} subtitle={xTransaksi.kodetrans} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Tanggal Transaksi"} subtitle={moment( xTransaksi.tgltrans).format("DD MMM YYYY")} verticalAlign={null} />
      {xIsPelunasan && <DetailDivStandard widthTitle={null} title={"Supplier"} subtitle={xTransaksi.namasupplier} verticalAlign={null} />}
      <DetailDivStandard widthTitle={null} title={"Kas Bank"} subtitle={`${xTransaksi.kodeperkiraan} - ${xTransaksi.namaperkiraan}`} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Catatan"} subtitle={xTransaksi.catatan} verticalAlign={null} />
      <DetailDivStandard widthTitle={null} title={"Jumlah"} subtitle={numberSeparatorFromString((xTransaksi.total ?? "0").split(".")[0])} verticalAlign={null} />
      {xIsPelunasan && <>
        <div className="mb-1"><p>List Hutang</p></div>
        <div className="border border-neutral-70 rounded-lg w-full p-2 mb-2" >
          {(xDetailKas?.detailHutang ?? []).map((pElement, pIndex) => {
            let totalPelunasan= (pElement.grandtotal ?? 0.0)- parseFloat(pElement.sisa ?? "0");
            return <div key={`itemJual${pIndex}`} className={`${pIndex > 0 && " border-t border-neutral-70 pt-2 mt-2"}`}>
              <div className="flex justify-between content-normal text-14px">
                <div  className="w-full">
                  <div className="flex">
                    <p className="font-semibold flex w-full">{CalendarAltOSVG(18, ListColor.main.Pressed)} {moment(pElement.tgltrans).format("DD MMM YYYY")} </p>
                    <button className=' py-1 px-2 rounded-full bg-main-Main text-white' onClick={() => { setxShowDetailHutang(true); setxSelectedHutang(pElement) }}>Detail</button>
                  </div>
                  <p className="text-left flex min-w-24 gap-1 text-12px font-normal">{PinSVG(18, ListColor.main.Pressed)} {pElement.namalokasi}</p>
                  <p className="text-left flex min-w-24 gap-1 text-14px py-1.5 font-bold">Pelunasan Hari Ini : Rp{numberSeparatorFromString((pElement.pelunasan ?? "0").toString().split(".")[0])}</p>
                  <div className="flex w-full gap-0.5">
                    <div className="w-full border-r border-neutral-70">
                      <div className="w-full">Piutang</div>
                      <div className="font-bold">Rp{numberSeparatorFromString((pElement.grandtotal ?? 0.0).toString().split(".")[0])}</div>
                    </div>
                    <div className="w-full  border-r  border-neutral-70 ">
                      <div className="w-full">Total Pelunasan</div>
                      <div className="font-bold">Rp{numberSeparatorFromString((totalPelunasan).toString().split(".")[0])}</div>
                    </div>
                    <div className="w-full">
                      <div className="w-full">Sisa</div>
                      <div className="font-bold">Rp{numberSeparatorFromString((pElement.sisa ?? "0").split(".")[0])}</div>
                    </div>
                  </div>

                </div>


              </div>
            </div>;
          })}
        </div>
      </>}
      <div className="mb-1"><p>List Perkiraan</p></div>
      <div className="border border-neutral-70 rounded-lg w-full p-2 mb-2" >
        {(xDetailKas?.detailPerkiraan ?? []).map((pElement, pIndex) => {
          return <div key={`itemJual${pIndex}`} className={`${pIndex > 0 && " border-t border-neutral-70 pt-2 mt-2"}`}>
            <div className=" text-14px flex justify-between">
              <div>
                <p className="font-semibold">{pElement.kodeperkiraan}-{pElement.namaperkiraan} </p>
                <p className="text-12px font-normal">({pElement.saldo})</p>
                <div className="text-12px" >{pElement.keterangan}</div>
              </div>
              <div className=" font-bold">Rp{numberSeparatorFromString((pElement.amount ?? "0").split(".")[0])}</div>
            </div>
          </div>
        })}
      </div>
    </div>
  </div>
}
export default DetailKeuanganPage;