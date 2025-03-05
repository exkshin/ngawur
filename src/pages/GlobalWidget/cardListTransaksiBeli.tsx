import moment from "moment";
import { numberSeparatorFromString } from "../../Config/globalVariables";
import { useState } from "react";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { useNavigate } from "react-router-dom";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";

interface CardListTransaksiBeliModel {
  onChangeShowOpsi?(value: boolean): void,
  isOpenOpsi: boolean,
  isClosing: boolean,
  dataItem: TransaksiBeliModel,
  onEdit?(value: TransaksiBeliModel): void,
  onCancel?(value: TransaksiBeliModel): void,
  onDetail?(value: TransaksiBeliModel): void,
  onPrintNota?(value: TransaksiBeliModel): void,
  onPembayaran?(value: TransaksiBeliModel): void,
}
export const CardListTransaksiBeli = (pParameter: CardListTransaksiBeliModel) => {
  const navigate = useNavigate();
  let xWarnaBg =  "bg-success-Surface";
  let xWarnaBorder =  "border-success-Border";
  let xKodeTransaksi = pParameter.dataItem.kodetrans;
  let xTanggal = moment(pParameter.dataItem.tgltrans);
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
          disabled: pParameter.isClosing,
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
      ] as OpsiItemModel[]
      }
    />
    <div className={`w-full mt-2 ${xWarnaBg} rounded-lg`} >
      <div onClick={() => { openOpsi() }} className={`w-full text-16px font-bold rounded-t-lg ${xWarnaBg} py-1 px-2 border text-main-Main`}>
        <div className="flex justify-between items-end">
          <p>{xKodeTransaksi}</p>
          <p className="text-12px font-normal" >{xTanggal.format("DD MMM YYYY")}</p>
        </div>
        <div className="text-12px font-semibold">
          <p>{pParameter.dataItem.namasupplier}</p>
        </div>
      </div>
      <div onClick={() => { openOpsi() }} className={`w-full text-14px font-bold rounded-b-lg justify-between flex ${xWarnaBg} border py-1 px-2 text-main-Main`}>
        <p className={`text-success-Main"`} >{pParameter.dataItem.jenistransaksi}</p>
        <p className="text-14px font-bold" >Rp{numberSeparatorFromString(xHarga)}</p>
      </div>
    </div>
  </>;
}