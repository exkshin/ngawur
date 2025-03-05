/**
 * @description untuk component toast
 * @param text: string, berisi tulisan yang akan ditampilkan dalam toast
 * @param show: boolean, diisi true apabila mau memunculkan toas, false untuk hide toast
 * @param isToastError: boolean, diisi true apabila mau menampilkan toast dengan desain untuk error
 * @returns component toast
 */
export const ToastSnackbar = (pShowToast: ToastSnackbarModel) => {
  return <div id="snackbar" className={` fixed inset-x-0 top-20 flex justify-between items-center`}
    // style={{ display: showToast.show ? "block" : "none" }}
    style={{ zIndex: 9999 }}
  >
    <span className={`m-auto rounded-full transition-all ease-in duration-400 text-center  ${pShowToast.show ? " opacity-100 px-2.5 py-2" : "opacity-0"} ${pShowToast.isToastError ? " text-danger-Main border-danger-Main bg-danger-Surface" : " text-success-Main border-success-Main bg-success-Surface"}`}>{pShowToast.text}</span>
  </div>;
}

export interface ToastSnackbarModel {
  text: string,
  show: boolean,
  isToastError: boolean,
}

