import { HutangPelunasanModelDaftarBarang } from "./HutangPelunasanModel";

export interface HeaderKasModel {
  userbuat?: string | null;
  userhapus?: string | null;
  idperusahaan?: string | null;
  idkas?: string | null;
  idlokasi?: string | null;
  kodekas?: string | null;
  idpo?: string | null;
  nobuktimanual?: string | null;
  jeniskas?: string | null;
  tgltrans?: string | null;
  referensi?: string | null;
  keterangan?: string | null;
  idperkiraankas?: string | null;
  idcurrency?: string | null;
  amount?: string | null;
  nilaikurs?: string | null;
  amountkurs?: string | null;
  totaldebet?: string | null;
  totalkredit?: string | null;
  userentry?: string | null;
  tglentry?: string | null;
  userbatal?: string | null;
  tglbatal?: string | null;
  alasanbatal?: string | null;
  status?: string | null;
  closing?: string | null;
  namaperkiraankas?: string | null;
  kodelokasi?: string | null;
  namalokasi?: string | null;
  namasupplier?: string | null;
  idsupplier?: string | null;
}

export interface DetailPerkiraanModel {
  idperkiraan?: string | null;
  idcurrency?: string | null;
  kodeperkiraan?: string | null;
  namaperkiraan?: string | null;
  saldo?: string | null;
  amount?: string | null;
  nilaikurs?: string | null;
  amountkurs?: string | null;
  currency?: string | null;
  keterangan?: string | null;
}

export interface DetailHutangModel {
  idtrans?: string | null;
  kodetrans?: string | null;
  noinvmanual?: string | null;
  tgltrans?: string | null;
  jenistransaksi?: string | null;
  jenis?: string | null;
  total?: string | null; // Consider using number if you plan to handle this as a numeric value  
  grandtotal?: number | null; // Assuming this is a numeric value  
  sisa?: string | null; // Consider using number if you plan to handle this as a numeric value  
  pelunasan?: string | null |number; // Consider using number if you plan to handle this as a numeric value  
  keterangan?: string | null;
  daftar_barang: HutangPelunasanModelDaftarBarang[],
  namalokasi: string | null,
  kodelokasi: string | null,
}

export interface DetailKasModel {
  header: HeaderKasModel,
  detailPerkiraan: DetailPerkiraanModel[],
  detailHutang: DetailHutangModel[],
}