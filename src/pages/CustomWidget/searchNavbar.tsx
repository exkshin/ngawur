import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { ArrowLeftOSVG } from "../../assets/icon/SVGTSX/ArrowLeftOSVG";
import ListColor from "../../Config/color";
import { SearchOSVG } from "../../assets/icon/SVGTSX/SearchOSVG";

const SearchNavbar=(pSearchParam:SearchNavbarModel)=>{
  const[xSearchLokasi,setXSearchLokasi]=useState("");
return <div className={`inline-flex bg-white px-4 py-1 h-14 items-center border-b fixed left-0 top-0 z-10 min-w-full font-Asap ${pSearchParam.className}`} 
style={pSearchParam.style}
>
  {pSearchParam.showBack &&
    <button className="mr-1"
      onClick={() => {
        pSearchParam.backFunction();
      }}>
        {ArrowLeftOSVG(24, ListColor.neutral[90])}
      {/* <Icon fontSize={"24px"} icon={"uil:arrow-left"} /> */}
    </button>}
    <div className="relative w-full">
    {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <FontAwesomeIcon className={`w-5 h-5 ${(xSearchLokasi !== "" && xSearchLokasi !== undefined) ? "text-main-text1" : "text-neutral-70"}`} icon={faSearch} />
    </div> */}

    <input
      onChange={(e) => {
        setXSearchLokasi(e.target.value);
        pSearchParam.onChangeSearch(e.target.value);
        if(e.target.value===""){
          pSearchParam.searchFunction("");
        }
      }}
      placeholder={pSearchParam.placeholder}
      value={pSearchParam.valueSearch?? xSearchLokasi}
      className={`${defaultInputCSS((xSearchLokasi !== "" && xSearchLokasi !== undefined), false, false)} rounded-r-none`}
      onSubmit={(value)=>pSearchParam.searchFunction(xSearchLokasi)}
      inputMode="search"
      type="text"
      enterKeyHint="search"
      onKeyUp={(e)=>{
        if(e.key=="Enter"){
          pSearchParam.searchFunction(xSearchLokasi)
        }
      }}
    />

    {/* <button type="button" className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600" onClick={() => { setXSearchLokasi("");pSearchParam.searchFunction("") }}>
      <FontAwesomeIcon className={`w-5 h-5 ${(xSearchLokasi !== "" && xSearchLokasi !== undefined) ? "text-main" : "text-transparent"}`} icon={faClose} />
    </button> */}
  </div>
    <button className={` rounded-r-lg p-2.5 max-h-[40px] ${xSearchLokasi!=""?" border border-neutral-100 bg-main-Hover border-l-0":"bg-neutral-50"} `}
      onClick={() => {
        xSearchLokasi!=""&& pSearchParam.searchFunction(xSearchLokasi)
      }}>
      <FontAwesomeIcon className={`w-5 h-5 ${(xSearchLokasi !== "" && xSearchLokasi !== undefined) ? "text-main-Surface" : "text-neutral-70"}`} icon={faSearch} />
      </button>
  {pSearchParam.showFrontIcon &&
    <button className="ml-1"
      onClick={() => {
        pSearchParam.frontFunction();
      }}>
      {/* <Icon color={pSearchParam.frontIcon} fontSize={"20px"} icon={"uil:filter"} /> */}
      {pSearchParam.frontIcon}
    </button>}
</div>
}

interface SearchNavbarModel extends React.HTMLProps<HTMLDivElement>{
  showBack:boolean,
  backFunction():void,
  showFrontIcon:boolean,
  frontIcon: React.ReactNode,
  frontFunction():void,
  valueSearch:string|null,
  placeholder:string,
  searchFunction(value:string):void,
  onChangeSearch(value:string):void,  
}

export default SearchNavbar;