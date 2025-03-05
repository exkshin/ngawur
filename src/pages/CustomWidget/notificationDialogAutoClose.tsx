import { Modal } from "flowbite-react";
import { useEffect } from "react";
import successImage from "../../assets/images/success.png";
import sorryImage from "../../assets/images/sorry.png";

import { AsyncImage } from 'loadable-image'
export interface notificationDialogAutoCloseModel {
    content: React.ReactNode,
    show: boolean,
    success: boolean,
    duration: number,
    onChange(value: boolean): void,
}

export const WidgetNotificationDialogAutoClose = (pParameter: notificationDialogAutoCloseModel) => {
    useEffect(() => {
        let closeTimer: ReturnType<typeof setTimeout> | null = null;
        if (pParameter.show) {

        document!=null&&document.activeElement!=null&& ((document.activeElement)as HTMLElement).blur();
            closeTimer = setTimeout(() => {
                console.log("Hide Notification");
                pParameter.onChange(false);
            }, pParameter.duration);
        }
        return () => {
            if (closeTimer !== null) {
                clearTimeout(closeTimer);
            }
        };
    }, [pParameter.show]);
    return (
      <>
        {pParameter.show && (
          <div
            className={`h-full w-full z-[10] bg-black opacity-25 fixed top-0`}
            style={{ zIndex: 10 }}
          />
        )}
        <Modal
          dismissible
          position="center"
          className={`z-[11] m-auto font-Asap`}
          show={pParameter.show}
          style={{ height: "auto", zIndex: 10 + 1 }}
        >
          <Modal.Body className="w-full min-h-[256px] flex flex-col justify-between items-center">
            <div className=" mt-[60px] mb-4 font-semibold text-h5">{pParameter.content}</div>
            <img src={pParameter.success? successImage:sorryImage} alt="success" className="px-8" loading="lazy"/>
          </Modal.Body>
        </Modal>
      </>
    );
};