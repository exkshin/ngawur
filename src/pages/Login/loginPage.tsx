import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailOSVG } from "../../assets/icon/SVGTSX/MailOSVG";
import ListColor from "../../Config/color";
import { KeySkeletonSVG } from "../../assets/icon/SVGTSX/KeySkeletonSVG";
import { EyeSplashSVG } from "../../assets/icon/SVGTSX/EyeSplashSVG";
import { EyeSVG } from "../../assets/icon/SVGTSX/EyeSVG";
import { keylang, tr } from "../../Config/translate";
import AXIOS from "../../Config/axiosRequest";

import { DefaultInputCustomModel, WidgetDefaultInputCustom } from "../CustomWidget/widgetDefaultInputCustom";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { launchWeb, validateEmail } from "../../Config/globalVariables";
import { notificationDialogAutoCloseModel, WidgetNotificationDialogAutoClose } from "../CustomWidget/notificationDialogAutoClose";
import { CustomPopup, CustomPopupOpsi, PopupLoading, PopupLoginImage } from "../CustomWidget/customPopup";
import { PageRoutes } from "../../PageRoutes";
import { HakAksesModel, LoginModelClass } from "../../classModels/loginModelClass";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { ChevronDownSVG } from "../../assets/icon/SVGTSX/ChevronDownSVG";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";
import { MagnifySVG } from "../../assets/icon/SVGTSX/MagnifySVG";
import galaxysnack from "../../assets/images/galaxysnack.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [xGoBack, setXGoBack] = useState(false);
  const [xOpenOpsi, setXOpenOpsi] = useState(false);
  const [xLoginAs, setxLoginAs] = useState(localStorage.getItem("loginAs") ?? "ADMIN");
  const [xNama, setXNama] = useState("");
  const [xOpenWelcome, setxOpenWelcome] = useState(false);
  const [xDataLogin, setXDataLogin] = useState({
    email: localStorage.getItem("emailLogin") ?? "",
    password: "",
  });
  const [xEmailResetPasswordValue, setXEmailResetPasswordValue] = useState({
    value: "",
    error: false,
    disabled: false,
    readonly: false,
    errortext: tr(keylang.FORMATEMAILISINCORRECT),
    title: tr(keylang.INSERTYOUREMAIL),
  } as DefaultInputCustomModel);
  const [xShowToast, setXShowToast] = useState({
    text: "",
    show: false,
    isToastError: false,
  } as ToastSnackbarModel);
  const [xIsPasswordVisible, setXIsPasswordVisible] = useState(false);
  const [xOpenModalLupaPassword, setXOpenModalLupaPassword] = useState(false);
  const [xOpenModalConfirmLupaPassword, setXOpenModalConfirmLupaPassword] = useState(false);
  const [xTokenFirebase, setXTokenFirebase] = useState("");
  const [xDeviceID, setXDeviceID] = useState("");
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xNotificationPopup, setXNotificationPopup] =
    useState<notificationDialogAutoCloseModel>(() => {
      const defaultPopup: notificationDialogAutoCloseModel = {
        show: location.state?.success ? true : false,
        content: (
          <div className="text-center text-black text-h5 font-bold leading">
            {location.state?.success ? location.state?.message : "BERHASIL"}
          </div>
        ),
        success: location.state?.success ? location.state?.success : false,
        duration: 3000,
        onChange: (value: boolean) => {
          setXNotificationPopup((prevState) => ({ ...prevState, show: value }));
        },
      };

      // Return location state if available, else default
      return defaultPopup;
    });

  /**
   * @description fungsi untuk menjalankan suatu perintah ketika klik back di hp
   */
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

    // cleanup this component
    return () => {
      window.removeEventListener("message", detectBack, true);
    };
  }, []);

  useEffect(() => {
    if (xGoBack) {
      setXGoBack(false);
      if (xIsLoading) return;
      if (xOpenModalLupaPassword) {
        if (xOpenModalConfirmLupaPassword) {
          setXOpenModalConfirmLupaPassword(false);
        } else {
          setXOpenModalLupaPassword(false);
        }
      }
      if (xOpenOpsi) {
        setXOpenOpsi(false);
      }
    }
  }, [xGoBack]);

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
   * @description toggle password dari text ke lingkaran dan sebaliknya
   */
  function togglePasswordVisibility() {
    setXIsPasswordVisible((prevState) => !prevState);
  }

  async function onSubmitLupaPassword() {
    setXIsLoading(true);
    console.log(validateEmail(xEmailResetPasswordValue.value.trim()));
    if (!validateEmail(xEmailResetPasswordValue.value.trim())) {
      setXEmailResetPasswordValue({
        ...xEmailResetPasswordValue,
        error: true,
      });
      setXOpenModalLupaPassword(true);
      return;
    } else {
      setXEmailResetPasswordValue({
        ...xEmailResetPasswordValue,
        error: false,
      });
      const form = new FormData();
      form.append("email", xDataLogin.email);
      try {
        await AXIOS
          .post("Master/ApiMember/lupaPassword", form)
          .then((res) => res.data)
          .then((data) => {
            if (data.success === true) {
              setSnackBar("Email Telah Dikirim", false);
              setXOpenModalLupaPassword(false);
            } else {
              let msg = globalVariables.errorMsg;
              if (data.message == "EMAIL_NOT_EXISTS") {
                msg = tr(keylang.EMAILISNOTREGISTERED);
              }
              setSnackBar(msg, true);
            }
          });
      } catch (error) {
        setSnackBar(globalVariables.errorMsg, true)
        console.error(error);
      }
    }
    setXIsLoading(false);
  }

  async function getDataLoginSupplier(idsupplier: string) {
    setXIsLoading(true);
    const form = new FormData();
    form.append("idsupplier", idsupplier);
    form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    try {
      await AXIOS
        .post("umkm/ApiSupplier/getDataSupplier", form)
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          if (data.success == true) {
            const responseData = data.data;
            let datalogin = responseData as LoginSupplierModel;
            localStorage.setItem("dataLoginSupplier", JSON.stringify(datalogin));
            localStorage.setItem("loginAs", "SUPPLIER");
            try {
              window.flutter_inappwebview.callHandler(
                "simpanDataLoginSupplier",
                JSON.stringify(responseData),
              );
            } catch (error) {

            }
            setXIsLoading(false);
            setxOpenWelcome(true);
            setTimeout(() => {
              navigate("/select-location", {
                state: {
                  fromPage: "login",
                }
              });
            }, 3000);
            // localStorage.setItem("Datalogin", JSON.stringify({
            //   email: xDataLogin.email,
            //   password: xDataLogin.password,
            //   idTrainer: 1
            // }));
          } else {
            setSnackBar(data.message, true);
            setXIsLoading(false);
          }
        });
    } catch (error) {
      setSnackBar(globalVariables.errorMsg, true)
      console.error(error);
    }
    setXIsLoading(false);
  }

  async function getDataLogin(iduser: string, namauser: string, idperusahaan: string, namaperusahaan: string) {
    setXIsLoading(true);
    const form = new FormData();
    form.append("iduser", iduser);
    form.append("idperusahaan", idperusahaan);
    form.append("tokenfirebase", xDataLogin.password);
    try {
      await AXIOS
        .post("api/Master/ApiUser/getDataLogin", form)
        .then((res) => res.data)
        .then((data) => {
          console.log(data.message);
          if (data.success == true) {
            const responseData = data.data;
            let datalogin = responseData as LoginModelClass;
            datalogin.aksespesananpenjualanso = responseData['aksespesananpenjualan(so)'] as HakAksesModel;
            datalogin.iduser = iduser;
            datalogin.namauser = namauser;
            datalogin.idperusahaan = idperusahaan;
            datalogin.namaperusahaan = namaperusahaan;
            localStorage.setItem("dataLogin", JSON.stringify(datalogin));
            localStorage.setItem("loginAs", "ADMIN");
            localStorage.setItem("email", "ADMIN");
            try {
              window.flutter_inappwebview.callHandler(
                "simpanDataLogin",
                JSON.stringify(responseData),
              );
            } catch (error) {

            }
            setXIsLoading(false);

            setxOpenWelcome(true);
            setTimeout(() => {
              navigate("/select-location", {
                state: {
                  fromPage: "login",
                }
              });
            }, 3000);
            // localStorage.setItem("Datalogin", JSON.stringify({
            //   email: xDataLogin.email,
            //   password: xDataLogin.password,
            //   idTrainer: 1
            // }));
          } else {
            console.log(data.message.message);
            setSnackBar(data.message, true);
            setXIsLoading(false);
          }
        });
    } catch (error) {
      setSnackBar(globalVariables.errorMsg, true)
      console.error(error);
    }
    setXIsLoading(false);
  }

  async function onSubmitLogin() {
    if (!validateEmail(xDataLogin.email.trim())) {
      setSnackBar("Format Email Salah", true);
      return;
    }
    setXIsLoading(true);
    const form = new FormData();
    form.append("email", xDataLogin.email.trim());
    form.append("password", xDataLogin.password);
    let url = "Login/cekLogin";
    if (xLoginAs == "SUPPLIER") {
      url = "umkm/ApiSupplier/cekLogin";
      form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
    }
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.success == true) {
            const responseData = data.daftarPerusahaan;
            localStorage.setItem("emailLogin", xDataLogin.email.trim());
            if (xLoginAs == "SUPPLIER") {
              await getDataLoginSupplier(data.data.idsupplier);
            } else {
              await getHakAkses(responseData[0].idperusahaan, data.iduser)
              await getDataLogin(data.iduser, data.namauser, responseData[0].idperusahaan, responseData[0].namaperusahaan);
            }
          } else {
            console.log(data)
            if (xLoginAs == "SUPPLIER") {
              setSnackBar(data.message, true);
            }else{
            setSnackBar(data.errorMsg, true);
          }
            setXIsLoading(false);
          }
        });
    } catch (error) {
      setSnackBar(globalVariables.errorMsg, true)
      console.error(error);
    }
    setXIsLoading(false);
  }

  async function onSearchEmail() {
    if (xDataLogin.email == "") {
      setSnackBar("email Tidak Boleh Kosong", true);
      return;
    } if (!validateEmail(xDataLogin.email.trim())) {
      setSnackBar("Format Email Salah", true);
      return;
    }
    setXIsLoading(true);
    const form = new FormData();
    form.append("email", xDataLogin.email.trim());
    let url = "api/Master/ApiUser/getNamaUser";
    if (xLoginAs == "SUPPLIER") {
      url = "umkm/ApiSupplier/getNamaSupplier";
      form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
      form.append("iduser", globalVariables.idUserGlobal);
    }
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.success == true) {
            const responseData = data.data;
            if (xLoginAs == "SUPPLIER") {
              if (responseData.namasupplier == null || responseData.namasupplier == undefined) {
                setSnackBar("User Tidak Ditemukan", true);
                setXNama("");
              } else {
                // setSnackBar(responseData.namasupplier,false);
                setXNama(responseData.namasupplier ?? "");
              }
            } else {
              if (responseData.username == null || responseData.username == undefined) {
                setSnackBar("User Tidak Ditemukan", true);
              } else {
                setSnackBar(responseData.username, false);
              }
            }
          } else {
            console.log(data)
            setSnackBar(data.errorMsg, true);
            setXIsLoading(false);
          }
        });
    } catch (error) {
      setSnackBar(globalVariables.errorMsg, true)
      console.error(error);
    }
    setXIsLoading(false);
  }

  async function getHakAkses(idperusahaan: string, iduser: string) {
    if (xDataLogin.email == "") {
      setSnackBar("email Tidak Boleh Kosong", true);
      return;
    } if (!validateEmail(xDataLogin.email.trim())) {
      setSnackBar("Format Email Salah", true);
      return;
    }
    setXIsLoading(true);
    const form = new FormData();
    form.append("email", xDataLogin.email.trim());
    let url = "api/Master/ApiUser/getAksesUmkm";
    form.append("idperusahaan", idperusahaan);
    form.append("iduser", iduser);
    try {
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then(async (data) => {
          if (data.success == true) {
            const responseData = data.data;
            localStorage.setItem("hakAkses", JSON.stringify(responseData));
          } else {
            console.log(data)
            setSnackBar(data.errorMsg, true);
            setXIsLoading(false);
          }
        });
    } catch (error) {
      setSnackBar(globalVariables.errorMsg, true)
      console.error(error);
    }
    setXIsLoading(false);
  }

  return (
    <>
      {WidgetNotificationDialogAutoClose(xNotificationPopup)}
      <PopupLoading open={xIsLoading} />
      <PopupLoginImage open={xOpenWelcome} />
      {ToastSnackbar(xShowToast)}
      <OpsiWidget
        openOpsi={xOpenOpsi}
        onClose={() => {
          setXOpenOpsi(false);
        }}
        title="Login Sebagai"
        item={[
          {
            disabled: false,
            text: "ADMIN",
            onClick: () => {
              setXOpenOpsi(false);
              setxLoginAs("ADMIN");
            }
          },
          {
            disabled: false,
            text: "SUPPLIER",
            onClick: () => {
              setXOpenOpsi(false);
              setxLoginAs("SUPPLIER");
            }
          },
        ] as OpsiItemModel[]
        }
      />
      <div className="App font-Asap max-h-screen w-screen ">
        <div
          className="bgColorLogin"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
          }}
        >
          <div className=" bgLogin h-full w-full"></div>
        </div>
        <div
          style={{
            zIndex: 5,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="flex flex-col items-center justify-end xl:justify-start px-2 mx-auto lg:pt-10 xl:pt-10 h-full">
            <div className="w-full mb-[30%] bg-black bg-opacity-30 rounded-lg  md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 backdrop-blur">
              <div className="px-2 py-3.5 space-y-4 md:space-y-2.5">
                <div className="space-y-2.5 md:space-y-2.5">
                  <div className={`w-full block`}>
                    <div className="font-semibold text-14px text-left mb-2.5">Login Sebagai</div>
                    <div className="relative w-full mt-2.5" onClick={() => {
                      setXOpenOpsi(true);
                    }}>
                      <input
                        placeholder={""}
                        value={xLoginAs}
                        type={"text"}
                        readOnly={true}
                        className={`pr-6 ${defaultInputCSS(true, false, true)}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pl-3 pointer-events-none pr-4">
                        {ChevronDownSVG(24, "black")}
                      </div>
                    </div>
                  </div>
                  <div className="w-full block">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {MailOSVG(24, ListColor.neutral[90])}
                      </div>
                      <input
                        placeholder="Email"
                        autoComplete={"false"}
                        value={xDataLogin.email}
                        onChange={(e) => {
                          setXDataLogin({
                            ...xDataLogin,
                            email: e.target.value,
                          });
                        }}
                        className={`input-border px-10 bg-neutral-10 border border-neutral-40 text-[#101C42] placeholder:text-[#6E7377]  sm:text-sm rounded-lg block w-full p-2.5`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                        onClick={() => {
                          onSearchEmail();
                        }}
                      >
                        {MagnifySVG(24, ListColor.neutral[90])}
                      </button>
                    </div>
                  </div>
                  {xNama != "" && <div className="text-left text-neutral-10 font-bold">Nama User : {xNama}</div>}
                  <div className="w-full block">
                    <div className="relative w-full mt-2.5">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {KeySkeletonSVG(24, ListColor.neutral[90])}
                      </div>
                      <input
                        onChange={(e) => {
                          setXDataLogin({
                            ...xDataLogin,
                            password: e.target.value,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            // onSubmitLogin();
                          }
                        }}
                        placeholder="Password"
                        autoComplete="false"
                        type={xIsPasswordVisible ? "text" : "password"}
                        className={`input-border px-10 bg-neutral-10 focus:ring-0 focus:outline-none border border-neutral-40 text-[#101C42] placeholder:text-[#6E7377]  sm:text-sm rounded-lg block w-full p-2.5`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {xIsPasswordVisible
                          ? EyeSVG(24, ListColor.neutral[90])
                          : EyeSplashSVG(24, ListColor.neutral[90])}
                        {/* <FontAwesomeIcon className="w-5 h-5 text-[#50555B]" icon={xIsPasswordVisible ? faEye : faEyeSlash} /> */}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={` ${xDataLogin.password === "" || xDataLogin.email === ""
                      ? "bg-neutral-30 text-neutral-70"
                      : "bg-main-Main text-neutral-10"
                      } w-full rounded-md text-16px font-bold px-5 py-1.5 text-center`}
                    onClick={(event) => {
                      event.preventDefault();
                      onSubmitLogin();
                      // navigate(PageRoutes.selectLocation, {
                      //   state: {
                      //     fromPage: PageRoutes.login,
                      //   }
                      // });
                    }}
                  >
                    Login
                  </button>
                  <div
                    className="font-bold text-12px text-main-Main"
                    onClick={() => {
                      launchWeb("https://app.atena.id");
                    }}
                  >
                    Lupa Password
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
