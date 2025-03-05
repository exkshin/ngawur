import { ReactNode } from "react"

export enum VerticalAlignType {
  VerticalCenter,
  VerticalUp,
  verticalDown,
}

interface DetailDivStandardModel{
  widthTitle:string|null,
  title:string,
  subtitle:ReactNode,
  verticalAlign:VerticalAlignType|null,
  useBorderBottom?:boolean,
  boldAll?:boolean,
}
export const DetailDivStandard=(pParameter:DetailDivStandardModel)=>{
  return (
    <div
      className={`w-full pb-2 ${(pParameter.boldAll??false)?"font-bold":""} ${pParameter.useBorderBottom==false?"":"mb-2 border-b border-neutral-70"} flex ${
        pParameter.verticalAlign === VerticalAlignType.VerticalUp
          ? "align-top"
          : pParameter.verticalAlign === VerticalAlignType.verticalDown
          ? "align-bottom"
          : "align-middle"
      }`}
    >
      <div
        className="font-Merriweather text-neutral-100 text-left mr-2"
        style={{ width: pParameter.widthTitle ?? "130px" }}
      >
        {pParameter.title}
      </div>
      <div className="font-Merriweathersans text-neutral-100 text-right ml-auto">
        {pParameter.subtitle}
      </div>
    </div>
  );
}