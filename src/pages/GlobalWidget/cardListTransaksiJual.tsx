import moment from "moment";
import { numberSeparatorFromString } from "../../Config/globalVariables";
import { ChevronDownSVG } from "../../assets/icon/SVGTSX/ChevronDownSVG";
import ListColor from "../../Config/color";
import { useState } from "react";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { useNavigate } from "react-router-dom";
import { PageRoutes } from "../../PageRoutes";
import { TransaksiJualModel } from "../../classModels/transaksiJualModel";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";

interface CardListTransaksiJualModel {
  isSO: boolean,
  onChangeShowOpsi?(value: boolean): void,
  isOpenOpsi: boolean,
  isClosing: boolean,
  dataItem: TransaksiJualModel,
  onEdit?(value: TransaksiJualModel): void,
  onCancel?(value: TransaksiJualModel): void,
  onDetail?(value: TransaksiJualModel): void,
  onPembayaran?(value: TransaksiJualModel): void,
  onPrintNota?(value: TransaksiJualModel): void,
}
export const CardListTransaksiJual = (pParameter: CardListTransaksiJualModel) => {
  const navigate = useNavigate();
  let xWarnaBg = pParameter.isSO ? "bg-warning-Surface" : "bg-success-Surface";
  let xWarnaBorder = pParameter.isSO ? "border-warning-Border" : "border-success-Border";
  let xKodeTransaksi = pParameter.dataItem.kodetrans;
  let xTanggal = moment(pParameter.isSO ? ((pParameter.dataItem.tglkirim ?? "") + " " + (pParameter.dataItem.jamkirim ?? "")) : pParameter.dataItem.tgltrans);
  let xHarga = (pParameter.dataItem.grandtotal ?? '0').split(".")[0];
  const [xExpand, setXExpand] = useState(false);
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
          disabled: (!pParameter.isSO&& pParameter.isClosing) || (!pParameter.isSO && (pParameter.dataItem.idso ?? "" !== "") && (pParameter.dataItem.idso ?? "") !== "0"),
          text: "Edit",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onEdit !== undefined && pParameter.onEdit !== null) {
              pParameter.onEdit(pParameter.dataItem);
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
          disabled: false,
          text: "Print Nota",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPrintNota !== undefined && pParameter.onPrintNota !== null) {
              pParameter.onPrintNota(pParameter.dataItem);
            }
          }
        },
        pParameter.isSO && {
          disabled: false,
          text: "Bayar Pesanan",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPembayaran !== undefined && pParameter.onPembayaran !== null) {
              pParameter.onPembayaran(pParameter.dataItem);
            }
          }
        },
      ] as OpsiItemModel[]
      }
    />
    <div className={`w-full mt-2`} >
      <div onClick={() => { openOpsi() }} className={`w-full text-16px font-bold rounded-t-lg ${xWarnaBg} py-1 px-2 border ${xWarnaBorder}`}>
        <div className="flex justify-between items-end">
          <p>{xKodeTransaksi}</p>
          <p className="text-12px font-normal" >{xTanggal.format("DD MMM YYYY")}</p>
        </div>
        <div className="text-12px font-semibold flex">
          <p className="w-full">{pParameter.dataItem.namacustomer}</p>
          {pParameter.isSO && <p className="text-12px font-normal" >{xTanggal.format("HH:mm")}</p>}
        </div>
      </div>
      <div className={`w-full ${xWarnaBg} border-x px-2 py-1 ${xWarnaBorder}`} onClick={() => { openOpsi() }} >
        {(pParameter.dataItem.detail ?? []).map((pElement, pIndex) => {
          if (!xExpand && pIndex > 2) {
            return <></>;
          } else {
            return <div key={`itemJual${pParameter.dataItem.idtrans}-${pIndex}`}>
              <p>{pElement.namabarang} </p>
              <div className="flex justify-between">
                <div className="text-12px font-normal" >{numberSeparatorFromString((pElement.jml ?? "").split(".")[0])} x Rp{numberSeparatorFromString((pElement.harga ?? "").split(".")[0])}</div>
                <div className="text-12px font-bold">Rp{numberSeparatorFromString((pElement.subtotal ?? "").split(".")[0])}</div>
              </div>
            </div>;
          }
        })
        }
      </div>
      {pParameter.dataItem.detail.length > 3 &&
        <div className={`w-full ${xWarnaBg} border-x px-2 ${xWarnaBorder}`} onClick={() => { setXExpand(!xExpand) }} >
          <div className="w-6 mx-auto">{
            xExpand ?
              AngleUpSVG(24, pParameter.isSO ? ListColor.warning.Main : ListColor.main.Main)
              : AngleDownSVG(24, pParameter.isSO ? ListColor.warning.Main : ListColor.main.Main)
          }</div>
        </div>
      }
      <div onClick={() => { openOpsi() }} className={`w-full text-14px font-bold rounded-b-lg justify-between flex ${xWarnaBg} border py-1 px-2 ${xWarnaBorder}`}>
        <p className={`${pParameter.isSO ? "text-warning-Main" : "text-success-Main"}`} >{pParameter.isSO ? "Pesanan" : `Lunas${(pParameter.dataItem.idso ?? "" !== "") && (pParameter.dataItem.idso ?? "") !== "0" ? " (SO)" : ""}`}</p>
        <p className="text-14px font-bold" >Rp{numberSeparatorFromString(xHarga)}</p>
      </div>
    </div>
  </>;
}