import { useState } from "react";
import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";
import { EyeSVG } from "../../assets/icon/SVGTSX/EyeSVG";
import ListColor from "../../Config/color";
import { EyeSplashSVG } from "../../assets/icon/SVGTSX/EyeSplashSVG";

export interface IconInputCustom {
  title: string;
  value: string;
  error: boolean;
  errortext?: string;
  readonly: boolean;
  disabled: boolean;
  ispassword?: boolean;
  lefticon: React.ReactNode;
  required?: boolean;
  isPhone?: boolean;
  onChange(value: string): void;
}
export const WidgetIconInputCustom = (pParameter: IconInputCustom) => {
  const [xIsPasswordVisible, setXIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setXIsPasswordVisible((prevState) => !prevState);
  }
  return (
    <div className="flex flex-col gap-2">
      {pParameter.title==""&& <div className="font-bold text-left text-16px">{pParameter.title}{pParameter.required == true && <span className="text-danger-Main text-16px font-bold"> *</span>}</div>}
      <div className="text-left">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {pParameter.lefticon}
          </div>
          {pParameter.isPhone == true &&
            <div className="absolute inset-y-0 left-0 flex items-center text-14px pl-12 pointer-events-none text-black">
              +62
            </div>
          }
          <input
            onChange={(e) => {
              let val = e.target.value;
              pParameter.onChange(val);
            }}
            placeholder=""
            value={pParameter.value}
            disabled={pParameter.disabled}
            onKeyDown={(event) => {
              if (pParameter.isPhone == true) {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ];
                if (pParameter.value.length === 0 && /[0]/.test(event.key)) {
                  event.preventDefault();
                }
                if (
                  !/[0-9]/.test(event.key) &&
                  !allowedKeys.includes(event.key)
                ) {
                  event.preventDefault();
                }
              }
            }}
            className={`${defaultInputCSS(
              pParameter.value !== "" && pParameter.value !== undefined,
              pParameter.error,
              pParameter.readonly
            )} ${pParameter.isPhone == true ? "pl-[70px] pr-10 " : "px-10 "}`}
            type={
              pParameter.isPhone == true ? "tel"
                : pParameter.ispassword
                  ? xIsPasswordVisible
                    ? "text"
                    : "password"
                  : "text"
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
            onClick={togglePasswordVisibility}
          >
            {pParameter.ispassword &&
              (xIsPasswordVisible
                ? EyeSVG(24, ListColor.neutral[90])
                : EyeSplashSVG(24, ListColor.neutral[90]))}
          </button>
        </div>
        {pParameter.error && (
          <div className="mt-2 text-12px text-danger-Main">
            {pParameter.errortext
              ? pParameter.errortext
              : `${pParameter.title} wajib diisi`}
          </div>
        )}
      </div>
    </div>
  );
};
