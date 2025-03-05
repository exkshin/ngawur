import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sheet from 'react-modal-sheet';
import { numberSeparator, numberSeparatorFromString } from '../../Config/globalVariables';
import { HitungBarangModel } from '../../classModels/barangModel';
export interface OpsiWidgetModel {
  openOpsi: boolean,
  onClose(): void,
  item: HitungBarangModel[],
  isBeli?:boolean,
}
export const PopupRangkuman = (pParameter: OpsiWidgetModel) => {
  return <div>
    {pParameter.openOpsi && <div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => pParameter.onClose()} />}
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
                <div className='w-full text-small font-bold text-main-text1 text-center '>Keranjang Belanja</div>
                <FontAwesomeIcon style={{ fontSize: "24px" }} className={`text-transparent w-6 h-6`} icon={faClose} />
              </div>
              {pParameter.item!=null&&pParameter.item!=undefined&& pParameter.item.map((pValue: HitungBarangModel, pIndex) => {
                let jumlahBarang = pValue.jumlahBarang;
                let hargaBarang = parseInt((pValue.data.hargajualmaxsatuan??"0").split(".")[0]);
                if(pParameter.isBeli==true){
                  hargaBarang = parseInt((pValue.data.hargabeli??"0").split(".")[0]);
                }
                let totalHarga = jumlahBarang * hargaBarang;
                return (
                  <div
                    key={pIndex.toString()}
                    className={`pb-2.5 border-b border-Grey ${pIndex == 0 ? "" : "pt-2.5"
                      } text-neutral-100`}

                  >
                    <p className='text-14px font-semibold'>{pValue.data.namabarang}</p>
                    <div className='flex justify-between'>
                      <p>{numberSeparator(jumlahBarang)} X Rp{numberSeparator(hargaBarang)}</p>
                      <p>Rp{numberSeparator(totalHarga)}</p>
                    </div>
                  </div>
                );
              })}
              <div className="min-h-16" />
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  </div>;
}