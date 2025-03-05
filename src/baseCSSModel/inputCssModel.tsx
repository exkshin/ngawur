/**
 * @description fungsi yang mengembalikan data string untuk classname textbox, gunanya untuk mengatur tampilan textbox. hanya bisa digunakan untuk tailwind
 * @param pHasInput diisi true apabila textbox mempunyai inputan
 * @param pError diisi true apabila textbox dalam kondisi error
 * @param pReadOnly diisi true apabila textbox berada dalam status read only
 * @returns string untuk classname textbox
 */
export const defaultInputCSS = (pHasInput: boolean, pError: boolean, pReadOnly: boolean) => {
  return ` font-Asap font-normal text-14px read-only:"border-borderColor-gray read-only:bg-lineColor read-only:text-neutral-100
  placeholder:text-neutral-60 font-Asap  input-border border rounded-lg block w-full bg-white p-2.5 text-neutral-100
    ${
    //dalam keadaan focus
    "focus:ring-0 focus:outline-none focus:text-neutral-100 "
    }
    ${pError
      // dalam keadaan error
      ? "border-danger-Main bg-danger-Surface "
      : pHasInput
        //ada inputannya
        ? "border-neutral-100 bg-neutral-10 focus:border-neutral-100"
        //tidak ada inputannya
        : "border-neutral-40 bg-neutral-10 focus:border-neutral-100"
    }
    ${
    //dalam keadaan disabled
    pReadOnly
      ? "disabled:border-neutral-50 disabled:bg-neutral-30 disabled:text-neutral-60 "
      : "disabled:border-neutral-50 disabled:bg-neutral-30 disabled:text-neutral-60 "
    }
  `
};
