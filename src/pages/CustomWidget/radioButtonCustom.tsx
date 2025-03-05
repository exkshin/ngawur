import ListColor from "../../Config/color"

interface RadioButtonCustomModel{
  selected:boolean,
}
export const RadioButtonCustom = (pParameter: RadioButtonCustomModel) => {
  return pParameter.selected
    ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="3.5" width="15" height="15" rx="7.5" fill="transparent" />
      <rect x="3.5" y="3.5" width="15" height="15" rx="7.5" stroke={ListColor.main.Hover} />
      <rect x="6" y="6" width="10" height="10" rx="5" fill={ListColor.main.Main} />
    </svg>
    : <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.5" y="3.5" width="15" height="15" rx="7.5" fill="white" />
      <rect x="3.5" y="3.5" width="15" height="15" rx="7.5" stroke={ListColor.main.Hover} />
    </svg>

}