import { useState } from "react";
import { DetailBarangModel } from "../../classModels/detailBarangModel";
import { DataBarangModel } from "../../classModels/barangModel";
import noImage from"../../assets/images/no-image-icon-0.png"
import { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { AsyncImage } from 'loadable-image'

interface CardListStokBarangModel{
  classname?:string,
  dataBarang:DataBarangModel,
  onDetail?(value: DataBarangModel): void,
}

export const CardListStokBarang=(pParameter:CardListStokBarangModel)=>{
  let nama =pParameter.dataBarang.namabarang;
  let harga = parseInt((pParameter.dataBarang.hargajualmaxsatuan??"0").split(".")[0]);
  const [xUrlPhoto,setXUrlPhoto]=useState((pParameter.dataBarang.gambar??"")+ "?t=" + Date.now());
  return <>
   <div onClick={() => { pParameter.onDetail!=null&&pParameter.onDetail!=undefined&&pParameter.onDetail(pParameter.dataBarang) }}  className={`w-[47%] max-w-96 rounded-lg mb-2 bg-success-Surface shadow-lg p-2 justify-items-center ${pParameter.classname??""} `}>
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
    <p className="text-16px font-semibold mt-2 min-h-[60px] max-h-[60px] overflow-y-hidden-hidden line-clamp-3 text-center ">{nama}</p>
    <p className="text-14px text-left w-full font-semibold">Sisa H-1  : {numberSeparatorFromString( (pParameter.dataBarang.jmlsisakemarin??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
    <p className="text-14px text-left w-full font-semibold">Beli  : {numberSeparatorFromString( (pParameter.dataBarang.jmlbeli??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
    <p className="text-14px text-left w-full font-semibold">Jual  : {numberSeparatorFromString( (pParameter.dataBarang.jmljual??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
    <p className="text-14px text-left w-full font-semibold">Retur : {numberSeparatorFromString( (pParameter.dataBarang.jmlretur??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
    <p className="text-14px text-left w-full font-semibold">Sisa  : {numberSeparatorFromString( (pParameter.dataBarang.jmlsisa??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
    <p className="text-14px text-left w-full font-semibold">Stok Hari Ini  : {numberSeparatorFromString( (pParameter.dataBarang.stok??"").toString().split('.')[0])} {pParameter.dataBarang.satuan}</p>
  </div>
  </>;
}