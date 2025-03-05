export interface TransaksiJualModel {
  idtrans: string | null,
  kodetrans: string | null,
  tgltrans: string | null,
  jenistransaksi: string | null,
  namacustomer: string | null,
  idcustomer: string | null,
  grandtotal: string | null,
  idso: string | null,
  detail: JualModelBarang[],
  tglkirim?: string | null,
  jamkirim?: string | null,
}

export interface JualModelBarang {
  idbarang:string | null,
  namabarang: string | null,
  harga: string | null,
  jml: string | null,
  subtotal: string | null,
}