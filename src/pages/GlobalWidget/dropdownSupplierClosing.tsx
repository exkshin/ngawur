import { HTMLProps, useEffect, useState } from "react"
import { SupplierModel } from "../../classModels/supplierModel"
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel"
import Sheet from 'react-modal-sheet';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { ChevronDownSVG } from "../../assets/icon/SVGTSX/ChevronDownSVG";
import SyncLoader from "react-spinners/SyncLoader";
import { LokasiModel } from "../../classModels/lokasiModel";
import { PopupLoading } from "../CustomWidget/customPopup";

interface DropdownSupplierClosingModel {
  value: SupplierModel | null,
  onChange?(value: SupplierModel): void,
  onOpenDropdown?(value: boolean): void,
  className?: HTMLProps<HTMLElement>["className"],
  isError?: boolean,
  errorText?: string,
  useTitle?: boolean
  title?: string,
  tanggal: string,
  canSetInitialValue: boolean,
  isEdit:boolean,
}
export const DropdownSupplierClosing = (pParameter: DropdownSupplierClosingModel) => {
  const [xIsOpenDropdown, setxIsOpenDropdown] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xListSupplier, setXListSupplier] = useState([] as SupplierModel[]);
  const [xListSupplierTemp, setXListSupplierTemp] = useState([] as SupplierModel[]);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xSupplierTemp, setXSupplierTemp] = useState(null as SupplierModel|null);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;
  let xDataLokasi = JSON.parse(localStorage.getItem("dataLokasi") ?? "{}") as LokasiModel;

  useEffect(() => {
    getListSupplier(pParameter.tanggal);
  }, [pParameter.tanggal])
  useEffect(() => {
    if(xSearch==""){
      searchSupplier("");
    }
  }, [xSearch])

  async function getListSupplier(pTanggal: string) {
    setXIsLoading(true);
    try {
      const form = new FormData();
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("tanggal", pTanggal);
      form.append("idlokasi", xDataLokasi.id ?? "");
      form.append("keyword", "");
      form.append("mode", pParameter.isEdit?"ubah":"tambah");

      await AXIOS
        .post("umkm/ApiSupplier/getListSupplierClosing", form)
        .then((res) => res.data)
        .then((data) => {
          if (data.success == true) {
            const responseData = data.data as SupplierModel[];
            // let data0 = {
            //   alamat: "",
            //   idperusahaan: "",
            //   idsupplier: "",
            //   idsyaratbayar: "",
            //   kodesupplier: "",
            //   namasupplier: `Semua Supplier(Total : ${responseData.length})`,
            //   selisihharibayar: "",
            // };
            let listSupplier = [ ...responseData] as SupplierModel[];
            setXListSupplier(listSupplier);
            setXListSupplierTemp(listSupplier);
            // setXSupplierTemp(data0);
            // if (pParameter.canSetInitialValue) {
            //   pParameter.onChange != null && pParameter.onChange(data0);
            // }
          } else {
            throw ("error success==false");
          }
        }
        );
    } catch (error) {
      console.log(error);
    }
    setXIsLoading(false);
  }

  function searchSupplier(pSearch: string) {
    let listSupplier = [] as SupplierModel[];
    xListSupplier.forEach((pSupplier) => {
      if ((pSupplier.namasupplier ?? "").toUpperCase().includes(pSearch.toUpperCase())) {
        listSupplier.push(pSupplier);
      }
    })
    setXListSupplierTemp(listSupplier);
  }

  return <>
    <PopupLoading key="loading" open={xIsLoading} />
    {xIsOpenDropdown && <div className='h-screen w-screen z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => { pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false); setxIsOpenDropdown(false) }} />}
    <Sheet
      isOpen={xIsOpenDropdown}
      onClose={() => { pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false); setxIsOpenDropdown(false) }}
      snapPoints={[0.7]}
      detent='content-height'
      style={{ zIndex: 53 }}
      key={"filter"}
    >
      <Sheet.Container>
        <Sheet.Content>
          <div className='w-full mt-2 mb-3'>
            <div className='h-[2px] w-9 bg-main-Pressed mx-auto mb-1.5' />
            {!xIsLoading && <div className="inline-flex w-full px-4 pt-2">
              <div className="relative w-full">
                <input
                  onChange={(e) => {
                    setXSearch(e.target.value);
                    searchSupplier(e.target.value);
                  }}
                  placeholder={"Cari Supplier"}
                  value={xSearch}
                  className={`${defaultInputCSS((xSearch !== "" && xSearch !== undefined), false, false)} `}
                  onSubmit={(value) => searchSupplier(xSearch)}
                  inputMode="search"
                  type="text"
                  enterKeyHint="search"
                  onKeyUp={(e) => {
                    if (e.key == "Enter") {
                      searchSupplier(xSearch);
                    }
                  }}
                />
              </div>
            </div>}
          </div>
          <Sheet.Scroller  >
            <div className='px-4 ' style={{ maxHeight: "70vh" }}>

              {xIsLoading ? <div>
                <SyncLoader color="#0172CB" className="text-center self-center mt-6 mb-4" />
              </div> : xListSupplierTemp.map((pSupplier, pIndex) => {
                return (
                  <div
                    key={pIndex.toString()}
                    className={`pb-2.5 border-b border-Grey text-neutral-100  text-14px ${pIndex == 0 ? "" : "pt-2.5"
                      } `}
                    onClick={(e) => {

                      if (pParameter.onChange != undefined && pParameter.onChange != null) {
                        pParameter.onChange(pSupplier);
                      }
                      setxIsOpenDropdown(false);
                      pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false);
                    }}
                  >
                    {pSupplier.namasupplier}
                  </div>
                );
              })}
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet >
    <div className={`w-full ${pParameter.className}`}>
      {pParameter.useTitle != false && <div className="font-semibold text-14px text-left mb-2.5">{pParameter.title ?? "Supplier"}</div>}
      <div className="relative w-full mt-2.5" onClick={() => {
        setxIsOpenDropdown(true);
        setXListSupplierTemp(xListSupplier);
        setXSearch("");
        pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(true);
      }}>
        <input
          placeholder={""}
          value={pParameter.value==undefined||pParameter.value==null?"": pParameter.value.namasupplier ?? ""}
          type={"text"}
          readOnly={true}
          className={`pr-6 ${defaultInputCSS((pParameter.value != null && pParameter.value.namasupplier !== "" && pParameter.value.namasupplier !== undefined), pParameter.isError == true, true)}`}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pl-3 pointer-events-none pr-4">
          {ChevronDownSVG(24, "black")}
        </div>
      </div>
      {pParameter.isError && <div className="text-12px text-danger-Main text-left">{pParameter.errorText}</div>}
    </div>
  </>
}