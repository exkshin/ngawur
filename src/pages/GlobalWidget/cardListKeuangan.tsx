import moment from "moment";
import { numberSeparatorFromString } from "../../Config/globalVariables";
import { useState } from "react";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { useNavigate } from "react-router-dom";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { ListKasKeuanganModel } from "../../classModels/listKasKeuanganModel";
import { CalculatorOSVG } from "../../assets/icon/SVGTSX/CalculatorOSVG";
import ListColor from "../../Config/color";
import { ClipboardAltSVG } from "../../assets/icon/SVGTSX/ClipboardAltSVG";
import { MoneyBagSVG } from "../../assets/icon/SVGTSX/MoneyBagSVG";
import { MoneySVG } from "../../assets/icon/SVGTSX/MoneySVG";
import { MoneyWithdrawalOSVG } from "../../assets/icon/SVGTSX/MoneyWithdrawalOSVG";
import { CheckSVG } from "../../assets/icon/SVGTSX/CheckSVG";
import { MultiplySVG } from "../../assets/icon/SVGTSX/MultiplySVG";

interface CardListKeuanganModel {
  onChangeShowOpsi?(value: boolean): void,
  isOpenOpsi: boolean,
  isClosing: boolean,
  forClosing?: boolean,
  dataItem: ListKasKeuanganModel,
  onCancel?(value: ListKasKeuanganModel): void,
  onDetail?(value: ListKasKeuanganModel): void,
  onOtorisasi?(value: ListKasKeuanganModel): void,
  onCetak?(value: ListKasKeuanganModel): void,
  onVerifikasi?(value: ListKasKeuanganModel): void,
}
export const CardListKeuangan = (pParameter: CardListKeuanganModel) => {
  const navigate = useNavigate();
  let xWarnaBg = "bg-success-Surface";
  let xWarnaBorder = "border-success-Pressed";
  let xKodeTransaksi = pParameter.dataItem.kodetrans ?? "";
  let xTanggal = moment(pParameter.dataItem.tgltrans);
  let xHarga = (pParameter.dataItem.total ?? '0').toString().split(".")[0];
  let xStatus = "";
  let xNeedVerifikasi = false;
  const [xOpenOpsi, setXOpenOpsi] = useState(false);
  function openOpsi() {
    if (xOpenOpsi) {
      setXOpenOpsi(false);
      if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
        pParameter.onChangeShowOpsi(false);
      }
    } else {
      if (pParameter.isOpenOpsi == false) {
        setXOpenOpsi(true);
        if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
          pParameter.onChangeShowOpsi(true);
        }
      }
    }
  }

  if (pParameter.dataItem.status == "S") {
    xWarnaBg = "bg-success-Surface";
    xWarnaBorder = "border-success-Border";
  } else if (pParameter.dataItem.status == "P") {
    xWarnaBg = "bg-warning-Surface";
    xWarnaBorder = "border-warning-Border";
  } else {
    xWarnaBg = "bg-neutral-10";
    xWarnaBorder = "border-neutral-70";
  }
  if (pParameter.dataItem.jenistrans == "KAS MASUK") {
    xStatus = "Otorisasi";
  } else if (pParameter.dataItem.jenistrans == "KAS KELUAR") {
    xStatus = "Otorisasi";
    if (pParameter.dataItem.status !== "S") {
      xNeedVerifikasi = true;
    }
  } else if (pParameter.dataItem.jenistrans == "PELUNASAN HUTANG") {
    xStatus = "Verifikasi";
    if (pParameter.dataItem.status !== "P") {
      xNeedVerifikasi = true;
    }
  }
  return <>
    <OpsiWidget
      openOpsi={xOpenOpsi}
      onClose={() => {
        setXOpenOpsi(false);
        if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
          pParameter.onChangeShowOpsi(false);
        }
      }}
      item={[
        {
          disabled: false,
          text: "Detail",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onDetail !== undefined && pParameter.onDetail !== null) {
              pParameter.onDetail(pParameter.dataItem);
            }
          }
        },
        {
          disabled: pParameter.isClosing,
          text: "Batal",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onCancel !== undefined && pParameter.onCancel !== null) {
              pParameter.onCancel(pParameter.dataItem);
            }
          }
        },
        {
          disabled: xNeedVerifikasi,
          text: "Cetak Nota",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onCetak !== undefined && pParameter.onCetak !== null) {
              pParameter.onCetak(pParameter.dataItem);
            }
          }
        },
        // pParameter.dataItem.jenistrans == "KAS KELUAR"? {
        //   disabled: xNeedVerifikasi||pParameter.isClosing,
        //   text: "Otorisasi",
        //   onClick: () => {
        //     setXOpenOpsi(false);
        //     if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
        //       pParameter.onChangeShowOpsi(false);
        //     }
        //     if (pParameter.onOtorisasi !== undefined && pParameter.onOtorisasi !== null) {
        //       pParameter.onOtorisasi(pParameter.dataItem);
        //     }
        //   }
        // }:pParameter.dataItem.jenistrans == "PELUNASAN HUTANG"?{
        //   disabled: xNeedVerifikasi||pParameter.isClosing,
        //   text: "Otorisasi",
        //   onClick: () => {
        //     setXOpenOpsi(false);
        //     if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
        //       pParameter.onChangeShowOpsi(false);
        //     }
        //     if (pParameter.onVerifikasi !== undefined && pParameter.onVerifikasi !== null) {
        //       pParameter.onVerifikasi(pParameter.dataItem);
        //     }
        //   }
        // }:null,
      ] as OpsiItemModel[]
      }
    />
    <div className={`w-full mt-2 ${xWarnaBg} rounded-lg relative`} >
      {pParameter.forClosing!==true&&
      <div className={`size-[18px] mt-1.5 absolute left-40 rounded-full bg-main-Main content-center justify-items-center`} onClick={() => {
        if (xNeedVerifikasi&& pParameter.forClosing!=true) {
          if (pParameter.dataItem.jenistrans == "PELUNASAN HUTANG") {
            if (pParameter.onVerifikasi !== undefined && pParameter.onVerifikasi !== null) {
              pParameter.onVerifikasi(pParameter.dataItem);
            }
          } else {
            if (pParameter.onOtorisasi !== undefined && pParameter.onOtorisasi !== null) {
              pParameter.onOtorisasi(pParameter.dataItem);
            }
          }
        }
      }}>
        {xNeedVerifikasi ? MultiplySVG(14, ListColor.neutral[10]) : CheckSVG(14, ListColor.neutral[10])}
      </div>}
      <div onClick={() => { if(pParameter.forClosing!=true) openOpsi() }} className={`w-full  rounded-lg ${xWarnaBg}`}>
        <div className={`flex justify-between items-end text-16px font-bold px-1 py-1 border ${xWarnaBorder} rounded-t-lg`}>
          <p>{xKodeTransaksi}</p>
          <p className="text-12px font-normal" >{xTanggal.format("DD MMM YYYY")}</p>
        </div>
        <div className={`w-full ${xWarnaBorder} text-14px rounded-b-lg border border-t-0 px-1 py-1`}>
          <div className="w-full flex gap-1 mb-1">
            <div>{MoneyWithdrawalOSVG(18, ListColor.main.Main)}</div>
            <div className=" w-full whitespace-pre-line">
              <p>{pParameter.dataItem.kodeperkiraan} - {pParameter.dataItem.namaperkiraan}</p>
            </div>
            <p className="font-bold">Rp{numberSeparatorFromString((pParameter.dataItem.total ?? "0").split(".")[0])}</p>
          </div>
          <div className="w-full flex gap-1 mb-1">
            <div>{ClipboardAltSVG(18, ListColor.main.Main)}</div>
            <div className="whitespace-pre-line">
              <p>{pParameter.dataItem.catatan}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}