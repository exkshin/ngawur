import { useLocation, useNavigate } from "react-router-dom";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { DataCustomerSOModel } from "../TransaksiJual/TambahTransaksiJual";
import { DataBarangModel, HitungBarangModel } from "../../classModels/barangModel";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import AXIOS from "../../Config/axiosRequest";
import globalVariables, { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import { NumericFormat } from "react-number-format";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { AlatBayarModel } from "../../classModels/alatBayarModel";
import { CheckboxSVG } from "../CustomWidget/checkboxCustom";
import ListColor from "../../Config/color";
import { AlatBayarWidget } from "../GlobalWidget/alatBayarWidget";
import { DetailBayar } from "../GlobalWidget/DetailBayar";
import { VerticalAlignType } from "../GlobalWidget/DetailDivStandard";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import { DetailSOModel } from "../../classModels/detailSOModel";
import { DetailJualModel } from "../../classModels/detailJualModel";

const BayarPenjualanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xIsSO, setxIsSO] = useState(false);
  const [xIsBayarSO, setXIsBayarSO] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingCustomer, setXIsLoadingCustomer] = useState(false);
  const [xTransaksi, setXTransaksi] = useState({} as TransaksiJualModel);
  const [xTotal, setXTotal] = useState(0);
  const [xFrom2, setXFrom2] = useState(PageRoutes.tambahTransaksiJual);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xItem, setItem] = useState([] as HitungBarangModel[]);
  const [xSelectedIndex, setXSelectedIndex] = useState(0);
  const [xUangMuka, setXUangMuka] = useState("0");
  const [xFrom, setXFrom] = useState(PageRoutes.tambahTransaksiJual);
  const [xDataCustomerSO, setXDataCustomerSO] = useState(null as DataCustomerSOModel | null);
  const [xAlatBayar, setXAlatBayar] = useState([] as AlatBayarModel[]);
  const [xDiskon, setXDiskon] = useState("0");
  const [xCheckedDiskon, setXCheckedDiskon] = useState(false);
  const [xJumlahBayar, setXJumlahBayar] = useState("0");
  const [xCheckedUangPas, setxCheckedUangPas] = useState(true);
  const [xPPN, setxPPN] = useState(0);
  const [xGrandTotal, setxGrandTotal] = useState(0);
  const [xSisaBayar, setxSisaBayar] = useState(0);
  const [xIdCustomer, setXIdCustomer] = useState("");
  const [xDetailSO, setXDetailSO] = useState({} as DetailSOModel);
  const [xDetailJual, setXDetailJual] = useState({} as DetailJualModel);
  const [xHasEditCustomer, setxHasEditCustomer] = useState(false);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xShowToastCheck, setXShowToastCheck] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
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
      let isBayarSO = false;
      let isSO=false;
      let total=0;
      let isedit=0;
      if (location.state.customer != undefined && location.state.customer != null) {
        setXDataCustomerSO(location.state.customer);
      }
      if (location.state.from != undefined && location.state.from != null) {
        setXFrom(location.state.from);
      }
      if (location.state.from2 != undefined && location.state.from2 != null) {
        setXFrom2(location.state.from2);
      }
      if (location.state.isSO != undefined && location.state.isSO != null) {
        setxIsSO(location.state.isSO);
        isSO=location.state.isSO;
      }
      if (location.state.isBayarSO != undefined && location.state.isBayarSO != null) {
        setXIsBayarSO(location.state.isBayarSO);
      }
      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        setxIsEdit(location.state.isEdit);
        isedit=location.state.isEdit;
      }
      if (location.state.items != undefined && location.state.items != null) {
        setItem(location.state.items as HitungBarangModel[]);
      }
      if (location.state.total != undefined && location.state.total != null) {
        setXTotal(location.state.total);
        hitungGrandTotal(location.state.total, 0);
        total=location.state.total;
      }
      if (location.state.isBayarSO != undefined && location.state.isBayarSO != null) {
        setXIsBayarSO(location.state.isBayarSO);
        isBayarSO = location.state.isBayarSO;
      }
      if (location.state.uangMuka != undefined && location.state.uangMuka != null) {
        setXUangMuka(location.state.uangMuka);
      }
      if (((location.state.isEdit ?? false) || (location.state.isBayarSO ?? false)) && location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTrans = location.state.dataTransaksi as TransaksiJualModel;
        setXTransaksi(dataTrans);
        setXIdCustomer(dataTrans.idcustomer ?? "")
      }
      if (location.state.dataDetailSO != undefined && location.state.dataDetailSO != null) {
        let detailso = location.state.dataDetailSO as DetailSOModel;
        setXDetailSO(detailso);
      }
      if (isedit&&!isSO&& location.state.dataDetailJual != undefined && location.state.dataDetailJual != null) {
        let detailJual = location.state.dataDetailJual as DetailJualModel;
        console.log(location.state.dataDetailJual);
        setXDetailJual(detailJual);
        let diskon = detailJual.header.discrp ?? "0";
        if (diskon !== "" && parseFloat(diskon) > 0) {
          setXCheckedDiskon(true);
          setXDiskon(diskon);
          hitungGrandTotal(total,parseInt(diskon.split(".")[0]));
        }
      }
      if (location.state.hasEditCustomerSO != undefined && location.state.hasEditCustomerSO != null) {
        setxHasEditCustomer(location.state.hasEditCustomerSO);
      }
      getAlatBayar();
    }
  }, [])

  function hitungGrandTotal(total: number, diskon: number) {
    let grandtotal = 0.0;
    let ppn = 0.0;
    let dpp = 0.0;
    let totalTemp = parseFloat((total - diskon).toString()) * parseFloat((xDataLogin.nilaikurs ?? "0"));
    if (xDataLogin.pakaippn == "TIDAK") {
      grandtotal = totalTemp;
      dpp = totalTemp;
    } else if (xDataLogin.pakaippn == "EXCL") {
      dpp = totalTemp;
      ppn = Math.floor(totalTemp * parseFloat(xDataLogin.ppnpersen ?? "0") / 100);
      grandtotal = totalTemp + ppn;
    } else if (xDataLogin.pakaippn == "INCL") {
      ppn = Math.floor(totalTemp * parseFloat(xDataLogin.ppnpersen ?? "0") / (100 + parseFloat((xDataLogin.ppnpersen ?? "0"))));
      dpp = totalTemp - ppn;
      grandtotal = totalTemp;
    }
    setxGrandTotal(grandtotal);
    setxPPN(ppn);
    // setxDPP(dpp);
  }

  async function getAlatBayar() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("status", "1");
      await AXIOS
        .post("api/Penjualan/ApiBayar/combogridAlatBayar", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            setXAlatBayar(data.rows as AlatBayarModel[])
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

  useEffect(() => {
    setXJumlahBayar("0");
    setxSisaBayar(0);
  }, [xSelectedIndex])

  const convertDataBarang = () => {
    let databarang = [] as any[];
    xItem.forEach((pItem, pIndex) => {
      let hargakurs = parseFloat((xDataLogin.nilaikurs ?? "0")) * parseFloat((pItem.data.hargajualmaxsatuan ?? "0"))
      let subtotalkurs = hargakurs * pItem.jumlahBarang;
      let ppn = 0.0;
      if (xDataLogin.pakaippn == "EXCL") {
        ppn = Math.floor(hargakurs * parseFloat(xDataLogin.ppnpersen ?? "0") / 100);
      } else if (xDataLogin.pakaippn == "INCL") {
        ppn = Math.floor(hargakurs * parseFloat(xDataLogin.ppnpersen ?? "0") / (100 + parseFloat((xDataLogin.ppnpersen ?? "0"))));
      }
      databarang.push({
        idbarang: pItem.data.idbarang ?? "",
        kodebarang: pItem.data.kodebarang ?? "",
        satuan: pItem.data.satuan ?? "",
        jmlso: pItem.jumlahBarang.toString(),
        jmlpenjualan: pItem.jumlahBarang.toString(),
        omnichannel: "0",
        idcurrency: xDataLogin.idcurrency ?? "0",
        harga: pItem.data.hargajualmaxsatuan ?? "0",
        discpersen: "0",
        disc: "0",
        disckurs: "0",
        subtotal: pItem.subtotal.toString(),
        nilaikurs: xDataLogin.nilaikurs,
        hargakurs: hargakurs,
        subtotalkurs: subtotalkurs,
        pakaippn: (xDataLogin.pakaippn ?? "").toUpperCase() == "INCL" ? "2" : (xDataLogin.pakaippn ?? "").toUpperCase() == "EXCL" ? "1" : "0",
        ppnpersen: xDataLogin.ppnpersen ?? "0",
        ppnrp: ppn,
        catatan: "",
      });
    })
    return databarang;
  }

  async function simpanDataSO(idCustomer: string) {
    setXIsLoading(true);
    try {
      let databarang = convertDataBarang();
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("mode", xIsEdit ? "ubah" : "tambah");
      form.append("idso", xIsEdit ? xTransaksi.idtrans ?? "" : "");
      form.append("kodeso", xIsEdit ? xTransaksi.kodetrans ?? "" : "");
      form.append("idlokasi", xDataLokasi.id??"");
      form.append("kodelokasi", xDataLokasi.kode??"");
      form.append("idcustomer", idCustomer);
      form.append("alamatkirim", xDataCustomerSO?.alamat ?? "");
      form.append("tglkirim", moment(xDataCustomerSO?.tanggal ?? new Date()).format("YYYY-MM-DD HH:mm:ss"));
      form.append("total", xTotal.toString());
      form.append("pembulatan", "0");
      form.append("grandtotal", xGrandTotal.toString());
      form.append("data_detail", JSON.stringify(databarang));
      form.append("discrp", xDiskon);
      form.append("discpersen", "");
      form.append("data_detail_pembayaran", JSON.stringify([{
        "amount": (xSelectedIndex == 0 && !xCheckedUangPas) ? xJumlahBayar : xIsBayarSO ? (xGrandTotal - parseInt(xUangMuka ?? "0")).toString() : xIsSO ? xUangMuka : xGrandTotal.toString(),
        "tglpembayaran": moment(new Date()).format("YYYY-MM-DD"),
      }]));
      form.append("amount", (xSelectedIndex == 0 && !xCheckedUangPas) ? xJumlahBayar : xIsBayarSO ? (xGrandTotal - parseInt(xUangMuka ?? "0")).toString() : xIsSO ? xUangMuka : xGrandTotal.toString());
      form.append("idalatbayar", xAlatBayar[xSelectedIndex].idalatbayar ?? "");
      form.append("namaalatbayar", xAlatBayar[xSelectedIndex].namaalatbayar ?? "");
      form.append("kembali", xSisaBayar.toString());
      form.append("catatan", `${xDataCustomerSO?.isDiambil ? "DIAMBIL" : "DIKIRIM"}\\${xDataCustomerSO?.catatan.toString()}`);

      let url="umkm/ApiSalesOrder/simpan";
      
      if(xIsEdit&&xTransaksi.tgltrans!=moment(new Date()).format("YYYY-MM-DD")){
        url="umkm/ApiSalesOrder/simpanDetail";
        form.append("tgltrans", xTransaksi.tgltrans??"");
      }else{
        form.append("tgltrans", moment(new Date()).format("YYYY-MM-DD"));
      }
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            navigate(PageRoutes.paymentSuccess, {
              state: {
                idtrans:data.id,
                isBayarSO:xIsBayarSO,
                isSO:xIsSO,
                isEdit:xIsEdit,
                linkFaktur:data.linkfaktur,
              }
            });
          } else {
            setSnackBar(data.errorMsg, true);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  async function simpanDataJual(idCustomer: string) {
    setXIsLoading(true);
    let bayar="";
    if(xSelectedIndex == 0 && !xCheckedUangPas){
      bayar=xJumlahBayar;
    }else if(xIsBayarSO){
      bayar=(xGrandTotal - parseInt(xUangMuka ?? "0")).toString();
    }else if(xIsSO){
      bayar=(xGrandTotal - parseInt(xUangMuka ?? "0")).toString();
    }else{
      bayar=xGrandTotal.toString();
    }
    try {
      let databarang = convertDataBarang();
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("mode", xIsEdit ? "ubah" : "tambah");
      form.append("idso", xIsBayarSO ? xDetailSO.header.idso ?? "" : "");
      form.append("kodeso", xIsBayarSO ? xDetailSO.header.kodeso ?? "" : "");
      form.append("idjual", xIsEdit ? xDetailJual.header.idjual ?? "" : "");
      form.append("kodejual", xIsEdit ? xDetailJual.header.kodejual ?? "" : "");
      form.append("tglso", xIsBayarSO ? moment(xDetailSO.header.tgltrans ?? new Date()).format("YYYY-MM-DD") : "");
      form.append("idlokasi", xDataLokasi.id??"");
      form.append("kodelokasi", xDataLokasi.kode??"");
      form.append("idcustomer", idCustomer);
      form.append("tgltrans", xIsEdit?xDetailJual.header.tgltrans ??moment(new Date()).format("YYYY-MM-DD"): moment(new Date()).format("YYYY-MM-DD"));
      form.append("jenis_simpan", "simpan_cetak");
      form.append("total", xTotal.toString());
      form.append("pembulatan", "0");
      form.append("grandtotal", xGrandTotal.toString());
      form.append("data_detail", JSON.stringify(databarang));
      form.append("discrp", xDiskon);
      form.append("discpersen", "");
      form.append("uangmuka", xUangMuka);
      form.append("ppnrp", xPPN.toString());
      // form.append("amount", (xSelectedIndex == 0 && !xCheckedUangPas) ? xJumlahBayar : xIsSO ? xUangMuka : xGrandTotal.toString());
      form.append("amount",bayar);

      form.append("idalatbayar", xAlatBayar[xSelectedIndex].idalatbayar ?? "");
      form.append("namaalatbayar", xAlatBayar[xSelectedIndex].namaalatbayar ?? "");
      form.append("kembali", xSisaBayar.toString());

      await AXIOS
        .post("api/Penjualan/ApiPenjualanLangsung/simpan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            navigate(PageRoutes.paymentSuccess, {
              state: {
                idtrans:data.id,
                isBayarSO:xIsBayarSO,
                isSO:xIsSO,
                isEdit:xIsEdit,
                linkFaktur:data.linkfaktur,
              }
            });
          } else {
            setSnackBar(data.errorMsg, true)
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  async function simpanDataCustomer() {
    setXIsLoadingCustomer(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("status", "1");
      form.append("idcustomer", xHasEditCustomer&&xIsEdit?(xDetailSO.header.idcustomer??""): "1");
      form.append("mode", xHasEditCustomer&&xIsEdit?"ubah": "tambah");
      form.append("kodecustomer", "");
      form.append("namacustomer", xDataCustomerSO?.nama ?? "");
      form.append("alamat", xDataCustomerSO?.alamat ?? "");
      form.append("kota", "");
      form.append("telp", xDataCustomerSO?.wa ?? "");
      form.append("namacustomer", xDataCustomerSO?.nama ?? "");
      form.append("kodetipecustomer", "TC001");
      await AXIOS
        .post("api/Master/ApiCustomer/simpan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let idcustomer = data.data.idcustomer;
            setXIdCustomer(idcustomer);
            simpanDataSO(idcustomer);
            setxHasEditCustomer(false);
          } else {
            throw ("error simpan data customer success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingCustomer(false);
  }
  async function getCustomerCash() {
    setXIsLoadingCustomer(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");

      await AXIOS
        .post("api/Master/ApiCustomer/getCustomerCash", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let idcustomer = data.data.idcustomer;
            setXIdCustomer(idcustomer);
            simpanDataJual(idcustomer);
          } else {
            throw ("error simpan data customer success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingCustomer(false);
  }

  const checkAllTransactionClosingByBarang = async () => {
    setXIsLoading(true);
    let check = false;
    let databarang = convertDataBarang();
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tanggal", moment().format("YYYY-MM-DD"));
      form.append("detail", JSON.stringify(databarang))

      await AXIOS
        .post("umkm/ApiClosingDate/cekSudahClosingByBarang", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            check = true;
          } else {
            setXShowToastCheck({ text: data.message, isToastError: true, show: true });
            check = false;
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
    return check;
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingCustomer} />
    <CustomPopupOpsi
          content={
            <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: xShowToastCheck.text }}>
            </div>
          }
          open={xShowToastCheck.show}
          zIndex={99}
          onClose={() => {
            setXShowToastCheck({
              text: "",
              show: false,
              isToastError: false
            })
          }}
        />
    {/* konfirmasi pembayaran  */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin data pembayaran sudah betul?</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={async () => {
        setXShowkonfirmasi(false);
        if (xIsBayarSO) {

          if (await checkAllTransactionClosingByBarang()){
          simpanDataJual(xDetailSO.header.idcustomer ?? "0");
          }
        } else if (xIsSO) {
          if (xIdCustomer != ""&&!(xHasEditCustomer&&xIsEdit)) {
            simpanDataSO(xIdCustomer);
          } else {
            simpanDataCustomer();
          }
        } else {
          if (await checkAllTransactionClosingByBarang()){
          getCustomerCash();
          }
        }
      }}
      onClose={() => { setXShowkonfirmasi(false); }}
      dismissible={false}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={"Pembayaran"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => {
        navigate(PageRoutes.ringkasanPenjualan, {
          state: {
            customer: xDataCustomerSO,
            items: xItem,
            isSO: xIsSO,
            isEdit: xIsEdit,
            isBayarSO: xIsBayarSO,
            from: xFrom2,
            uangMuka: xUangMuka,
            total: xTotal,
            dataTransaksi: xTransaksi,
            dataDetailSO:xDetailSO,
            dataDetailJual:xDetailJual,
          }
        })
      }}
    />
    <div className="min-h-16" />

    <div className="w-full px-4 mb-2 ">
      <div className="border py-1 px-2 rounded-lg border-neutral-70 w-full">
        <div className="flex justify-between text-14px font-bold">
          <div>Jenis Transaksi : {xIsBayarSO?"Bayar Nota Pesanan": xIsSO ? "Nota Pesanan" : "Jual Tunai"}</div>
        </div>
        <p className="text-14px font-bold">{xIsSO ? xDataCustomerSO?.nama : "Cash"}</p>
        {xIsSO||xIsBayarSO&&<p className="text-14px my-1">Uang Muka : {numberSeparatorFromString(xUangMuka)}</p>}
        {!xIsSO&&!xIsBayarSO&&<>
        <div className="flex mb-1 gap-1" onClick={() => { 
          setXCheckedDiskon(!xCheckedDiskon); 
          if(xCheckedDiskon) {
            setXDiskon("0");
            hitungGrandTotal(xTotal,0);
          } }}>
          <CheckboxSVG borderColor={ListColor.main.Main} checkColor={xCheckedDiskon ? ListColor.main.Main : "transparent"} backgroundColor={"white"} />
          <p className="text-14px ">Diskon </p>
        </div>
        <NumericFormat
          className={`inset-y-0 h-10 ${defaultInputCSS(
            true,
            false,
            false
          )} mb-2`}
          thousandSeparator="."
          decimalSeparator=","
          disabled={!xCheckedDiskon}
          decimalScale={0}
          thousandsGroupStyle="thousand"
          value={xDiskon}
          isAllowed={(values) => {
            let jumlah = values.floatValue ?? 0;
            return jumlah >= 0;
          }}
          allowLeadingZeros={false}
          onChange={(e) => {
            let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
              setXDiskon((jumlah).toString());
              hitungGrandTotal(xTotal,jumlah);
          }}
        />
        </>
        }
      </div>
      <div className="border-b border-t my-2 py-1 px-2 border-neutral-70 w-full">
        <div className="w-full text-h5 font-bold text-center">
          Tunai
        </div>
        <div className="flex mb-2 gap-1" onClick={() => { setxCheckedUangPas(true); setXSelectedIndex(0); }}>
          <CheckboxSVG borderColor={ListColor.main.Main} checkColor={xCheckedUangPas && xSelectedIndex == 0 ? ListColor.main.Main : "transparent"} backgroundColor={"white"} />
          <p className="text-14px ">Uang Pas </p>
        </div>
        <div className="flex mb-1 gap-1" onClick={() => { setxCheckedUangPas(false); setXSelectedIndex(0); }}>
          <CheckboxSVG borderColor={ListColor.main.Main} checkColor={!xCheckedUangPas && xSelectedIndex == 0 ? ListColor.main.Main : "transparent"} backgroundColor={"white"} />
          <p className="text-14px ">Jumlah Uang </p>
        </div>
        <NumericFormat
          className={`inset-y-0 h-10 ${defaultInputCSS(
            true,
            false,
            false
          )} mb-2`}
          thousandSeparator="."
          decimalSeparator=","
          disabled={!(!xCheckedUangPas && xSelectedIndex == 0)}
          decimalScale={0}
          thousandsGroupStyle="thousand"
          value={xJumlahBayar}
          isAllowed={(values) => {
            let jumlah = values.floatValue ?? 0;
            return jumlah >= 0;
          }}
          allowLeadingZeros={false}
          onChange={(e) => {
            let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
            let biaya = xIsSO ? parseInt(xUangMuka) : xGrandTotal;
            if (jumlah >= 0) {
              setXJumlahBayar((jumlah).toString());
              let sisa = jumlah - biaya;
              setxSisaBayar(sisa > 0 ? sisa : 0);
            }
          }}
        />
      </div>
      {xAlatBayar.length > 0 &&
        <div>
          <div className=" my-2 py-1 px-2 w-full">
            <div className="w-full text-h5 font-bold text-center">
              Alat Bayar
            </div>
          </div>
          <div className="flex-wrap flex justify-between w-full">
            {xAlatBayar.map((pAlatBayar, pIndex) => {
              if (pIndex == 0) {
                return <></>
              }
              return <AlatBayarWidget
                key={`alatbayar${pIndex}`}
                checked={xSelectedIndex == pIndex}
                dataAlatBayar={pAlatBayar}
                onClick={() => setXSelectedIndex(pIndex)}
              />
            })}
          </div>
        </div>
      }

      <div className="h-56" />
    </div>
    <div className="w-full max-h-56 px-4 py-2.5 fixed bottom-0 bg-white shadow-outline-up justify-between">
      <DetailBayar title="Total" classname="text-14px" subtitle={numberSeparator(xTotal)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      <DetailBayar title="Diskon" classname="text-14px" subtitle={numberSeparatorFromString(xDiskon)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      {/* <DetailBayar title="DPP" classname="text-12px" subtitle={numberSeparator(xDPP)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      <DetailBayar title={`PPN (${xDataLogin.pakaippn})`} classname="text-12px mb-1" subtitle={numberSeparator(xPPN)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} /> */}
      <DetailBayar title={`Grand Total`} classname="text-14px" subtitle={numberSeparator(xGrandTotal)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      {xIsSO && <DetailBayar title={`Uang Muka`} classname="text-14px" subtitle={numberSeparatorFromString(xUangMuka)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />}
      {xIsBayarSO&&<DetailBayar title={`Kurang Bayar`} classname="text-14px" subtitle={numberSeparatorFromString((xGrandTotal-parseInt(xUangMuka)).toString())} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />}
      <DetailBayar title={`Pembayaran`} classname="text-14px" subtitle={numberSeparatorFromString((xSelectedIndex == 0 && !xCheckedUangPas) ? xJumlahBayar : xIsBayarSO ? (xGrandTotal - parseInt(xUangMuka ?? "0")).toString() : xIsSO ? xUangMuka : xGrandTotal.toString())} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      <DetailBayar title={`Kembalian`} classname="text-14px mb-1" subtitle={numberSeparator(xSisaBayar)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
      <div
        className={`w-full shadow-md rounded-xl py-2 px-5 text-center text-16px font-bold text-neutral-10 bg-main-Main `}
        onClick={() => {
          let biaya =xIsBayarSO?(xGrandTotal- parseInt(xUangMuka)) : xIsSO ? parseInt(xUangMuka) : xGrandTotal;
          let jumlahbayar = biaya;
          if ((xSelectedIndex == 0 && !xCheckedUangPas)) {
            jumlahbayar = parseInt(xJumlahBayar);
          }
          if (jumlahbayar >= biaya) {
            setXShowkonfirmasi(true);
          } else {
            setSnackBar(xIsSO ? "Pembayaran kurang dari uang muka" : "Pembayaran kurang dari grand total", true);
          }
        }}
      >
        Simpan Transaksi
      </div>
    </div>
  </div>;
}

export default BayarPenjualanPage
