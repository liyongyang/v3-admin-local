import pointsMock from "@/config/json/map/points.json"
import lake from "@/config/json/map/lake.json"
import riverMock from "@/config/json/map/river.json"
import dongbuPark from "@/config/json/map/dongbuPark.json"

export const mapIcons = {
  // offline
  "1_0": `${import.meta.env.BASE_URL}img/map/sz0.png`,
  "2_0": `${import.meta.env.BASE_URL}img/map/sw0.png`,
  "3_0": `${import.meta.env.BASE_URL}img/map/qxz0.png`,
  "4_0": `${import.meta.env.BASE_URL}img/map/llz0.png`,
  "5_0": `${import.meta.env.BASE_URL}img/map/sp0.png`,
  "6_0": `${import.meta.env.BASE_URL}img/map/yw0.png`,
  // online
  "1_1": `${import.meta.env.BASE_URL}img/map/sz.png`,
  "2_1": `${import.meta.env.BASE_URL}img/map/sw.png`,
  "3_1": `${import.meta.env.BASE_URL}img/map/qxz.png`,
  "4_1": `${import.meta.env.BASE_URL}img/map/llz.png`,
  "5_1": `${import.meta.env.BASE_URL}img/map/sp.png`,
  "6_1": `${import.meta.env.BASE_URL}img/map/yw.png`,
  // error
  "1_2": `${import.meta.env.BASE_URL}img/map/sz_2.png`,
  "2_2": `${import.meta.env.BASE_URL}img/map/sw_2.png`,
  "3_2": `${import.meta.env.BASE_URL}img/map/qxz_2.png`,
  "4_2": `${import.meta.env.BASE_URL}img/map/llz_2.png`,
  "5_2": `${import.meta.env.BASE_URL}img/map/sp_2.png`,
  "6_2": `${import.meta.env.BASE_URL}img/map/yw_2.png`
}

export const mockJson = [pointsMock, lake, riverMock, dongbuPark]
