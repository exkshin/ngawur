import { useEffect, useRef, useState } from "react";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";
import { DataHutang, ListHutangModel } from "../../classModels/listHutangModel";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { PopupLoading } from "../CustomWidget/customPopup";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import { FilterSVG } from "../../assets/icon/SVGTSX/FilterSVG";
import ListColor from "../../Config/color";
import { DropdownLokasi } from "../GlobalWidget/dropdownLokasi";
import SyncLoader from "react-spinners/SyncLoader";
import ListHutangWidget from "../GlobalWidget/listHutangWidget";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import globalVariables from "../../Config/globalVariables";
import { BottomSheetDetailHutang } from "./BottomSheetDetailHutang";

const ListHutangPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollableContentRef = useRef(null);
  const [xScroll, setXScroll] = useState(false);
  const [xLastFetchCount, setXLastFetchCount] = useState(0);
  const xJumlahDataTampil = 1000;
  const [xPage, setXPage] = useState(1);
  const [xIsLoadingPagination, setXIsLoadingPagination] = useState(false);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xLoginAsSupplier = localStorage.getItem("loginAs") == "SUPPLIER";
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xDataHutang, setXDataHutang] = useState([] as ListHutangModel[]);
  const [xSearch, setXSearch] = useState("");
  const [xSelectedLokasi, setXSelectedLokasi] = useState(JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel);
  const [xSelectedHutang, setxSelectedHutang] = useState(null as DataHutang | null)
  const [xShowDetailHutang, setxShowDetailHutang] = useState(false);
  const [xFrom, setxFrom] = useState(PageRoutes.dashboard);
  const [xIdSupplier,setXIdSupplier]=useState("");
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

  /**
   * @description untuk pengecekan scroll sudah sampai bawah atau belum
   */
  useEffect(() => {
    const addScrollListener = () => {
      const scrollableElement = scrollableContentRef.current as HTMLElement | null;
      if (scrollableElement) {
        scrollableElement.addEventListener("scroll", handleScroll);
      } else {
      }
      return () => {
        if (scrollableElement) {
          scrollableElement.removeEventListener("scroll", handleScroll);
        }
      };
    };

    const timeoutId = setTimeout(addScrollListener, 500); // Run addScrollListener after 0 milliseconds

    return () => {
      clearTimeout(timeoutId); // Clear the timeout if the component unmounts before the timeout finishes
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let idsupplier=xDataSupplierLogin.idsupplier ?? "0";
    if (location.state != undefined && location.state != null) {
      if (location.state.from != undefined && location.state.from != null ) {
        setxFrom(location.state.from);
      }
      if (location.state.idsupplier != undefined && location.state.idsupplier != null) {
        idsupplier=location.state.idsupplier ;
      }
    }
    setXIdSupplier(idsupplier)
    getListHutang(1, xSelectedLokasi.id ?? "", [],idsupplier);
  }, [])


  // Fungsi untuk memanggil fungsi dapat list barang ketika scroll mencapai bagian bawah halaman
  const handleScroll = async () => {
    const scrollableElement = scrollableContentRef.current as HTMLElement | null;

    if (scrollableElement && (scrollableElement.scrollTop + scrollableElement.clientHeight >=
      scrollableElement.scrollHeight)) {
      setXScroll(true);
    } else {
      setXScroll(false);
    }
  };

  useEffect(() => {
    if (xScroll) {
      handlePagination()
    }
  }, [xScroll])

  /**
   * 
   * fungsi yang dipanggil ketika scroll sudah sampai bawah
   */
  const handlePagination = async () => {
    if (xLastFetchCount <= 0) return;
    let page = xPage + 1;
    setXPage(page);
    // xPage = page;
    setXIsLoadingPagination(true);
    // await getListBarang(page, xSearch, xResultData, xDataBarang);
    await getListHutang(page, xSelectedLokasi.id ?? "", xDataHutang,xIdSupplier);
    setXIsLoadingPagination(false);

  }

  /**
   * @description untuk mendapatkan data list Hutang
   */
  const getListHutang = async (pPage: number, pIdLokasi: string, pDaftarHutang: ListHutangModel[], pidSupplier:string) => {
    if (pPage == 1) {
      setXIsLoading(true);
    }
    let url = "umkm/ApiSupplier/getListHutangUmkm";
    const form = new FormData();
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    // form.append("idlokasi", pIdLokasi)
    form.append("idsupplier", pidSupplier);
    form.append("page", pPage.toString());
    form.append("perpage", xJumlahDataTampil.toString());

    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success === true) {
            const responseData = data.data;
            console.log(responseData)
            let listExistingData = pDaftarHutang;
            let listIncomingData = (responseData ?? []) as ListHutangModel[];
            const fetchCount = listIncomingData.length;
            setXLastFetchCount(fetchCount);
            for (let i = 0; i < listIncomingData.length; i++) {
              if (i == 0 && listExistingData.length > 0 && listExistingData[listExistingData.length - 1].periode == listIncomingData[0].periode) {
                for (let j = 0; j < listIncomingData[0].daftar.length; j++) {
                  listExistingData[listExistingData.length - 1].daftar.push(listIncomingData[0].daftar[j]);
                }
              } else {
                listExistingData.push(listIncomingData[i]);
              }
            }
            setXDataHutang(listExistingData);
          } else {
            setSnackBar(data.message, true);
          }
        });
    } catch (error) {
      setSnackBar("Network Error", true);
      console.error(error);
    }
    if (pPage == 1) {
      setXIsLoading(false);
    }
  };

  return <div
    className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background"
    ref={scrollableContentRef}
  >
    <BottomSheetDetailHutang
      hutang={xSelectedHutang}
      onClose={(value) => setxShowDetailHutang(value)}
      open={xShowDetailHutang}
    />
    <PopupLoading key="loading" open={xIsLoading} />

    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={"Daftar Tagihan"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(xFrom)}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
      {/* <DropdownLokasi
        value={xSelectedLokasi}
        className="mb-2"
        isSupplier={true}
        onChange={(pLokasi) => {
          setXSelectedLokasi(pLokasi);
          setXPage(1);
          setXDataHutang([]);
          getListHutang(1, pLokasi.id ?? "", []);
        }} /> */}
      {
        xDataHutang.map((pValue, pIndex) => {
          return <ListHutangWidget data={pValue} index={pIndex} onShowDetail={(hutang) => {
            setxSelectedHutang(hutang);
            setxShowDetailHutang(true);
          }} />
        })
      }

      {xIsLoadingPagination && (
        <div className="w-full h-10 center">
          <SyncLoader
            color="#0172CB"
            className="text-center self-center mt-6 mb-4"
          />
        </div>
      )}
    </div>
  </div>;
}
export default ListHutangPage;