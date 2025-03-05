import { useEffect, useState } from "react";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import { CardBarangTransaksiJual } from "../GlobalWidget/cardBarangTransaksiJual"
import { useLocation, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import ListColor from "../../Config/color";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import SearchNavbar from "../CustomWidget/searchNavbar";
import globalVariables, { numberSeparator } from "../../Config/globalVariables";
import { BottomNavbarJual } from "../GlobalWidget/bottomNavbarJual";
import { PopupRangkuman } from "../GlobalWidget/popupRangkuman";
import { FilterSVG } from "../../assets/icon/SVGTSX/FilterSVG";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { DataBarangModel, HitungBarangModel } from "../../classModels/barangModel";
import { DetailBeliModel } from "../../classModels/detailBeliModel";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { SupplierModel } from "../../classModels/supplierModel";
import { DropdownSupplier } from "../GlobalWidget/dropdownSupplier";

const TambahTransaksiBeli = () => {
  const [xShowFormSupplier, setxShowFormSupplier] = useState(false);
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsEdit, setxIsEdit] = useState(false);
  const [xFrom, setxFrom] = useState(PageRoutes.listTransaksiJual);
  const location = useLocation();
  const [xTransaksi, setXTransaksi] = useState({} as TransaksiBeliModel);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsLoadingBeli, setXIsLoadingBeli] = useState(true);
  const [xTotal, setXTotal] = useState(0);
  const [xShowPopupRangkuman, setXShowPopupRangkuman] = useState(false);
  const [xDetailBeli, setXDetailBeli] = useState(null as DetailBeliModel | null);
  const [xCart, setXCart] = useState([] as HitungBarangModel[]);
  const [xListBarang, setXListBarang] = useState([] as DataBarangModel[]);
  const [xListBarangComplete, setXListBaranComplete] = useState([] as DataBarangModel[]);
  const [xDisableRingkasan, setXDisableRingkasan] = useState(true);
  const [xReady, setXReady] = useState(false);
  const [xSelectedSupplier, setXSelectedSupplier] = useState(null as SupplierModel | null);
  const [xIsErrorSupplier, setxIsErrorSupplier] = useState(false);
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

  useEffect(() => {
    let from = "";
    let idtrans = "";
    let isEdit = false;
    if (location.state != undefined && location.state != null) {
      if (location.state.from != undefined && location.state.from != null && location.state.from != PageRoutes.listTransaksiJual) {
        setxFrom(location.state.from);
        from = location.state.from
      }
      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        setxIsEdit(location.state.isEdit);
        isEdit = location.state.isEdit;
      }
      if (location.state.dataTransaksi != undefined && location.state.dataTransaksi != null) {
        let dataTransaksi = location.state.dataTransaksi as TransaksiBeliModel;
        idtrans = dataTransaksi.idtrans ?? "";
        setXTransaksi(dataTransaksi);
      }
      initState(isEdit, idtrans, from);
      if (location.state.supplier != undefined && location.state.supplier != null) {
        let supplier = location.state.supplier as SupplierModel;
        setXSelectedSupplier(location.state.supplier);
        setxShowFormSupplier(false);
        getListBarang("", supplier.idsupplier ?? "");
      }
      if (location.state.total != undefined && location.state.total != null) {
        setXTotal(location.state.total);
      }
      if (location.state.items != undefined && location.state.items != null) {
        setXCart(location.state.items);
      }
    }
    // getListBarang(xSearch, xIsSortBySupplier);
  }, [])

  async function initState(pIsEdit: boolean, pIdTrans: string, pFrom: string) {
    if (pIsEdit) {
      setXIsLoadingBeli(false);
      await getDetailBeli(pIdTrans, pFrom);
    } else {
      setxShowFormSupplier(true);
      setXIsLoadingBeli(false);
    }
    setXReady(false);
  }



  async function getDetailBeli(idBeli: string, from: string) {
    setXIsLoadingBeli(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idbeli", idBeli);
      await AXIOS
        .post("api/Pembelian/ApiPembelianLangsung/getDataBeli", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as DetailBeliModel;
            let item = [] as HitungBarangModel[];
            responseData.detail.forEach((pItem, pIndex) => {
              item.push({
                data: {
                  gambar: "",
                  hargajualmaxsatuan: pItem.harga,
                  idbarang: pItem.idbarang,
                  satuan: pItem.satuan,
                  namabarang: pItem.namabarang,
                  kodebarang: pItem.kodebarang,
                  idsupplier: responseData.header.idsupplier,
                  namasupplier: responseData.header.namasupplier,
                  satuan2: "",
                  satuan3: "",
                  hargajualminsatuan: "",
                  hargajualminsatuan2: "",
                  hargajualmaxsatuan2: "",
                  hargajualminsatuan3: "",
                  hargajualmaxsatuan3: "",
                  hargabeli: pItem.harga,
                },
                idbarang: pItem.idbarang,
                jumlahBarang: parseInt((pItem.jml ?? "0").split(".")[0]),
                subtotal: parseInt((pItem.subtotal ?? "0").split(".")[0]),
              });
            })
            setXTotal(parseInt((responseData.header.total ?? "0").split(".")[0]));
            setXDetailBeli(responseData);
            setXSelectedSupplier({
              alamat: responseData.header.alamatsupplier,
              idperusahaan: xDataLogin.idperusahaan,
              idsupplier: responseData.header.idsupplier,
              idsyaratbayar: responseData.header.idsyaratbayar,
              kodesupplier: responseData.header.kodesupplier,
              namasupplier: responseData.header.namasupplier,
              selisihharibayar: responseData.header.selisih,
            });
            getListBarang("", responseData.header.idsupplier ?? "");
            console.log(item);

            if (from == PageRoutes.ringkasanTransaksiBeli) {
              if (location.state.items != undefined && location.state.items != null) {
                let items = (location.state.items as HitungBarangModel[]);
                setXCart(location.state.items as HitungBarangModel[]);
                setXDisableRingkasan(items.length <= 0)
              }
              if (location.state.total != undefined && location.state.total != null) {
                setXTotal(location.state.total);
              }
              setxShowFormSupplier(false);
            } else {
              setXCart(item);
            }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoadingBeli(false);
  }

  async function getListBarang(pSearch: string, pIdSupplier: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("keyword", pSearch);
      form.append("idsupplier", pIdSupplier);
      form.append("idlokasi", xDataLokasi.id ?? "");

      await AXIOS
        .post("api/Master/ApiBarang/listBarang", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data;
            setXListBarang(responseData as DataBarangModel[]);
            if (pSearch == "") {
              setXListBaranComplete(responseData as DataBarangModel[]);
            }
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


  const cariJumlahBarang = (pIdBarang: string) => {
    let jumlah = 0;
    xCart.forEach((pElementCart, pIndexCart) => {
      if (pElementCart.idbarang == pIdBarang) {
        jumlah = pElementCart.jumlahBarang;
      }
    });
    return jumlah;
  }


  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupRangkuman isBeli={true} openOpsi={xShowPopupRangkuman} onClose={() => {
      setXShowPopupRangkuman(false);
    }} item={xCart} />
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingBeli} />

    <CustomPopup
      content={<div className="">
        <DropdownSupplier
          className="mb-2"
          value={xSelectedSupplier}
          errorText="Supplier wajib diisi"
          title="Supplier *"
          isError={xIsErrorSupplier}
          onChange={(pSupplier) => {
            setXSelectedSupplier(pSupplier);
          }} />
      </div>}
      functionButtonRight={() => {
        navigate(PageRoutes.listTransaksiBeli);
      }}
      functionButtonLeft={() => {
        if (xSelectedSupplier == null) {
          setxIsErrorSupplier(true);
        } else {
          setxIsErrorSupplier(false);
          setxShowFormSupplier(false);
          getListBarang(xSearch, xSelectedSupplier.idsupplier ?? "");
        }
      }}
      onClose={() => {
      }}
      dismissible={xSelectedSupplier == null}
      open={xShowFormSupplier}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={40}
    />
    {ToastSnackbar(xShowToast)}
    <SearchNavbar
      showBack={true}
      backFunction={() => {
        navigate(PageRoutes.listTransaksiBeli)
      }}
      showFrontIcon={false}
      frontIcon={FilterSVG(24, ListColor.main.Main)}
      frontFunction={() => { }}
      valueSearch={xSearch}
      placeholder={"Cari Barang"}
      searchFunction={(value) => { getListBarang(value, xSelectedSupplier?.idsupplier ?? ""); }}
      onChangeSearch={(value) => { setXSearch(value) }}
    />
    <div className="min-h-16" />
    <div className="w-full px-4 mb-2 ">
      <div className="border py-1 px-2 rounded-lg border-neutral-70 w-full">
        <div className="flex justify-between text-14px font-bold">
          <div>Supplier : {xSelectedSupplier == null ? "" : xSelectedSupplier.namasupplier}</div>
        </div>
        {xIsEdit && <p className="text-14px">Kode Transaksi : {xTransaksi.kodetrans}</p>}
      </div>
    </div>
    {xIsLoadingBeli ? <></>
      : <div className="flex-wrap flex justify-between w-full px-4">
        {!xIsLoading && xListBarang.map((pElement, pIndex) => {
          return <CardBarangTransaksiJual
            dataBarang={pElement}
            isBeli={true}
            initialJumlah={cariJumlahBarang(pElement.idbarang ?? "").toString()}
            key={`databarang${pIndex}`}
            onChangeJumlah={(pJumlah) => {
              let jumlahBarang = pJumlah == "" ? 0 : parseInt(pJumlah);
              let cart = xCart;
              let isFound = false;
              let indexCart = 0;
              xCart.forEach((pElementCart, pIndexCart) => {
                if (pElementCart.idbarang == pElement.idbarang) {
                  isFound = true;
                  indexCart = pIndexCart;
                }
              });
              if (!xReady) {
                if (jumlahBarang > 0) {
                  let subtotal = jumlahBarang * parseInt((pElement.hargabeli ?? "0").split(".")[0]);
                  if (isFound) {
                    cart[indexCart].jumlahBarang = jumlahBarang;
                    cart[indexCart].subtotal = subtotal;
                  } else {
                    cart.push({
                      idbarang: pElement.idbarang ?? "",
                      jumlahBarang: jumlahBarang,
                      subtotal: subtotal,
                      data: pElement,
                    });

                    console.log(cart)
                  }
                  let total = 0;
                  cart.forEach((pCart) => {
                    total += pCart.subtotal;
                  });
                  setXTotal(total);

                  setXDisableRingkasan(cart.length <= 0);
                  setXCart(cart);
                } else {
                  if (isFound) {
                    let cartTemp = [] as HitungBarangModel[];
                    cart.forEach((pValue, pIndexCart) => {
                      if (pIndexCart != indexCart) {
                        cartTemp.push(pValue);
                      }
                    })

                    let total = 0;
                    cartTemp.forEach((pCart) => {
                      total += pCart.subtotal;
                    });
                    setXTotal(total);

                    setXDisableRingkasan(cartTemp.length <= 0);
                    setXCart(cartTemp);
                  }
                }
              }
            }
            }
          />;
        })}
      </div>
    }
    <div className="min-h-20" />
    <BottomNavbarJual
      textButton={"Ringkasan"}
      total={xTotal.toString()}
      zIndex={30}
      onClickButton={() => {
        let temp = [] as HitungBarangModel[];
        let total=0;
        xCart.forEach(pCart => {
          xListBarangComplete.forEach(pBarang => {
            if (pCart.idbarang == pBarang.idbarang) {
              let subtotal = pCart.jumlahBarang * parseInt((pBarang.hargabeli ?? "0").split(".")[0]);
              total+=subtotal;
              temp.push({
                data: pBarang,
                idbarang: pBarang.idbarang,
                jumlahBarang: pCart.jumlahBarang,
                subtotal: subtotal,
              });
            }
          });
        })
        navigate(PageRoutes.ringkasanTransaksiBeli, {
          state: {
            items: temp,
            from: PageRoutes.tambahTransaksiBeli,
            isEdit: xIsEdit,
            dataTransaksi: xTransaksi,
            total: total,
            detailTransaksiBeli: xDetailBeli,
            supplier: xSelectedSupplier,
          }
        })
      }}
      onClickTotal={() => { setXShowPopupRangkuman(!xShowPopupRangkuman); }}
      disable={xDisableRingkasan}
    />
  </div>
}

export default TambahTransaksiBeli;