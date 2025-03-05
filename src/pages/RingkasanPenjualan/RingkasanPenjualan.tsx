import { useEffect, useState } from "react";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { useLocation, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import moment from "moment";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { NumericFormat } from "react-number-format";
import { SelectedRadioButtonSVG } from "../../assets/icon/SVGTSX/SelectedRadioButtonSVG";
import { UnselectedRadioButtonSVG } from "../../assets/icon/SVGTSX/UnselectedRadioButtonSVG";
import ListColor from "../../Config/color";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import globalVariables, { numberSeparator } from "../../Config/globalVariables";
import { TrashAltSVG } from "../../assets/icon/SVGTSX/TrashAltSVG";
import { BottomNavbarJual } from "../GlobalWidget/bottomNavbarJual";
import { CardBarangTransaksiJual } from "../GlobalWidget/cardBarangTransaksiJual";
import { EditSVG } from "../../assets/icon/SVGTSX/EditSVG";
import { DataCustomerSOModel } from "../TransaksiJual/TambahTransaksiJual";
import { DataBarangModel, HitungBarangModel } from "../../classModels/barangModel";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";

import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { DetailSOModel } from "../../classModels/detailSOModel";
import { DetailJualModel } from "../../classModels/detailJualModel";

const RingkasanPenjualan = () => {
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xShowFormSO, setxShowFormSO] = useState(false);
  const navigate = useNavigate();
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xIsSO, setxIsSO] = useState(false);
  const location = useLocation();
  const [xTransaksi, setXTransaksi] = useState({}as TransaksiJualModel);
  const [xNamaCustomer, setXNamaCustomer] = useState("");
  const [xWA, setXWA] = useState("");
  const [xAlamat, setXAlamat] = useState("");
  const [xTanggalKirim, setXTanggalKirim] = useState(moment(new Date()));
  const [xIsDiambil, setXIsDiambil] = useState(true);
  const [xCatatan, setXCatatan] = useState("");
  const [xErrorNamaCustomer, setXerrorNamaCustomer] = useState(false);
  const [xErrorWA, setXerrorWA] = useState(false);
  const [xErrorAlamat, setXerrorAlamat] = useState(false);
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xModeCustomerAdd, setxModeCustomerAdd] = useState(false);
  const [xKodeTransaksi, setXKodeTransaksi] = useState("");
  const [xTotal, setXTotal] = useState(0);
  const [xShowUbahBarang, setXShowUbahBarang] = useState(false);
  const [xShowUangMuka, setxShowUangMuka] = useState(false);
  const [xShowDelete, setXshowDelete] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xItem, setXItem] = useState([] as HitungBarangModel[]);
  const [xSelectedIndex, setXSelectedIndex] = useState(0);
  const [xUangMuka, setXUangMuka] = useState("0");
  const [xErrorTanggal, setXErrorTanggal] = useState(false);
  const [xJumlahBarangTemp, setXJumlahBarangTemp] = useState("0");
  const [xPageReady, setXPageReady] = useState(false);
  const [xFrom, setXFrom] = useState(PageRoutes.tambahTransaksiJual);
  const [xDataCustomerSO, setXDataCustomerSO] = useState(null as DataCustomerSOModel | null);
  const [xIsBayarSO, setXIsBayarSO] = useState(false);
  const [xDetailSO,setXDetailSO]=useState({}as DetailSOModel);
  const [xDetailJual,setXDetailJual]=useState({}as DetailJualModel);
  const [xHasEditCustomer, setxHasEditCustomer] = useState(false);
  const [xDisableUangMuka,setXDisableUangMuka]=useState(false);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xSearch, setXSearch] = useState("");

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

  function validasiFormCustomer() {
    setXerrorNamaCustomer(xNamaCustomer == "");
    setXerrorAlamat(xAlamat == "");
    setXerrorWA(xWA == "");
    if (!(xNamaCustomer == "" || xAlamat == "" || xWA == "")) {
      setxShowFormSO(false);
      setXDataCustomerSO({
        alamat: xAlamat,
        catatan: xCatatan,
        isDiambil: xIsDiambil,
        nama: xNamaCustomer,
        wa: xWA,
        tanggal: xTanggalKirim.format("YYYY MM DD HH:mm"),
      });
    }
  }

  useEffect(() => {
    let isSO=false;
    if (location.state != undefined && location.state != null) {
      if (location.state.customer != undefined && location.state.customer != null) {
        setXDataCustomerSO(location.state.customer);
      }
      if (location.state.from != undefined && location.state.from != null) {
        setXFrom(location.state.from);
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
      }
      if (location.state.items != undefined && location.state.items != null) {
        setXItem(location.state.items as HitungBarangModel[]);
      }
      if (location.state.total != undefined && location.state.total != null) {
        setXTotal(location.state.total);
      }
      if (location.state.hasEditCustomerSO != undefined && location.state.hasEditCustomerSO != null) {
        setxHasEditCustomer(location.state.hasEditCustomerSO);
      }
      if (((location.state.isEdit ?? false)|| (location.state.isBayarSO??false))&& location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi=location.state.dataTransaksi as TransaksiJualModel
        setXTransaksi(dataTransaksi);
        if(location.state.isBayarSO??false){
          getDetailSO(dataTransaksi.idtrans??"0");
        }
        if(dataTransaksi.tgltrans!=moment(new Date()).format("YYYY-MM-DD")){
          setXDisableUangMuka(true);
        }
      }
      if((location.state.isEdit??false)&&!isSO&&location.state.detailTransaksiJual!=null&&location.state.detailTransaksiJual!=undefined){
        let detailJual=location.state.detailTransaksiJual as DetailJualModel;
        setXDetailJual(detailJual);
        setXKodeTransaksi(detailJual.header.kodejual??"");
      }
      if((location.state.isEdit??false)&&isSO&&location.state.detailTransaksiSO!=null&&location.state.detailTransaksiSO!=undefined){
        let detailSO=location.state.detailTransaksiSO as DetailSOModel;
        setXDetailSO(location.state.detailTransaksiSO);
        setXKodeTransaksi(detailSO.header.kodeso??"");
        setXUangMuka((detailSO.pembayaran.amount??"0").split(".")[0]);
      }
      if(location.state.dataDetailJual != undefined && location.state.dataDetailJual != null){
        setXDetailJual(location.state.dataDetailJual);
      }
      setXPageReady(true);
    }
  }, [])

  useEffect(() => {
    if (xShowFormSO && xDataCustomerSO != null) {
      setXNamaCustomer(xDataCustomerSO?.nama);
      setXWA(xDataCustomerSO.wa);
      setXIsDiambil(xDataCustomerSO.isDiambil);
      setXAlamat(xDataCustomerSO.alamat);
      setXCatatan(xDataCustomerSO.catatan);
      setXTanggalKirim(moment(new Date(xDataCustomerSO.tanggal)))
      setXerrorAlamat(false);
      setXerrorNamaCustomer(false);
      setXerrorWA(false);
      setXErrorTanggal(false)
    }
  }, [xShowFormSO])

  async function getDetailSO(idSO:string){
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
            let responseData=data.data as DetailSOModel;
            let listcatatan=(responseData.header.catatan??"DIAMBIL\\").split('\\');
            let catatan=listcatatan.length>1?listcatatan[1]:"";
            let isDiambil=listcatatan[0]=="DIAMBIL";
            let dataCustomer={
              alamat:responseData.header.alamatkirim,
              catatan:catatan,
              isDiambil:isDiambil,
              nama:responseData.header.namacustomer,
              tanggal:responseData.header.tglkirim,
              wa:responseData.header.telp,
            }as DataCustomerSOModel;
            setXDataCustomerSO(dataCustomer);
            let item=[]as HitungBarangModel[];
            responseData.detail.forEach((pItem,pIndex)=>{
              item.push({
                data:{
                  gambar: "",
                  hargajualmaxsatuan: pItem.harga,
                  idbarang: pItem.idbarang,
                  satuan: pItem.satuan,
                  namabarang: pItem.namabarang,
                  kodebarang: pItem.kodebarang,
                  idsupplier: "",
                  namasupplier: "",
                  satuan2: "",
                  satuan3: "",
                  hargajualminsatuan: "",
                  hargajualminsatuan2: "",
                  hargajualmaxsatuan2: "",
                  hargajualminsatuan3: "",
                  hargajualmaxsatuan3: "",
                  hargabeli:"",
                },
                idbarang:pItem.idbarang,
                jumlahBarang:parseInt(( pItem.jml??"0").split(".")[0]),
                subtotal:parseInt((pItem.subtotal??"0").split(".")[0]),
              });
            })
            setXItem(item);
            setXTotal(parseInt((responseData.header.total??"0").split(".")[0]));
            setXDetailSO(responseData);
            setXUangMuka((responseData.pembayaran.amount??"0").split(".")[0]);
            
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

  function goBack() {
    navigate(xFrom, {
      state: {
        customer: xDataCustomerSO,
        items: xItem,
        dataTransaksi: xTransaksi,
        mode: xIsEdit ? "edit" : "add",
        type: xIsSO ? "SO" : "jual",
        from: PageRoutes.ringkasanPenjualan,
        total: xTotal,
        hasEditCustomerSO:xHasEditCustomer,
      }
    })
  }

  useEffect(() => {
    if (xItem.length <= 0 && xPageReady) goBack();
  }, [xItem])


  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => { setXOpenDatePicker(value) }}
      useTimeWidget={true}
      zIndex={60}
      minDate={new Date()}
      onChange={(value) => {
        setXTanggalKirim(moment(value));
      }}
    />
    <PopupLoading key="loading" open={xIsLoading} />
    {/* form customer so */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Data Customer</div>
        <div className=" mb-2.5">
          <div className="font-semibold text-sm text-left mb-2.5">Apakah diantar / diambil?</div>
          <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => { setXIsDiambil(false); }}>
            {!xIsDiambil ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Diantar
          </div>
          <div className="relative w-full mt-2.5 text-14px text-left flex items-center gap-2" onClick={() => setXIsDiambil(true)}>
            {xIsDiambil ? SelectedRadioButtonSVG(20, ListColor.main.Main) : UnselectedRadioButtonSVG(20, ListColor.main.Main)} Diambil
          </div>
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Nama Customer *</div>
          <div className="relative w-full mt-2.5">
            <input
              onChange={(e) => {
                setXNamaCustomer(e.target.value);
              }}
              placeholder={""}
              value={xNamaCustomer}
              type={"text"}
              className={`${defaultInputCSS((xNamaCustomer !== "" && xNamaCustomer !== undefined), xErrorNamaCustomer, false)}`}
            />
          </div>
          {xErrorNamaCustomer && <div className="text-12px text-danger-Main text-left">Nama customer wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">No WA *</div>
          <div className="relative w-full mt-2.5">
            <NumericFormat
              onChange={(e) => {
                setXWA(e.target.value);
              }}
              decimalScale={0}
              placeholder={""}
              value={xWA}
              type={"tel"}
              className={`${defaultInputCSS((xWA !== "" && xWA !== undefined), xErrorWA, false)}`}
            />
          </div>
          {xErrorWA && <div className="text-12px text-danger-Main text-left">No WA wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Alamat Kirim / Customer *</div>
          <div className="relative w-full mt-2.5">
            <input
              onChange={(e) => {
                setXAlamat(e.target.value);
              }}
              placeholder={""}
              value={xAlamat}
              type={"text"}
              className={`${defaultInputCSS((xAlamat !== "" && xAlamat !== undefined), xErrorAlamat, false)}`}
            />
          </div>
          {xErrorAlamat && <div className="text-12px text-danger-Main text-left">Alamat kirim / customer wajib diisi</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Tanggal Ambil / Kirim *</div>
          <div className="relative w-full mt-2.5">
            <input
              onClick={(e) => {
                setXOpenDatePicker(true);
              }}
              value={xTanggalKirim.format("DD MMM YYYY HH:mm")}
              readOnly={true}
              type={"text"}
              className={`${defaultInputCSS(true, xErrorTanggal, true)}`}
            />
          </div>
          {xErrorTanggal && <div className="text-12px text-danger-Main text-left">Tanggal ambil / kirim wajib melebihi tanggal & jam saat ini</div>}
        </div>
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Catatan</div>
          <div className="relative w-full mt-2.5">
            <textarea
              onChange={(e) => {
                setXCatatan(e.target.value);
              }}
              placeholder={""}
              value={xCatatan}
              className={`${defaultInputCSS((xCatatan !== "" && xCatatan !== undefined), false, false)}`}
            />
          </div>
        </div>
      </div>}
      functionButtonRight={() => {
        setxShowFormSO(false);
      }}
      functionButtonLeft={() => {
        validasiFormCustomer();
      }}
      onClose={() => { setxShowFormSO(false); }}
      dismissible={false}
      open={xShowFormSO}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={81}
    />
    {/* form uang muka  */}
    <CustomPopup
      content={<div className="">
        <div className=" mb-2.5">
          <div className="font-semibold text-14px text-left mb-2.5">Uang Muka</div>
          <div className="relative w-full mt-2.5">
            <NumericFormat
              onChange={(e) => {
                let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
                if (jumlah >= 0) {
                  setXUangMuka((jumlah).toString());
                }
              }}
              disabled={xDisableUangMuka}
              placeholder={""}
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={0}
              allowLeadingZeros={false}
              thousandsGroupStyle="thousand"
              value={xUangMuka}
              type={"text"}
              isAllowed={(values) => {
                let jumlah = values.floatValue ?? 0;
                return jumlah >= 0;
              }}
              className={`${defaultInputCSS(true, false, false)}`}
            />
          </div>
          {parseInt(xUangMuka.replaceAll(".",""))>xTotal && <div className="text-12px text-danger-Main text-left">Uang Muka Tidak Bisa Melebihi Harga Total</div>}
        </div>
      </div>}
      functionButtonRight={() => {
        setxShowUangMuka(false);
      }}
      functionButtonLeft={() => {
        if(parseInt(xUangMuka.replaceAll(".",""))>xTotal)return
        setXShowkonfirmasi(true);
        setxShowUangMuka(false);
      }}
      onClose={() => { setxShowUangMuka(false); }}
      dismissible={false}
      open={xShowUangMuka}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={81}
    />
    {/* form ubah data  */}
    <CustomPopup
      content={<div className="w-full justify-items-center">
        <div className="font-semibold text-center text-16px mb-2.5">Ubah Data Barang</div>
        {xItem.length > 0 && xItem.length > xSelectedIndex &&
          <CardBarangTransaksiJual
            classname="w-full sm:max-w-[70$dvw] md:max-w-[50$dvw]"
            onChangeJumlah={(pJumlah) => {
              setXJumlahBarangTemp(pJumlah);
            }}
            dataBarang={xItem[xSelectedIndex].data}
            initialJumlah={xItem[xSelectedIndex].jumlahBarang.toString()}
          />}
      </div>}
      functionButtonRight={() => {
        setXShowUbahBarang(false);
      }}
      functionButtonLeft={() => {
        setXShowUbahBarang(false);
        let jumlahBarang = xJumlahBarangTemp == "" ? 0 : parseInt(xJumlahBarangTemp);
        let cart = xItem;
        if (jumlahBarang > 0) {
          let subtotal = jumlahBarang * parseInt((xItem[xSelectedIndex].data.hargajualmaxsatuan ?? "0").split(".")[0]);

          cart[xSelectedIndex].jumlahBarang = jumlahBarang;
          cart[xSelectedIndex].subtotal = subtotal;
          let total = 0;
          cart.forEach((pCart) => {
            total += pCart.subtotal;
          });
          setXTotal(total);
          setXItem(cart);
        } else {
          let cartTemp = [] as HitungBarangModel[];
          cart.forEach((pValue, pIndexCart) => {
            if (pIndexCart != xSelectedIndex) {
              cartTemp.push(pValue);
            }
          })

          let total = 0;
          cartTemp.forEach((pCart) => {
            total += pCart.subtotal;
          });
          setXTotal(total);
          setXItem(cartTemp);
        }
      }}
      onClose={() => { setXShowUbahBarang(false); }}
      dismissible={false}
      open={xShowUbahBarang}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={81}
    />
    {/* konfirmasi delete  */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin mau menghapus {xItem.length>0&&xItem.length-1>xSelectedIndex&&xItem[xSelectedIndex].data.namabarang}?</div>
      </div>}
      functionButtonRight={() => {
        setXshowDelete(false);
      }}
      functionButtonLeft={() => {
        setXshowDelete(false);

        let cartTemp = [] as HitungBarangModel[];
        xItem.forEach((pValue, pIndexCart) => {
          if (pIndexCart != xSelectedIndex) {
            cartTemp.push(pValue);
          }
        })

        let total = 0;
        cartTemp.forEach((pCart) => {
          total += pCart.subtotal;
        });
        setXTotal(total);
        setXItem(cartTemp);
      }}
      onClose={() => { setXshowDelete(false); }}
      dismissible={true}
      open={xShowDelete}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {/* konfirmasi bayar penjualan  */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin pesanan yang dimasukkan sudah betul?</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
        navigate(PageRoutes.bayarPenjualan, {
          state: {
            customer: xDataCustomerSO,
            items: xItem,
            isSO: xIsSO,
            isBayarSO:xIsBayarSO,
            from: PageRoutes.ringkasanPenjualan,
            uangMuka: xUangMuka,
            from2: xFrom,
            total: xTotal,
            isEdit:xIsEdit,
            dataTransaksi:xTransaksi,
            dataDetailSO:xDetailSO,
            dataDetailJual:xDetailJual,
            hasEditCustomerSO:xHasEditCustomer,
          }
        })
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
      title={"Ringkasan Transaksi"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => {
        goBack();
      }}
    />
    <div className="min-h-16" />

    <div className="w-full px-4 mb-2 ">
      <div className="border py-1 px-2 rounded-lg border-neutral-70 w-full">
        <div className="flex justify-between text-14px font-bold">
          <div>Jenis Transaksi : {xIsBayarSO?"Bayar Nota Pesanan": xIsSO ? "Nota Pesanan" : "Jual Tunai"}</div>
          {/* {xIsSO && <div onClick={() => { setxShowFormSO(true) }}>
            {EditSVG(18, ListColor.main.Main)}
          </div>} */}
        </div>
        <p className="text-14px font-bold">{xIsSO ? xDataCustomerSO?.nama : "Cash"}</p>
        {xIsEdit && <p className="text-14px">Kode Transaksi : {xKodeTransaksi}</p>}
        {xIsSO && <>
          <p className="text-14px">No WA : {xDataCustomerSO?.wa}</p>
          <p className="text-14px">Alamat {xDataCustomerSO?.isDiambil ? "Customer" : "Kirim"} : {xDataCustomerSO?.alamat}</p>
          <p className="text-14px">Tanggal {xDataCustomerSO?.isDiambil ? "Ambil" : "Kirim"} : {moment(xDataCustomerSO?.tanggal).format("DD MMM YYYY HH:mm")}</p>
          <p className="text-14px">Catatan : {xDataCustomerSO?.catatan}</p>
        </>
        }
      </div>
    </div>
    <div className="w-full px-4">
      {xItem.map((pValue: HitungBarangModel, pIndex) => {
        let jumlahBarang = pValue.jumlahBarang;
        let hargaBarang = parseInt((pValue.data.hargajualmaxsatuan ?? "0").split(".")[0]);
        let totalHarga = jumlahBarang * hargaBarang;
        return (
          <div className="relative">
            {!xIsBayarSO &&
              <div className="absolute right-2 top-2" onClick={() => { setXSelectedIndex(pIndex); setXshowDelete(true); }}>{
                TrashAltSVG(20, ListColor.main.Main)}
              </div>
            }
            <div
              key={pIndex.toString()}
              className={`mb-2.5 py-2 px-2 bg-main-Surface rounded-lg ${pIndex == 0 ? "" : "mt-2.5"
                } text-neutral-100 w-full`}
              onClick={() => {
                // setXSelectedIndex(pIndex);
                // setXShowUbahBarang(true);
                // setXJumlahBarangTemp(jumlahBarang.toString())
              }}
            >
              <div className="flex w-full mb-2">
                <div className="text-16px font-bold w-full">{pValue.data.namabarang}</div>
                {!xIsBayarSO &&
                  <div >{TrashAltSVG(20, "transparent")}</div>
                }
              </div>
              <div className='flex justify-between'>
                <p>{numberSeparator(jumlahBarang)} X Rp{numberSeparator(hargaBarang)}</p>
                <p>Rp{numberSeparator(totalHarga)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="min-h-20" />
    <BottomNavbarJual
      textButton={"Bayar"}
      total={xTotal.toString()}
      onClickButton={() => { xIsSO&&!xIsBayarSO ? setxShowUangMuka(true) : setXShowkonfirmasi(true); }}
      onClickTotal={() => { }}
    />
  </div>;
}

export default RingkasanPenjualan;