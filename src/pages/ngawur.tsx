import { Button } from "flowbite-react";
import { useEffect, useState } from "react";

const Ngawur = () => {
  const [xList, setxList] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [xBlueGoFirst, setXBlueGoFirst] = useState(false);

  const generateData=()=>{
    let goFirst = Math.round(Math.random()) == 1;
    setXBlueGoFirst(goFirst);
    let red = goFirst ? 8 : 9;
    let blue = goFirst ? 9 : 8;
    let temp = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
    //red
    for (let i = 0; i < red; i++) {
      let check = false;
      while (check == false) {
        let posx = Math.floor(Math.random() * 5);
        let posy = Math.floor(Math.random() * 5);
        if (temp[posy][posx] == 0) {
          temp[posy][posx] = 1
          check = true;
        }
      }
    }
    //blue
    for (let i = 0; i < blue; i++) {
      let check = false;
      while (check == false) {
        let posx = Math.floor(Math.random() * 5);
        let posy = Math.floor(Math.random() * 5);
        if (temp[posy][posx] == 0) {
          temp[posy][posx] = 2
          check = true;
        }
      }
    }
    //black
    let check = false;
    while (check == false) {
      let posx = Math.floor(Math.random() * 5);
      let posy = Math.floor(Math.random() * 5);
      if (temp[posy][posx] == 0) {
        temp[posy][posx] = 3
        check = true;
      }
    }
    setxList(temp)
  }


  return <div className="w-screen h-screen">
    {xList.map((posY, pIndexY) => {
      return <div key={`posy${pIndexY}`} className="flex">
        {posY.map((posx, pIndexX) => {
          let color = "";
          if (posx == 0) {
            color = "bg-neutral-10";
          } else if (posx == 1) {
            color = "bg-danger-Main";
          } else if (posx == 2) {
            color = "bg-info-Main";
          } else if (posx == 3) {
            color = "bg-neutral-100";
          }
          return <div className={`w-1/5 h-20 ${color} border-2 border-neutral-60`} key={`test-${pIndexY}${pIndexX}`}></div>;
        })}
      </div>
    })}
    <div className="text-14px font-bold">{xBlueGoFirst?"Blue Go First":"Red Go First"}</div>
    <div onClick={()=>{generateData()}} className="mt-4 rounded-sm py-2 w-16 bg-main-Main text-main-Surface">Generate</div>
  </div>
}

export default Ngawur;