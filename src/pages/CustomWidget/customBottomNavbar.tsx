import { HomeOSVG } from "../../assets/icon/SVGTSX/HomeOSVG";
import { PersonSVG } from "../../assets/icon/SVGTSX/PersonSVG";
import { QrcodeScanSVG } from "../../assets/icon/SVGTSX/QrcodeScanSVG";
import ListColor from "../../Config/color";

interface CustomBottomNavbarModel {
    leftIcon: React.ReactNode,
    functionLeftIcon(): void,
    rightIcon: React.ReactNode,
    functionRightIcon(): void,
    centerIcon: React.ReactNode,
    functionCenterIcon(): void,
    centerText?: string,
  }

export const CustomBottomNavbar = (pParameter: CustomBottomNavbarModel) => {
  return (
    <div className="fixed -bottom-0.5 w-full bg-transparent flex justify-center z-50 font-Asap">
      <div className="relative w-full z-50 -mr-1">
        <svg
          className="w-full h-[66px] z-50  drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] "
          viewBox="0 0 118 56"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M120 0H8.69995C6.39257 0 4.17966 0.916621 2.5481 2.54819C0.916529 4.17975 0 6.39263 0 8.70001V55.656H120V0Z"
            fill="white"
          />
        </svg>
        <div
          className="absolute bottom-[5px] right-[45%] transform translate-x-1/2  flex justify-center items-center gap-1"
          onClick={pParameter.functionLeftIcon}
        >
          {pParameter.leftIcon}
        </div>
      </div>
      <div className="z-[60]">
        <svg
          className="w-32 h-[66px] drop-shadow-[0_-3px_10px_ 0px_rgba(0,0,0,0.3)] z-10"
          viewBox="0 0 128 66"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 128 0 C 119.816 0.0033 116.108 1.1373 113.059 3.2322 C 110.009 5.3272 107.781 8.2706 106.708 11.6226 C 103.969 20.1027 98.312 27.544 90.582 32.8363 C 82.852 38.1287 73.462 40.9884 63.814 40.9889 C 54.166 40.9886 44.776 38.129 37.045 32.8366 C 29.315 27.5443 23.658 20.1029 20.919 11.6226 C 19.846 8.2707 17.618 5.3273 14.668 3.2324 C 11.518 1.1375 7.811 0.0035 0 0 V 66 H 128 V 0 Z"
            fill="white"
          />
        </svg>
        <div className="relative">
          <div
            className="absolute w-[68px] h-[68px] bottom-[33px] border-4 rounded-full border-main-Surface left-1/2 transform -translate-x-1/2 bg-main-Main hover:bg-main-Main  flex items-center justify-center z-[70]"
            onClick={pParameter.functionCenterIcon}
          >
            {pParameter.centerIcon}
          </div>
          {pParameter.centerText && (
            <div className="absolute z-[70] bottom-[5px] left-1/2 -translate-x-1/2 text-14px">
              {pParameter.centerText}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full z-50 -ml-1">
        <svg
          className="flex-grow w-full h-[66px] z-50 drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
          viewBox="0 0 121 56"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H111.3C113.608 0 115.82 0.916621 117.452 2.54819C119.083 4.17975 120 6.39263 120 8.70001V55.656H0V0Z"
            fill="white"
          />
        </svg>
        <div
          className="absolute bottom-[5px] right-[55%] transform translate-x-1/2  flex justify-center items-center gap-1"
          onClick={pParameter.functionRightIcon}
        >
          {pParameter.rightIcon}
        </div>
      </div>
    </div>
  );
};
