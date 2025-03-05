import { defaultInputCSS } from "../../baseCSSModel/inputCssModel";


export interface DefaultInputCustomModel {
  title: string;
  value: string;
  error: boolean;
  errortext ?: string;
  readonly: boolean;
  disabled:boolean;
  onChange(value: string): void;
}
export const WidgetDefaultInputCustom = (pParameter: DefaultInputCustomModel) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold">{pParameter.title}</div>
      <div>
        <input
          onChange={(e) => pParameter.onChange(e.target.value.toUpperCase())}
          placeholder=""
          value={pParameter.value}
          disabled={pParameter.disabled}
          className={`${defaultInputCSS(
            pParameter.value !== "" && pParameter.value !== undefined,
            pParameter.error,
            pParameter.readonly,
          )}`}
        />
        {pParameter.error && (
          <div className="mt-2 text-12px text-danger-Main">
            {pParameter.errortext ? pParameter.errortext : `${pParameter.title} wajib diisi`}
          </div>
        )}
      </div>
    </div>
  );
};
