import { useState } from "react";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { BarangBySupplierModel, DataBarangModel, HeaderHitungBarangClosingModel, HitungBarangClosingModel, HitungBarangModel } from "../../classModels/barangModel";
import ListColor from "../../Config/color";
import { CardBarangTransaksiJual } from "./cardBarangTransaksiJual";
import { CardBarangClosingWidget } from "./cardBarangClosingWidgetModel";

interface BarangBySupplierClosingWidgetModel{
  data: BarangBySupplierModel, 
  index: number,
  indexCart:number,
  cart:HitungBarangClosingModel[],
  onExpand():void,
  onChangeJumlah(indexSupplier:number, indexBarang:number, jumlah:{retur:string,sisa:string},data:DataBarangModel):void,
}
const BarangBySupplierClosingWidget = (pParameter:BarangBySupplierClosingWidgetModel) => {
    const [xExpand,setXExpand]=useState(true)
    const cariJumlahBarang=(pIdBarang:string)=>{
      let retur=0;
      let sisa=0;
      pParameter.cart.forEach((pElementCart, pIndexCart) => {
        if (pElementCart.idbarang ==pIdBarang) {
          retur=pElementCart.retur;
          sisa=pElementCart.sisa;
        }
      });
      return {
        retur:retur,
        sisa:sisa,
      };
    }
  return <>
    <div key={"barangsupplier" + pParameter.index} className="flex px-4 w-full justify-between items-center mb-2.5"
      onClick={() => {
        setXExpand(!xExpand)
      }}
    >
      <p className="font-14px font-bold">{pParameter.data.namasupplier}</p>
      <div>{xExpand ? AngleUpSVG(24, ListColor.main.Main) : AngleDownSVG(24, ListColor.main.Main)}</div>
    </div>
    {xExpand ?
      <div className="flex-wrap flex justify-between w-full px-4">
        {pParameter.data.daftarbarang.map((pElementBarang, pIndexBarang) => {
          return <CardBarangClosingWidget 
          dataBarang={pElementBarang}
          initialRetur={cariJumlahBarang(pElementBarang.idbarang??"").retur.toString()}
          initialSisa={cariJumlahBarang(pElementBarang.idbarang??"").sisa.toString()}
          onChangeJumlah={(pRetur,pSisa)=>{
            pParameter.onChangeJumlah(pParameter.index,pIndexBarang,{retur: pRetur, sisa: pSisa},pElementBarang);
          }}
          key={"barangsupplier" + pParameter.index + "-" + pIndexBarang} />;        
        })}
      </div> : <></>
    }
  </>;
}
export default BarangBySupplierClosingWidget;