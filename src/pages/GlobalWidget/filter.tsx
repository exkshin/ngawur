import { useEffect, useState } from 'react'
import moment from 'moment'
import { Icon } from '@iconify/react'
import { Modal } from 'flowbite-react'
import Sheet from 'react-modal-sheet';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DataBoxDropdownModel, DataDateTimeModel, DataDateTimeRangeModel, DataFilterModel, DataListCheckboxModel, DataTextboxModel, DataTextboxRangeModel, ValueListModel, WidgetDateTimeFilterModel, WidgetDateTimeRangeFilterModel, WidgetDropdownBoxFilterModel, WidgetFilterModel, WidgetListCheckboxFilterModel, WidgetTextboxFilterModel, WidgetTextboxRangeFilterModel, WidgetType } from '../../classModels/filterModel';
import { defaultInputCSS } from '../../baseCSSModel/inputCssModel';
import DatePicker from 'react-datepicker';
import ReactDatePicker from 'react-datepicker';
import { ListBoxDropDownPage } from './listBoxDropdownPage';
import { CheckboxSVG } from './checkboxCustom';

/**
 * @description untuk mengatur hasil awal data filter
 * @param dataFilter berisi list datafiltermodel
 * @returns mengembalikan list valuelistmodel untuk hasil awal filter
 */
export const setInitData = (dataFilter: DataFilterModel[]) => {
  let temp = [] as ValueListModel[];
  dataFilter.map((val: DataFilterModel, index: number) => {
    if (val.type === WidgetType.DateTime) {
      let valueWidget = val.dataWidget as DataDateTimeModel;
      temp.push({
        extraData: valueWidget.value,
        id: "",
        nama: "",
      } as ValueListModel);
    } else if (val.type === WidgetType.Date) {
      let valueWidget = val.dataWidget as DataDateTimeModel;
      temp.push({
        extraData: valueWidget.value,
        id: "",
        nama: "",
      } as ValueListModel);
    } else if (val.type === WidgetType.DateRange) {
      let valueWidget = val.dataWidget as DataDateTimeRangeModel;
      temp.push({
        extraData: valueWidget.value,
        id: "",
        nama: "",
      } as ValueListModel);
    } else if (val.type === WidgetType.ListCheckbox) {
      let valueWidget = val.dataWidget as DataListCheckboxModel;
      temp.push(
        {
          extraData: JSON.parse(JSON.stringify(valueWidget.listData)),
          id: "",
          nama: "",
        }
      );
    } else if (val.type === WidgetType.BoxDropdown) {
      temp.push(
        {
          extraData: [] as DataBoxDropdownModel[],
          id: "",
          nama: "",
        }
      );
    }  else if (val.type === WidgetType.Textbox) {
      let valueWidget = val.dataWidget as DataTextboxModel;
      temp.push(
        {
          extraData: valueWidget.value,
          id: "",
          nama: "",
        } as ValueListModel
      );
    } else if (val.type === WidgetType.TextboxRange) {
      let valueWidget = val.dataWidget as DataTextboxRangeModel;
      temp.push(
        {
          extraData: valueWidget.value,
          id: "",
          nama: "",
        } as ValueListModel
      );

    } else {
      temp.push({
        extraData: null,
        id: "",
        nama: "",
      } as ValueListModel);
    }
    return true
  })
  return temp
}

