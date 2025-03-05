export interface DataHutang {
  tgltrans?: string;
  amount?: string;
  tahunbulan?: string;
  keterangan?: string;
  daftarbarang?:DaftarBarangHutang[];
  idlokasi?:string;
  namalokasi?:string;
}

export interface DaftarBarangHutang {
  hargabeli?: string;
  idbarang?: string;
  jml?: string;
  kodebarang?: string;
  namabarang?: string;
}

export interface ListHutangModel {
  saldoawal?: number;
  hutang?: string;
  pelunasan?: string;
  periode?: string;
  daftar: DataHutang[];
}