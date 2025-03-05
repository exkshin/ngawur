import { useEffect, useState } from "react";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { PlusSVG } from "../../assets/icon/SVGTSX/plusSVG";
import ListColor from "../../Config/color";
import { MinusSVG } from "../../assets/icon/SVGTSX/minusSVG";
import { NumericFormat } from 'react-number-format';
import { numberSeparator } from "../../Config/globalVariables";
import { DataBarangModel } from "../../classModels/barangModel";
import moment from "moment";
import noImage from "../../assets/images/no-image-icon-0.png"

interface CardBarangClosingWidgetModel {
  classname?: string,
  onChangeJumlah(retur: string, sisa: string): void,
  dataBarang: DataBarangModel,
  initialSisa: string,
  initialRetur: string,
}
export const CardBarangClosingWidget = (pParameter: CardBarangClosingWidgetModel) => {
  const [xJumlah, setXJumlah] = useState({ sisa: pParameter.initialSisa, retur: pParameter.initialRetur });
  let nama = pParameter.dataBarang.namabarang;
  useEffect(() => {
    pParameter.onChangeJumlah(xJumlah.retur, xJumlah.sisa);
  }, [xJumlah])

  return <div className={`w-full mb-1.5 justify-items-center ${pParameter.classname ?? ""} `}>
    {/* <p className="text-16px font-semibold mt-2 overflow-y-hidden-hidden line-clamp-3">{nama}</p> */}
    <div className="flex w-full items-center gap-1">
      <div className="min-w-48 max-w-48 text-left text-12px">{nama}</div>
        <NumericFormat
          className={`inset-y-0 ${defaultInputCSS(
            true,
            false,
            false
          )} text-center py-1`}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={0}
          thousandsGroupStyle="thousand"
          value={xJumlah.retur}
          isAllowed={(values) => {
            let jumlah = values.floatValue ?? 0;
            return jumlah >= 0;
          }}
          allowLeadingZeros={false}
          onChange={(e) => {
            let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
            if (jumlah >= 0) {
              setXJumlah({ retur: (jumlah).toString(), sisa: xJumlah.sisa });
            }
          }}
        />
        <NumericFormat
          className={`inset-y-0 ${defaultInputCSS(
            true,
            false,
            false
          )} text-center py-1`}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={0}
          thousandsGroupStyle="thousand"
          value={xJumlah.sisa}
          isAllowed={(values) => {
            let jumlah = values.floatValue ?? 0;
            return jumlah >= 0;
          }}
          allowLeadingZeros={false}
          onChange={(e) => {
            let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
            if (jumlah >= 0) {
              setXJumlah({ sisa: (jumlah).toString(), retur: xJumlah.retur });
            }
          }}
        />
    </div>
  </div>;
}