export const WidgetFilter = (pDataWidget: WidgetFilterModel) => {
  const [xDataFilter, setXDataFilter] = useState(pDataWidget.dataFilter);
  const [xTempResultData, setXTempResultData] = useState<ValueListModel[]>(JSON.parse(JSON.stringify(pDataWidget.value)));
  const [xOpenModal, setXOpenModal] = useState(false);
  const [xIsOpenNewPage, setXIsOpenNewPage] = useState(false);
  const [xIsLoading, setXIsLoading] = useState(false);
  const [xIsReset, setXIsReset] = useState(false);

  /**
   * @description untuk menutup filter
   */
  const closeFilter = () => {
    pDataWidget.onClose();
  }

  /**
   * @description ketika variable xIsReset berubah, maka akan mereset data filter
   */
  useEffect(() => {
    if (xIsReset) {
      let temp = setInitData(xDataFilter);
      setXTempResultData(temp);
      setXIsLoading(false);
      setXIsReset(false);
    }
  }, [xIsReset])

  return (
    <div
      className="h-full w-full z-[51] absolute">
      <div className="h-full w-full z-[51] bg-black opacity-25 fixed top-0 left-0"
      onClick={() => closeFilter()} />
      <Sheet
        isOpen={pDataWidget.open}
        onClose={() => {
          closeFilter();
        }}
        snapPoints={[pDataWidget.snapPoint]}
        detent="content-height"
        disableDrag={xIsOpenNewPage}
        style={{ zIndex: 53 }}
        className="font-Merriweather"
        key={"filter"}
      >
        <Sheet.Container>
          <Sheet.Content>
            {xOpenModal && (
              <div
                className="h-full w-full z-[56] bg-black opacity-25 fixed top-0 left-0"
                onClick={() => setXOpenModal(false)}
              />
            )}
            <div className="w-full mt-1.5 mb-3">
              <div className="h-[2px] w-9 bg-main-text1 mx-auto" />
            </div>
            <div className="inline-flex w-full px-4 pb-4">
              <FontAwesomeIcon
                style={{ fontSize: "24px" }}
                className={`text-main-text1 w-6 h-6`}
                icon={faClose}
                onClick={() => closeFilter()}
              />
              <div className="w-full text-14px font-bold text-main-text1 text-center ml-3">
                Filter
              </div>
              <div
                className="text-12px font-normal text-main-text1"
                onClick={() => {
                  setXIsLoading(true);

                  setXIsReset(true);
                }}
              >
                Reset
              </div>
            </div>
            <Sheet.Scroller>
              <div className="pb-16" style={{ maxHeight: "70vh" }}>
                {xIsLoading ? (
                  <div></div>
                ) : (
                  xDataFilter.map((widget: DataFilterModel, index: number) => {
                    if (widget.type === WidgetType.Date) {
                      let datadate = new Date();
                      if (xTempResultData !== undefined) {
                        datadate = xTempResultData![index].extraData;
                      }
                      return (
                        <div key={index}>
                          <WidgetDateTime
                            toggleOverlayBackground={(value) => {
                              setXOpenModal(value);
                            }}
                            IndexWidget={index}
                            DataDateTime={
                              widget.dataWidget as DataDateTimeModel
                            }
                            onChange={(date) => {
                              let tempData = xTempResultData;
                              tempData![index].extraData = date;
                              setXTempResultData(tempData);
                            }}
                            value={datadate}
                            // value={xTempResultData![index].extraData as Date}
                            useTimeWidget={false}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 m-4" />
                          ) : (
                            <div className='h-16 my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.DateTime) {
                      let datadate = new Date();
                      if (
                        xTempResultData !== undefined &&
                        xTempResultData.length > 0
                      ) {
                        datadate = xTempResultData![index].extraData;
                      }
                      return (
                        <div key={index}>
                          <WidgetDateTime
                            toggleOverlayBackground={(value) => {
                              setXOpenModal(value);
                            }}
                            IndexWidget={index}
                            DataDateTime={
                              widget.dataWidget as DataDateTimeModel
                            }
                            onChange={(date) => {
                              let tempData = xTempResultData;
                              tempData![index].extraData = date;
                              setXTempResultData(tempData);
                            }}
                            value={datadate}
                            // value={xTempResultData![index].extraData as Date}
                            useTimeWidget={true}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 m-4" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.ListCheckbox) {
                      let dataResult =
                        xTempResultData !== undefined &&
                        xTempResultData.length > 0
                          ? xTempResultData![index].extraData
                          : [];
                      return (
                        <div key={index}>
                          <WidgetListCheckbox
                            DataListCheckbox={
                              widget.dataWidget as DataListCheckboxModel
                            }
                            value={dataResult}
                            IndexWidget={index}
                            onChange={(val, indexCheckbox) => {
                              let temp = xTempResultData;
                              let tempVal = xTempResultData![index].extraData;
                              tempVal[indexCheckbox].extraData =
                                !tempVal[indexCheckbox].extraData;
                              temp[index].extraData = tempVal;
                              setXTempResultData(temp);
                            }}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.BoxDropdown) {
                      let dataResult =
                        xTempResultData !== undefined &&
                        xTempResultData.length > 0
                          ? xTempResultData![index].extraData
                          : [];
                      return (
                        <div key={index}>
                          <WidgetDropdownBox
                            DataDropdownBox={
                              widget.dataWidget as DataBoxDropdownModel
                            }
                            ListSelected={dataResult}
                            IndexWidget={index}
                            onChange={(pValue) => {
                              let temp = xTempResultData;
                              temp[index].extraData =
                                pValue as ValueListModel[];
                              setXTempResultData(temp);
                            }}
                            useOverflowBadge={true}
                            onNewPage={(value) => {
                              setXIsOpenNewPage(value);
                            }}
                            isError={false}
                            errorText=""
                            showAllSelected={false}
                            classnameWrapper=''
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 mx-4" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.Textbox) {
                      let stringvalue =
                        xTempResultData !== undefined &&
                        xTempResultData.length > 0
                          ? xTempResultData![index].extraData
                          : "";
                      return (
                        <div key={index}>
                          <WidgetTextbox
                            DataTextBox={widget.dataWidget as DataTextboxModel}
                            IndexWidget={index}
                            value={stringvalue}
                            onChange={(value) => {
                              // Create a new array with the same content as xTempResultData
                              let temp = [...xTempResultData];
                              // Create a new object for the specific index to update, ensuring immutability
                              let newItem = {
                                ...temp[index],
                                extraData: value,
                              };
                              // Replace the item at the specific index with the updated item
                              temp[index] = newItem;
                              // Update the state with the new array, triggering a re-render
                              setXTempResultData(temp);
                            }}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 mx-4" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.DateRange) {
                      return (
                        <div key={index}>
                          <WidgetDateRange
                            DataDateTimeRange={
                              widget.dataWidget as DataDateTimeRangeModel
                            }
                            IndexWidget={index}
                            onChange={(date) => {
                              let tempData = xTempResultData;
                              tempData![index].extraData = date;
                              setXTempResultData(tempData);
                            }}
                            value={xTempResultData![index].extraData as Date[]}
                            toggleOverlayBackground={(value) => {
                              setXOpenModal(value);
                            }}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 m-4" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    } else if (widget.type === WidgetType.TextboxRange) {
                      let stringvalue =
                        xTempResultData !== undefined &&
                        xTempResultData.length > 0
                          ? xTempResultData![index].extraData
                          : "";
                      
                      return (
                        <div key={index}>
                          <WidgetTextboxRange
                            DataTextBoxRange={widget.dataWidget as DataTextboxRangeModel}
                            IndexWidget={index}
                            value={stringvalue}
                            onChange={(value) => {
                              // Create a new array with the same content as xTempResultData
                              let temp = [...xTempResultData];
                              // Create a new object for the specific index to update, ensuring immutability
                              let newItem = {
                                ...temp[index],
                                extraData: value,
                              };
                              // Replace the item at the specific index with the updated item
                              temp[index] = newItem;
                              // Update the state with the new array, triggering a re-render
                              setXTempResultData(temp);
                            }}
                          />
                          {index < xDataFilter.length - 1 ? (
                            <hr className="bg-neutral-40 my-2.5 mx-4" />
                          ) : (
                            <div className='h-[68px] my-2.5'/>
                          )}
                        </div>
                      );
                    }
                    return <div key={index}></div>;
                  })
                )}
              </div>
              <div className="fixed inline-flex bottom-0 left-0 z-54 w-full h-16 py-2.5 px-4 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-[0_35px_60px_15px_rgba(0,0,0,0.3)]">
                <button
                  className="h-full w-full rounded-xl text-main-border bg-white border-main-border border text-medium font-bold mr-2.5"
                  onClick={() => closeFilter()}
                >
                  Batal
                </button>
                <button
                  className="h-full w-full rounded-xl text-neutral-10 bg-main-border text-medium font-bold"
                  onClick={() => {
                    let temp = JSON.parse(JSON.stringify(xTempResultData));
                    pDataWidget.onChange(temp);
                    pDataWidget.onClose();
                  }}
                >
                  Terapkan
                </button>
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
}

/**
 * @description ini adalah component untuk filter yang bertipe dropdown
 * @param DataDropdownBox: DataBoxDropdownModel, berisi settingan awal dari widgetdropdownbox
 * @param IndexWidget: number, untuk tahu widget ini ada pada urutan keberapa
 * @param ListSelected: ValueListModel[], hasil yang dipilih oleh user
 * @param onChange(value: ValueListModel[]): void, fungsi yang dijalankan ketika user memilih dropdown
 * @param onNewPage(value: boolean): void, fungsi yang dijalankan ketika membuka halaman list dropdown
 * @returns component dropdown filter
 */
export const WidgetDropdownBox = (pDataDropdownBox: WidgetDropdownBoxFilterModel) => {
  const [xSelected, setXSelected] = useState((JSON.parse(JSON.stringify(pDataDropdownBox.ListSelected))));
  const [xList, setXList] = useState(pDataDropdownBox.DataDropdownBox.listData);
  const [xOpenNewPage, setXOpenNewPage] = useState(false);

  /**
   * @description untuk mengecek apakah data tersebut sudah dipilih user atau belum
   * @param pValue berisi valuelistmodel yang mau dicek
   * @returns boolean true kalau terpilih, false kalau tidak terpilih
   */
  function checkIsSelected(pValue: ValueListModel) {
    let xIsSelected = false;
    for (let i = 0; i < xSelected.length; i++) {
      if (xSelected[i].id === pValue.id) {
        xIsSelected = true;
      }
    }
    return xIsSelected;
  }

  /**
   * @description tampilan badge yang berada pada filter
   * @param pValueBadge value dari badge tersebut
   * @param pSelected value dari badge ini terpilih atau tidak
   * @param pIndex badge ini berada di urutan keberapa
   * @returns component badge
   */
  function widgetBadge(pValueBadge: ValueListModel, pSelected: boolean, pIndex: number) {
    return <div
      key={pIndex.toString() + "-" + pSelected.toString()}
      className={`px-2 py-1.5 border text-14px font-Merriweathersans truncate ... border-main-Border rounded-full ${pSelected ? "bg-main-Border text-neutral-10" : "bg-neutral-10 text-main-Border"}`}
      style={{ maxWidth: pDataDropdownBox.useOverflowBadge? "120px":"100%" }}
      onClick={() => {
        let temp = [] as ValueListModel[];
        if (pSelected) {
          xSelected.map((pValue: ValueListModel, index: number) => {
            if (pValueBadge.id !== pValue.id) {
              temp.push(pValue);
            }
            return true;
          })
        } else {
          xSelected.map((pValue: ValueListModel, index: number) => {
            temp.push(pValue);
            return true;
          })
          temp.push(pValueBadge);
        }
        setXSelected(temp);
        pDataDropdownBox.onChange(temp);
      }}
    >
      {pValueBadge.nama}
    </div>
  }

  /**
   * @description untuk membuat tampilan list badge. posisi saat ini, badge yang terpilih akan otomatis berada di posisi depannya badge yang belum terpilih.
   * @returns component div dengan max 5 badge didalamnya
   */
  function getWidgetListBadge() {
    let xIsiBadgeSelected = [] as ValueListModel[];
    let xIsiBadgeNotSelected = [] as ValueListModel[];
    for (let i = 0; i < (xSelected.length > 5&& !pDataDropdownBox.showAllSelected ? 5 : xSelected.length); i++) {
      xIsiBadgeSelected.push(xSelected[i] as ValueListModel);
    }
    if (xIsiBadgeSelected.length <= 5) {
      let index = 0;
      while ((xIsiBadgeSelected.length + xIsiBadgeNotSelected.length) <= xList.length && (xIsiBadgeSelected.length + xIsiBadgeNotSelected.length) < 5 && index < xList.length) {
        if (checkIsSelected(xList[index]) === false) {
          xIsiBadgeNotSelected.push(xList[index]);
        }
        index++;
      }
    }
    return <div className='inline-flex flex-wrap w-full gap-1.5'>
      {
        xIsiBadgeSelected.map((pValueBadge: ValueListModel, index) => {
          return widgetBadge(pValueBadge, true, index);
        })
      }
      {
        xIsiBadgeNotSelected.map((pValueBadge, index) => {
          return widgetBadge(pValueBadge, false, index);
        })
      }
    </div>
  }

  return (<div id={pDataDropdownBox.IndexWidget.toString()} key={pDataDropdownBox.IndexWidget} className={pDataDropdownBox.classnameWrapper==""? 'mx-4':pDataDropdownBox.classnameWrapper}>
    <div className='mb-2.5 w-full inline-flex '>
      <div className='mr-1 text-14px font-bold my-auto'>
        {pDataDropdownBox.DataDropdownBox.title}
      </div>
      <div className='rounded-full mx-0.5 text-12px text-center flex items-center justify-center font-Merriweathersans text-neutral-10 bg-main-Border' style={{ minWidth: "25px", height: "25px" }}>
        {xSelected.length}
      </div>
      {
        <div
          className=' ml-auto my-auto text-12px font-bold text-main-Border font-Merriweathersans'
          onClick={() => {
            let openPage = true;
            setXOpenNewPage(openPage);
            pDataDropdownBox.onNewPage(openPage);
          }}
        >
          Tambah
        </div>}
    </div>
    {pDataDropdownBox.isError && <div className="mt-2 text-12px text-danger-Main px-4">{pDataDropdownBox.errorText}</div>}
    {getWidgetListBadge()}
    {xOpenNewPage &&
      <ListBoxDropDownPage
        listData={xList}
        listSelected={xSelected}
        onChange={(pValue) => { setXSelected(pValue); pDataDropdownBox.onChange(pValue); }}
        onClose={() => { setXOpenNewPage(false); pDataDropdownBox.onNewPage(false); }}
        placeholder={pDataDropdownBox.DataDropdownBox.placeholder}
        titleListBadge={pDataDropdownBox.DataDropdownBox.titleListBadge}
      />
    }
  </div>);
}

/**
 * @description untuk component list checkbox yang digunakan pada filter
 * @param DataListCheckbox: DataListCheckboxModel, settingan awal list checkbox
 * @param IndexWidget: number, widget ini berada pada urutan keberapa
 * @param value: ValueListModel[], data yang dipilih oleh user
 * @param onChange(value: boolean, indexCheckbox: number): void, fungsi yang dijalankan ketika terdapat perubahan status checkbox
 * @returns component list checkbox
 */
export const WidgetListCheckbox = (pDataListCheckbox: WidgetListCheckboxFilterModel) => {
  const [xSelected, setXSelected] = useState(JSON.parse(JSON.stringify(pDataListCheckbox.value)));
  return (<div id={pDataListCheckbox.IndexWidget.toString()} key={pDataListCheckbox.IndexWidget} className='mx-4'>
    <div className='text-14px font-bold mb-2.5 w-full'>{pDataListCheckbox.DataListCheckbox.title}</div>
    {
      xSelected.map((val: ValueListModel, index: number) => {
        return <div className='w-full inline-flex' key={index} onClick={() => {
          let temp = JSON.parse(JSON.stringify(xSelected));
          temp[index].extraData = temp[index].extraData === false;
          setXSelected(temp);
          pDataListCheckbox.onChange(!val.extraData, index)
        }}>
          <div className='text-14px w-full mr-2 mb-2.5'>{val.nama}</div>
          <div style={{ fontSize: "16px" }}>
            <CheckboxSVG borderColor={"#C19A6B"} checkColor={val.extraData ? "#C19A6B" : "transparent"} />
          </div>
        </div>
      })
    }
  </div>)
}

/**
 * @param DataDateTime: DataDateTimeModel, untuk settingan awal pada filter datetime
 * @param useTimeWidget: boolean, diisi true apabila menggunakan filter waktu
 * @param IndexWidget: number, menunjukkan index keberapa widget datetime ini
 * @param value: Date, value dari widget date time
 * @param onChange(value: Date): void, fungsi yang dijalankan ketika value dari widgetdatetime ini berubah
 * @param toggleOverlayBackground(value: boolean): void, untuk mengaktifkan / non aktifkan overlay background
 */
export const WidgetDateTime = (pDataDateTime: WidgetDateTimeFilterModel) => {
  const [xOpenModal, setXOpenModal] = useState(false);
  const [xSelectedDate, setXSelectedDate] = useState(pDataDateTime.DataDateTime.value);
  let mindate=new Date()
  mindate.setFullYear(new Date().getFullYear()-100);
  return (
    <div id={pDataDateTime.IndexWidget.toString()} key={pDataDateTime.IndexWidget} className='mx-4'>
      <div className='text-14px font-bold mb-2.5'>{pDataDateTime.DataDateTime.title}</div>
      <div className="relative w-full mr-1.5"
        onClick={() => {
          setXOpenModal(true);
          pDataDateTime.toggleOverlayBackground(true);
        }}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
        </div>
        <input
          placeholder={pDataDateTime.DataDateTime.placeholder}
          readOnly={true}
          value={pDataDateTime.value==null?"": moment(pDataDateTime.value).format(pDataDateTime.useTimeWidget ? "DD MMM YYYY HH:mm" : "DD MMM YYYY")}
          className={`pl-10 ${defaultInputCSS(pDataDateTime.value!==null, false, true)} `}
        />
      </div>
      <Modal dismissible position="center" show={xOpenModal}
        style={{ height: "auto", width:"auto", zIndex: 57 }}
        onClose={() => {
          setXOpenModal(false);
          pDataDateTime.toggleOverlayBackground(false);
        }}
        popup>
        <Modal.Body className=" w-auto h-auto m-auto bg-transparent " >
          <div className="m-auto bg-transparent">
            <ReactDatePicker
              selected={pDataDateTime.DataDateTime.value}
              showTimeSelect={pDataDateTime.useTimeWidget}
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              className="m-auto"
              monthClassName={(date) => "text-14px font-medium"}
              // maxDate={new Date()}
              // minDate={mindate}
              showYearDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              showMonthDropdown
              onChange={date => {
                if (date !== null) {
                  setXSelectedDate(date);
                  if (pDataDateTime.useTimeWidget === false) {
                    setXOpenModal(false)
                    pDataDateTime.toggleOverlayBackground(false);
                    pDataDateTime.onChange(date);
                  }
                }
              }}
              inline
            />
            {pDataDateTime.useTimeWidget &&
              <button
                onClick={() => {
                  setXOpenModal(false)
                  pDataDateTime.onChange(xSelectedDate);
                  pDataDateTime.toggleOverlayBackground(false);
                }}
                className='h-full w-full rounded-md py-1.5 text-neutral-10 bg-info-Main text-medium font-bold mr-2.5'
              >
                Pilih
              </button>}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export const WidgetTextbox = (pDataTextbox: WidgetTextboxFilterModel) => {
  return (
    <div id={pDataTextbox.IndexWidget.toString()} key={pDataTextbox.IndexWidget} className='mx-4'>
      <div className='text-14px font-bold mb-2.5'>{pDataTextbox.DataTextBox.title}</div>
      <input
      onChange={(e) => {
        pDataTextbox.onChange(e.target.value);
      }}
      placeholder={pDataTextbox.DataTextBox.placeholder}
      value={pDataTextbox.value}
      className={` pl-2 pr-10 ${defaultInputCSS((pDataTextbox.value !== "" && pDataTextbox.value !== undefined), false, false)}`}
    />
      </div>
  )
}

export const WidgetTextboxRange = (pDataTextboxRange: WidgetTextboxRangeFilterModel) => {
  var regex = pDataTextboxRange.DataTextBoxRange.format === 'decimal' ? /^\d*[,]?\d*$/ : /^\d+$/;
  return (
    <div
      id={pDataTextboxRange.IndexWidget.toString()}
      key={pDataTextboxRange.IndexWidget}
      className="mx-4"
    >
      <div className="text-14px font-bold mb-2.5">
        {pDataTextboxRange.DataTextBoxRange.title}
      </div>
      <div className="flex flex-row items-center">
        <input
          onChange={(e) => {
            var temp = pDataTextboxRange.value;
            if (regex.test(e.target.value.replace('.', ',')) || e.target.value === "") {
              temp[0] = e.target.value.replace('.', ',');
              pDataTextboxRange.onChange(temp);
            }
          }}
          placeholder={pDataTextboxRange.DataTextBoxRange.placeholder[0]}
          value={pDataTextboxRange.value[0]}
          className={`pl-2 pr-10 mr-1.5 ${defaultInputCSS(
            pDataTextboxRange.value[0] !== "" &&
              pDataTextboxRange.value[0] !== undefined,
            false,
            false
          )}`}
        />
        <div className="relative mr-1.5 font-Merriweathersans font-bold text-12px">
          {"S/D"}
        </div>
        <input
            onChange={(e) => {
              var temp = pDataTextboxRange.value;
              if (regex.test(e.target.value.replace('.', ',')) || e.target.value === "") {
                temp[1] = e.target.value.replace('.', ',');
                pDataTextboxRange.onChange(temp);
              }
            }}
            placeholder={pDataTextboxRange.DataTextBoxRange.placeholder[1]}
            value={pDataTextboxRange.value[1]}
            className={`pl-2 pr-10 mr-1.5 ${defaultInputCSS(
              pDataTextboxRange.value[1] !== "" &&
                pDataTextboxRange.value[1] !== undefined,
              false,
              false
            )}`}
          />
      </div>
    </div>
  );
}

export const WidgetDateRange = (pDataDateRange: WidgetDateTimeRangeFilterModel) =>{
const [xOpenAwalModal, setXOpenAwalModal] = useState(false);
const [xOpenAkhirModal, setXOpenAkhirModal] = useState(false);

const [xSelectedAwalDate, setXSelectedAwalDate] = useState(pDataDateRange.DataDateTimeRange.value[0]);
const [xSelectedAkhirDate, setXSelectedAkhirDate] = useState(pDataDateRange.DataDateTimeRange.value[1]);

return (
  <div
    id={pDataDateRange.IndexWidget.toString()}
    key={pDataDateRange.IndexWidget}
    className="mx-4"
  >
    <div className="text-14px font-bold mb-2.5">
      {pDataDateRange.DataDateTimeRange.title}
    </div>
    <div className="flex flex-row items-center">
      <div
        className="relative w-full mr-1.5"
        onClick={() => {
          setXOpenAwalModal(true);
          pDataDateRange.toggleOverlayBackground(true);
        }}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
        </div>
        <input
          placeholder="Cari No Transaksi / No Plat"
          readOnly={true}
          value={moment(pDataDateRange.value[0]).format("DD MMM YYYY")}
          className={`pl-10 ${defaultInputCSS(true, false, true)} `}
        />
      </div>
      <div className="relative mr-1.5 font-Merriweathersans font-bold text-12px">
        {"S/D"}
      </div>
      <div
        className="relative w-full mr-1.5"
        onClick={() => {
          setXOpenAkhirModal(true);
          pDataDateRange.toggleOverlayBackground(true);
        }}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon fontSize={"24px"} icon={"uil:calendar-alt"} />
        </div>
        <input
          placeholder="Cari No Transaksi / No Plat"
          readOnly={true}
          value={moment(pDataDateRange.value[1]).format("DD MMM YYYY")}
          className={`pl-10 ${defaultInputCSS(true, false, true)} `}
        />
      </div>
    </div>
    <Modal
      dismissible
      position="center"
      className="max-w-[280px] max-h-[290px] m-auto p-auto z-[57]"
      show={xOpenAwalModal}
      size="md"
      onClose={() => {
        setXOpenAwalModal(false);
        pDataDateRange.toggleOverlayBackground(false);
      }}
    >
      <Modal.Body className="m-auto">
        <div className="m-auto w-full h-full">
          <ReactDatePicker
            selected={pDataDateRange.DataDateTimeRange.value[0]}
            showTimeSelect={false}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            className="m-auto"
            monthClassName={(date) => "text-14px font-medium"}
            maxDate={new Date()}
            onChange={(date) => {
              if (date !== null) {
                setXSelectedAwalDate(date);
                setXOpenAwalModal(false);
                pDataDateRange.toggleOverlayBackground(false);
                pDataDateRange.onChange([date, xSelectedAkhirDate ?? null]);
              }
            }}
            inline
          />
        </div>
      </Modal.Body>
    </Modal>
    <Modal
      dismissible
      position="center"
      className="max-w-[280px] max-h-[290px] m-auto p-auto z-[57]"
      show={xOpenAkhirModal}
      size="md"
      onClose={() => {
        setXOpenAkhirModal(false);
        pDataDateRange.toggleOverlayBackground(false);
      }}
    >
      <Modal.Body className="m-auto">
        <div className="m-auto w-full h-full">
          <ReactDatePicker
            selected={pDataDateRange.DataDateTimeRange.value[1]}
            showTimeSelect={false}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            className="m-auto"
            monthClassName={(date) => "text-14px font-medium"}
            maxDate={new Date()}
            onChange={(date) => {
              if (date !== null) {
                setXSelectedAkhirDate(date);
                setXOpenAkhirModal(false);
                pDataDateRange.toggleOverlayBackground(false);
                pDataDateRange.onChange([xSelectedAwalDate, date]);
              }
            }}
            inline
          />
        </div>
      </Modal.Body>
    </Modal>
  </div>
);
}

