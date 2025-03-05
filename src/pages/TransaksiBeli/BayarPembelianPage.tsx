import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { HitungBarangModel } from "../../classModels/barangModel";
import { DetailBeliModel } from "../../classModels/detailBeliModel";
import { SupplierModel } from "../../classModels/supplierModel";
import { PageRoutes } from "../../PageRoutes";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { BottomButton } from "../CustomWidget/bottomButton";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { DetailBayar } from "../GlobalWidget/DetailBayar";
import globalVariables, { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import { VerticalAlignType } from "../GlobalWidget/DetailDivStandard";
import { CustomPopup } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import moment from "moment";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";

const BayarPembelianPage = () => {
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const location = useLocation();
  const navigate = useNavigate();
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  const [xDetailBeli, setXDetailBeli] = useState({} as DetailBeliModel);
  const [xItem, setXItem] = useState([] as HitungBarangModel[]);
  const [xKodeTransaksi, setXKodeTransaksi] = useState("");
  const [xTotal, setXTotal] = useState(0);
  const [xTransaksi, setXTransaksi] = useState(null as TransaksiBeliModel | null);
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xFrom, setXFrom] = useState(PageRoutes.ringkasanTransaksiBeli);
  const [xFrom2, setXFrom2] = useState(PageRoutes.ringkasanTransaksiBeli); const [xDPP, setxDPP] = useState(0);
  const [xPPN, setxPPN] = useState(0);
  const [xGrandTotal, setxGrandTotal] = useState(0);
  const [xTglJatuhTempo, setXTglJatuhTempo] = useState(moment(new Date()).add(parseInt(xSelectedSupplier?.selisihharibayar ?? "0".split(",")[0]), "days"));
  const [xCatatan, setXCatatan] = useState("");
  const [xLinkFoto, setXLinkFoto] = useState("");
  const [xFileFoto, setXFileFoto] = useState<File | null | undefined>(null);
  const [xErrorNoInvoiceSupplier, setXErrorNoInvoiceSupplier] = useState(false);
  const [xNoInvoiceSupplier, setxNoInvoiceSupplier] = useState("");
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
      if (location.state.supplier != undefined && location.state.supplier != null) {
        setXSelectedSupplier(location.state.supplier);
      }
      if (location.state.from != undefined && location.state.from != null) {
        setXFrom(location.state.from);
      }

      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        setxIsEdit(location.state.isEdit);
      }
      if (location.state.items != undefined && location.state.items != null) {
        setXItem(location.state.items as HitungBarangModel[]);
      }
      if (location.state.total != undefined && location.state.total != null) {
        setXTotal(location.state.total);
        hitungGrandTotal(location.state.total, 0)
      }
      if ((location.state.isEdit ?? false) && location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi = location.state.dataTransaksi as TransaksiBeliModel
        setXTransaksi(dataTransaksi);
      }
      if ((location.state.isEdit ?? false) && location.state.detailTransaksiBeli != null && location.state.detailTransaksiJual != undefined) {
        let detailBeli = location.state.detailTransaksiJual as DetailBeliModel;
        setXDetailBeli(detailBeli);
        setXKodeTransaksi(detailBeli.header.kodebeli ?? "");
      }
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
    setxDPP(dpp);
  }
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

  async function simpanDataBeli() {
    setXIsLoading(true);
    try {
      let databarang = convertDataBarang();
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("mode", xIsEdit ? "ubah" : "tambah");
      form.append("idbeli", xTransaksi?.idtrans ?? "");
      form.append("kodebeli", xTransaksi?.kodetrans ?? "");
      form.append("tgljatuhtempo", xTglJatuhTempo.format("YYYY-MM-DD"));
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("kodelokasi", xDataLokasi.kode ?? "");
      form.append("idSupplier", xSelectedSupplier?.idsupplier ?? "");
      form.append("tgltrans", moment(new Date()).format("YYYY-MM-DD"));
      form.append("total", xTotal.toString());
      form.append("pembulatan", "0");
      form.append("grandtotal", xGrandTotal.toString());
      form.append("data_detail", JSON.stringify(databarang));
      form.append("catatan", xCatatan);
      form.append("noinvoicesupplier", xNoInvoiceSupplier);
      form.append("ppnrp", xPPN.toString());
      form.append("gambar", "");
      form.append("filegambar", xFileFoto ?? "");

      await AXIOS
        .post("api/Penjualan/ApiPenjualanLangsung/simpan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            navigate(PageRoutes.paymentSuccess, {
              state: {
                idtrans: data.id,
                isBeli: true,
                isEdit: xIsEdit,
              }
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

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin data transaksi sudah betul?</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
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
      title={"Simpan Pembelian"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => {
        navigate(PageRoutes.ringkasanPenjualan, {
          state: {
            items: xItem,
            isEdit: xIsEdit,
            from: xFrom2,
            total: xTotal,
            dataTransaksi: xTransaksi,
          }
        })
      }}
    />
    <div className="min-h-16" />
    <DetailBayar title="Supplier" subtitle={xSelectedSupplier == null ? "" : xSelectedSupplier?.namasupplier ?? ""} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
    <DetailBayar title="Total" subtitle={numberSeparator(xTotal)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
    <DetailBayar title="DPP" subtitle={numberSeparator(xDPP)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
    <DetailBayar title={`PPN (${xDataLogin.pakaippn})`} subtitle={numberSeparator(xPPN)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
    <DetailBayar title={`Grand Total`} subtitle={numberSeparator(xGrandTotal)} widthTitle={null} verticalAlign={VerticalAlignType.VerticalCenter} />
    <div className=" mb-2.5">
      <div className="font-semibold text-14px text-left mb-2.5">No Invoice Supplier*</div>
      <div className="relative w-full mt-2.5">
        <input
          onChange={(e) => {
            setxNoInvoiceSupplier(e.target.value);
          }}
          placeholder={""}
          value={xNoInvoiceSupplier}
          type={"text"}
          className={`${defaultInputCSS((xNoInvoiceSupplier !== "" && xNoInvoiceSupplier !== undefined), xErrorNoInvoiceSupplier, false)}`}
        />
      </div>
      {xErrorNoInvoiceSupplier && <div className="text-12px text-danger-Main text-left">No Invoice supplier wajib diisi</div>}
    </div>
    <div className="h-16" />
    <BottomButton onClick={() => {
      setXShowkonfirmasi(true);
    }} text={"Simpan"} />
  </div>
}
export default BayarPembelianPage;