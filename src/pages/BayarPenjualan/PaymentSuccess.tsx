import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomButton } from "../CustomWidget/bottomButton";
import { PageRoutes } from "../../PageRoutes";
import { CheckSVG } from "../../assets/icon/SVGTSX/CheckSVG";
import ListColor from "../../Config/color";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { LokasiModel } from "../../classModels/lokasiModel";
import { launchWeb, printNota } from "../../Config/globalVariables";
import QRCode from "react-qr-code";
import { NumericFormat } from "react-number-format";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { CustomPopup } from "../CustomWidget/customPopup";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;
  const [xIdTrans, setxIdTrans] = useState("0");
  const [xIsEdit, setXIsEdit] = useState(false);
  const [xIsSO, setXIsSO] = useState(false);
  const [xIsBayarSO, setXIsBayarSO] = useState(false);
  const [xIsBeli, setXIsBeli] = useState(false);
  const [xKalimat, setXKalimat] = useState("");
  const [xIsClosing, setXIsClosing] = useState(false);
  const [xIdJual, setXIdJual] = useState("");
  const [xLinkFaktur, setxLinkFaktur] = useState("");
  const [xShowNoWA, setXShowNoWA] = useState(false);
  const [xWA, setXWA] = useState("");
  const [xErrorWA, setXErrorWA] = useState(false);

  useEffect(() => {
    let isSO = false;
    let isEdit = false;
    let isBayarSO = false;
    let kalimat = "";
    let isBeli = false;
    let isClosing = false;
    if (location.state != undefined && location.state != null) {
      if (location.state.idtrans != undefined && location.state.idtrans != null) {
        setxIdTrans(location.state.idtrans);
      }
      if (location.state.isBayarSO != undefined && location.state.isBayarSO != null) {
        setXIsBayarSO(location.state.isBayarSO);
        isBayarSO = location.state.isBayarSO;
      }
      if (location.state.isSO != undefined && location.state.isSO != null) {
        setXIsSO(location.state.isSO);
        isSO = location.state.isSO;
      }

      if (location.state.isBeli != undefined && location.state.isBeli != null) {
        setXIsSO(location.state.isBeli);
        isBeli = location.state.isBeli;
      }
      if (location.state.isEdit != undefined && location.state.isEdit != null) {
        setXIsEdit(location.state.isEdit);
        isEdit = location.state.isEdit;
      }
      if (location.state.isClosing != undefined && location.state.isClosing != null) {
        setXIsClosing(location.state.isClosing);
        isClosing = location.state.isClosing;
      }
      if (isClosing && location.state.idjual != undefined && location.state.idjual != null) {
        setXIdJual(location.state.idjual.toString());
      }
      console.log(location.state)
      if (location.state.linkFaktur != undefined && location.state.linkFaktur != null) {
        setxLinkFaktur(location.state.linkFaktur);
      }
    }
    if (isEdit) {
      if (isBeli) {
        kalimat = "Transaksi Beli Berhasil Diubah";
      } else if (isSO) {
        kalimat = "Transaksi Pesanan Berhasil Diubah";
      } else {
        kalimat = "Transaksi Jual Berhasil Diubah";
      }
    } else {
      if (isBeli) {
        kalimat = "Transaksi Beli Berhasil Ditambahkan";
      } else if (isSO) {
        kalimat = "Transaksi Pesanan Berhasil Ditambahkan";
      } else {
        kalimat = "Transaksi Jual Berhasil Ditambahkan";
      }
    }
    if (isBayarSO) {
      kalimat = "Transaksi Pesanan Berhasil Dibayar";
    }
    if (isClosing) {
      kalimat = "Data Closing Berhasil Disimpan";
    }
    setXKalimat(kalimat);
    setXIsBeli(isBeli);
  }, [])

  return <div className="w-screen min-h-screen max-h-screen h-screen flex flex-col justify-center items-center overflow-y-scroll bg-background">
    <CustomPopup
      content={<div className=" mb-2.5">
        <div className="font-semibold text-14px text-left mb-2.5">No WA</div>
        <div className="relative w-full mt-2.5">
          <NumericFormat
            onChange={(e) => {
              setXWA(e.target.value);
            }}
            decimalScale={0}
            placeholder={""}
            value={xWA}
            allowLeadingZeros={true}
            type={"tel"}
            className={`${defaultInputCSS((xWA !== "" && xWA !== undefined), xErrorWA, false)}`}
          />
        </div>
        {xErrorWA && <div className="text-12px text-danger-Main text-left">No WA wajib diisi</div>}
      </div>
      }
      functionButtonRight={() => {
        setXShowNoWA(false);
      }}
      functionButtonLeft={() => {
        if (xWA == "") {
          setXErrorWA(true);
        } else {
          let telp = xWA;
          if (telp[0] === "0") {
            telp = "+62" + telp.toString().substring(1, telp.length);
          }
          launchWeb('https://wa.me/' + telp + "?text=" + encodeURIComponent("Terima kasih telah berbelanja di " + xDataLokasi.nama + ".\nuntuk melihat nota digital, bisa klik di tautan berikut:\n" + xLinkFaktur));
        }
      }}
      onClose={() => {
        setXShowNoWA(false);
      }}
      dismissible={true}
      open={xShowNoWA}
      textButtonRight="Kembali"
      textButtonLeft="Simpan"
      zIndex={70}
    />
    {xLinkFaktur == "" ?
      <div className="size-32 rounded-full bg-main-Main content-center justify-items-center mb-2">{CheckSVG(80, ListColor.neutral[10])}</div>
      : <div className="mb-2 p-4 bg-neutral-10 rounded-xl">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "200px", width: "200px%" }}
          value={xLinkFaktur}
          viewBox={`0 0 256 256`}
        />
        <p className="font-semibold text-14px text-center mt-4">Scan Disini Untuk Lihat Nota</p>
      </div>
    }
    <div className="text-h5 font-semibold">{xKalimat}</div>
    <div
      onClick={() => {
        if (xIsClosing) {
          printNota({
            idPerusahaan: xDataLogin.idperusahaan ?? "",
            idUser: xDataLogin.iduser ?? "",
            idTransaksi: xIdTrans.toString(),
            type: "CLOSING"
          });
        }
        else if (xIsBeli) {
          printNota({
            idPerusahaan: xDataLogin.idperusahaan ?? "",
            idUser: xDataLogin.iduser ?? "",
            idTransaksi: xIdTrans.toString(),
            type: "BELI"
          });
        } else {
          if (xIsBayarSO) {
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: xIdTrans.toString(),
              type: "JUAL"
            });

          } else if (xIsSO) {
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: xIdTrans.toString(),
              type: "SO"
            });
          } else {
            printNota({
              idPerusahaan: xDataLogin.idperusahaan ?? "",
              idUser: xDataLogin.iduser ?? "",
              idTransaksi: xIdTrans.toString(),
              type: "JUAL"
            });
          }
        }
      }}
      className="rounded-full py-2 px-8 my-4 bg-main-Hover text-14px font-bold text-neutral-10">{xIsClosing ? "Cetak Nota Closing" : "Cetak Nota"}</div>
    {xIsClosing && xIdJual !== "" && xIdJual !== "0" &&
      <div
        onClick={() => {
          printNota({
            idPerusahaan: xDataLogin.idperusahaan ?? "",
            idUser: xDataLogin.iduser ?? "",
            idTransaksi: xIdJual.toString(),
            type: "JUAL"
          });
        }}
        className="rounded-full py-2 px-8 mb-2 bg-neutral-10 text-14px font-bold text-main-Hover border border-main-Hover">Cetak Nota Jual</div>
    }
    {xIsBeli == false && xIsClosing == false &&
      <div
        onClick={() => {
          setXShowNoWA(true);
        }}
        className="rounded-full py-2 px-8 mb-2 bg-neutral-10 text-14px font-bold text-main-Hover border border-main-Hover">Kirim WA</div>
    }
    <BottomButton onClick={() => {
      navigate(xIsClosing ? PageRoutes.listClosing : xIsBeli ? PageRoutes.listTransaksiBeli : PageRoutes.listTransaksiJual);

    }} text={xIsClosing ? "Kembali Ke List Closing" : xIsBeli ? "Kembali Ke Transaksi Beli" : "Kembali Ke Transaksi Jual"} />
  </div>
}
export default PaymentSuccess;