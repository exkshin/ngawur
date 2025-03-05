interface BottomButtonModel {
  onClick(): void,
  text: string,
  disabled?: boolean
  className?:string,
  style?:React.CSSProperties 
}
export const BottomButton = (pParameter:BottomButtonModel) => {
  return (
    <div className="w-full px-4 py-2.5 fixed bottom-0 bg-white shadow-outline-up max-h-14">
      <div
        className={`w-full shadow-md rounded-xl py-2 px-5 text-center text-16px font-bold ${pParameter.disabled ? "text-neutral-70 bg-neutral-30":"text-neutral-10 bg-main-Main "}${pParameter.className??""}`}
        onClick={pParameter.disabled ? () => {} : () => pParameter.onClick()}
      >
        {pParameter.text}
      </div>
    </div>
  );
}
