import { useEffect, useState } from "react"
import { Icon } from "@iconify/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import ListColor from "../../Config/color";
import { ValueListModel } from "../../classModels/filterModel";
import SearchNavbar from "../CustomWidget/searchNavbar";
import { CheckboxSVG } from "./checkboxCustom";

interface ListBoxDropDownPageParameter {
  listSelected: ValueListModel[],
  listData: ValueListModel[],
  placeholder: string,
  titleListBadge: string,
  onChange(value: ValueListModel[]): void,
  onClose(): void
}

/**
 * @description halaman yang dibuka ketika user klik tombol tambah pada filter dengan tipe dropdownbox
 * @param listSelected: ValueListModel[], data yang sudah dipilih oleh user sebelumnya
 * @param listData: ValueListModel[], data yang ditampilan pada list dropdown
 * @param placeholder: string, placeholder untuk textbox search
 * @param titleListBadge: string, judul untuk list badge yang terpilih
 * @param onChange(value: ValueListModel[]): void, fungsi yang diterapkan ketika user klik button terapkan
 * @param onClose(): void, fungsi yang dilakukan ketika user menutup halaman ini
 * @returns data list valuelistmodel yang sudah dipilih oleh user
 */
export const ListBoxDropDownPage = (pDataBoxDropDown: ListBoxDropDownPageParameter) => {
  const [xSelected, setXSelected] = useState(JSON.parse(JSON.stringify(pDataBoxDropDown.listSelected)) as ValueListModel[]);
  const [xListData, setXListData] = useState([] as ValueListModel[]);
  const [xSearch, setXSearch] = useState("");
  useEffect(() => {
    searchItem("");
  }, [])

  function searchItem(pSearchText: string) {
    let tempList = [] as ValueListModel[];
    pDataBoxDropDown.listData.map((pValue) => {
      if (pValue.nama.toLowerCase().includes(pSearchText.toLowerCase())) {
        let temp = pValue;
        temp.extraData = checkIsSelected(pValue);
        tempList.push(temp);
      }
      return true
    })
    setXListData(tempList);
  }

  function widgetBadge(pValueBadge: ValueListModel, pSelected: boolean, index: number) {
    return <div
      key={index.toString() + "- true"}
      className={`px-2 py-1.5 border font-Merriweathersans text-14px truncate ... border-main-Border rounded-full ${pSelected ? "bg-main-Border text-neutral-10" : "bg-neutral-10 text-main-Border"}`}
      style={{ maxWidth: "120px" }}
      onClick={() => {
        let temp = [] as ValueListModel[];
        xSelected.map((pValue: ValueListModel, index: number) => {
          if (pValueBadge.id !== pValue.id) {
            temp.push(pValue);
          }
          return true;
        })
        setXSelected(temp);
        let tempList = xListData;
        for (let i = 0; i < tempList.length; i++) {
          if (pValueBadge.id === tempList[i].id) {
            tempList[i].extraData = false;
          }
        }
        setXListData(tempList);
      }}
    >
      {pValueBadge.nama}
    </div>
  }

  function checkIsSelected(pValue: ValueListModel) {
    let xIsSelected = false;
    for (let i = 0; i < xSelected.length; i++) {
      if (xSelected[i].id === pValue.id) {
        xIsSelected = true;
      }
    }
    return xIsSelected;
  }

  return <div className="w-screen h-screen fixed font-Merriweathersans z-[60] top-0 left-0 bg-white">
    {/* <div className="inline-flex bg-main-badge px-4 py-1 items-center border-b sticky top-0 min-w-full" >
      <button className="mr-1"
        onClick={() => {
          pDataBoxDropDown.onClose();
        }}>
        <Icon fontSize={"24px"} icon={"uil:arrow-left"} />
      </button>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FontAwesomeIcon className={`w-5 h-5 ${(xSearch !== "" && xSearch !== undefined) ? "text-main-text2" : "text-[#50555B]"}`} icon={faSearch} />
        </div>

        <input
          onChange={(e) => {
            setXSearch(e.target.value);
            searchItem(e.target.value);
          }}
          placeholder={pDataBoxDropDown.placeholder}
          value={xSearch}
          className={` pl-10 pr-10 ${defaultInputCSS((xSearch !== "" && xSearch !== undefined), false, false)}`}
        />

        <button type="button" className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600" onClick={() => { setXSearch(""); searchItem("") }}>
          <FontAwesomeIcon className={`w-5 h-5 ${(xSearch !== "" && xSearch !== undefined) ? "text-main-text2" : "text-transparent"}`} icon={faClose} />
        </button>
      </div>
    </div> */}
    <SearchNavbar showBack={true} backFunction={() => {
      pDataBoxDropDown.onClose();
    } } valueSearch={xSearch} placeholder={pDataBoxDropDown.placeholder} searchFunction={(pValue) => {
      setXSearch(pValue);
      searchItem(pValue);
    } } onChangeSearch={(pValue) => {
      setXSearch(pValue);
      searchItem(pValue);
    } } showFrontIcon={false} frontIcon={undefined} frontFunction={function (): void {
      throw new Error("Function not implemented.");
    } }/>
    <div className="px-4 pb-36 h-full w-full overflow-auto">
    <div className="h-14"/>
      {xSelected.length > 0 &&
        <div className="mt-4">
          <div className="text-14px font-bold font-Merriweather">{pDataBoxDropDown.titleListBadge}</div>
          <div className="w-full max-h-40 inline-flex flex-wrap gap-1.5 mb-3 mt-2 overflow-y-auto">
            {
              xSelected.map((pValue: ValueListModel, index: number) => {
                return widgetBadge(pValue, true, index)
              })
            }
          </div>
          <hr className="bg-main-badge h-0.5" />
        </div>
      }
      {xListData.map((pValue, index) => {
        return <div key={index}>
          <div className={`w-full inline-flex my-4`} onClick={() => {
            let temp = [] as ValueListModel[];
            if (pValue.extraData) {
              xSelected.map((pValueBadge: ValueListModel, index: number) => {
                if (pValue.id !== pValueBadge.id) {
                  temp.push(pValueBadge);
                }
                return true;
              })
            } else {
              xSelected.map((pValueBadge: ValueListModel, index: number) => {
                temp.push(pValueBadge);
                return true;
              })
              temp.push(pValue);
            }
            setXSelected(temp);
            let tempList = xListData;
            tempList[index].extraData = !pValue.extraData;
            setXListData(tempList);
          }}>
            <div className='text-14px font-Merriweathersans w-full mr-2 mb-2.5'>{pValue.nama}</div>
            <div style={{ fontSize: "16px" }}>
              <CheckboxSVG borderColor={ListColor.main.Border} checkColor={pValue.extraData ? ListColor.main.Border : "transparent"} />
            </div>
          </div>
          <hr className="border-main-badge"/>
        </div>
      })}
      <div className="h-16"/>
    </div>
    <div className="fixed inline-flex bottom-0 left-0 z-54 w-full h-16 py-2.5 px-4 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-[0_35px_60px_15px_rgba(0,0,0,0.3)]">
      <button className='h-full w-full rounded-xl font-Merriweather text-main-Border bg-white border-main-Border border text-16px font-bold mr-2.5' onClick={() => pDataBoxDropDown.onClose()}>Batal</button>
      <button className='h-full w-full rounded-xl font-Merriweather text-neutral-10 bg-main-Border text-16px font-bold' onClick={() => {
        let temp = JSON.parse(JSON.stringify(xSelected));
        pDataBoxDropDown.onChange(temp);
        pDataBoxDropDown.onClose();
      }}>Terapkan</button>
    </div>
  </div>
}