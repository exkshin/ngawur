import { numberSeparator, numberSeparatorFromString } from "../../Config/globalVariables"

interface BottomNavbarJual {
  onClickButton?(): void,
  onClickTotal?(): void,
  textButton: string,
  disable?: boolean,
  total: string,
  zIndex?:number,
}
export const BottomNavbarJual = (pParameter: BottomNavbarJual) => {
  return <div className="w-full px-4 py-2.5 max-h-14 fixed bottom-0 bg-white shadow-outline-up justify-between flex"
  style={{zIndex:pParameter.zIndex??60}}
  >
    <div onClick={()=>{
      if (pParameter.onClickTotal!=undefined&&pParameter.onClickTotal!=null) {
        pParameter.onClickTotal();
      }
    }}>
      <p className="text-12px font-semibold">Total</p>
      <p className="text-14px font-bold">Rp{numberSeparatorFromString(pParameter.total)}</p>
    </div>
    <div
      className={`w-40 shadow-md rounded-full py-2 px-5 text-center text-16px font-bold ${(pParameter.disable??false) ? "text-neutral-70 bg-neutral-30" : "text-neutral-10 bg-main-Main "}`}
      onClick={() => {
        if (!(pParameter.disable??false)&& pParameter.onClickButton!=undefined&&pParameter.onClickButton!=null) {
          pParameter.onClickButton();
        }
      }}
    >
      {pParameter.textButton}
    </div>
  </div>
}
