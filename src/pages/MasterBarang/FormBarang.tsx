import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useRef, useState } from "react";
import { DataBoxDropdownModel, ValueListModel } from "../../classModels/filterModel";
import AXIOS from "../../Config/axiosRequest";
import { WidgetDropdownBox } from "../GlobalWidget/filter";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { CameraOSVG } from "../../assets/icon/SVGTSX/CameraOSVG";
import { GallerySVG } from "../../assets/icon/SVGTSX/GallerySVG";
import { compressImage } from "../../Config/globalVariables";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { PageRoutes } from "../../PageRoutes";
import { BottomButton } from "../CustomWidget/bottomButton";
import { NumericFormat } from "react-number-format";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";
import { SupplierModel } from "../../classModels/supplierModel";
import ListColor from "../../Config/color";
import noImage from "../../assets/images/no-image-icon-0.png"
import { url } from "inspector";
import { DataBarangModel } from "../../classModels/barangModel";
import { DetailBarangModel } from "../../classModels/detailBarangModel";
import { AsyncImage } from 'loadable-image'

const FormBarang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsEdit, setXIsEdit] = useState(false);
  const [xLokasiError, setXLokasiError] = useState(false);
  const [xListLokasi, setXListLokasi] = useState([] as ValueListModel[]);
  const [xSelectedListLokasi, setXSelectedListLokasi] = useState([] as ValueListModel[]);
  const [xOpenLokasiDD, setXOpenLokasiDD] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xIsLoadingLokasi, setXIsLoadingLokasi] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingDetail, setXIsLoadingDetail] = useState(false);
  const [xNama, setXNama] = useState("");
  const [xHargaJual, setXHargaJual] = useState("");
  const [xHargaBeli, setXHargaBeli] = useState("");
  const [xCatatan, setXCatatan] = useState("");
  const [xSatuan, setXSatuan] = useState("");
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  const [xLinkFoto, setXLinkFoto] = useState("");
  const [xFileFoto, setXFileFoto] = useState<File | null | undefined>(null);
  const [xErrorNama, setXErrorNama] = useState(false);
  const [xErrorHargaJual, setXErrorHargaJual] = useState(false);
  const [xErrorHargaBeli, setXErrorHargaBeli] = useState(false);
  const [xErrorCatatan, setXErrorCatatan] = useState(false);
  const [xErrorSatuan, setXErrorSatuan] = useState(false);
  const [xErrorFoto, setXErrorFoto] = useState(false);
  const [xErrorSupplier, setXErrorSupplier] = useState(false);
  const [xErrorLokasi, setXErrorLokasi] = useState(false);
  const xRefPhoto = useRef<HTMLInputElement | null>(null);
  const xRefGaleri = useRef<HTMLInputElement | null>(null);
  const [xOpenImage, setXOpenImage] = useState(false);
  const [xIsLoadingContent, setXIsLoadingContent] = useState(false);
  const [xStatus, setXStatus] = useState(false);
  const [xDataBarang, setxDataBarang] = useState(null as DataBarangModel | null);
  const [xDetailBarang, setXDetailBarang] = useState(null as DetailBarangModel | null);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);

  /**
  * @description untuk menampilkan toast
  * @param text text yang mau ditampilkan dalam toast
  * @param isToastError true, tampilan akan berubah menjadi toast error dan false, akan menjadi toast success
  */
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
        isToastError: false //error/success
      });
    }, 3000);
  }

  async function getListLokasi() {
    setXIsLoadingLokasi(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");

      await AXIOS
        .post("api/Master/ApiLokasi/index", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.rows as LokasiModel[];
          let temp = [] as ValueListModel[];
          responseData.forEach(pValue => {
            temp.push({
              extraData: pValue,
              id: pValue.id,
              nama: pValue.nama
            } as ValueListModel)
          })
          setXListLokasi(temp);
        }
        );
    } catch (error) {
      console.log(error);
    }
    setXIsLoadingLokasi(false);
  }

  useEffect(() => {
    getListLokasi();
    if (location.state != undefined && location.state != null) {
      let isEdit = false;
      let idBarang = "";
      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        isEdit = location.state.isEdit;
        setXIsEdit(location.state.isEdit);
      }
      if (location.state.dataBarang != undefined && location.state.dataBarang != null) {
        let databarang = location.state.dataBarang as DataBarangModel;
        setxDataBarang(location.state.dataBarang);
        idBarang = databarang.idbarang ?? "";
      }
      if (isEdit) {
        getDetailBarang(idBarang);
      }
    }
  }, [])

  async function getDetailBarang(idBarang: string) {
    setXIsLoadingDetail(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idbarang", idBarang);
      await AXIOS
        .post("api/Master/ApiBarang/getDataBarang", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.data as DetailBarangModel;
          setXDetailBarang(responseData);
          setXCatatan(responseData.catatan ?? "");
          setXNama(responseData.namabarang ?? "");
          setXHargaJual(responseData.hargajual ?? "");
          setXHargaBeli(responseData.hargabeli ?? "");
          setXSatuan(responseData.satuan ?? "");
          setXLinkFoto((responseData.pathgambar??"")+ "?t=" + Date.now());
          let lokasi=[] as ValueListModel[];
          responseData.daftarlokasi.forEach((pLokasi)=>{
            lokasi.push({
              id:pLokasi.idlokasi,
              nama:pLokasi.namalokasi,
              extraData:{
                alamat:pLokasi.alamat,
                id:pLokasi.idlokasi,
                kode:pLokasi.kodelokasi,
                kota:pLokasi.kota,
                nama:pLokasi.namalokasi,
                negara:pLokasi.negara,
                propinsi:pLokasi.propinsi,
              }as LokasiModel,
            }as ValueListModel);
          });
          setXSelectedListLokasi(lokasi);
          setXSelectedSupplier({
            idsupplier: responseData.daftarsupplier[0].idsupplier,
            alamat:responseData.daftarsupplier[0].alamat,
            idperusahaan:responseData.daftarsupplier[0].idperusahaan,
            idsyaratbayar:responseData.daftarsupplier[0].idsyaratbayar,
            kodesupplier:responseData.daftarsupplier[0].kodesupplier,
            namasupplier:responseData.daftarsupplier[0].namasupplier,
            selisihharibayar:"",
          }as SupplierModel);
        }
        );
    } catch (error) {
      console.log(error);
    }
    setXIsLoadingDetail(false);
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

  async function simpanBarang() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idbarang", xIsEdit? xDetailBarang?.idbarang??"":"");
      form.append("kodebarang", xIsEdit? xDetailBarang?.kodebarang??"": "");
      form.append("namabarang", xNama.toUpperCase());
      form.append("satuan", xSatuan.toUpperCase());
      form.append("konversi1", "1");
      form.append("konversi2", "1");
      form.append("gambar", xIsEdit? xDetailBarang?.gambar??"":"");
      form.append("mode", !xIsEdit ? "tambah" : "ubah");
      form.append("filegambar", xFileFoto ?? "");
      form.append("stok", "1");
      form.append("jual", "1");
      form.append("produksi", "0");
      form.append("ppn", "1");
      form.append("hargabeli", xHargaBeli);
      form.append("hargajual", xHargaJual);
      form.append("catatan", xCatatan);
      form.append("kodemerkbarang", "M001");
      form.append("status", "1" );
      form.append("data_supplier", JSON.stringify([{ idsupplier: xSelectedSupplier?.idsupplier ?? "" }]));
      form.append("daftarlokasi", JSON.stringify(xSelectedListLokasi.map((pValue) => { return { idlokasi: pValue.id } })));

      await AXIOS
        .post("api/Master/ApiBarang/simpan", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            navigate(PageRoutes.masterBarang, {
              state: {
                showdialog: true,
                text: "Barang berhasil disimpan",
                isError: false,
              }
            });
          }else{
            setSnackBar(data.errorMsg,true);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar("Gagal simpan data barang",true);
    }
    setXIsLoading(false);
  }

  async function validasi() {
    setXErrorNama(xNama == "");
    setXErrorHargaJual(xHargaJual == "" || xHargaJual == "0");
    setXErrorHargaBeli(xHargaBeli == "" || xHargaBeli == "0");
    setXErrorSatuan(xSatuan == "");
    // setXErrorFoto(xLinkFoto == "");
    setXErrorSupplier(xSelectedSupplier == null);
    setXErrorLokasi(xSelectedListLokasi.length <= 0);
    let valid = true;
    if (xSelectedListLokasi.length <= 0 || xNama == "" || xHargaJual == "" || xHargaJual == "0" || xHargaBeli == "" || xHargaBeli == "0" || xSatuan == "" || xSelectedSupplier == null) {
      valid = false;
    }
    if (valid) {
      if(parseFloat(xHargaJual) < parseFloat(xHargaBeli)){
        setSnackBar("Harga Beli Tidak Boleh Lebih Dari Harga Jual", true);
        return;
      }
      let selisih = parseFloat(xHargaJual) - parseFloat(xHargaBeli);
      let persen = 0.0;
      if (selisih < 0) {
        persen = ((selisih * -1) / parseFloat(xHargaBeli)) * 100;
      } else {
        persen = ((selisih) / parseFloat(xHargaJual)) * 100;
      }
      if (persen < 15) {
        setXStatus(false);
      } else {
        setXStatus(true);
      }
      setXShowkonfirmasi(true);
    } else {
      setSnackBar("Terdapat data yang belum diisi", true);
    }
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoadingDetail || xIsLoading || xIsLoadingLokasi || xIsLoadingContent} />
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">{xStatus ? "Apakah anda yakin data barang yang dimasukkan sudah betul?" : "Selish harga beli dan harga jual kurang dari 15%. Apakah anda yakin?"}</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
        simpanBarang();
      }}
      onClose={() => { setXShowkonfirmasi(false); }}
      dismissible={false}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    {ToastSnackbar(xShowToast)}
    <CustomPopupOpsi content={contentPopupImage()} onClose={() => setXOpenImage(false)} open={xOpenImage} zIndex={10} />
    <CustomNavbar
      title={`${!xIsEdit ? "Tambah" : "Ubah"} Barang`}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.masterBarang)}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      <div className="font-semibold text-14px text-left mb-2.5">Foto Barang *</div>
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
            src={xLinkFoto.substring(xLinkFoto.lastIndexOf('/') + 1).split('?')[0] == 'NO_IMAGE.jpg' ? noImage : xLinkFoto}
            onError={() => {
              setXLinkFoto(noImage)
            }}
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
      <div className=" mb-2.5">
        <div className="font-semibold text-14px text-left mb-2.5">Nama Barang *</div>
        <div className="relative w-full mt-2.5">
          <input
            onChange={(e) => {
              setXNama(e.target.value);
            }}
            placeholder={""}
            value={xNama}
            type={"text"}
            className={`${defaultInputCSS((xNama !== "" && xNama !== undefined), xErrorNama, false)}`}
          />
        </div>
        {xErrorNama && <div className="text-12px text-danger-Main text-left">Nama barang wajib diisi</div>}
      </div>
      <div className=" mb-2.5">
        <div className="font-semibold text-14px text-left mb-2.5">Satuan *</div>
        <div className="relative w-full mt-2.5">
          <input
            onChange={(e) => {
              setXSatuan(e.target.value);
            }}
            placeholder={""}
            value={xSatuan}
            type={"text"}
            className={`${defaultInputCSS((xSatuan !== "" && xSatuan !== undefined), xErrorSatuan, false)}`}
          />
        </div>
        {xErrorSatuan && <div className="text-12px text-danger-Main text-left">Satuan wajib diisi</div>}
      </div>

      <div className=" mb-2.5">
        <div className="font-semibold text-14px text-left mb-2.5">Harga Beli *</div>
        <div className="relative w-full mt-2.5">
          <NumericFormat
            className={`inset-y-0 h-10 ${defaultInputCSS((xHargaBeli !== "" && xHargaBeli !== undefined), xErrorHargaBeli, false)} mb-2`}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            thousandsGroupStyle="thousand"
            value={xHargaBeli}
            isAllowed={(values) => {
              let jumlah = values.floatValue ?? 0;
              return jumlah >= 0;
            }}
            allowLeadingZeros={false}
            onChange={(e) => {
              let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
              if (jumlah >= 0) {
                setXHargaBeli(jumlah.toString());
              }
            }}
          />
        </div>
        {xErrorHargaBeli && <div className="text-12px text-danger-Main text-left">Harga beli wajib diisi</div>}
      </div>
      <div className=" mb-2.5">
        <div className="font-semibold text-14px text-left mb-2.5">Harga Jual *</div>
        <div className="relative w-full mt-2.5">
          <NumericFormat
            className={`inset-y-0 h-10 ${defaultInputCSS((xHargaJual !== "" && xHargaJual !== undefined), xErrorHargaJual, false)} mb-2`}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            thousandsGroupStyle="thousand"
            value={xHargaJual}
            isAllowed={(values) => {
              let jumlah = values.floatValue ?? 0;
              return jumlah >= 0;
            }}
            allowLeadingZeros={false}
            onChange={(e) => {
              let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
              if (jumlah >= 0) {
                setXHargaJual(jumlah.toString());
              }
            }}
          />
        </div>
        {xErrorHargaJual && <div className="text-12px text-danger-Main text-left">Harga jual wajib diisi</div>}
      </div>

      <DropdownSupplier
        title="Supplier *"
        className="mb-2"
        value={xSelectedSupplier}
        errorText="Supplier wajib diisi"
        isError={xErrorSupplier}
        onChange={(pSupplier) => {
          setXSelectedSupplier(pSupplier);
        }}
      />

      <div className="-mx-2 mb-2">
        {!xIsLoadingLokasi&&!xIsLoadingDetail && <WidgetDropdownBox
          DataDropdownBox={
            {
              listData: xListLokasi,
              placeholder: "Cari Lokasi",
              title: "Lokasi *",
              titleListBadge: "Lokasi",
              value: [],
            } as DataBoxDropdownModel
          }
          ListSelected={xSelectedListLokasi}
          IndexWidget={0}
          onChange={(pValue) => {
            setXSelectedListLokasi(pValue);
          }}
          useOverflowBadge={false}
          onNewPage={(value) => {
            setXOpenLokasiDD(value)
          }}
          isError={xLokasiError}
          errorText={"Lokasi wajib diisi"}
          showAllSelected={true}
          classnameWrapper="px-2.5"
        />}
        {xErrorLokasi && <div className="text-12px text-danger-Main text-left mx-2 mt-2">Lokasi wajib diisi</div>}
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
    </div>
    <div className="min-h-16" />
    <BottomButton onClick={() => {
      validasi();
    }} text={"Simpan Barang"} />
  </div>
}

export default FormBarang;