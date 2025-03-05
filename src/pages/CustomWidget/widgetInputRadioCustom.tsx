import { RadioButtonCustom } from "./radioButtonCustom";

export interface InputRadioCustom {
  title: string;
  value: {
    id: string;
    value: string;
    selected: boolean;
  }[];
  error: boolean;
  errortext?: string;
  readonly: boolean;
  disabled: boolean;
  onChange(value: string): void;
}
export const WidgetInputRadioCustom = (pParameter: InputRadioCustom) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold text-left text-16px">{pParameter.title}</div>
      <div className="w-full">
        <div className="flex gap-2.5 font-bold">
          {pParameter.value.map((item) => (
            <div
              className="flex gap-1 items-center"
              onClick={() => {
                pParameter.onChange(item.value);
              }}
            >
              <RadioButtonCustom
                selected={item.selected}
              />
              <div>{item.id}</div>
            </div>
          ))}
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
