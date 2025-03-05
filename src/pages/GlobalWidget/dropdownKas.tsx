import { HTMLProps, useEffect, useState } from "react"
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel"
import Sheet from 'react-modal-sheet';
import AXIOS from "../../Config/axiosRequest";
import { LoginModelClass } from "../../classModels/loginModelClass";
import { ChevronDownSVG } from "../../assets/icon/SVGTSX/ChevronDownSVG";
import SyncLoader from "react-spinners/SyncLoader";
import { KasModel } from "../../classModels/perkiraanKasModel";

interface DropdownKasModel {
  value: KasModel | null,
  onChange?(value: KasModel): void,
  onOpenDropdown?(value: boolean): void,
  className?: HTMLProps<HTMLElement>["className"],
  isError?: boolean,
  errorText?: string,
  jenisIsKas: boolean,
}

export const DropdownKas = (pParameter: DropdownKasModel) => {
  const [xIsOpenDropdown, setxIsOpenDropdown] = useState(false);
  const [xSearch, setXSearch] = useState("");
  const [xListPerkiraan, setXListPerkiraan] = useState([] as KasModel[]);
  const [xListPerkiraanTemp, setXListPerkiraanTemp] = useState([] as KasModel[]);
  const [xIsLoading, setXIsLoading] = useState(false);
  let xDataLogin = JSON.parse(localStorage.getItem("dataLogin") ?? "{}") as LoginModelClass;

  useEffect(() => {
    getListPerkiraan()
  }, [])
  useEffect(() => {
    if (xSearch == "") {
      searchAkunKas("");
    }
  }, [xSearch])

  async function getListPerkiraan() {
    setXIsLoading(true);
    try {
      const form = new FormData();
      let url = "umkm/ApiPerkiraan/getListPerkiraan";
      form.append("idperusahaan", xDataLogin.idperusahaan ?? "");
      form.append("iduser", xDataLogin.iduser ?? "");
      form.append("jenis", pParameter.jenisIsKas ? "kas" : "detail_non_kasbank");

      await AXIOS
        .post(url, form)
        .then((res) => res.data)
        .then((data) => {
          let responseData = data.data.rows as KasModel[];
          setXListPerkiraan(responseData);
          setXListPerkiraanTemp(responseData);
        }
        );
    } catch (error) {
      console.log(error);
    }
    setXIsLoading(false);
  }

  function searchAkunKas(pSearch: string) {
    let listPerkiraan = [] as KasModel[];
    xListPerkiraan.forEach((pPerkiraan) => {
      if (((pPerkiraan.kode ?? "") + "-" + (pPerkiraan.nama ?? "")).toUpperCase().includes(pSearch.toUpperCase())) {
        listPerkiraan.push(pPerkiraan);
      }
    })
    setXListPerkiraanTemp(listPerkiraan);
  }

  return <>
    {xIsOpenDropdown && <div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => { pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false); setxIsOpenDropdown(false) }} />}
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
          <div className='w-full mt-1.5 mb-3'>
            <div className='h-[2px] w-9 bg-main-Pressed mx-auto' />
            {!xIsLoading && 
            <div className="inline-flex w-full px-4 pt-2">
              <div className="relative w-full">
                <input
                  onChange={(e) => {
                    setXSearch(e.target.value);
                    if (e.target.value == "" || e.target.value.length >= 3) {
                      searchAkunKas(xSearch);
                    }
                  }}
                  placeholder={pParameter.jenisIsKas? "Cari Akun Kas/Bank":"Cari Perkiraan"}
                  value={xSearch}
                  className={`${defaultInputCSS((xSearch !== "" && xSearch !== undefined), false, false)}`}
                  onSubmit={(value) => searchAkunKas(xSearch)}
                  inputMode="search"
                  type="text"
                  enterKeyHint="search"
                  onKeyUp={(e) => {
                    if (e.key == "Enter") {
                      searchAkunKas(xSearch);
                    }
                  }}
                />
              </div>
            </div>}
          </div>
          <Sheet.Scroller>
            <div className='px-4' style={{ maxHeight: "70vh" }}>
              {
              xListPerkiraanTemp.map((pValue,pIndex)=>{
                return  <div
                    key={pIndex.toString()}
                    className={`pb-2.5 border-b border-Grey text-14px ${pIndex == 0 ? "" : "pt-2.5"
                      } $text-neutral-100
                  `}
                    onClick={(e) => {
                      if (pParameter.onChange != undefined && pParameter.onChange != null) {
                        pParameter.onChange(pValue);
                      }
                      setxIsOpenDropdown(false);
                      pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false);
                    }}
                  >
                    {pValue.kode}-{pValue.nama}
                  </div>;
              })
                // xListPerkiraanTemp.map((pPerkiraan, pIndex) => {
                //   return <div
                //     key={pIndex.toString()}
                //     className={`pb-2.5 border-b border-Grey text-14px ${pIndex == 0 ? "" : "pt-2.5"
                //       } $text-neutral-100
                //   `}
                //     onClick={(e) => {
                //       if (pParameter.onChange != undefined && pParameter.onChange != null) {
                //         pParameter.onChange(pPerkiraan);
                //       }
                //       setxIsOpenDropdown(false);
                //       pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(false);
                //     }}
                //   >
                //     {pPerkiraan.kode}-{pPerkiraan.nama}
                //   </div>;
                // })
                }
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
    <div className={`w-full ${pParameter.className}`}>
      <div className="font-semibold text-14px text-left mb-2.5">{pParameter.jenisIsKas? "Akun Kas/Bank*":"Akun Perkiraan*"}</div>
      <div className="relative w-full mt-2.5" onClick={() => {
        setxIsOpenDropdown(true);
        setXListPerkiraanTemp(xListPerkiraan);
        setXSearch("");
        pParameter.onOpenDropdown != undefined && pParameter.onOpenDropdown != null && pParameter.onOpenDropdown(true);
      }}>
        <input
          placeholder={""}
          value={pParameter.value == null ? "" : pParameter.value.kode+"-"+pParameter.value.nama}
          type={"text"}
          readOnly={true}
          className={`pr-6 ${defaultInputCSS((pParameter.value != null && pParameter.value.nama !== undefined && pParameter.value.nama !== null), pParameter.isError == true, true)}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pl-3 pointer-events-none pr-4">
          {ChevronDownSVG(24, "black")}
        </div>
      </div>
      {pParameter.isError && <div className="text-12px text-danger-Main text-left">{pParameter.errorText}</div>}
    </div>
  </>
}