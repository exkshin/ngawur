interface CheckboxSVGParameter {
  checkColor: string,
  borderColor: string,
}

/**
 * @description untuk mendapatkan svg checkbox dengan warna yang ditentukan user
 * @param color untuk menentukan warna yang dipakai oleh checkbox. ada border color dan check color
 * @returns 
 */
export const CheckboxSVG = (color: CheckboxSVGParameter) => {
  return <svg width="16" height="17" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="white" />
    <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke={color.borderColor} />
    <path d="M12.6666 4.5L6.24992 10.9167L3.33325 8" stroke={color.checkColor} strokeWidth="1.33334" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}
