import { useLocation, useNavigate } from "react-router-dom";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { useEffect, useState } from "react";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import { PopupLoading } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import { NominasiUangModel } from "../../classModels/nominasiUangModel";
import globalVariables, { numberSeparatorFromString } from "../../Config/globalVariables";
import { BottomButton } from "../CustomWidget/bottomButton";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { PageRoutes } from "../../PageRoutes";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { NumericFormat } from "react-number-format";
import { BottomNavbarJual } from "../GlobalWidget/bottomNavbarJual";
import { DetailClosingModel } from "../../classModels/detailClosingModel";
const PostingPage = () => {
  const navigate = useNavigate();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const location = useLocation();
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xListNominasi, setxListNominasi] = useState([] as NominasiUangModel[]);
  const [xTotal, setxTotal] = useState(0);
  const [xTglOmzet, setxTglOmzet] = useState("");
  const [xCheck, setXCheck] = useState(false);
  const [xDetailClosing, setXDetailClosing] = useState(null as NominasiUangModel | null);
  const [xIdClosing, setXIdClosing] = useState("");
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
    let idClosing = "";
    let tgl="";
    if (location.state != undefined && location.state != null) {
      if (location.state.tglomzet != undefined && location.state.tglomzet != null) {
        setxTglOmzet(location.state.tglomzet);
        tgl=location.state.tglomzet;
      }
      if (location.state.idclosing != undefined && location.state.idclosing != null) {
        setXIdClosing(location.state.idclosing);
        idClosing = location.state.idclosing;
      }
    }
    getNominasiUang(idClosing,tgl);
  }, [])

  async function getDetailClosing(idClosing: string, lisNominasi: NominasiUangModel[],tglOmzet:string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("tanggal", tglOmzet);
      form.append("idlokasi", xDataLokasi.id??"");

      await AXIOS
        .post("umkm/ApiKasir/getDataSetoran", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.data as NominasiUangModel[];
          // setXDetailClosing(responseData);
          let temp = [] as NominasiUangModel[];
          lisNominasi.forEach((value) => {
            let jumlah = "0";
            responseData.forEach(element => {
              if (element.denominasi == value.denominasi) {
                jumlah = (element.amount ?? "0").split(".")[0];
              }
            });
            temp.push({
              ...value,
              amount: jumlah,
            })
          })
          console.log(temp);
          getTotal(temp);
          setxListNominasi(temp);
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
  }

  async function getNominasiUang(idclosing: string,tglomzet: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");

      await AXIOS
        .post("umkm/ApiKasir/getDaftarDenominasi", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            let responseData = data.data as NominasiUangModel[];
            let temp = [] as NominasiUangModel[];
            responseData.forEach((value) => {
              temp.push({ ...value, amount: "0" });
            })
            getDetailClosing(idclosing, temp,tglomzet);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true);
    }
    setXIsLoading(false);
  }

  async function postingClosing() {
    let check = true;
    xListNominasi.forEach((value) => {
      console.log(parseInt(value.amount ?? "0") % parseInt(value.denominasi) != 0)
      if (parseInt(value.amount ?? "0") % parseInt(value.denominasi) != 0) {
        check = false;
        console.log("check")
        setXCheck(true);
      }
    })
    if (!check) return
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("tgltrans", xTglOmzet);
      form.append("setoran", JSON.stringify({ total: xTotal, detail: xListNominasi }));

      await AXIOS
        .post("umkm/ApiClosingDate/posting", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            navigate(PageRoutes.listClosing, {
              state: {
                message: "Posting Berhasil",
                isToastError: false,
                showToast: true,
              }
            })
          } else {
            // throw ("error success==false");
            setSnackBar(data.message, true);
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  async function getTotal(listNominasi: NominasiUangModel[]) {
    let total = 0;
    listNominasi.forEach((value) => {
      total += parseInt(value.amount ?? "0")
    });
    setxListNominasi(listNominasi);
    setxTotal(total);
  }

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-start items-start overflow-y-scroll bg-background">
    <PopupLoading key="loading" open={xIsLoading} />
    {ToastSnackbar(xShowToast)}
    <CustomNavbar
      title={"Posting"}
      leftIcon={null}
      leftIconShow={true}
      functionLeftIcon={() => navigate(PageRoutes.listClosing)}
    />
    <div className="min-h-16" />
    <div className="w-full px-4">
      <div className="font-bold py-2 text-16px text-center mb-2.5">Masukkan uang setoran berdasarkan total denominasi mata uang</div>
      {xListNominasi.map((pValue, pIndex) => {
        return <TextBoxNominasi
          key={"nominasi" + pIndex}
          title={pValue.denominasi}
          onChange={(value) => {
            let temp = xListNominasi;
            temp[pIndex].amount = value;
            getTotal(temp);
          }}
          index={pIndex}
          value={pValue.amount ?? "0"}
          check={xCheck}
        />
      })}
    </div>
    <div className="min-h-20" />
    <BottomNavbarJual
      textButton={"Posting"}
      total={xTotal.toString()}
      onClickButton={() => {
        postingClosing();
      }}
      onClickTotal={() => { }}
      disable={false}
    />
  </div>
}
export default PostingPage;

const TextBoxNominasi = (pParameter: { onChange(value: string): void, index: number, value: string, title: string, check: boolean }) => {
  const [xJml, setXJml] = useState(pParameter.value);
  const [xError, setXError] = useState(false);
  useEffect(() => {
    if (parseInt(xJml) % parseInt(pParameter.title) != 0) {
      if (pParameter.check)
        setXError(true);
    } else {
      setXError(false)
    }
  }, [xJml, pParameter.check])

  return <div className="w-full">
    <div className="font-semibold text-14px text-left mb-2.5">{numberSeparatorFromString(pParameter.title)}</div>
    <div className="relative w-full mb-2.5">
      <NumericFormat
        className={`inset-y-0 h-10 ${defaultInputCSS(
          true,
          xError,
          false
        )} text-left`}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={0}
        thousandsGroupStyle="thousand"
        value={xJml}
        isAllowed={(values) => {
          let jumlah = values.floatValue ?? 0;
          return jumlah >= 0;
        }}
        allowLeadingZeros={false}
        onChange={(e) => {
          let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
          if (jumlah >= 0) {
            pParameter.onChange(jumlah.toString());
            setXJml(jumlah.toString());
          }
        }}
      />
      {xError && (
        <div className="mt-2 text-12px text-danger-Main text-left">
          {`Jumlah yang diisi harus kelipatan dari ${numberSeparatorFromString(pParameter.title)}`}
        </div>
      )}
    </div>
  </div>
}