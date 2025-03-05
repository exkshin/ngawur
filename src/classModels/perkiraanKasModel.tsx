export interface KasModel {
  id: string | null,
  kode: string | null,
  nama: string | null,
  idcurrency: string | null,
  simbolcurrency?: string | null,
  kasbank?: string | null,
  akunpiutang?: string | null,
  akunhutang?: string | null,
}

export interface SelectedPerkiraanModel{
    idperkiraan: string | null,
    saldo: string | null,
    idcurrency: string | null,
    amount: string | null,
    nilaikurs: string | null,
    amountkurs: string | null,
    keterangan: string | null,
    namaperkiraan: string | null,
    kodeperkiraan:string | null,
}

export interface JurnalPelunasanModel{
  idperkiraan: string | null,
  kodeperkiraan:string | null,
  namaperkiraan: string | null,
  saldo:string | null,
  amount: string | null,
  idcurrency:string | null,
  currency:string | null,
  nilaikurs: string | null,
  amountkurs: string | null,
  keterangan: string | null,
}

