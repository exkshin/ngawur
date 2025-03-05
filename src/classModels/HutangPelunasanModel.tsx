export interface HutangPelunasanModel {
  kodetrans: string | null,
  tgltrans: string | null,
  jenistransaksi: string | null,
  grandtotal: string | null,
  sisa: string | null,
  catatan: string | null,
  idtrans: string | null,
  daftar_barang:HutangPelunasanModelDaftarBarang[],
  namalokasi:string | null,
  idlokasi:string | null,
}
export interface HutangPelunasanModelDaftarBarang{
  harga: string | null,
  jml: string | null,
  namabarang: string | null,
  subtotal: string | null,
}
