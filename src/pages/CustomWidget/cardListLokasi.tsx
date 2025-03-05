import { useEffect, useState } from "react";
import globalVariables from "../../Config/globalVariables";
import noimage from "../../assets/images/noimage.jpg"
import { LokasiModel } from "../../classModels/lokasiModel";
import { Icon } from "@iconify/react";
import { MapMarkerOSVG } from "../../assets/icon/SVGTSX/MapMarkerOSVG";
import ListColor from "../../Config/color";
import { ClockSVG } from "../../assets/icon/SVGTSX/ClockSVG";
import moment from "moment";

interface cardListLokasiModel {
  isSelected: boolean;
  onClose(): void;
  item: LokasiModel;
  onClick(pItem: LokasiModel): void;
}

export const CardListLokasi = (
  pParameter: cardListLokasiModel,
  pIndex: number
) => {
  // let xUrlBarang = pParameter.item.gambar || "";

  // const [imageSrc, setImageSrc] = useState(xUrlBarang);

// useEffect(() => {
//   const img = new Image();
//   img.src = xUrlBarang;
//   img.onload = () => setImageSrc(xUrlBarang);
//   img.onerror = () => setImageSrc(noimage);
// }, [xUrlBarang]);

  return (
    <div
      key={pIndex.toString()}
      className={`w-full  rounded-[10px] max-w-[720px] text-neutral-100 flex flex-col font-Asap overflow-hidden border-2 ${
        pParameter.isSelected ? " border-main-Main" : "border-transparent"
      }`}
      onClick={() => {
        pParameter.onClick(pParameter.item);
      }}
    >
      {/* <div
        className="h-[125px] flex flex-row-reverse"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
        }}
      >
        <div className="rounded-full w-[34px] h-[34px] bg-neutral-10 mt-3 mr-3 flex items-center justify-center">
          {pParameter.isSelected && (
            <Icon icon="uil:check" className="text-main-Main" fontSize={30} />
          )}
        </div>
      </div> */}
      <div className={`flex flex-col items-start py-2 px-3 gap-2 ${pParameter.isSelected ? " bg-main-Surface" : "bg-neutral-10"} text-left`}>
        <div className="font-bold text-h5 ">{pParameter.item.nama}</div>
        <div className="flex flex-row gap-2">
          <div className="min-w-[18px]">
            {MapMarkerOSVG(18, ListColor.main.Main)}
          </div>
          <div className="text-left text-neutral-70 text-14px font-semibold">
            {pParameter.item.alamat??"-"}
          </div>
        </div>
      </div>
    </div>
  );
};
