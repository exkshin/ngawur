import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Icon } from "@iconify/react"
import { ArrowLeftOSVG } from "../../assets/icon/SVGTSX/ArrowLeftOSVG"
import ListColor from "../../Config/color"

interface CustomNavbarModel {
  title: string,
  leftIcon: typeof Icon | null,
  leftIconShow: boolean,
  functionLeftIcon(): void,
  rightIcon?: React.ReactNode,
  rightIconShow?: boolean,
  functionRightIcon?(): void,
}

/**
 * @param title isi dengan nama halaman
 * @param leftIcon bisa tidak diisi, kalau diisi, isi dengan icon untuk button di navbar sebelah kiri
 * @param leftIconShow true kalau mau menampilkan leftIcon
 * @param functionLeftIcon isi dengan function untuk button icon sebelah kiri
 * @description top navbar yang isinya cuma nama halaman dan button icon sebelah kiri
*/
export const CustomNavbar = (pParameter: CustomNavbarModel) => {
  return (
    <div className="inline-flex border-b shadow-md min-h-14 max-h-14 px-4 py-3 w-full bg-main-card fixed top-0 z-10 bg-neutral-10">
      {/* kiri */}
      <div className="content-center">
        {pParameter.leftIconShow && pParameter.leftIcon == null && (
          // <Icon fontSize={"24px"} icon={"heroicons-outline:arrow-left"} onClick={()=>pParameter.functionLeftIcon()} />
          <div onClick={() => pParameter.functionLeftIcon()}>
            {ArrowLeftOSVG(24, ListColor.neutral[70])}
          </div>
        )}
      </div>
      {/* tengah  */}
      <div className="ml-2.5 text-base font-bold my-auto w-full">
        {pParameter.title}
      </div>
      {/* kanan  */}
      <div className="content-center">
        {pParameter.rightIconShow &&
          (pParameter.rightIcon === null ? (
            <div
              onClick={() =>
                pParameter.functionRightIcon && pParameter.functionRightIcon()
              }
            >
              {ArrowLeftOSVG(24, ListColor.neutral[70])}
            </div>
          ) : (
            <div
              onClick={() =>
                pParameter.functionRightIcon && pParameter.functionRightIcon()
              }
            >
              {pParameter.rightIcon}{" "}
            </div>
          ))}
      </div>
    </div>
  );
}