import { useLocation, useNavigate } from "react-router-dom";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { keylang, tr } from "../../Config/translate";
import { EditSVG } from "../../assets/icon/SVGTSX/EditSVG";
import ListColor from "../../Config/color";
import { PageRoutes } from "../../PageRoutes";
import { useEffect, useState } from "react";
import { ProfileModel } from "../../classModels/profileModel";
import { DetailDivStandard } from "../GlobalWidget/DetailDivStandard";
import MaleAvatar from "../../assets/images/male_avatar.png";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { CustomPopup, PopupLoading } from "../CustomWidget/customPopup";
import AXIOS from "../../Config/axiosRequest";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables from "../../Config/globalVariables";
import { LoginSupplierModel } from "../../classModels/loginSupplierModel";
import { BottomButton } from "../CustomWidget/bottomButton";
import { EyeSVG } from "../../assets/icon/SVGTSX/EyeSVG";
import { EyeSplashSVG } from "../../assets/icon/SVGTSX/EyeSplashSVG";
import { KeySkeletonSVG } from "../../assets/icon/SVGTSX/KeySkeletonSVG";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { AsyncImage } from 'loadable-image'

const ProfilePage = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const [xDataProfile, setxDataprofile] = useState(null as ProfileModel | null);
  const [xLinkFoto, setXLinkFoto] = useState(MaleAvatar);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  let xDataSupplierLogin = JSON.parse(localStorage.getItem("dataLoginSupplier") ?? "{}") as LoginSupplierModel;
  let xLoginAsSupplier = localStorage.getItem("loginAs") == "SUPPLIER";
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xErrorPassword, setXErrorPassword] = useState("");
  const [xErrorPasswordBaru, setXErrorPasswordBaru] = useState("");
  const [xErrorKonfirmasiPasswordBaru, setXErrorKonfirmasiPasswordBaru] = useState("");
  const [xPassword, setXPassword] = useState("");
  const [xPasswordBaru, setXPasswordBaru] = useState("");
  const [xKonfirmasiPasswordBaru, setXKonfirmasiPasswordBaru] = useState("");
  const [xIsVisiblePassword, setXIsVisiblePassword] = useState(false);
  const [xIsVisiblePasswordBaru, setXIsVisiblePasswordBaru] = useState(false);
  const [xIsVisibleKonfirmasiPasswordBaru, setXIsVisibleKonfirmasiPasswordBaru] = useState(false);
  const [xShowUbahPassword, setXShowUbahPassword] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
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
    if (xLoginAsSupplier) {
      setxDataprofile({
        username: xDataSupplierLogin.namasupplier,
        email: xDataSupplierLogin.email,
        hp: xDataSupplierLogin.telp,
      })
    } else {
      getProfile()
    }
    if(location.state!=undefined&&location.state!=null){
      let message=location.state.message??"";
      let isError=location.state.isError??false;
      if(location.state.showSnackbar!=undefined&&location.state.showSnackbar!=null&&location.state.showSnackbar==true){
        setSnackBar(message,isError);
      }
    }
  }, [])


  async function getProfile() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      await AXIOS
        .post("api/Master/ApiUser/getDataProfile", form)
        .then((res) => res.data)
        .then((data) => {
          const responseData = data.data as ProfileModel;
          setxDataprofile(responseData);
          setXLinkFoto((responseData.gambarpath ?? "")+ "?t=" + Date.now());
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  async function simpanUbahPassword() {
    setXIsLoading(true);
    try {
      setXShowkonfirmasi(false);
      let url = xLoginAsSupplier ? "umkm/ApiSupplier/ubahPassword" : "api/Master/ApiUser/ubahPassword";
      const form = new FormData();
      form.append("passwordlama", xPassword);
      form.append("password", xPasswordBaru);
      if (xLoginAsSupplier) {
        form.append("idperusahaan", globalVariables.idPerusahaanGlobal);
        form.append("idsupplier", xDataSupplierLogin.idsupplier ?? "");

      } else {
        form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
        form.append("iduser", xDataLogin.iduser ?? "");
      }
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            setSnackBar("Password Berhasil Diubah", false);
          } else { 
            if((data.message??"")!==""){
              setXErrorPassword(data.message);
              setSnackBar(data.message, true);
              setXShowUbahPassword(true); 
            }
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
      setXShowUbahPassword(true); 
    }
    setXIsLoading(false);
  }

  return (
    <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start font-Asap overflow-auto">
      <PopupLoading key="loading" open={xIsLoading} />
      {ToastSnackbar(xShowToast)}
      {/* konfirmasi ubah password  */}
      <CustomPopup
        content={<div className="">
          <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin ingin mengubah password?</div>
        </div>}
        functionButtonRight={() => {
          setXShowkonfirmasi(false);
          setXShowUbahPassword(true);
        }}
        functionButtonLeft={() => {
          simpanUbahPassword();
        }}
        onClose={() => {
          setXShowkonfirmasi(false);
          setXShowUbahPassword(true);
        }}
        dismissible={false}
        open={xShowKonfirmasi}
        textButtonRight="Tidak"
        textButtonLeft="Ya"
        zIndex={81}
      />
      {/* form ubah password  */}
      <CustomPopup
        content={<div className="">
          <div className="font-semibold text-center text-16px mb-2.5">Ubah Password</div>
          <div className=" mb-2.5 w-full">
            <div className="font-semibold text-14px text-left mb-2.5">Password Lama *</div>
            <div className="w-full block">
              <div className="relative w-full mt-2.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {KeySkeletonSVG(24, ListColor.neutral[90])}
                </div>
                <input
                  onChange={(e) => {
                    setXPassword(e.target.value);
                  }}
                  autoComplete="false"
                  value={xPassword}
                  type={xIsVisiblePassword ? "text" : "password"}
                  className={`${defaultInputCSS((xPassword !== "" && xPassword !== undefined), xErrorPassword !== "", false)} px-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                  onClick={() => setXIsVisiblePassword(!xIsVisiblePassword)}
                >
                  {!xIsVisiblePassword
                    ? EyeSVG(24, ListColor.neutral[90])
                    : EyeSplashSVG(24, ListColor.neutral[90])}
                  {/* <FontAwesomeIcon className="w-5 h-5 text-[#50555B]" icon={xIsPasswordVisible ? faEye : faEyeSlash} /> */}
                </button>
              </div>
              {xErrorPassword != "" && <div className="text-12px text-danger-Main text-left">{xErrorPassword}</div>}
            </div>
          </div>
          <div className=" mb-2.5 w-full">
            <div className="font-semibold text-14px text-left mb-2.5">Password Baru *</div>
            <div className="w-full block">
              <div className="relative w-full mt-2.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {KeySkeletonSVG(24, ListColor.neutral[90])}
                </div>
                <input
                  onChange={(e) => {
                    setXPasswordBaru(e.target.value);
                  }}
                  autoComplete="false"
                  value={xPasswordBaru}
                  type={xIsVisiblePasswordBaru ? "text" : "password"}
                  className={`${defaultInputCSS((xPasswordBaru !== "" && xPasswordBaru !== undefined), xErrorPasswordBaru !== "", false)} px-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                  onClick={() => setXIsVisiblePasswordBaru(!xIsVisiblePasswordBaru)}
                >
                  {!xIsVisiblePasswordBaru
                    ? EyeSVG(24, ListColor.neutral[90])
                    : EyeSplashSVG(24, ListColor.neutral[90])}
                  {/* <FontAwesomeIcon className="w-5 h-5 text-[#50555B]" icon={xIsPasswordVisible ? faEye : faEyeSlash} /> */}
                </button>
              </div>
              {xErrorPasswordBaru != "" && <div className="text-12px text-danger-Main text-left">{xErrorPasswordBaru}</div>}
            </div>
          </div>
          <div className=" mb-2.5 w-full">
            <div className="font-semibold text-14px text-left mb-2.5">Konfirmasi Password Baru *</div>
            <div className="w-full block">
              <div className="relative w-full mt-2.5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {KeySkeletonSVG(24, ListColor.neutral[90])}
                </div>
                <input
                  onChange={(e) => {
                    setXKonfirmasiPasswordBaru(e.target.value);
                  }}
                  autoComplete="false"
                  value={xKonfirmasiPasswordBaru}
                  type={xIsVisibleKonfirmasiPasswordBaru ? "text" : "password"}
                  className={`${defaultInputCSS((xKonfirmasiPasswordBaru !== "" && xKonfirmasiPasswordBaru !== undefined), xErrorKonfirmasiPasswordBaru !== "", false)} px-10`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                  onClick={() => setXIsVisibleKonfirmasiPasswordBaru(!xIsVisiblePasswordBaru)}
                >
                  {!xIsVisibleKonfirmasiPasswordBaru
                    ? EyeSVG(24, ListColor.neutral[90])
                    : EyeSplashSVG(24, ListColor.neutral[90])}
                  {/* <FontAwesomeIcon className="w-5 h-5 text-[#50555B]" icon={xIsPasswordVisible ? faEye : faEyeSlash} /> */}
                </button>
              </div>
              {xErrorKonfirmasiPasswordBaru != "" && <div className="text-12px text-danger-Main text-left">{xErrorKonfirmasiPasswordBaru}</div>}
            </div>
          </div>
        </div>}
        functionButtonRight={() => {
          setXShowUbahPassword(false);
        }}
        functionButtonLeft={() => {
          setXErrorPassword("");
          setXErrorPasswordBaru("");
          setXErrorKonfirmasiPasswordBaru("");
          let check = true;
          if (xPassword == "") {
            setXErrorPassword("Password Lama Wajib Diisi");
            check = false;
          }
          if (xPasswordBaru == "") {
            setXErrorPasswordBaru("Password Baru Wajib Diisi")
            check = false;
          }
          if (xKonfirmasiPasswordBaru == "") {
            setXErrorKonfirmasiPasswordBaru("Konfirmasi Password Baru Wajib Diisi")
            check = false;
          } else if (xKonfirmasiPasswordBaru != xPasswordBaru) {
            setXErrorKonfirmasiPasswordBaru("Konfirmasi Password Baru Tidak Sama Dengan Password Baru")
            check = false;
          }
          if (check) {
            setXShowUbahPassword(false);
            setXShowkonfirmasi(true);
          }
        }}
        onClose={() => {
          if (!xShowKonfirmasi) {
            setXShowUbahPassword(false);
          }
        }}
        dismissible={!xShowKonfirmasi}
        open={xShowUbahPassword}
        textButtonRight="Kembali"
        textButtonLeft="Simpan"
        zIndex={70}
      />
      <CustomNavbar
        leftIconShow={true}
        leftIcon={null}
        functionLeftIcon={() => {
          navigate(PageRoutes.dashboard);
        }}
        rightIconShow={!xLoginAsSupplier}
        rightIcon={EditSVG(24, ListColor.main.Main)}
        functionRightIcon={() => navigate(PageRoutes.formProfile)}
        title={"Profile"}
      />
      <div className="min-h-14" />
      {
        xDataProfile != null && <div className="w-full px-4 py-2">
          <div className="w-full max-w-96 mb-2">
            <img
              src={xLinkFoto}
              alt={"no image"}
              style={{
                width: "100%",
                aspectRatio: 4 / 3,
                objectFit: "cover",
              }}
loading="lazy"
              onError={() => {
                setXLinkFoto(MaleAvatar);
              }}
            />
          </div>
          <DetailDivStandard widthTitle={null} title={"Nama"} subtitle={xDataProfile?.username} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"No Telp"} subtitle={xDataProfile?.hp} verticalAlign={null} />
          <DetailDivStandard widthTitle={null} title={"Email"} subtitle={xDataProfile?.email} verticalAlign={null} />
        </div>
      }
      <BottomButton text="Ubah Password" onClick={() => {
        setXShowUbahPassword(true);
        setXPassword("");
        setXErrorPassword("");
        setXIsVisiblePassword(false);
        setXPasswordBaru("");
        setXErrorPasswordBaru("");
        setXIsVisiblePasswordBaru(false);
        setXKonfirmasiPasswordBaru("");
        setXErrorKonfirmasiPasswordBaru("");
        setXIsVisibleKonfirmasiPasswordBaru(false);
      }} />
    </div>
  );
}

export default ProfilePage;