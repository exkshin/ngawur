import Sheet from 'react-modal-sheet';
import { DataHutang } from '../../classModels/listHutangModel';
import moment from 'moment';
import { numberSeparatorFromString } from '../../Config/globalVariables';
import { useEffect, useState } from 'react';
import { HutangPelunasanModel } from '../../classModels/HutangPelunasanModel';
import { DetailHutangModel } from '../../classModels/detailKasModel';

interface BottomSheetDetailPelunasanHutangKasModel {
  hutang: DetailHutangModel | null,
  open: boolean,
  onClose(value: boolean): void,
}

export const BottomSheetDetailPelunasanHutangKas = (pParameter: BottomSheetDetailPelunasanHutangKasModel) => {
  const [xTotal, setXTotal] = useState(0.0);

  useEffect(() => {
    if (pParameter.hutang != null && pParameter.hutang != undefined && pParameter.hutang.daftar_barang != undefined) {
      let total = 0.0;
      pParameter.hutang.daftar_barang.forEach(pBarang => {
        total += (parseFloat(pBarang.harga ?? "0.0") * parseFloat(pBarang.jml ?? "0.0"))
      });
      setXTotal(total);
    }
  }, [pParameter.hutang])

  return <>
    {pParameter.open && <div className='h-full w-full z-[51] fixed top-0 left-0 bg-black opacity-25 ' onClick={() => { pParameter.onClose != undefined && pParameter.onClose != null && pParameter.onClose(false); }} />}
    <Sheet
      isOpen={pParameter.open}
      onClose={() => { pParameter.onClose != undefined && pParameter.onClose != null && pParameter.onClose(false); }}
      snapPoints={[0.7]}
      detent='content-height'
      style={{ zIndex: 53 }}
      key={"filter"}
    >
      <Sheet.Container>
        <Sheet.Content>
          <div className='w-full mt-1.5 mb-3'>
            <div className='h-[2px] w-9 bg-main-Pressed mx-auto' />
            <div className='w-full text-center mt-1 px-4 font-semibold'>Detail Penjualan <br />{moment(pParameter.hutang?.tgltrans).format("DD MMM YYYY")}</div>
          </div>
          <Sheet.Scroller>
            <div className='px-4' style={{ maxHeight: "70vh" }}>
              {pParameter.hutang != undefined && pParameter.hutang != null && pParameter.hutang?.daftar_barang?.map((pBarang, pIndex) => {
                return <div
                  key={pIndex.toString()}
                  className={`pb-2.5 border-b border-Grey text-14px ${pIndex == 0 ? "" : "pt-2.5"
                    } $text-neutral-100
              `}
                >
                  <div>
                    <p className='font-bold'>{pBarang.namabarang}</p>
                    
                  </div>
                  <div className='text-danger-Main flex justify-between' >
                  <p>{numberSeparatorFromString((pBarang.jml ?? "0").split(".")[0])} X {numberSeparatorFromString((pBarang.harga ?? "0").split(".")[0])}</p>
                    {numberSeparatorFromString((parseFloat(pBarang.harga ?? "0.0") * parseFloat(pBarang.jml ?? "0.0")).toString().split(".")[0])}
                  </div>
                </div>;
              })}
              <div
                className={`pb-2.5 border-b border-Grey text-14px justify-between font-bold pt-2.5 text-neutral-100 flex
              `}
              >
                <div>
                  Total
                </div>
                <div className='text-danger-Main' >
                  {numberSeparatorFromString(xTotal.toString().split('.')[0])}
                </div>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  </>
}