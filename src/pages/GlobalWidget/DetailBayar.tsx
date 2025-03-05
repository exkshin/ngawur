import { ReactNode } from "react"
import { VerticalAlignType } from "./DetailDivStandard";

interface DetailBayarModel{
  widthTitle?:string|null,
  title:string,
  subtitle:ReactNode,
  verticalAlign:VerticalAlignType|null,
  classname?:string,
}
export const DetailBayar=(pParameter:DetailBayarModel)=>{
  return (
    <div
      className={`w-full flex ${
        pParameter.verticalAlign === VerticalAlignType.VerticalUp
          ? "align-top"
          : pParameter.verticalAlign === VerticalAlignType.verticalDown
          ? "align-bottom"
          : "align-middle"
      } ${pParameter.classname}`}
    >
      <div
        className=" text-left mr-2"
        style={{ width: pParameter.widthTitle ?? "130px" }}
      >
        {pParameter.title}
      </div>
      <div className="text-right ml-auto">
        {pParameter.subtitle}
      </div>
    </div>
  );
}