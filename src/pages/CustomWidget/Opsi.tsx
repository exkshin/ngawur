import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sheet from 'react-modal-sheet';
export interface OpsiItemModel {
  text: string,
  onClick(): void,
  disabled: boolean,
}
export interface OpsiWidgetModel {
  openOpsi: boolean,
  onClose(): void,
  item: OpsiItemModel[],
  title?:string,
}
export const OpsiWidget = (pParameter: OpsiWidgetModel) => {
  return <>
    {pParameter.openOpsi&&<div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => pParameter.onClose()} />}
    <Sheet
      isOpen={pParameter.openOpsi}
      onClose={() => pParameter.onClose()}
      snapPoints={[0.7]}
      detent='content-height'
      style={{ zIndex: 53 }}
      key={"filter"}
    >
      <Sheet.Container>
        <Sheet.Content>
          <div className='w-full mt-1.5 mb-3'>
            <div className='h-[2px] w-9 bg-main-text1 mx-auto' />
          </div>
          <Sheet.Scroller>
            <div className='px-4 font-Merriweather' style={{ maxHeight: "70vh" }}>
              <div className='flex w-full mb-4'>
                <FontAwesomeIcon style={{ fontSize: "24px" }} className={`text-main-text1 w-6 h-6`} icon={faClose} onClick={() => pParameter.onClose()} />
                <div className='w-full text-small font-bold text-main-text1 text-center '>{pParameter.title??"Opsi"}</div>
                <FontAwesomeIcon style={{ fontSize: "24px" }} className={`text-transparent w-6 h-6`} icon={faClose} />
              </div>
              {pParameter.item.map((pValue: OpsiItemModel, pIndex) => {
                return (
                  <div
                    key={pIndex.toString()}
                    className={`pb-2.5 border-b border-Grey text-14px font-bold ${
                      pIndex == 0 ? "" : "pt-2.5"
                    } ${
                      pValue.disabled ? "text-neutral-70" : "text-neutral-100"
                    }`}
                    onClick={(e) => {
                      if (!pValue.disabled) {
                      pValue.onClick();
                    }
                    }}
                  >
                    {pValue.text}
                  </div>
                );
              })}
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  </>;
}