import { ListKasKeuanganModel } from "./listKasKeuanganModel";

export interface DetailClosingModel {
  header: {
    idclosing: string | null; // Assuming these are strings based on the provided data
    kodeclosing: string | null;
    username: string | null;
    tglawal: string | null; // Can also be a Date if parsed as a JavaScript Date
    omzet: string | null;
    selisihsetoran: number | null;
  };
  datajual: DataItem[];
  dataretur: DataItem[];
  setoran: DetailSetoranModel[];
  kaskeluar: ListKasKeuanganModel[];
  kasmasuk: ListKasKeuanganModel[];
  pelunasanhutang: ListKasKeuanganModel[];
  bank: KasBankModel[];
  grandtotalsetoran: number | null;
  modalawal: KasModalModel;
  uangmukahariini: String | null;
  uangmukasebelumnya: String | null;
}

export interface DetailSetoranModel {
  amountclosing: string | null;
  amountsementara: string | null;
  denominasi: string | null;
  idperusahaan: string | null;
  idsetorankasir: string | null;
}

export interface DataItem {
  idsupplier: string | null,
  namasupplier: string | null,
  hutang: string | null,
  omzet: string | null,
  daftarbarang: DataBarangModel[];
}

export interface KasBankModel {
  amount: string | null,
  jmltrans: string | null,
  namabank: string | null,
}

export interface DataBarangModel {
  kodebarang: string | null;
  namabarang: string | null;
  jml: string | null; // Can be a number if the value is parsed instead of kept as a string
  harga: string | null; // Can be a number if parsed
  subtotal: string | null; // Can be a number if parsed
  namasupplier: string | null;
  hpp: number | null;
  subtotalbeli: string | null;
  subtotalreturbeli: string | null;
  hargabeli: string | null;
}

export interface KasModalModel {
  amount: string | null;
  idkassa: string | null;
  idlokasi: string | null;
  idmodalawal: string | null;
  idperusahaan: string | null;
  kodemodalawal: string | null;
  status: string | null;
  tglentry: string | null;
  tgltrans: string | null;
  userentry: string | null;
}

export interface ListTagihanModel {
  idsupplier: string | null;
  namasupplier: string | null;
  sisahutang: string | null;
}