import { useEffect, useRef, useState } from "react";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
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
import globalVariables, { compressImage, numberSeparator } from "../../Config/globalVariables";
import { TrashAltSVG } from "../../assets/icon/SVGTSX/TrashAltSVG";
import { BottomNavbarJual } from "../GlobalWidget/bottomNavbarJual";
import { CardBarangTransaksiJual } from "../GlobalWidget/cardBarangTransaksiJual";

import {  HitungBarangModel } from "../../classModels/barangModel";

import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { SupplierModel } from "../../classModels/supplierModel";
import { DetailBeliModel } from "../../classModels/detailBeliModel";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import AXIOS from "../../Config/axiosRequest";
import { AsyncImage } from 'loadable-image'
import { CameraOSVG } from "../../assets/icon/SVGTSX/CameraOSVG";
import { GallerySVG } from "../../assets/icon/SVGTSX/GallerySVG";

const RingkasanPembelian = () => {
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xShowFormSO, setxShowFormSO] = useState(false);
  const navigate = useNavigate();
  const [xIsEdit, setxIsEdit] = useState(false);
  const location = useLocation();
  const [xTransaksi, setXTransaksi] = useState({}as TransaksiBeliModel);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xKodeTransaksi, setXKodeTransaksi] = useState("");
  const [xTotal, setXTotal] = useState(0);
  const [xShowUbahBarang, setXShowUbahBarang] = useState(false);
  const [xShowDelete, setXshowDelete] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xItem, setXItem] = useState([] as HitungBarangModel[]);
  const [xSelectedIndex, setXSelectedIndex] = useState(0);
  const [xJumlahBarangTemp, setXJumlahBarangTemp] = useState("0");
  const [xPageReady, setXPageReady] = useState(false);
  const [xFrom, setXFrom] = useState(PageRoutes.tambahTransaksiBeli);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  const [xDetailBeli,setXDetailBeli]=useState({}as DetailBeliModel);
  const [xLinkFoto, setXLinkFoto] = useState("");
  const [xFileFoto, setXFileFoto] = useState<File | null | undefined>(null);
  const [xIsLoadingContent, setXIsLoadingContent] = useState(false);
  const xRefPhoto = useRef<HTMLInputElement | null>(null);
  const xRefGaleri = useRef<HTMLInputElement | null>(null);
  const [xOpenImage, setXOpenImage] = useState(false);
  const [xErrorFoto, setXErrorFoto] = useState(false);
  const [xTglJatuhTempo, setXTglJatuhTempo] = useState(moment(new Date()).add(parseInt(xSelectedSupplier?.selisihharibayar ?? "0".split(",")[0]), "days"));
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

        console.log(location.state.items);
      }
      if (location.state.total != undefined && location.state.total != null) {
        setXTotal(location.state.total);
      }
      if ((location.state.isEdit ?? false)&& location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi=location.state.dataTransaksi as TransaksiBeliModel
        setXTransaksi(dataTransaksi);
      }
      if((location.state.isEdit??false)&&location.state.detailTransaksiBeli!=null&&location.state.detailTransaksiBeli!=undefined){
        let detailBeli=location.state.detailTransaksiBeli as DetailBeliModel;
        setXDetailBeli(detailBeli);
        setXKodeTransaksi(detailBeli.header.kodebeli??"");
        setXLinkFoto((detailBeli.header.pathgambar??"")+ "?t=" + Date.now());
        setXTglJatuhTempo(moment((detailBeli.header.tgljatuhtempo??"")==""?new Date(): new Date(detailBeli.header.tgljatuhtempo??"")))
      }
      setXPageReady(true);
    }
  }, [])

  function goBack() {
    navigate(xFrom, {
      state: {
        supplier: xSelectedSupplier,
        items: xItem,
        dataTransaksi: xTransaksi,
        isEdit:xIsEdit,
        from: PageRoutes.ringkasanTransaksiBeli,
        total: xTotal,
      }
    })
  }

  useEffect(() => {
    if (xItem.length <= 0 && xPageReady) goBack();
  }, [xItem])

  const convertDataBarang = () => {
    let databarang = [] as any[];
    xItem.forEach((pItem, pIndex) => {
      let hargakurs = parseFloat((xDataLogin.nilaikurs ?? "0")) * parseFloat((pItem.data.hargabeli ?? "0"))
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
        jmlbeli: pItem.jumlahBarang.toString(),
        omnichannel: "0",
        idcurrency: xDataLogin.idcurrency ?? "0",
        harga: pItem.data.hargabeli ?? "0",
        discpersen: "0",
        disc: "0",
        disckurs: "0",
        subtotal: pItem.subtotal.toString(),
        nilaikurs: xDataLogin.nilaikurs,
        hargakurs: hargakurs,
        subtotalkurs: subtotalkurs,
        pakaippn: xDataLogin.pakaippn,
        ppnpersen: xDataLogin.ppnpersen ?? "0",
        ppnrp: ppn,
        catatan: "",
        adanpwp:"0",
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
      form.append("idsupplier", xSelectedSupplier?.idsupplier ?? "");
      form.append("idsyaratbayar", xSelectedSupplier?.idsyaratbayar ?? "");
      form.append("tgltrans", moment(new Date()).format("YYYY-MM-DD"));
      form.append("total", xTotal.toString());
      form.append("pembulatan", "0");
      form.append("grandtotal", xTotal.toString());
      form.append("data_detail", JSON.stringify(databarang));
      form.append("catatan", "");
      form.append("noinvoicesupplier", "");
      form.append("ppnrp", "0");
      form.append("gambar", xIsEdit?xDetailBeli.header.gambar??"":"");
      form.append("filegambar", xFileFoto ?? "");

      await AXIOS
        .post("api/Pembelian/ApiPembelianLangsung/simpan", form)
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

  // isi popup untuk ambil gambar lewat kamera atau galery
  const contentPopupImage = () => {
    return <div className="flex justify-center font-inter">
      <div
        className="w-[90px] h-[90px] py-[13px] mr-2.5 content-center rounded-lg border border-backgroundColor-gray"
        onClick={() => {
          xRefPhoto.current !== null && xRefPhoto.current!.click();
          setXOpenImage(false);
        }}
      >
        <div className="px-[25px]">{CameraOSVG(40, "black")}</div>
        <div className="font-semibold text-sm mt-2.5 text-center">Kamera</div>
      </div>
      <div
        className="w-[90px] h-[90px] py-[13px] rounded-lg border border-backgroundColor-gray"
        onClick={() => {
          xRefGaleri.current !== null && xRefGaleri.current!.click();
          setXOpenImage(false);
        }}
      >
        <div className="px-[25px]">{GallerySVG(40, "black")}</div>
        <div className="font-semibold text-sm mt-2.5  text-center">Galeri</div>
      </div>
    </div>
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
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
          let subtotal = jumlahBarang * parseInt((xItem[xSelectedIndex].data.hargabeli ?? "0").split(".")[0]);

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
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin mau menghapus {xItem.length>0&& xItem[xSelectedIndex].data.namabarang}?</div>
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
        <div className="font-semibold text-center text-16px mb-2.5">{xLinkFoto==""?"Foto nota belum dimasukkan. Apakah anda yakin mau melanjutkan?": "Apakah anda yakin data pesanan pembelian yang dimasukkan sudah betul?"}</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
        simpanDataBeli();
      }}
      onClose={() => { setXShowkonfirmasi(false); }}
      dismissible={true}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {ToastSnackbar(xShowToast)}
    <CustomPopupOpsi content={contentPopupImage()} onClose={() => setXOpenImage(false)} open={xOpenImage} zIndex={10} />
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
          <div>Supplier : {xSelectedSupplier==null ? "" : xSelectedSupplier.namasupplier}</div>
        </div>
        {xIsEdit && <p className="text-14px">Kode Transaksi : {xKodeTransaksi}</p>}
        <div className="w-full py-2">
      <div className="font-semibold text-14px text-left mb-2.5">Foto Nota</div>
      {xLinkFoto == "" ?
        <div className="w-full max-w-96 mb-2 border border-dashed text-main-Pressed border-main-Border text-center content-center justify-items-center"
          style={{
            width: "100%",
            aspectRatio: 4 / 3,
            objectFit: "cover",
          }}
          onClick={() => setXOpenImage(true)}
        >
          {CameraOSVG(80, ListColor.main.Border)}
          Masukkan Gambar Barang
        </div>
        : <div className="w-full max-w-96 mb-2"
          onClick={() => setXOpenImage(true)}>
          <img
            src={xLinkFoto}
            alt={"no image"}
            loading="lazy"
            style={{
              width: "100%",
              aspectRatio: 4 / 3,
              objectFit: "cover",
            }}
          />
        </div>
      }
      {xErrorFoto && <div className="text-12px text-danger-Main text-left">Foto barang wajib diisi</div>}
      <input type="file" accept="image/*" ref={xRefPhoto} capture hidden onChange={async (e) => {
        if (e.target.files != null && e.target.files !== undefined) {
          setXIsLoadingContent(true);
          let file = e.target.files[0];
          let tempfile = await compressImage(file);
          if (tempfile == null) {
            setSnackBar("Harap upload ulang gambar", true);
            return;
          } else {
            file = tempfile;
          }

          // Encode the file using the FileReader API
          const reader = new FileReader();
          reader.onloadend = (event) => {
            // Use a regex to remove data url part
            const base64String = reader.result?.toString();
            // setXFileFoto(base64String)
            setXFileFoto(file);
            // Logs wL2dvYWwgbW9yZ...
            if (event.target != null && event.target?.result !== null && event.target?.result !== undefined) {
              setXLinkFoto(URL.createObjectURL(file));
            }
          };
          reader.readAsDataURL(file);
          setXIsLoadingContent(false);
        }
      }} />
      <input type="file" accept="image/*" onChange={async (e) => {
        if (e.target.files != null && e.target.files !== undefined) {
          setXIsLoadingContent(true)
          let file = e.target.files[0];
          let tempfile = await compressImage(file);
          if (tempfile == null) {
            setSnackBar("Harap upload ulang gambar", true);
            return;
          } else {
            file = tempfile;
          }
          // Encode the file using the FileReader API
          const reader = new FileReader();
          reader.onloadend = (event) => {
            // Use a regex to remove data url part
            const base64String = reader.result?.toString();
            // setXFileFoto(base64String)
            setXFileFoto(file);
            // Logs wL2dvYWwgbW9yZ...
            if (event.target != null && event.target?.result !== null && event.target?.result !== undefined) {
              setXLinkFoto(URL.createObjectURL(file));
            }
          };
          reader.readAsDataURL(file);
          setXIsLoadingContent(false);
        }
      }} hidden ref={xRefGaleri} />
      </div>
    </div>
    </div>
    <div className="w-full px-4">
      {xItem.map((pValue: HitungBarangModel, pIndex) => {
        let jumlahBarang = pValue.jumlahBarang;
        let hargaBarang = parseInt((pValue.data.hargabeli ?? "0").split(".")[0]);
        let totalHarga = jumlahBarang * hargaBarang;
        return (
          <div className="relative">
              <div className="absolute right-2 top-2" onClick={() => { setXSelectedIndex(pIndex); setXshowDelete(true); }}>{
                TrashAltSVG(20, ListColor.main.Main)}
              </div>
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
                  <div >{TrashAltSVG(20, "transparent")}</div>
                
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
      textButton={"Simpan"}
      total={xTotal.toString()}
      onClickButton={() => {
        // let error= xLinkFoto==""||xLinkFoto==undefined||xLinkFoto==null;
        // setXErrorFoto(error);
        // if(!error){
         setXShowkonfirmasi(true); 
        // }
      }}
      onClickTotal={() => { }}
    />
  </div>;
}

export default RingkasanPembelian;