import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PopupLoading } from "../CustomWidget/customPopup";
import { keylang, tr } from "../../Config/translate";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { QrcodeScanSVG } from "../../assets/icon/SVGTSX/QrcodeScanSVG";
import ListColor from "../../Config/color";
import { LokasiModel } from "../../classModels/lokasiModel";
import { CardListLokasi } from "../CustomWidget/cardListLokasi";
import { BottomButton } from "../CustomWidget/bottomButton";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import globalVariables from "../../Config/globalVariables";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { PageRoutes } from "../../PageRoutes";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";

const SelectLocationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [xGoBack, setXGoBack] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xListLokasi, setXListLokasi] = useState([] as LokasiModel[]);
  const [xListLokasiAll, setXListLokasiAll] = useState([] as LokasiModel[]);
  const [xSelectedLokasi, setXSelectedLokasi] = useState(null as LokasiModel | null);
  const [xSearchLocation, setXSearchLocation] = useState("");
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xLoginAs = localStorage.getItem("loginAs") ?? "";
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  

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

  const detectBack = (event: MessageEvent) => {
    if (event.data === "GoBack") {
      setXGoBack(true);
    }
  };

  /**
 * @description untuk tambahkan listener ketika user klik back di hp
 */
  useEffect(() => {
    window.addEventListener("message", detectBack, true);
    getDataCabang();
    // cleanup this component
    return () => {
      window.removeEventListener("message", detectBack, true);
    };
  }, []);

  useEffect(() => {
    if (xGoBack) {
      setXGoBack(false);
      if (xIsLoading) return;
      //! SET CONFIRMATION TO GO BACK TO LOGIN
      goBack()
    }
  }, [xGoBack]);

  async function getDataCabang() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      let url="api/Master/ApiLokasi/index";
      if (xLoginAs == "SUPPLIER") {
        url="umkm/ApiSupplier/getDataLokasi";
        form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
      }else {
        form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
        form.append("iduser", xDataLogin.iduser ?? "");
      }
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          let responseData = data.rows;
          if (xLoginAs == "SUPPLIER") {
            responseData=data.data;
          }
          setXIsLoading(false);
          setXListLokasi(responseData as LokasiModel[]);
          setXListLokasiAll(responseData as LokasiModel[]);
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  function goBack(){
    if (location.state != null && location.state?.fromPage == PageRoutes.dashboard) {
      navigate(PageRoutes.dashboard);
    } else {
      navigate(PageRoutes.login);
    }
  }

  return (
    <>
      <PopupLoading open={xIsLoading} />
      {ToastSnackbar(xShowToast)}
      <div className="App font-Asap h-screen w-screen bg-background">
        <SearchNavbar
          showBack={true}
          backFunction={() => {
            goBack();
          }}
          onChangeSearch={(value) => {
            setXSearchLocation(value);
            let listlokasi = xListLokasiAll.filter((valueLokasi) => {
              return (valueLokasi.nama ?? "").toLowerCase().includes(value.toLowerCase()) || (valueLokasi.alamat ?? "").toLowerCase().includes(value.toLowerCase());
            });
            setXListLokasi(listlokasi);
          }}
          searchFunction={(value) => { }}
          showFrontIcon={false}
          valueSearch={xSearchLocation}
          placeholder={tr(keylang.SEARCHLOCATION)}
          frontIcon={undefined}
          frontFunction={() => { }}
        />
        <div className="flex flex-col justify-between h-full overflow-y-auto pt-[49px] pb-[86px]">
          <div className={`flex-grow flex flex-col ${xListLokasi.length <= 0 && "justify-center items-center"}`}>

            <div className="flex flex-col gap-4 px-4 w-full pt-[21px] items-center">
              {xListLokasi.map((item, index) => (
                <CardListLokasi
                  key={index}
                  item={item}
                  onClick={(pItem) => {
                    setXSelectedLokasi(pItem);
                  }}
                  isSelected={xSelectedLokasi != null && xSelectedLokasi.id === item.id}
                  onClose={() => { }} />
              ))}
            </div>
          </div>
        </div>
        <BottomButton text={tr(keylang.SELECTLOCATION)} onClick={() => {
          if (xSelectedLokasi != null) {
            localStorage.setItem("dataLokasi", JSON.stringify(xSelectedLokasi));
            if(xLoginAs!=="SUPPLIER"){
            try {
              window.flutter_inappwebview.callHandler(
                "simpanDataLokasi",
                JSON.stringify(xSelectedLokasi),
              );
            } catch (error) {

            }}
            // navigate("/dashboard", { state: xSelectedLokasi });
            navigate(PageRoutes.dashboard);
          }
        }}
          disabled={xSelectedLokasi == null}
        />
      </div>
    </>
  );
};

export default SelectLocationPage;
