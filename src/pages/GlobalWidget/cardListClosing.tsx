import moment from "moment";
import { numberSeparatorFromString } from "../../Config/globalVariables";
import { useState } from "react";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { useNavigate } from "react-router-dom";
import { TransaksiBeliModel } from "../../classModels/transaksiBeliModel";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import ListColor from "../../Config/color";
import { PersonSVG } from "../../assets/icon/SVGTSX/PersonSVG";
import { MoneyBillOSVG } from "../../assets/icon/SVGTSX/MoneyBillOSVG";
import { ListClosingModel } from "../../classModels/listClosingModel";
import { CheckSVG } from "../../assets/icon/SVGTSX/CheckSVG";

interface CardListClosingModel {
  onChangeShowOpsi?(value: boolean): void,
  isOpenOpsi: boolean,
  isClosing: boolean,
  dataItem: ListClosingModel,
  onEdit?(value: ListClosingModel): void,
  onCancel?(value: ListClosingModel): void,
  onDetail?(value: ListClosingModel): void,
  onPembayaran?(value: ListClosingModel): void,
  onPrintNotaClosing?(value: ListClosingModel, jenisClosing: string): void,
  onPrintNotaJual?(value: ListClosingModel): void,
  onPosting?(value: ListClosingModel): void,
  onBatalPosting?(value: ListClosingModel): void,
  onBatalSupplier?(value: ListClosingModel): void,
}
export const CardListClosing = (pParameter: CardListClosingModel) => {
  const navigate = useNavigate();
  let xWarnaBg = "bg-success-Surface";
  let xWarnaBorder = "border-success-Border";
  // let xKodeTransaksi = pParameter.dataItem.kodebeli;
  let xTanggal = moment(pParameter.dataItem.tanggal);
  let xNama = pParameter.dataItem.username;
  let xHarga = (pParameter.dataItem.omzet ?? '0').split(".")[0];
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
          disabled: (pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING",
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
          disabled: (pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING",
          text: "Posting",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPosting !== undefined && pParameter.onPosting !== null) {
              pParameter.onPosting(pParameter.dataItem);
            }
          }
        },
        {
          disabled: false,
          text: (pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING" ? "Batal Posting" : "Batal Closing",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if ((pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING") {
              if (pParameter.onBatalPosting !== undefined && pParameter.onBatalPosting !== null) {
                pParameter.onBatalPosting(pParameter.dataItem);
              }
            } else {
              if (pParameter.onCancel !== undefined && pParameter.onCancel !== null) {
                pParameter.onCancel(pParameter.dataItem);
              }
            }
          }
        },
        {
          disabled: (pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING",
          text: "Batal Closing Supplier",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onBatalSupplier !== undefined && pParameter.onBatalSupplier !== null) {
              pParameter.onBatalSupplier(pParameter.dataItem);

            }
          }
        },
        {
          disabled: false,
          text: "Print Nota Closing",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPrintNotaClosing !== undefined && pParameter.onPrintNotaClosing !== null) {
              pParameter.onPrintNotaClosing(pParameter.dataItem, "CLOSING");
            }
          }
        },
        {
          disabled: false,
          text: "Print Nota Closing Data Jual",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPrintNotaClosing !== undefined && pParameter.onPrintNotaClosing !== null) {
              pParameter.onPrintNotaClosing(pParameter.dataItem, "JUAL");
            }
          }
        },
        {
          disabled: false,
          text: "Print Nota Closing Data Retur",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPrintNotaClosing !== undefined && pParameter.onPrintNotaClosing !== null) {
              pParameter.onPrintNotaClosing(pParameter.dataItem, "RETUR");
            }
          }
        },
        {
          disabled: pParameter.dataItem.idjual == "" || pParameter.dataItem.idjual == "0" || pParameter.dataItem.idjual == null || pParameter.dataItem.idjual == undefined,
          text: "Print Nota Jual",
          onClick: () => {
            setXOpenOpsi(false);
            if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
              pParameter.onChangeShowOpsi(false);
            }
            if (pParameter.onPrintNotaJual !== undefined && pParameter.onPrintNotaJual !== null) {
              pParameter.onPrintNotaJual(pParameter.dataItem);
            }
          }
        },
      ] as OpsiItemModel[]
      }
    />
    <div className={`w-full mt-2 p-2 ${xWarnaBg} rounded-lg`} onClick={() => { openOpsi() }} >
      <div className=" flex items-center gap-1">{CalendarAltOSVG(18, ListColor.main.Border)} <p>{xTanggal.format("DD MMM YYYY")}</p> </div>
      <div className=" flex items-center gap-1">{PersonSVG(18, ListColor.main.Border)} <p>{xNama}</p> </div>
      <div className=" flex items-center gap-1">{MoneyBillOSVG(18, ListColor.main.Border)} <p>Rp{numberSeparatorFromString(xHarga)}</p> </div>
      <div className=" flex items-center gap-1"><div className="size-[18px] rounded-full bg-main-Main content-center justify-items-center">{(pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING" && CheckSVG(14, ListColor.neutral[10])}</div> <p>{(pParameter.dataItem.catatan ?? "").toUpperCase() == "POSTING" ? "Sudah Posting" : "Belum Posting"}</p> </div>
    </div>
  </>;
}