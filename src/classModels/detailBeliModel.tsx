export interface DetailBeliModel {
  header: HeaderDetailBeli,
  detail: DataBarangDetailBeli[],
}

export interface HeaderDetailBeli {
  userbuat: string | null,
  userhapus: string | null,
  tgltrans: string | null,
  tgljatuhtempo: string | null,
  idbeli: string | null,
  kodebeli: string | null,
  jenistransaksi: string | null,
  noinvoicesupplier: string | null,
  idlokasi: string | null,
  idsupplier: string | null,
  idsyaratbayar: string | null,
  tglentry: string | null,
  tglbatal: string | null,
  alasanbatal: string | null,
  total: string | null,
  ppnrp: string | null,
  pph22rp: string | null,
  pembulatan: string | null,
  grandtotal: string | null,
  catatan: string | null,
  status: string | null,
  closing: string | null,
  selisih: string | null,
  namasyaratbayar: string | null,
  kodelokasi: string | null,
  namalokasi: string | null,
  kodesupplier: string | null,
  namasupplier: string | null,
  alamatsupplier: string | null,
  telpsupplier: string | null,
  contactperson: string | null,
  telpcp: string | null,
  norekening: string | null,
  kodesupplierkirim: string | null,
  namasupplierkirim: string | null,
  alamatsupplierkirim: string | null,
  telpsupplierkirim: string | null,
  contactpersonsupplierkirim: string | null,
  telpcpsupplierkirim: string | null,
  biayakirim: string | null,
  perhitunganbiayakirim: string | null,
  idsupplierkirim: string | null,
  gambar: string | null,
  pathgambar: string | null,
}

export interface DataBarangDetailBeli {
  kodebeli: string | null,
  idbbm: string | null,
  adanpwp: string | null,
  idbarang: string | null,
  kodebarang: string | null,
  namabarang: string | null,
  jml: string | null,
  jmlbonus: string | null,
  satuan: string | null,
  satuanutama: string | null,
  konversi: string | null,
  idcurrency: string | null,
  simbol: string | null,
  harga: string | null,
  ppn: string | null,
  discpersen: string | null,
  disc: string | null,
  disckurs: string | null,
  subtotal: string | null,
  nilaikurs: string | null,
  hargakurs: string | null,
  subtotalkurs: string | null,
  urutan: string | null
  pakaippn: string | null,
  ppnpersen: string | null,
  ppnrp: string | null,
  pph22persen: string | null,
  pph22rp: string | null,
  akunbiaya: string | null,
  idakunbiaya: string | null,
  akunhutang: string | null,
  idakunhutang: string | null,
  barcodesatuan1: string | null,
  partnumber: string | null,
  catatan: string | null,
  kategori: string | null,
  biayakirim: string | null,
  satuan1: string | null,
  satuan2: string | null,
  satuan3: string | null,
  konversi1: string | null,
  konversi2: string | null,
  idreturbeli?: string | null,
  kodereturbeli?: string | null,
}
