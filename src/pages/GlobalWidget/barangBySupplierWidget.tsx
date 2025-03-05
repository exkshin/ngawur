import { useState } from "react";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { BarangBySupplierModel, HitungBarangModel } from "../../classModels/barangModel";
import ListColor from "../../Config/color";
import { CardBarangTransaksiJual } from "./cardBarangTransaksiJual";

interface BarangBySupplierWidgetModel{
  data: BarangBySupplierModel, 
  index: number,
  cart:HitungBarangModel[],
  onExpand():void,
  onChangeJumlah(indexSupplier:number, indexBarang:number, jumlah:string):void,
}
const BarangBySupplierWidget = (pParameter:BarangBySupplierWidgetModel) => {
    const [xExpand,setXExpand]=useState(true)
    const cariJumlahBarang=(pIdBarang:string)=>{
      let jumlah=0;
      pParameter.cart.forEach((pElementCart, pIndexCart) => {
        if (pElementCart.idbarang ==pIdBarang) {
          jumlah=pElementCart.jumlahBarang;
        }
      });
      return jumlah;
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
          return <CardBarangTransaksiJual 
          dataBarang={pElementBarang}
          initialJumlah={cariJumlahBarang(pElementBarang.idbarang??"").toString()}
          onChangeJumlah={(pValue)=>{
            pParameter.onChangeJumlah(pParameter.index,pIndexBarang,pValue);
          }}
          key={"barangsupplier" + pParameter.index + "-" + pIndexBarang} />;        
        })}
      </div> : <></>
    }
  </>;
}
export default BarangBySupplierWidget;