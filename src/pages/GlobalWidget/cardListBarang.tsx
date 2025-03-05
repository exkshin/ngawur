import { useState, useEffect } from "react";
import { DetailBarangModel } from "../../classModels/detailBarangModel";
import { DataBarangModel } from "../../classModels/barangModel";
import noImage from"../../assets/images/no-image-icon-0.png"
import { numberSeparator } from "../../Config/globalVariables";
import { OpsiItemModel, OpsiWidget } from "../CustomWidget/Opsi";
import { AsyncImage } from 'loadable-image'

interface CardListBarangModel{
  classname?:string,
  dataBarang:DataBarangModel,
  onChangeShowOpsi?(value: boolean): void,
  isOpenOpsi: boolean,
  disableEdit?:boolean,
  onEdit?(value: DataBarangModel): void,
  onDetail?(value: DataBarangModel): void,
}

export const CardListBarang=(pParameter:CardListBarangModel)=>{
  let nama =pParameter.dataBarang.namabarang;
  let harga = parseInt((pParameter.dataBarang.hargajualmaxsatuan??"0").split(".")[0]);
  let hargabeli= parseInt((pParameter.dataBarang.hargabeli??"0").split(".")[0]);
  const [xUrlPhoto,setXUrlPhoto]=useState((pParameter.dataBarang.gambar??"")+ "?t=" + Date.now());
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

  useEffect(() => {
    let tempFoto = pParameter.dataBarang.gambar ?? 'z/NO_IMAGE.JPG?xx'
    if(tempFoto.substring(tempFoto.lastIndexOf('/') + 1).split('?')[0] == 'NO_IMAGE.jpg') {
      setXUrlPhoto(noImage)
    } else {
      setXUrlPhoto((tempFoto??"")+ "?t=" + Date.now())
    }
  }, [pParameter.dataBarang.gambar])
  

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
            pParameter.onDetail(pParameter.dataBarang);
          }
        }
      },
      {
        disabled: pParameter.disableEdit??false,
        text: "Edit",
        onClick: () => {
          setXOpenOpsi(false);
          if (pParameter.onChangeShowOpsi !== undefined && pParameter.onChangeShowOpsi !== null) {
            pParameter.onChangeShowOpsi(false);
          }
          if (pParameter.onEdit !== undefined && pParameter.onEdit !== null) {
            pParameter.onEdit(pParameter.dataBarang);
          }
        }
      },
    ] as OpsiItemModel[]
    }
  />
   <div onClick={() => { openOpsi() }}  className={`w-[47%] max-w-96 rounded-lg mb-2 bg-success-Surface shadow-lg p-2 text-center justify-items-center ${pParameter.classname??""} `}>
    <div>
      <img
        loading="eager"
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
      />
    </div>
    <p className="text-16px font-semibold mt-2 min-h-[60px] max-h-[60px] overflow-y-hidden-hidden line-clamp-3">{nama}</p>
    <div className="text-14px font-bold flex"><div className="text-main-Pressed">Rp{numberSeparator(harga)}</div><p>/</p><div className="text-danger-Hover">Rp{numberSeparator(hargabeli)}</div></div>
    
  </div>
  </>;
}