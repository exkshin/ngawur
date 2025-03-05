import { useEffect, useState } from "react";
import { PageRoutes } from "../../PageRoutes";
import { BottomButton } from "../CustomWidget/bottomButton";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useLocation, useNavigate } from "react-router-dom";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { DetailBeliModel } from "../../classModels/detailBeliModel";
import { BarangBySupplierModel, DataBarangModel, HeaderHitungBarangClosingModel, HitungBarangClosingModel, HitungBarangModel } from "../../classModels/barangModel";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import moment from "moment";
import { DetailJualModel } from "../../classModels/detailJualModel";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import globalVariables from "../../Config/globalVariables";
import { DatePickerPopup } from "../CustomWidget/datePickerPopup";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { FilterSVG } from "../../assets/icon/SVGTSX/FilterSVG";
import ListColor from "../../Config/color";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import BarangBySupplierWidget from "../GlobalWidget/barangBySupplierWidget";
import BarangBySupplierClosingWidget from "../GlobalWidget/barangBySupplierClosingWidget";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";
import { SupplierModel } from "../../classModels/supplierModel";
import { DetailClosingModel } from "../../classModels/detailClosingModel";
import { DropdownSupplierClosing } from "../GlobalWidget/dropdownSupplierClosing";

const FormClosingPage = () => {
  const [xShowFormSO, setxShowFormSO] = useState(false);
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xIsSO, setxIsSO] = useState(false);
  const [xFrom, setxFrom] = useState(PageRoutes.listTransaksiJual);
  const location = useLocation();
  const [xSelectedSupplier, setXSelectedSupplier] = useState({
    alamat: "",
    idperusahaan: "",
    idsupplier: "",
    idsyaratbayar: "",
    kodesupplier: "",
    namasupplier: "Semua Supplier",
    selisihharibayar: "",
  } as SupplierModel);
  const [xTransaksi, setXTransaksi] = useState({});
  const [xTanggalClosing, setXTanggalClosing] = useState(moment(new Date()));
  const [xOpenDatePicker, setXOpenDatePicker] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingJual, setXIsLoadingJual] = useState(true);
  const [xIsSortBySupplier, setxIsSortBySupplier] = useState(true);
  const [xCartClosing, setXCartClosing] = useState([] as HeaderHitungBarangClosingModel[]);
  const [xListBarangBySupplier, setXListBarangBySupplier] = useState([] as BarangBySupplierModel[]);
  const [xExpand, setXExpand] = useState([] as boolean[]);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xIsPosting, setXIsPosting] = useState(false);
  const [xDetailClosing, setXDetailClosing] = useState(null as DetailClosingModel | null);
  const [xResultLoadData, setXResultLoadData] = useState([] as HeaderHitungBarangClosingModel[]);
  const [xSearch, setXSearch] = useState("");
  const [xFirstTime, setXfirstTime] = useState(false);
  const [xSelectedSupplierTemp, setXSelectedSupplierTemp] = useState(xSelectedSupplier);
  const [xShowKonfirmasiSupplier, setXShowkonfirmasiSupplier] = useState(false);
  const [xIsReady,setXIsReady]=useState(false);
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
    let from = "";
    let idtrans = "";
    let isEdit = false;
    let isSO = false;
    let idsupplier = "";
    let tanggal = moment().format("YYYY-MM-DD");
    if (location.state != undefined && location.state != null) {
      if (location.state.from != undefined && location.state.from != null && location.state.from != PageRoutes.listTransaksiJual) {
        setxFrom(location.state.from);
        from = location.state.from
      }
      if (location.state.type != undefined && location.state.type != null && location.state.type == "SO") {
        setxIsSO(true);
        setxShowFormSO(true);
        isSO = true;
      }
      if (location.state.isEdit != undefined && location.state.isEdit != null && location.state.isEdit == true) {
        setxIsEdit(true);
        isEdit = true;
      }
      if (isEdit && location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi = location.state.dataTransaksi as TransaksiJualModel;
        idtrans = dataTransaksi.idtrans ?? "0";
        setXTransaksi(dataTransaksi);
      }
      if (location.state.tanggal != undefined && location.state.tanggal != null) {
        setXTanggalClosing(moment(location.state.tanggal));
        tanggal = location.state.tanggal
      }
      if (location.state.supplier != undefined && location.state.supplier != null) {
        let supplier = location.state.supplier as SupplierModel;
        setXSelectedSupplier(supplier);
        idsupplier = supplier.idsupplier ?? "";
      }
    }
    initState(idsupplier, tanggal);
    setXIsReady(true);
    // getListBarang(xSearch, xIsSortBySupplier);
  }, [])

  async function initState(pIdSupplier: string, tanggal: string) {

    await getListBarang(xSearch, xIsSortBySupplier, pIdSupplier, tanggal);
    setXIsLoadingJual(false);

  }

  async function getListBarang(pSearch: string, pIsSortSupplier: boolean, pIdSupplier: string, pTanggal: string) {
    setXIsLoadingJual(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("keyword", pSearch);
      form.append("orderby", pIsSortSupplier ? "supplier" : "barang");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tanggal", pTanggal);
      form.append("jenis", "closing");

      await AXIOS
        .post("api/Master/ApiBarang/listBarangJual", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data;
            let databarang = responseData as BarangBySupplierModel[];
            if (pIdSupplier != "") {
              databarang = databarang.filter((value) => value.idsupplier == pIdSupplier)
            }
            setXListBarangBySupplier(databarang);
            let expand = [];
            for (let i = 0; i < databarang.length; i++) {
              expand.push(true);
            }
            setXExpand(expand);

          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingJual(false);
  }

  async function getLoadData() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tanggal", xTanggalClosing.format("YYYY-MM-DD"));

      await AXIOS
        .post("umkm/ApiClosingDate/loadData", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data;
            let dataLoadClosing = [] as HeaderHitungBarangClosingModel[];
            responseData.map((element: any) => {
              dataLoadClosing.push({
                idSupplier: element.idsupplier,
                namaSupplier: "",
                mode: element.sudahinput == 1 ? "ubah" : "tambah",
                listHitungBarang: element.daftarbarang.map((value: any) => {
                  return {
                    idbarang: value.idbarang,
                    retur: parseInt((value.retur).toString().split(".")[0]),
                    sisa: parseInt((value.sisa).toString().split(".")[0]),
                    data: {
                      idbarang: value.idbarang,
                      idsupplier: value.idsupplier
                    } as DataBarangModel,
                  } as HitungBarangClosingModel;
                }),
              } as HeaderHitungBarangClosingModel)
            })
            // setXResultLoadData(responseData as );
            let databarang = xListBarangBySupplier;
            let tempSupp = [] as HeaderHitungBarangClosingModel[];
            for (let i = 0; i < databarang.length; i++) {
              let loadTemp = dataLoadClosing.find(value => value.idSupplier == databarang[i].idsupplier);
              let temp = [] as HitungBarangClosingModel[];
              console.log(loadTemp);
              databarang[i].daftarbarang.forEach((pData, index) => {
                let retur = 0;
                let sisa = 0;
                if (loadTemp != undefined) {
                  let loadtempbarang = loadTemp.listHitungBarang.find(barang => barang.idbarang == pData.idbarang);
                  retur = loadtempbarang != undefined ? loadtempbarang.retur : 0;
                  sisa = loadtempbarang != undefined ? loadtempbarang.sisa : 0;
                }
                temp.push({
                  data: pData,
                  idbarang: pData.idbarang ?? "",
                  retur: retur,
                  sisa: sisa,
                });
              });
              console.log(temp);
              tempSupp.push({
                idSupplier: databarang[i].idsupplier ?? "",
                namaSupplier: databarang[i].namasupplier ?? "",
                mode: loadTemp == undefined ? "tambah" : loadTemp.mode ?? "tambah",
                listHitungBarang: temp,
              })
            }
            setXCartClosing(tempSupp);
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXfirstTime(true);
    setXIsLoading(false);
  }

  useEffect(() => {
    if (xListBarangBySupplier.length > 0 && !xFirstTime) {
      setXfirstTime(true);
      getLoadData();
    }
  }, [xListBarangBySupplier])


  async function simpanClosing(goBackAfterSave: boolean) {
    setXIsLoading(true);
    try {
      let tempSupp = [] as { idsupplier: string, mode: string, daftarbarang: { retur: string, sisa: string, idbarang: string, hargabeli: string, namabarang: string, satuan: string, }[] }[];
      let cart = xCartClosing.filter((value => xSelectedSupplier.idsupplier == "" || value.idSupplier == xSelectedSupplier.idsupplier));
      for (let i = 0; i < cart.length; i++) {
        let temp = [] as { retur: string, sisa: string, idbarang: string, namabarang: string, satuan: string, hargabeli: string }[];
        cart[i].listHitungBarang.forEach((pData, index) => {
          temp.push({
            retur: pData.retur.toString(),
            sisa: pData.sisa.toString(),
            idbarang: pData.idbarang,
            namabarang: pData.data.namabarang ?? "",
            satuan: pData.data.satuan ?? "",
            hargabeli: pData.data.hargabeli ?? "0",
          });
        });
        tempSupp.push({
          idsupplier: xCartClosing[i].idSupplier,
          mode: xCartClosing[i].mode ?? "",
          daftarbarang: temp,
        })
      }

      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("lokasi", xDataLokasi.id ?? "");
      form.append("tglomzet", xTanggalClosing.format("YYYY-MM-DD"));
      form.append("idcurrency", xDataLogin.idcurrency ?? "");
      form.append("data_detail", JSON.stringify(tempSupp));

      await AXIOS
        .post("umkm/ApiClosingDate/simpan", form)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.success == true) {
            // if (xIsPosting) {
            //   await postingClosing(xTanggalClosing.format("YYYY-MM-DD"));
            // }
            if (goBackAfterSave) {
              navigate(PageRoutes.paymentSuccess, {
                state: {
                  idtrans: data.data.idclosing,
                  idjual: data.data.idjual,
                  isEdit: false,
                  isClosing: true,
                }
              });
            }
          } else {
            setSnackBar(data.message,true);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  async function postingClosing(tglomzet: string) {
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tgltrans", tglomzet);

      await AXIOS
        .post("umkm/ApiClosingDate/posting", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {

          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <DatePickerPopup
      open={xOpenDatePicker}
      onClose={(value) => {
      }}
      zIndex={72}
      maxDate={new Date()}
      onChange={(value) => {
        setXOpenDatePicker(false);
        setXTanggalClosing(moment(value));
      }}
      value={new Date(xTanggalClosing.format("YYYY-MM-DD"))}
    />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingJual} />
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">{
          "Apakah anda yakin data closing yang dimasukkan sudah betul?"
        }</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        setXShowkonfirmasi(false);
        simpanClosing(true);
      }}
      onClose={() => { setXShowkonfirmasi(false); }}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    <CustomPopup
      content={<div className="font-semibold text-center text-16px mb-2.5">
        Data yang belum disimpan akan hilang apabila belum disimpan. Apakah anda mau menyimpan data closing terlebih dahulu?
      </div>}
      open={xShowKonfirmasiSupplier}
      functionButtonLeft={async () => {
        await simpanClosing(false);
        setXSelectedSupplier(xSelectedSupplierTemp);
        setXfirstTime(false);
        getListBarang(xSearch, xIsSortBySupplier, xSelectedSupplierTemp.idsupplier ?? "", xTanggalClosing.format("YYYY-MM-DD"));
      }}
      functionButtonRight={() => {
        setXShowkonfirmasiSupplier(false);
      }}
      textButtonLeft="Simpan"
      textButtonRight="Kembali"
      onClose={() => setXShowkonfirmasiSupplier(false)}
      zIndex={81}
    />
    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => {
        navigate(PageRoutes.listClosing);
      }}
      showFrontIcon={false}
      frontIcon={FilterSVG(24, ListColor.main.Main)}
      frontFunction={() => { }}
      valueSearch={xSearch}
      placeholder={"Cari Barang"}
      searchFunction={(value) => { getListBarang(value, true, xSelectedSupplier?.idsupplier ?? "", xTanggalClosing.format("YYYY-MM-DD")); }}
      onChangeSearch={(value) => {
        setXSearch(value);
      }}
    />
    <div className="absolute top-14 bg-background w-full py-1 px-4">
      <div className="inline-flex mb-2 items-center w-full">
        <div className="min-w-32" onClick={() => { }}>
          <div className="flex text-14px font-bold">
            {CalendarAltOSVG(18, ListColor.main.Main)}
            <div className="ml-2">{xTanggalClosing.format("DD MMM YYYY")}</div>
          </div>
        </div>
        {xIsReady&& <DropdownSupplierClosing
          useTitle={false}
          className="-mt-2"
          value={xSelectedSupplier}
          canSetInitialValue={false}
          isEdit={xIsEdit}
          onChange={(pSupplier: SupplierModel) => {
            if (xSelectedSupplier.idsupplier != pSupplier.idperusahaan) {
              setXSelectedSupplierTemp(pSupplier);
              setXShowkonfirmasiSupplier(true);
            }
          }} 
          tanggal={xTanggalClosing.format("YYYY-MM-DD")} 
        />}
      </div>
      <div className="w-full inline-flex">
        <div className="min-w-48 max-w-48 ">Nama Barang</div>
        <div className="w-full text-center">Retur</div>
        <div className="w-full text-center">Sisa</div>
      </div>
    </div>
    <div className="min-h-36 mt-1" />

    {xIsLoadingJual || xCartClosing.length < 1 ? <></>
      : xListBarangBySupplier.map((pElement, pIndex) => {
        let indexCartSupplier = xCartClosing.findIndex((value) => value.idSupplier == pElement.idsupplier);
        return <BarangBySupplierClosingWidget
          data={pElement}
          key={"bysupplier" + pIndex}
          indexCart={0}
          index={pIndex}
          cart={xCartClosing[indexCartSupplier].listHitungBarang}
          onExpand={() => {
            let expand = xExpand;
            expand[pIndex] = !expand[pIndex];
            setXExpand(expand);
          }}
          onChangeJumlah={(pIndexSupplier, pIndexBarang, pJumlah, pData) => {
            let retur = pJumlah.retur == "" ? 0 : parseInt(pJumlah.retur);
            let sisa = pJumlah.sisa == "" ? 0 : parseInt(pJumlah.sisa);
            let cart = xCartClosing;
            let databarang = xCartClosing[indexCartSupplier].listHitungBarang
            let indexCartBarang = databarang.findIndex((value) => value.idbarang == pElement.daftarbarang[pIndexBarang].idbarang);
            cart[indexCartSupplier].listHitungBarang[indexCartBarang].retur = retur;
            cart[indexCartSupplier].listHitungBarang[indexCartBarang].sisa = sisa;
            setXCartClosing(cart);
          }}
        />;
      })

    }
    <div className="min-h-20" />
    <BottomButton
      onClick={() => {
        setXShowkonfirmasi(true);
        setXIsPosting(false);
      }}
      text={"Simpan Closing"}
    />
  </div>
}

export default FormClosingPage;