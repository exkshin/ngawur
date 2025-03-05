import { useEffect, useState } from "react";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { PlusSVG } from "../../assets/icon/SVGTSX/plusSVG";
import ListColor from "../../Config/color";
import { MinusSVG } from "../../assets/icon/SVGTSX/minusSVG";
import { NumericFormat } from 'react-number-format';
import { numberSeparator } from "../../Config/globalVariables";
import { DataBarangModel } from "../../classModels/barangModel";
import moment from "moment";
import noImage from"../../assets/images/no-image-icon-0.png"
import { AsyncImage } from 'loadable-image'

interface CardBarangTransaksiJualModel{
  classname?:string,
  onChangeJumlah(value:string):void,
  dataBarang:DataBarangModel,
  initialJumlah:string,
  isBeli?:boolean
}
export const CardBarangTransaksiJual = (pParameter:CardBarangTransaksiJualModel) => {
  const [xJumlah, setXJumlah] = useState(pParameter.initialJumlah);
  let nama =pParameter.dataBarang.namabarang;
  let harga = parseInt((pParameter.dataBarang.hargajualmaxsatuan??"0").split(".")[0]);
  let hargabeli = parseInt((pParameter.dataBarang.hargabeli??"0").split(".")[0]);
  let hargajual = parseInt((pParameter.dataBarang.hargajualmaxsatuan??"0").split(".")[0]);
  if(pParameter.isBeli==true){
    harga = parseInt((pParameter.dataBarang.hargabeli??"0").split(".")[0]);
  }
  const [xUrlPhoto,setXUrlPhoto]=useState((pParameter.dataBarang.gambar??"")+ "?t=" + Date.now());
  useEffect(() => {
    pParameter.onChangeJumlah(xJumlah);
  }, [xJumlah])

  useEffect(() => {
    let tempFoto = pParameter.dataBarang.gambar ?? 'z/NO_IMAGE.JPG?xx'
    if(tempFoto.substring(tempFoto.lastIndexOf('/') + 1).split('?')[0] == 'NO_IMAGE.jpg') {
      setXUrlPhoto(noImage)
    } else {
      setXUrlPhoto((tempFoto??"")+ "?t=" + Date.now())
    }
  }, [pParameter.dataBarang.gambar])

  useEffect(() => {
    setXJumlah(pParameter.initialJumlah)
  }, [pParameter.initialJumlah])
  
  
  return <div className={`w-[47%] max-w-96 rounded-lg mb-2 bg-success-Surface shadow-lg p-2 text-center justify-items-center ${pParameter.classname??""} `}>
    <div>
      <img
        src={xUrlPhoto}
        alt={pParameter.dataBarang.namabarang??"no image"}
        onError={()=>{
          setXUrlPhoto(noImage)
        }}
        style={{
          width: "100%",
          aspectRatio: 4 / 3,
          objectFit: "cover",
        }}
        loading="lazy"
      />
    </div>
    <p className="text-16px font-semibold mt-2 min-h-[60px] max-h-[60px] overflow-y-hidden-hidden line-clamp-3">{nama}</p>
    <div className="text-14px font-bold flex">
      <div className="text-main-Pressed">Rp{numberSeparator(hargajual)}</div>{pParameter.isBeli==true&&<p>/</p>}{pParameter.isBeli==true&&<div className="text-danger-Hover">Rp{numberSeparator(hargabeli)}</div>}</div>
    <div className="flex w-full mt-2 items-center">
      <div
        onClick={() => {
          let jumlah = parseInt(xJumlah);
          if (jumlah - 1 >= 0) {
            setXJumlah((jumlah - 1).toString());
          }
        }}
        className="rounded-full bg-main-Main size-8 min-w-8 font-bold items-center content-center justify-items-center text-neutral-20"
      >
        {MinusSVG(18, ListColor.neutral[20])}
      </div>
      <NumericFormat
        className={`inset-y-0 h-10 ${defaultInputCSS(
          true,
          false,
          false
        )} text-center mx-1`}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={0}
        thousandsGroupStyle="thousand"
        value={xJumlah}
        isAllowed={(values) => {
          let jumlah = values.floatValue ?? 0;
          return jumlah >= 0;
        }}
        allowLeadingZeros={false}
        onChange={(e) => {
          let jumlah = e.target.value == "" ? 0 : parseInt(e.target.value.replaceAll(",", "").replaceAll(".", ""));
          if (jumlah >= 0) {
            setXJumlah((jumlah).toString());
          }
        }}
      />
      <div
        onClick={() => {
          let jumlah = parseInt(xJumlah);
          setXJumlah((jumlah + 1).toString());
        }}
        className="rounded-full bg-main-Main size-8 min-w-8 font-bold items-center content-center justify-items-center text-neutral-20"
      >
        {PlusSVG(18, ListColor.neutral[20])}
      </div>
    </div>
  </div>;
}