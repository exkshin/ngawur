import { useState } from "react";
import noImage from"../../assets/images/no-image-icon-0.png"
import { AlatBayarModel } from "../../classModels/alatBayarModel";
import { AsyncImage } from 'loadable-image'

export interface AlatBayarWidgetModel{
  checked:boolean,
  dataAlatBayar:AlatBayarModel,
  onClick():void
}

export const AlatBayarWidget=(pParameter:AlatBayarWidgetModel)=>{
  let nama =pParameter.dataAlatBayar.namaalatbayar;
  const [xUrlPhoto,setXUrlPhoto]=useState((pParameter.dataAlatBayar.gambar??"")+ "?t=" + Date.now());

  return <div 
  className={`w-[45%] max-w-96 rounded-lg mb-2 ${pParameter.checked?" border bg-main-Surface border-main-Border":"bg-neutral-10"} shadow-lg p-2 text-center justify-items-center`} 
  onClick={()=>pParameter.onClick()}
  >
    <div>
      <img
        src={xUrlPhoto}
        alt={nama??"no image"}
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
    </div>
}