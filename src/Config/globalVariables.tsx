import imageCompression, { Options } from "browser-image-compression";

//! OBSCURED
const urlAPI = "https://app.atena.id/";
// const urlAPI = "http://192.168.1.42/atena/";
const errorMsg = "Network Error";
const innerHeight =window.innerHeight;
const innerWidth = window.innerWidth;

const idPerusahaanGlobal = "41";
const idUserGlobal="181";

/**
   * 
   * @param link isi dengan link yang mau dibuka di browser
   * @description untuk buka browser baru di hp
   */
export function launchWeb(link: string) {
    if(window.flutter_inappwebview!==null &&window.flutter_inappwebview!==undefined&&window.flutter_inappwebview.callHandler!==null &&window.flutter_inappwebview.callHandler!==undefined){
        window.flutter_inappwebview.callHandler(
        "LaunchWeb",
        link,
        );
    }else{
        window.open(link, "_blank");
    }
  }

/**
 * untuk separator currency
 * @param price masukkan angka yang mau dibuat separatornya
 * @returns Rp{number with separator ex:10.000}
 */
export const priceSeparator = (price: number) => {
    return 'Rp' + price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * untuk separator angka
 * @param numberValue masukkan angka yang mau dibuat separatornya
 * @returns number with separator ex:10.000
 */
export const numberSeparator = (numberValue: number) => {
    return numberValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}
/**
 * untuk separator angka
 * @param numberValue masukkan angka yang mau dibuat separatornya
 * @returns number with separator ex:10.000
 */
export const numberSeparatorFromString = (numberValue: string) => {
    return numberValue.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

export const floatSeparator=(text:string)=>{
    let newText="";
    let firstTime=true;
    let subtext="";
    let isMin=false;
    if(text.length>0){
        isMin=text[0]=="-";
    }

    let arrText =text.replaceAll("-","").split(".");
    for(let i=arrText[0].length-1;i>=0;i--){
        if((subtext.length==3&& firstTime)||(subtext.length==2&&!firstTime)){
            subtext="";
            newText+="."+arrText[0][i];
            firstTime = false;
        }else{
            subtext+=arrText[0][i];
            newText+=arrText[0][i];
        }
    }
    if(arrText.length>1){
        if(parseInt(arrText[1])!=0){
            arrText[1]=arrText[1].split("").reverse().join("");
            newText=arrText[1]+","+newText;
        }
    }
    newText=newText.split("").reverse().join("");
    if(isMin) newText="-"+newText;
    return newText;
}

/**
 * untuk cek format email
 * @param email masukkan angka yang mau dibuat separatornya
 * @returns true kalau sudah betul
 */
export const validateEmail = (email: string) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export async function compressImage (pFileGambar:File): Promise<File|null> {
    try{
    const options = {
        maxSizeMB: 3,
        initialQuality:1,
      } as Options;
  
      const compressedFile =  await imageCompression(pFileGambar, options);
  
      var newCompressed = new File([compressedFile], "image.png", { type: "image/png" });
      // Create a File object
      return newCompressed;
    }catch(e){
        console.error("Error fetching image blob",e);
        return null;
    }
}


export function printNota(pParameter : {idPerusahaan:string, idUser:string, idTransaksi:string, type:string,kode?:string,jenisClosing?:string}){
    window.flutter_inappwebview.callHandler(
        "PrintNota",
        JSON.stringify( pParameter),
      );
}
/**
 * untuk mendapatkan url api
 */
const globalVariables = {
    urlAPI,
    errorMsg,
    innerHeight,
    innerWidth,
    idPerusahaanGlobal,
    idUserGlobal,
}

export default globalVariables;