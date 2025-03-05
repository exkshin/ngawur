import { useState } from "react";
import { AngleDownSVG } from "../../assets/icon/SVGTSX/AngleDownSVG";
import { AngleUpSVG } from "../../assets/icon/SVGTSX/AngleUpSVG";
import { BarangBySupplierModel, HitungBarangModel } from "../../classModels/barangModel";
import ListColor from "../../Config/color";
import { CardBarangTransaksiJual } from "./cardBarangTransaksiJual";
import { DataHutang, ListHutangModel } from "../../classModels/listHutangModel";
import { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables";
import { CalendarAltOSVG } from "../../assets/icon/SVGTSX/CalendarAltOSVG";
import moment from "moment";
import { PinSVG } from "../../assets/icon/SVGTSX/PinSVG";

interface ListHutangWidgetModel {
  data: ListHutangModel,
  index: number,
  onShowDetail(hutang:DataHutang):void,
}
const ListHutangWidget = (pParameter: ListHutangWidgetModel) => {
  let saldoawal =  parseInt((pParameter.data.saldoawal ?? 0).toString().split(".")[0]);
  let hutang = parseInt((pParameter.data.hutang ?? "0").split(".")[0]);
  let pelunasan = parseInt((pParameter.data.pelunasan ?? 0).toString().split(".")[0]);
  let sisa = saldoawal + hutang - pelunasan;
  
  return <div key={"hutangperiode" + pParameter.index} className="">
    <div className="w-full rounded-lg bg-neutral-20 px-2 py-2 mb-2">
      <div className="flex justify-between w-full">
        <div className="text-16px font-bold">{moment(pParameter.data.periode + "-01").format("MMM YYYY")}</div>
        <div className={`${sisa > 0 ? "text-main-Hover": "text-danger-Main"} flex align-bottom`}><p className="text-12px content-center mr-1 text-neutral-100">Saldo </p> {numberSeparator(sisa)}</div>
      </div>
      <div className="flex rounded-lg w-full border mt-1">
        <div className="w-1/3 p-1 border-r">
          <p className="text-12px text-center mb-1">Awal</p>
          <p className="text-center">{numberSeparator(saldoawal).toString().replaceAll("-","")}</p>
        </div>
        <div className="w-1/3 p-1 border-r">
          <p className="text-12px text-center mb-1">Penjualan</p>
          <p className="text-center">{numberSeparator(hutang).toString().replaceAll("-","")}</p>
        </div>
        <div className="w-1/3 p-1">
          <p className="text-12px text-center mb-1">Pelunasan</p>
          <p className="text-center">{numberSeparator(pelunasan).toString().replaceAll("-","")}</p>
        </div>
      </div>
    </div>

    {pParameter.data.daftar.map((trans, idx) => (
      <div
        className={`w-full pb-2 mb-2 border-b border-neutral-70 flex items-baseline`}
      >
        <div
          className=" text-left mr-2"
        >
          <p className="text-12px text-neutral-80">{moment(trans.tgltrans).format("DD MMM YYYY")}</p>
          <p className="">{trans.keterangan?.toUpperCase()=="HUTANG"?"Penjualan":(trans.keterangan??" ").toLowerCase().replace(/^./,char =>char.toUpperCase())}</p>
          <p className="flex gap-1 text-12px">{PinSVG(18, ListColor.main.Main)} {trans.namalokasi??""}</p>
          {
            trans.keterangan?.toUpperCase()=="HUTANG"&&<div
            className={` shadow-md rounded-full py-1 px-2  max-w-24 text-center text-12px font-bold text-neutral-10 bg-main-Main`}
            onClick={() => {
              pParameter.onShowDetail(trans);
            }}
          >
            Detail
          </div>
          }
        </div>
        <div className={`text-right ml-auto content-center ${trans.keterangan?.toUpperCase()=="HUTANG"? "text-main-Hover":"text-danger-Main"}`}>
        {trans.keterangan?.toUpperCase()=="HUTANG"?"+":"-"}{numberSeparatorFromString( (trans.amount??"0").split(".")[0]).replaceAll("-","")}
        </div>
      </div>
    ))}
  </div>;
}
export default ListHutangWidget;