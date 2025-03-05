import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

interface CustomScannerModel {
    onScan: Function;
    isTorchOn: boolean;
    isPaused: boolean;
  }
  
  export const CustomScanner = (pParameter: CustomScannerModel) => {

    const [facingMode, setFacingMode] = useState("environment");
    
      /**
   * @description Fungsi `handleScan` ini digunakan untuk menangani proses pemindaian kode QR. Jika data hasil pemindaian ada, fungsi ini akan membuka dialog perpanjang tebus dan mengirim permintaan POST ke endpoint "gadai/cekkodegadai" dengan kode gadai sebagai data. Jika permintaan berhasil, fungsi ini akan mengatur hasil pemindaian dengan data yang diterima dan mencetak data tersebut ke konsol. Jika terjadi kesalahan, fungsi ini akan mencetak pesan kesalahan ke konsol.
   * @param {string} scannedData Data hasil pemindaian kode QR.
   * @author Henry
   * @date 22/01/2024 - 12:09:18 PM
   */
  const handleScan = async (scannedData: any) => {
    if (scannedData) {
      pParameter.onScan(scannedData);
    }
  };
  

    return (
      <Scanner
        onScan={handleScan}
        paused={pParameter.isPaused}
        styles={{
          video: {
            width: "100vw",
            height: "100%",
            objectFit: "cover",
          },
        }}
        components={{
          torch: true,
          finder: false,
        }}
        constraints={
          {
            facingMode,
            advanced: [{ torch: pParameter.isTorchOn }],
          } as MediaTrackConstraintSet
        }
      />
    );

  }