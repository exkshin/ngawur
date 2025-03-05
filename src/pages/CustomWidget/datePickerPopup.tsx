import { Modal } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { keylang, tr } from "../../Config/translate";


export interface WidgetDateTimeFilterModel {
  // DataDateTime: Date | moment.Moment,
  useTimeWidget?: boolean | null,
  value?: Date | null,
  open: boolean,
  onClose(value: boolean): void,
  onChange(value: Date | moment.Moment): void,
  zIndex?:number|null,
  minDate?:Date | null,
  maxDate?:Date | null,
}

export const DatePickerPopup = (pDataDateTime: WidgetDateTimeFilterModel) => {
  const [xSelectedDate, setXSelectedDate] = useState(moment(pDataDateTime.value));
  return <>
    {pDataDateTime.open && 
    <div className={`h-full w-full z-[${(pDataDateTime.zIndex??57)}] bg-black opacity-25 fixed top-0`} style={{ zIndex: (pDataDateTime.zIndex??57) }} />}
    <Modal dismissible position="center" show={pDataDateTime.open}
      style={{ height: "auto", width: "auto", zIndex: (pDataDateTime.zIndex??57)+1 }}
      onClose={() => {
        pDataDateTime.onClose != null && pDataDateTime.onClose(false);
      }}
      popup>
      <Modal.Body className=" w-auto h-auto m-auto bg-transparent max-w-[370px]" >
        <div className="m-auto bg-transparent text-center max-w-[370px]">
          <ReactDatePicker
            selected={xSelectedDate.toDate()}
            showTimeSelect={pDataDateTime.useTimeWidget ?? false}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            className="m-auto"
            monthClassName={(date) => "text-14px font-medium"}
            maxDate={pDataDateTime.maxDate}
            minDate={pDataDateTime.minDate}
            showYearDropdown
            yearDropdownItemNumber={100}
            scrollableYearDropdown
            showMonthDropdown
            onChange={date => {
              if (date !== null) {
                console.log(date);
                setXSelectedDate(moment( date));
                if ((pDataDateTime.useTimeWidget??false) === false) {
                  pDataDateTime.onChange(moment( date));
                  pDataDateTime.onClose(false);
                }
              }
            }}
            inline
          />
          {pDataDateTime.useTimeWidget &&
            <button
              onClick={() => {
                pDataDateTime.onClose(false);
                pDataDateTime.onChange(xSelectedDate);
              }}
              className='h-full w-full rounded-md py-1.5 max-w-[370px] text-neutral-10 bg-main-Main text-medium font-bold mr-2.5'
            >
              {tr(keylang.CHOOSE)}
            </button>}
        </div>
      </Modal.Body>
    </Modal>
  </>
}