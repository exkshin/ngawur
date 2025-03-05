import { useEffect, useRef, useState } from "react";
import MaleAvatar from "../../assets/images/male_avatar.png";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { ProfileModel } from "../../classModels/profileModel";
import AXIOS from "../../Config/axiosRequest";
import { CustomPopup, CustomPopupOpsi, PopupLoading } from "../CustomWidget/customPopup";
import { ToastSnackbar, ToastSnackbarModel } from "../CustomWidget/toastSnackbar";
import globalVariables, { compressImage } from "../../Config/globalVariables";
import { CustomNavbar } from "../CustomWidget/customNavbar";
import { useNavigate } from "react-router-dom";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { CameraOSVG } from "../../assets/icon/SVGTSX/CameraOSVG";
import { GallerySVG } from "../../assets/icon/SVGTSX/GallerySVG";
import { PageRoutes } from "../../PageRoutes";
import { BottomButton } from "../CustomWidget/bottomButton";
import { NumericFormat } from "react-number-format";
import { AsyncImage } from 'loadable-image'
const FormProfilePage = () => {
  const navigate = useNavigate();
  const [xDataProfile, setxDataprofile] = useState(null as ProfileModel | null);
  const [xLinkFoto, setXLinkFoto] = useState(MaleAvatar);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xShowKonfirmasi, setXShowkonfirmasi] = useState(false);
  const [xUsername, setXUsername] = useState("");
  const [xEmail, setXEmail] = useState("");
  const [xErrorUsername, setXErrorUsername] = useState(false);
  const [xHp, setXHp] = useState("");
  const [xErrorHP, setXErrorHP] = useState(false);
  const [xOpenImage, setXOpenImage] = useState(false);
  const xRefPhoto = useRef<HTMLInputElement | null>(null);
  const xRefGaleri = useRef<HTMLInputElement | null>(null);
  const [xIsLoadingContent, setXIsLoadingContent] = useState(false);
  const [xFileFoto, setXFileFoto] = useState<File | null | undefined>(null);
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

  async function simpanProfile() {
    setXIsLoading(true);
    try {
      setXShowkonfirmasi(false);
      let url = "api/Master/ApiUser/simpan";
      const form = new FormData();
      form.append("userid", xDataProfile?.userid ?? "");
      form.append("username", xUsername);
      form.append("email", xEmail);
      form.append("hp", xHp);
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("gambar", xDataProfile?.gambar ?? "");
      form.append("filegambar", xFileFoto ?? "");
      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success) {
            navigate(PageRoutes.profile, {
              state: {
                message: "Profile Berhasil Dirubah",
                showSnackbar: true,
                isError: false,
              }
            })
          } else {
            if ((data.message ?? "") !== "") {
              setSnackBar(data.message, true);
            }
          }
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

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
          setXEmail(responseData.email ?? "");
          setXHp(responseData.hp ?? "");
          setXUsername(responseData.username ?? "");
        }
        );
    } catch (error) {
      console.log(error);
      setSnackBar(globalVariables.errorMsg, true)
    }
    setXIsLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, [])


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

  return <div className="w-screen min-h-screen h-screen flex flex-col justify-start items-start font-Asap overflow-auto">
    <PopupLoading key="loading" open={xIsLoading || xIsLoadingContent} />
    {ToastSnackbar(xShowToast)}
    <CustomPopupOpsi content={contentPopupImage()} onClose={() => setXOpenImage(false)} open={xOpenImage} zIndex={10} />
    {/* konfirmasi ubah password  */}
    <CustomPopup
      content={<div className="">
        <div className="font-semibold text-center text-16px mb-2.5">Apakah anda yakin data profile sudah betul?</div>
      </div>}
      functionButtonRight={() => {
        setXShowkonfirmasi(false);
      }}
      functionButtonLeft={() => {
        simpanProfile();
      }}
      onClose={() => {
        setXShowkonfirmasi(false);
      }}
      dismissible={false}
      open={xShowKonfirmasi}
      textButtonRight="Tidak"
      textButtonLeft="Ya"
      zIndex={81}
    />
    <CustomNavbar
      leftIconShow={true}
      leftIcon={null}
      functionLeftIcon={() => {
        navigate(-1);
      }}
      rightIconShow={false}
      title={"Profile"}
    />
    <div className="min-h-14" />
    <div className="w-full px-4 py-2">
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
      <div className="w-full max-w-96 mb-2"
        onClick={() => setXOpenImage(true)}>
        <img
          src={xLinkFoto}
          alt={"no image"}
          style={{
            width: "100%",
            aspectRatio: 4 / 3,
            objectFit: "cover",
          }}
          loading="lazy"
        />
      </div>

      <div className=" mb-2.5 w-full">
        <div className="font-semibold text-14px text-left mb-2.5">Nama *</div>
        <div className="relative w-full mt-2.5">
          <input
            onChange={(e) => {
              setXUsername(e.target.value);
            }}
            placeholder={""}
            value={xUsername}
            type={"text"}
            className={`${defaultInputCSS((xUsername !== "" && xUsername !== undefined), xErrorUsername, false)}`}
          />
        </div>
        {xErrorUsername && <div className="text-12px text-danger-Main text-left">Nama wajib diisi</div>}
      </div>
      <div className=" mb-2.5  w-full">
        <div className="font-semibold text-14px text-left mb-2.5">No HP</div>
        <div className="relative w-full mt-2.5">
          <NumericFormat
            onChange={(e) => {
              setXHp(e.target.value);
            }}
            decimalScale={0}
            allowLeadingZeros={true}
            placeholder={""}
            value={xHp}
            type={"tel"}
            className={`${defaultInputCSS((xHp !== "" && xHp !== undefined), false, false)}`}
          />
        </div>
      </div>
      <div className=" mb-2.5 w-full">
        <div className="font-semibold text-14px text-left mb-2.5">Email</div>
        <div className="relative w-full mt-2.5">
          <input
            disabled={true}
            placeholder={""}
            value={xEmail}
            type={"text"}
            className={`${defaultInputCSS((xEmail !== "" && xEmail !== undefined), false, false)}`}
          />
        </div>
      </div>
    </div>
    <BottomButton text="Simpan" onClick={() => {
      if (xUsername == "") {
        setXErrorUsername(true);
      }else{
        setXShowkonfirmasi(true);
      }
    }} />
  </div>
}
export default FormProfilePage;