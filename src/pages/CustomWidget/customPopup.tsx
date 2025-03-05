import { Modal } from "flowbite-react";
import { ReactNode, useEffect } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import galaxysnack from "../../assets/images/galaxysnack.png";
import { AsyncImage } from 'loadable-image'
/**
 * @description untuk popup dengan 2 tombol bawah kanan dan kiri
 * @param open: boolean untuk munculkan / hide popup,
 * @param zIndex: number untuk z-index popup,
 * @param content: ReactNode untuk isi popup,
 * @param onClose: Function untuk fungsi tutup popup,
 * @param functionButtonLeft: Function untuk fungsi tombol kiri popup,
 * @param functionButtonRight: Function untuk fungsi tombol kanan popup,
 * @param textButtonLeft: string isi tulisan tombol kiri,
 * @param textButtonRight: string isi tulisan tombol kanan,
 * @returns component modal
 */
export const CustomPopup = (props: CustomPopupModal) => {
  useEffect(() => {
    if (props.open) {
      document != null && document.activeElement != null && ((document.activeElement) as HTMLElement).blur();
    }
  }, [props.open])
  return (
    <>
      {props.open && (
        <div
          style={{ zIndex: props.zIndex }}
          className={`h-full w-full z-[${props.zIndex}] outline-none bg-black opacity-25 fixed top-0 left-0`}
        />
      )}
      <Modal
        dismissible={props.dismissible ?? true}
        position="center"
        className={`z-[${props.zIndex + 1}] m-auto font-Asap outline-none`}
        show={props.open}
        style={{ height: "auto", zIndex: props.zIndex }}
        onClose={() => {
          props.onClose();
        }}
      >
        <Modal.Body className={`w-full outline-none overflow-y-scroll max-h-[${props.maxHeight ?? "75dvh"}]`}>
          <div className="mx-3 my-4 flex flex-col gap-4">
            {props.content}
            <div className="inline-flex w-full h-[52px] gap-x-2.5">
              <button
                className="h-full w-full rounded-xl text-neutral-10 bg-main-Main text-medium font-bold"
                onClick={(event) => {
                  event.preventDefault();
                  props.functionButtonLeft(event);
                }}
              >
                {props.textButtonLeft}
              </button>
              <button
                className="h-full w-full rounded-xl text-main-Main bg-white border-main-Main border text-medium font-bold"
                onClick={(event) => {
                  event.preventDefault();
                  props.functionButtonRight(event);
                }}
              >
                {props.textButtonRight}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

interface CustomPopupModal {
  open: boolean,
  zIndex: number,
  content: ReactNode,
  onClose: Function,
  functionButtonLeft: Function,
  functionButtonRight: Function,
  textButtonLeft: string,
  textButtonRight: string,
  dismissible?: boolean
  maxHeight?: string,
}

/**
 * 
 * @param open untuk trigger popupnya dimunculkan atau tidak
 * @description popup untuk loading
 */
export const PopupLoading = (pModal: PopupLoadingModal) => {
  useEffect(() => {
    if (pModal.open) {
      document != null && document.activeElement != null && ((document.activeElement) as HTMLElement).blur();
    }
  }, [pModal.open])

  return <>
    {pModal.open && <div className={`h-full w-full bg-black opacity-25 fixed left-0 top-0`}
      style={{ zIndex: 99 }} />}
    <Modal dismissible={false} position="center" className={` m-auto font-Asap `} show={pModal.open} style={{ height: "auto", zIndex: 99 }} >
      <Modal.Body className="w-full h-auto " >
        <SyncLoader color="#0172CB" className="text-center self-center mt-6 mb-4" />
      </Modal.Body>
    </Modal>
  </>
}
interface PopupLoadingModal {
  open: boolean,
}

/**
 * @description untuk popup dengan 2 tombol bawah kanan dan kiri
 * @param open: boolean untuk munculkan / hide popup,
 * @param zIndex: number untuk z-index popup,
 * @param content: ReactNode untuk isi popup,
 * @param onClose: Function untuk fungsi tutup popup,
 */
export const CustomPopupOpsi = (props: CustomPopupOpsiModal) => {
  useEffect(() => {
    if (props.open) {
      document != null && document.activeElement != null && ((document.activeElement) as HTMLElement).blur();
    }
  }, [props.open])
  return <>
    {props.open && <div className={`h-full w-full z-[${props.zIndex}] bg-black opacity-25 fixed top-0`} style={{ zIndex: props.zIndex }} />}
    <Modal dismissible position="center" className={`  z-[${props.zIndex + 1}] m-auto font-Asap`} show={props.open} style={{ height: "auto", zIndex: props.zIndex + 1 }}
      onClose={() => {
        props.onClose();
      }}
    >
      <Modal.Body className="w-full h-auto" >
        <div className="mx-3 my-4">
          {props.content}

        </div>
      </Modal.Body>
    </Modal>
  </>
}

interface CustomPopupOpsiModal {
  open: boolean,
  zIndex: number,
  content: ReactNode,
  onClose: Function,
}

export const PopupLoginImage = (pModal: { open: boolean }) => {
  useEffect(() => {
    if (pModal.open) {
      document != null && document.activeElement != null && ((document.activeElement) as HTMLElement).blur();
    }
  }, [pModal.open])

  return <>
    {pModal.open && <div className={`h-full w-full bg-white opacity-100 fixed left-0 top-0`}
      style={{ zIndex: 99 }} />}
    {/* <Modal dismissible={false} position="center" className={` m-auto font-Asap `} show={pModal.open} style={{ height: "auto", zIndex: 99 }} > */}
    {/* <Modal.Body className="w-full h-auto " > */}
    {/* <div className="min-[50dwv]:"> */}
    {pModal.open&& <div className="fixed h-screen w-screen content-center" style={{ zIndex: 100 }} >
      <div className="rounded-full size-[70dvw]  bg-neutral-10 mx-auto">
        <img src={galaxysnack} loading="lazy"/>
      </div>
      <p className="text-center text-h3 text-neutral-100 font-bold ">Selamat Datang</p>
    </div>}
    {/* </div> */}
    {/* </Modal.Body> */}
    {/* </Modal> */}
  </>
}
