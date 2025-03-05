export interface WidgetFilterModel {
  dataFilter: DataFilterModel[],
  open: boolean,
  snapPoint: number,
  value: ValueListModel[]
  onChange(value: any[]): void,
  onClose(): void,
}
export interface WidgetDateTimeFilterModel {
  DataDateTime: DataDateTimeModel,
  useTimeWidget: boolean,
  IndexWidget: number,
  value: Date|null,
  onChange(value: Date): void,
  toggleOverlayBackground(value: boolean): void,
}
export interface WidgetDateTimeRangeFilterModel {
  DataDateTimeRange: DataDateTimeRangeModel,
  IndexWidget: number,
  value: Date[],
  onChange(value: Date[]): void,
  toggleOverlayBackground(value: boolean): void,

}
export interface WidgetListCheckboxFilterModel {
  DataListCheckbox: DataListCheckboxModel,
  IndexWidget: number,
  value: ValueListModel[],
  onChange(value: boolean, indexCheckbox: number): void,
}
export interface WidgetDropdownBoxFilterModel {
  DataDropdownBox: DataBoxDropdownModel,
  IndexWidget: number,
  ListSelected: ValueListModel[],
  onChange(value: ValueListModel[]): void,
  onNewPage(value: boolean): void,
  useOverflowBadge:boolean,
  isError:boolean,
  errorText:string,
  showAllSelected:boolean
  classnameWrapper:string,
}
export interface WidgetTextboxFilterModel {
  DataTextBox: DataTextboxModel,
  IndexWidget: number,
  value: string,
  onChange(value: string): void,
}

export interface WidgetTextboxRangeFilterModel {
  DataTextBoxRange: DataTextboxRangeModel,
  IndexWidget: number,
  value: string[],
  onChange(value: string[]): void,
}

export interface DataFilterModel {
  type: WidgetType,
  dataWidget: DataDateTimeModel | DataBoxDropdownModel | DataListCheckboxModel | DataTextboxModel | DataDateTimeRangeModel | DataTextboxRangeModel | null,
}
export interface DataDateTimeModel {
  value: Date,
  title: string,
  placeholder: string,
}
export interface DataDateTimeRangeModel {
  value: Date[],
  title: string,
  placeholder: string,
}
export interface DataBoxDropdownModel {
  value: ValueListModel[],
  listData: ValueListModel[],
  title: string,
  placeholder: string,
  titleListBadge: string,
}
export interface DataListCheckboxModel {
  value: ValueListModel[],
  listData: ValueListModel[],
  title: string,
}
export interface DataTextboxModel {
  value: string,
  title: string,
  placeholder: string,
}
export interface DataTextboxRangeModel {
  value: string[],
  title: string,
  format: string,
  placeholder: string[],
}
export interface ValueListModel {
  id: string,
  nama: string,
  extraData: any | null
}
export enum WidgetType {
  Date,
  DateRange,
  DateTime,
  ListCheckbox,
  BoxDropdown,
  Textbox,
  TextboxRange,
}