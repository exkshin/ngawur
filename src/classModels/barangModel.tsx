export interface BarangBySupplierModel {
  idsupplier: string | null,
  namasupplier: string | null,
  daftarbarang: DataBarangModel[],
}

export interface DataBarangModel {
  idbarang: string | null,
  kodebarang: string | null,
  namabarang: string | null,
  idsupplier: string | null,
  namasupplier: string | null,
  satuan: string | null,
  satuan2: string | null,
  satuan3: string | null,
  hargajualminsatuan: string | null,
  hargajualmaxsatuan: string | null,
  hargajualminsatuan2: string | null,
  hargajualmaxsatuan2: string | null,
  hargajualminsatuan3: string | null,
  hargajualmaxsatuan3: string | null,
  gambar: string | null,
  hargabeli: string | null,
  stok?: number | null,
  jmljual?: string | null,
  jmlretur?: string | null,
  jmlsisa?: string | null,
  jmlbeli?: string | null,
  jmlsisakemarin?: string | null,

}

export interface HitungBarangModel {
  jumlahBarang: number,
  subtotal: number,
  idbarang: string | null,
  data: DataBarangModel,
}

export interface HitungBarangClosingModel {
  sisa: number,
  retur: number,
  idbarang: string,
  data: DataBarangModel,
}
export interface HeaderHitungBarangClosingModel {
  idSupplier: string,
  namaSupplier: string,
  mode?: string,
  listHitungBarang: HitungBarangClosingModel[],
}