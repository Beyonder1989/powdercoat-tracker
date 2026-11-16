// แผนการผลิตตามตู้สินค้า (นำเข้าจาก Google Sheet วางแผนของ HAMER 4X4)
import { PlanItem, ContainerPlan } from '../types';

export const INITIAL_CONTAINER_PLANS: ContainerPlan[] = [
  {
    "id": "งานผลิตในประเทศ",
    "name": "งานผลิตในประเทศ",
    "date": "",
    "items": [
      {
        "id": "งานผลิตในประเทศ_2_AM106F12",
        "modelPartNo": "AM106-F12",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_3_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_4_AM111PD24",
        "modelPartNo": "AM111-PD24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_5_AM1064WT19",
        "modelPartNo": "AM106-4W-T19",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_6_HC601TT26",
        "modelPartNo": "HC601-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_7_SM105CV26",
        "modelPartNo": "SM105-CV26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_8_HR161F22",
        "modelPartNo": "HR161-F22",
        "planQty": 1,
        "pcStatus": "ตัว1 รอพ่นสี / ขา1 รอส่ง",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_9_HR153",
        "modelPartNo": "HR153",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_10_SB2401F22",
        "modelPartNo": "SB2401-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_11_SB1602F22",
        "modelPartNo": "SB1602-F22",
        "planQty": 4,
        "pcStatus": "4 รอส่ง",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_12_AM112CH24",
        "modelPartNo": "AM112-CH24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_13_H004FR22LR",
        "modelPartNo": "H004-FR22 L+R",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_14_2",
        "modelPartNo": "บอล 2 ชั้น",
        "planQty": 1,
        "pcStatus": "1แก้สี",
        "note": "",
        "isClosed": false
      },
      {
        "id": "งานผลิตในประเทศ_15_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 2,
        "pcStatus": "2 รอขึ้นพ่น",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "RMA_DUBAI",
    "name": "RMA DUBAI",
    "date": "16/9",
    "items": [
      {
        "id": "RMA_DUBAI_2_H001VXRL322AGRAY",
        "modelPartNo": "H001-VXR-L322-A GRAY",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_3_H001MEPD24",
        "modelPartNo": "H001-ME-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_4_H001Y105GRAY",
        "modelPartNo": "H001-Y105-GRAY",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_5_SM109CMPD24",
        "modelPartNo": "SM109-CM-PD24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_6_HA302F523",
        "modelPartNo": "HA302-F523",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_7_SB2000GG",
        "modelPartNo": "SB2000-GG",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_8_H001AB625",
        "modelPartNo": ".H001A-B625",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_9_SM105CMB625",
        "modelPartNo": "SM105-CM-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_10_MX204B625",
        "modelPartNo": "MX204-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_11_H001JB74",
        "modelPartNo": "H001-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_12_AM112JL19",
        "modelPartNo": "AM112-JL19",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_13_MX209JL19",
        "modelPartNo": "MX209-JL19",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_14_H001GFR22",
        "modelPartNo": "H001-G-FR22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_DUBAI_15_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "FODR_DUBAI",
    "name": "FODR DUBAI",
    "date": "10/11",
    "items": [
      {
        "id": "FODR_DUBAI_2_VN1WZ99286D76CSPORTBAR",
        "modelPartNo": "VN1WZ99286D76C (SPORT BAR)",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "RMA__DUBAI",
    "name": "RMA  DUBAI",
    "date": "30/10",
    "items": [
      {
        "id": "RMA__DUBAI_2_HA312EV22",
        "modelPartNo": "HA312-EV22",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "FORD_SAF",
    "name": "FORD SAF",
    "date": "10/11",
    "items": [
      {
        "id": "FORD_SAF_2_VS1WZ99286D76BAFFORDABLE",
        "modelPartNo": "VS1WZ99286D76B  (AFFORDABLE )",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "RMA_TH",
    "name": "RMA TH",
    "date": "28/8",
    "items": [
      {
        "id": "RMA_TH_2_TL005",
        "modelPartNo": "TL005",
        "planQty": 1,
        "pcStatus": "31/8=10",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "ASIA_AUTO_LAB",
    "name": "Asia Auto Lab",
    "date": "15/9",
    "items": [
      {
        "id": "ASIA_AUTO_LAB_2_AM120F22",
        "modelPartNo": "AM120-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ASIA_AUTO_LAB_3_HA444F22C",
        "modelPartNo": "HA444-F22-C",
        "planQty": 5,
        "pcStatus": "",
        "note": "14/11/26",
        "isClosed": false
      },
      {
        "id": "ASIA_AUTO_LAB_4_HC601F22A",
        "modelPartNo": "HC601-F22-A",
        "planQty": 3,
        "pcStatus": "",
        "note": "20/11",
        "isClosed": false
      }
    ]
  },
  {
    "id": "ASIA_AUTO_LAB",
    "name": "Asia Auto Lab",
    "date": "30/11",
    "items": [
      {
        "id": "ASIA_AUTO_LAB_2_AM120PTJV26",
        "modelPartNo": "AM120-PT-JV26",
        "planQty": 50,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ASIA_AUTO_LAB_3_SB2602CC",
        "modelPartNo": "SB2602-CC",
        "planQty": 20,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "FORD_SAF",
    "name": "Ford SAF",
    "date": "29/8",
    "items": [
      {
        "id": "FORD_SAF_2_CrossBars",
        "modelPartNo": "Cross Bars",
        "planQty": 63,
        "pcStatus": "",
        "note": "50=12/11",
        "isClosed": false
      },
      {
        "id": "FORD_SAF_3_Current",
        "modelPartNo": "Current",
        "planQty": 2,
        "pcStatus": "",
        "note": "12/11",
        "isClosed": false
      }
    ]
  },
  {
    "id": "RMA",
    "name": "RMA",
    "date": "15/9",
    "items": [
      {
        "id": "RMA_2_AM106PTFJ26",
        "modelPartNo": "AM106-PT-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_3_AM106FJ26",
        "modelPartNo": "AM106-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_4_H001FJ26",
        "modelPartNo": "H001-FJ26",
        "planQty": 2,
        "pcStatus": "2/10 =A2+B2",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_5_SM105FJ26",
        "modelPartNo": "SM105-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_6_HA302FJ26",
        "modelPartNo": "HA302-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_7_HR161CCFJ26",
        "modelPartNo": "HR161-CC-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_8_HA312EV22",
        "modelPartNo": "HA312-EV22",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_9_HA403DCBB",
        "modelPartNo": "HA403-DC-BB",
        "planQty": 4,
        "pcStatus": "",
        "note": "4",
        "isClosed": false
      },
      {
        "id": "RMA_10_AM111AM23",
        "modelPartNo": "AM111-AM23",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_11_AM111PTAM23",
        "modelPartNo": "AM111-PT-AM23",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_12_MX204AM23",
        "modelPartNo": "MX204-AM23",
        "planQty": 2,
        "pcStatus": "",
        "note": "2",
        "isClosed": false
      },
      {
        "id": "RMA_13_H001AM23",
        "modelPartNo": "H001-AM23",
        "planQty": 1,
        "pcStatus": "",
        "note": "1",
        "isClosed": false
      }
    ]
  },
  {
    "id": "EL_SALVADOR",
    "name": "EL SALVADOR",
    "date": "12/11",
    "items": [
      {
        "id": "EL_SALVADOR_2_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_3_AM106FJL19",
        "modelPartNo": "AM106F-JL19",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_4_AM106CO16",
        "modelPartNo": "AM106-CO16",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_5_AM106N20",
        "modelPartNo": "AM106-N20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_6_AM106D24",
        "modelPartNo": "AM106-D24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_7_AM106NFRC20",
        "modelPartNo": "AM106-NF-RC20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_8_AM106PTN20",
        "modelPartNo": "AM106-PT-N20",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_9_AM106PTRGR24",
        "modelPartNo": "AM106-PT-RGR24",
        "planQty": 2,
        "pcStatus": "30/10=2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_10_AM106PTNFRC20",
        "modelPartNo": "AM106-PT-NF-RC20",
        "planQty": 7,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_11_AM106PTT24",
        "modelPartNo": "AM106-PT-T24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_12_AM106PTTT26",
        "modelPartNo": "AM106-PT-TT26",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_13_AM106PT4WT19",
        "modelPartNo": "AM106-PT.4W-T19",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_14_AM106PTAM10",
        "modelPartNo": "AM106-PT-AM10",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_15_AM106PTBT20",
        "modelPartNo": "AM106-PT-BT20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_16_AM106PTBT25",
        "modelPartNo": "AM106-PT-BT25",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_17_AM106PTJB74",
        "modelPartNo": "AM106-PT-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_18_AM111PTFR22",
        "modelPartNo": "AM111-PT-FR22",
        "planQty": 3,
        "pcStatus": "14/11=2 แก้",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_19_AM111PTPD24",
        "modelPartNo": "AM111-PT-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_20_AM111PT2L723",
        "modelPartNo": "AM111-PT2-L723",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_21_AM112JB74",
        "modelPartNo": "AM112-JB74",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_22_AM112FR22",
        "modelPartNo": "AM112-FR22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_23_MX204RC20",
        "modelPartNo": "MX204-RC20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_24_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_25_MX204T19",
        "modelPartNo": "MX204-T19",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_26_MX204N20",
        "modelPartNo": "MX204-N20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_27_MX204T24",
        "modelPartNo": "MX204-T24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_28_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_29_MX204BT20",
        "modelPartNo": "MX204-BT20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_30_MX208JB74",
        "modelPartNo": "MX208-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_31_MX209L712",
        "modelPartNo": "MX209-L712",
        "planQty": 2,
        "pcStatus": "14/11=2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_32_RL505RE15",
        "modelPartNo": "RL505-RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_33_HR161BBRE15",
        "modelPartNo": "HR161-BB-RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_34_HR161BBN20",
        "modelPartNo": "HR161-BB-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_35_HP903LTT26",
        "modelPartNo": "HP903-L-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_36_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "EL_SALVADOR_37_HC601TT26",
        "modelPartNo": "HC601-TT26",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "DEAN_SURINAME",
    "name": "DEAN-SURINAME",
    "date": "17/11",
    "items": [
      {
        "id": "DEAN_SURINAME_2_AM111PTNFRC20",
        "modelPartNo": "AM111-PT.NF-RC20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_3_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 4,
        "pcStatus": "30/10=5",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_4_MX204D20",
        "modelPartNo": "MX204-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_5_SB2400AA",
        "modelPartNo": "SB2400-AA",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_6_RL503RE15",
        "modelPartNo": "RL503-RE15",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_7_RL505RC18",
        "modelPartNo": "RL505-RC18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_8_RL505D12",
        "modelPartNo": "RL505-D12",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_9_RL505N20",
        "modelPartNo": "RL505-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_10_SM105CMB625",
        "modelPartNo": "SM105-CM-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_11_HP903LN20",
        "modelPartNo": "HP903-L-N20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_12_H001AD20",
        "modelPartNo": "H001A-D20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_13_H001RD24BK",
        "modelPartNo": "H001-RD24-BK",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DEAN_SURINAME_14_HA356DD",
        "modelPartNo": "HA356-DD",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "RMA",
    "name": "RMA",
    "date": "7/11",
    "items": [
      {
        "id": "RMA_2_MX207EV22",
        "modelPartNo": "MX207-EV22",
        "planQty": 1,
        "pcStatus": "16/11=4",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_3_MX204F22",
        "modelPartNo": "MX204-F22",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_4_AM106FF22",
        "modelPartNo": "AM106-F-F22",
        "planQty": 2,
        "pcStatus": "13/11=2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_5_H001GFR22A",
        "modelPartNo": "H001-G-FR22-A",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_6_AM120F22",
        "modelPartNo": "AM120-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "RMA_7_SB2602",
        "modelPartNo": "SB2602",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "DESERT",
    "name": "DESERT",
    "date": "",
    "items": [
      {
        "id": "DESERT_2_AM106TF15",
        "modelPartNo": "AM106-TF15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_3_AM111SZ22",
        "modelPartNo": "AM111-SZ22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_4_MX207TF12",
        "modelPartNo": "MX207-TF12",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_5_H001SZ22",
        "modelPartNo": "H001-SZ22",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_6_SM105TF15",
        "modelPartNo": "SM105-TF15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_7_HP903LSR24",
        "modelPartNo": "HP903-L.SR24",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_8_RL50058F518",
        "modelPartNo": "RL500-58-F518",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_9_H001GRL322GY",
        "modelPartNo": "H001-GR-L322-GY",
        "planQty": 6,
        "pcStatus": "6",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_10_HR161CCJB23",
        "modelPartNo": "HR161-CC-JB23",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "DESERT_11_SM105CMJB23",
        "modelPartNo": "SM105-CM-JB23",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "KENYA",
    "name": "KENYA",
    "date": "17/11",
    "items": [
      {
        "id": "KENYA_2_AM102RE15",
        "modelPartNo": "AM102-RE15",
        "planQty": 2,
        "pcStatus": "2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_3_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_4_AM106D20",
        "modelPartNo": "AM106-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_5_AM106D24",
        "modelPartNo": "AM106-D24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_6_AM106L210",
        "modelPartNo": "AM106-L210",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_7_AM106L216",
        "modelPartNo": "AM106-L216",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_8_AM106L723",
        "modelPartNo": "AM106-L723",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_9_AM106PD10",
        "modelPartNo": "AM106-PD10",
        "planQty": 1,
        "pcStatus": "13/11=1",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_10_AM106PD14",
        "modelPartNo": "AM106-PD14",
        "planQty": 1,
        "pcStatus": "",
        "note": "REV.6",
        "isClosed": false
      },
      {
        "id": "KENYA_11_AM106PD18",
        "modelPartNo": "AM106-PD18",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_12_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_13_AM106NFRC20",
        "modelPartNo": "AM106-NF-RC20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_14_AM106JB74",
        "modelPartNo": "AM106-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_15_AM106RGR24",
        "modelPartNo": "AM106-RGR24",
        "planQty": 2,
        "pcStatus": "เช็ค",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_16_AM106PTRGR24",
        "modelPartNo": "AM106-PT-RGR24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_17_AM106PTPD18",
        "modelPartNo": "AM106-PT-PD18",
        "planQty": 10,
        "pcStatus": "12/11=1+16/11=2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_18_AM106PTL210",
        "modelPartNo": "AM106-PT-L210",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_19_AM106PTNFRC20",
        "modelPartNo": "AM106-PT-NF-RC20",
        "planQty": 2,
        "pcStatus": "9/11=3",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_20_AM106PTFRC20",
        "modelPartNo": "AM106-PT-F-RC20",
        "planQty": 3,
        "pcStatus": "12/11=1+1",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_21_AM106PTJB74",
        "modelPartNo": "AM106-PT-JB74",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_22_AM106PTTT26",
        "modelPartNo": "AM106-PT-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_23_AM106PTTF20",
        "modelPartNo": "AM106-PT-TF20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_24_AM106PTD20",
        "modelPartNo": "AM106-PT-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_25_AM111FR22",
        "modelPartNo": "AM111-FR22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_26_AM111L210",
        "modelPartNo": "AM111-L210",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_27_MX204D24",
        "modelPartNo": "MX204-D24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_28_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_29_MX204RC20",
        "modelPartNo": "MX204-RC20",
        "planQty": 4,
        "pcStatus": "12/11=6",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_30_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_31_MX208JB74TH",
        "modelPartNo": "MX208-JB74-TH",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_32_SM101L322",
        "modelPartNo": "SM101-L322",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_33_SM105L210",
        "modelPartNo": "SM105-L210",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_34_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_35_SM105PD18",
        "modelPartNo": "SM105-PD18",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_36_HR157L210",
        "modelPartNo": "HR157-L210",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_37_HR161BBRC20",
        "modelPartNo": "HR161-BB-RC20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_38_HR161CCPD10",
        "modelPartNo": "HR161-CC-PD10",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_39_SB2000BB",
        "modelPartNo": "SB2000-BB",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_40_SB2400AA",
        "modelPartNo": "SB2400-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_41_SB2401AA",
        "modelPartNo": "SB2401-AA",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_42_RL503RE15",
        "modelPartNo": "RL503-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_43_HC601RC20A",
        "modelPartNo": "HC601-RC20-A",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_44_HC601F22A",
        "modelPartNo": "HC601-F22-A",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_45_H001GRL322RD",
        "modelPartNo": "H001-GR-L322-RD",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_46_H001RGR24",
        "modelPartNo": "H001-RGR24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_47_H001RE15",
        "modelPartNo": "H001-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_48_H001L712",
        "modelPartNo": "H001-L712",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_49_H001L723",
        "modelPartNo": "H001-L723",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_50_H001L210",
        "modelPartNo": "H001-L210",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_51_H001AFR22",
        "modelPartNo": "H001A-FR22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_52_H001APD10",
        "modelPartNo": "H001A-PD10",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_53_H001AL210",
        "modelPartNo": "H001A-L210",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_54_HA302RE15",
        "modelPartNo": "HA302-RE15",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_55_HA302L322",
        "modelPartNo": "HA302-L322",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_56_HA302F22",
        "modelPartNo": "HA302-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_57_HA311",
        "modelPartNo": "HA311",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_58_HA325L322",
        "modelPartNo": "HA325-L322",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_59_HA32913",
        "modelPartNo": "HA329-13",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_60_HA3867",
        "modelPartNo": "HA386-7",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_61_HA3869",
        "modelPartNo": "HA386-9",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_62_HA402",
        "modelPartNo": "HA402",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_63_HA403DCAA",
        "modelPartNo": "HA403-DC-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_64_HL0239",
        "modelPartNo": "HL023-9",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_65_HL03820",
        "modelPartNo": "HL038-20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_66_HL03830",
        "modelPartNo": "HL038-30",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_67_HL0404",
        "modelPartNo": "HL040-4",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_68_PKPA13",
        "modelPartNo": "PKPA13",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_69_HM417BK",
        "modelPartNo": "HM417-BK",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_70_HM436BK",
        "modelPartNo": "HM436-BK",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "KENYA_71_HM436WT",
        "modelPartNo": "HM436-WT",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "COSTA_RICA",
    "name": "COSTA RICA",
    "date": "27/11",
    "items": [
      {
        "id": "COSTA_RICA_2_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_3_AM106PTB625",
        "modelPartNo": "AM106-PT-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_4_MX204B625",
        "modelPartNo": "MX204-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_5_AM106BT20",
        "modelPartNo": "AM106-BT20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_6_AM106PTBT20",
        "modelPartNo": "AM106-PT-BT20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_7_MX204BT20",
        "modelPartNo": "MX204-BT20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_8_AM106PA06",
        "modelPartNo": "AM106-PA06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_9_AM106PA16",
        "modelPartNo": "AM106-PA16",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_10_AM106PA20",
        "modelPartNo": "AM106-PA20",
        "planQty": 2,
        "pcStatus": "12/11=2",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_11_AM106PTPA06",
        "modelPartNo": "AM106-PT-PA06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_12_AM106T08",
        "modelPartNo": "AM106-T08",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_13_AM106PT4WT19",
        "modelPartNo": "AM106-PT.4W-T19",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_14_AM106PTT24",
        "modelPartNo": "AM106-PT-T24",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_15_H001AT194WD",
        "modelPartNo": "H001A-T19-4WD",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_16_AM106VG12",
        "modelPartNo": "AM106-VG12",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_17_AM106TT26",
        "modelPartNo": "AM106-TT26",
        "planQty": 5,
        "pcStatus": "13/11=6",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_18_AM106PTTT26",
        "modelPartNo": "AM106-PT-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_19_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_20_H0014WTT26",
        "modelPartNo": "H001-4W-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_21_AM106PTRGR24",
        "modelPartNo": "AM106-PT-RGR24",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_22_SB1902PAA",
        "modelPartNo": "SB1902-P-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_23_SB2000BB",
        "modelPartNo": "SB2000-BB",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_24_SB2400AA",
        "modelPartNo": "SB2400-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_25_AM106TF15",
        "modelPartNo": "AM106-TF15",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_26_AM106PTTF20",
        "modelPartNo": "AM106-PT-TF20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_27_AM106L102",
        "modelPartNo": "AM106-L102",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_28_AM106L216",
        "modelPartNo": "AM106-L216",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_29_AM106PTL210",
        "modelPartNo": "AM106-PT-L210",
        "planQty": 1,
        "pcStatus": "13/11=1",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_30_MX209L712",
        "modelPartNo": "MX209-L712",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_31_MX209L723",
        "modelPartNo": "MX209-L723",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_32_HR161AAL712",
        "modelPartNo": "HR161-AA-L712",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_33_HR161BBL712",
        "modelPartNo": "HR161-BB-L712",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_34_AM106PTFJ06",
        "modelPartNo": "AM106-PT-FJ06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_35_MX209FJ06",
        "modelPartNo": "MX209-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_36_H001AFJ06",
        "modelPartNo": "H001A-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_37_HA342FJ06",
        "modelPartNo": "HA342-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_38_AM106PD03",
        "modelPartNo": "AM106-PD03",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_39_AM106PTPD03",
        "modelPartNo": "AM106-PT-PD03",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_40_AM106PD14",
        "modelPartNo": "AM106-PD14",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_41_AM106PTPD14",
        "modelPartNo": "AM106-PT-PD14",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_42_AM111PD24",
        "modelPartNo": "AM111-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_43_AM111PTPD24",
        "modelPartNo": "AM111-PT-PD24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_44_HR161EEPD24",
        "modelPartNo": "HR161-EE-PD24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_45_AM106F15",
        "modelPartNo": "AM106-F15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_46_AM106FR18",
        "modelPartNo": "AM106-FR18",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_47_AM106PTNFF22",
        "modelPartNo": "AM106-PT-NF-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_48_AM111BC22",
        "modelPartNo": "AM111-BC22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_49_AM111FR22",
        "modelPartNo": "AM111-FR22",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_50_AM112FR22",
        "modelPartNo": "AM112-FR22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_51_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_52_AM111PTFF22",
        "modelPartNo": "AM111-PT-F-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_53_MX202F12",
        "modelPartNo": "MX202-F12",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_54_MX204F12",
        "modelPartNo": "MX204-F12",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_55_MX204F22",
        "modelPartNo": "MX204-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_56_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_57_HR161CCEV22",
        "modelPartNo": "HR161-CC-EV22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_58_SB2600AA",
        "modelPartNo": "SB2600-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_59_AM106N20",
        "modelPartNo": "AM106-N20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_60_AM106PTN20",
        "modelPartNo": "AM106-PT-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_61_AM107N20",
        "modelPartNo": "AM107-N20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_62_AM111N20",
        "modelPartNo": "AM111-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_63_SM105N15",
        "modelPartNo": "SM105-N15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_64_AM111MU25",
        "modelPartNo": "AM111-MU25",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_65_HR161CCMU25",
        "modelPartNo": "HR161-CC-MU25",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_66_AM111SL22",
        "modelPartNo": "AM111-SL22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_67_AM111SZ22",
        "modelPartNo": "AM111-SZ22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_68_AM106FJL19",
        "modelPartNo": "AM106-F-JL19",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_69_AM111T323",
        "modelPartNo": "AM111-T323",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_70_AM111PTT323",
        "modelPartNo": "AM111-PT-T323",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_71_MX209T323",
        "modelPartNo": "MX209-T323",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_72_HL0237",
        "modelPartNo": "HL023-7",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_73_HL0239",
        "modelPartNo": "HL023-9",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_74_HL0404",
        "modelPartNo": "HL040-4",
        "planQty": 35,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_75_HA40712",
        "modelPartNo": "HA407-12",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_76_HA425BK",
        "modelPartNo": "HA425-BK",
        "planQty": 25,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_77_HA425RD",
        "modelPartNo": "HA425-RD",
        "planQty": 25,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_78_S112",
        "modelPartNo": "S112",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "COSTA_RICA_79_S113",
        "modelPartNo": "S113",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "AHRM___PHILIPPINES",
    "name": "AHRM - PHILIPPINES",
    "date": "18/11",
    "items": [
      {
        "id": "AHRM___PHILIPPINES_2_AM102N15",
        "modelPartNo": "AM102-N15",
        "planQty": 10,
        "pcStatus": "ตัว10",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_3_AM103TT26",
        "modelPartNo": "AM103-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_4_AM103F22",
        "modelPartNo": "AM103-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_5_AM106RE15",
        "modelPartNo": "AM106-RE15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_6_AM106F15",
        "modelPartNo": "AM106-F15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_7_AM106FJ26",
        "modelPartNo": "AM106-FJ26",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_8_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_9_AM106RGR24",
        "modelPartNo": "AM106-RGR24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_10_AM106TF20",
        "modelPartNo": "AM106-TF20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_11_AM106PTFJ26",
        "modelPartNo": "AM106-PT-FJ26",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_12_AM106PTRGR24",
        "modelPartNo": "AM106-PT-RGR24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_13_AM111PTFR22",
        "modelPartNo": "AM111-PT-FR22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_14_AM111PTTT26",
        "modelPartNo": "AM111-PT-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_15_MX204N15",
        "modelPartNo": "MX204-N15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_16_MX204N20",
        "modelPartNo": "MX204-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_17_MX204F12",
        "modelPartNo": "MX204-F12",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_18_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_19_SB1602AA",
        "modelPartNo": "SB1602-AA",
        "planQty": 15,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_20_SB1701AA",
        "modelPartNo": "SB1701-AA",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_21_SB1801AA",
        "modelPartNo": "SB1801-AA",
        "planQty": 14,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_22_SB2000AA",
        "modelPartNo": "SB2000-AA",
        "planQty": 31,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_23_SB2602BB",
        "modelPartNo": "SB2602-BB",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_24_HP904N15",
        "modelPartNo": "HP904-N15",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_25_HP904FR22",
        "modelPartNo": "HP904-FR22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_26_HP904B625",
        "modelPartNo": "HP904-B625",
        "planQty": 13,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_27_HP904D20",
        "modelPartNo": "HP904-D20",
        "planQty": 9,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_28_HP904F22",
        "modelPartNo": "HP904-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_29_HR161BBT19",
        "modelPartNo": "HR161-BB-T19",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_30_HR161BBF22",
        "modelPartNo": "HR161-BB-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_31_HR161GGRE15",
        "modelPartNo": "HR161-GG-RE15",
        "planQty": 22,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_32_HR161CCFJ26",
        "modelPartNo": "HR161-CC-FJ26",
        "planQty": 9,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_33_HR161CCTF15",
        "modelPartNo": "HR161-CC-TF15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_34_HR161CCPA16",
        "modelPartNo": "HR161-CC-PA16",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_35_SM101CH24",
        "modelPartNo": "SM101-CH24",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_36_SM105FJ26",
        "modelPartNo": "SM105-FJ26",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_37_HA312N15",
        "modelPartNo": "HA312-N15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_38_HA403DCAA",
        "modelPartNo": "HA403-DC-AA",
        "planQty": 98,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_39_HA403DCBB",
        "modelPartNo": "HA403-DC-BB",
        "planQty": 100,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_40_H001DFR22",
        "modelPartNo": "H001-D-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_41_H0014WTT26",
        "modelPartNo": "H001-4W-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_42_HL0237",
        "modelPartNo": "HL023-7",
        "planQty": 30,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_43_HL0404",
        "modelPartNo": "HL040-4",
        "planQty": 50,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "AHRM___PHILIPPINES_44_103TT26",
        "modelPartNo": "ขา103-TT26",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "MALAYSIA",
    "name": "MALAYSIA",
    "date": "20/11",
    "items": [
      {
        "id": "MALAYSIA_2_AM106CV26",
        "modelPartNo": "AM106-CV26",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_3_AM106LETF20",
        "modelPartNo": "AM106-LE-TF20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_4_AM106N15",
        "modelPartNo": "AM106-N15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_5_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_6_AM106PTFRC20",
        "modelPartNo": "AM106-PT-F-RC20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_7_AM106PT4WT19",
        "modelPartNo": "AM106-PT.4W-T19",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_8_MX204D20",
        "modelPartNo": "MX204-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_9_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_10_MX204F12",
        "modelPartNo": "MX204-F12",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_11_MX204RC20",
        "modelPartNo": "MX204-RC20",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_12_MX204PTF22",
        "modelPartNo": "MX204-PT-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_13_MX209CV26",
        "modelPartNo": "MX209-CV26",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_14_SB1801AA",
        "modelPartNo": "SB1801-AA",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_15_SB2000BB",
        "modelPartNo": "SB2000-BB",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_16_SB2000EE",
        "modelPartNo": "SB2000-EE",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_17_SB2100AA",
        "modelPartNo": "SB2100-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_18_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_19_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_20_SM105CV26",
        "modelPartNo": "SM105-CV26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_21_SM110CV26",
        "modelPartNo": "SM110-CV26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_22_HA389",
        "modelPartNo": "HA389",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_23_HR161BBF22",
        "modelPartNo": "HR161-BB-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_24_H001CV26",
        "modelPartNo": "H001-CV26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_25_HA4681",
        "modelPartNo": "HA468-1",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_26_HA313RD",
        "modelPartNo": "HA313-RD",
        "planQty": 20,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "MALAYSIA_27_HL014",
        "modelPartNo": "HL014",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "SOUTH_AFICA",
    "name": "SOUTH AFICA",
    "date": "27/11",
    "items": [
      {
        "id": "SOUTH_AFICA_2_AM106F15",
        "modelPartNo": "AM106-F15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_3_AM106NFF22",
        "modelPartNo": "AM106-NF-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_4_AM106TT26",
        "modelPartNo": "AM106-TT26",
        "planQty": 15,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_5_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_6_AM106L210",
        "modelPartNo": "AM106-L210",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_7_AM106FJ06",
        "modelPartNo": "AM106-FJ06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_8_AM106FJ26",
        "modelPartNo": "AM106-FJ26",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_9_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_10_AM106D12",
        "modelPartNo": "AM106-D12",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_11_AM106D17",
        "modelPartNo": "AM106-D17",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_12_AM106D24",
        "modelPartNo": "AM106-D24",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_13_AM106N20",
        "modelPartNo": "AM106-N20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_14_AM106L1L322",
        "modelPartNo": "AM106-L1-L322",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_15_AM106L2L322",
        "modelPartNo": "AM106-L2-L322",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_16_AM106BT20",
        "modelPartNo": "AM106-BT20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_17_AM106TF15",
        "modelPartNo": "AM106-TF15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_18_AM106PTF15",
        "modelPartNo": "AM106-PT-F15",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_19_AM106PTTT26",
        "modelPartNo": "AM106-PT-TT26",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_20_AM106PTFRC20",
        "modelPartNo": "AM106-PT-F-RC20",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_21_AM106PTNFF22",
        "modelPartNo": "AM106-PT-NF-F22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_22_AM106PTPD14",
        "modelPartNo": "AM106-PT-PD14",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_23_AM106PTPD18",
        "modelPartNo": "AM106-PT-PD18",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_24_AM106PTFJ06",
        "modelPartNo": "AM106-PT-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_25_AM106PTFJ26",
        "modelPartNo": "AM106-PT-FJ26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_26_AM106PTL210",
        "modelPartNo": "AM106-PT-L210",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_27_AM106PTL216",
        "modelPartNo": "AM106-PT-L216",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_28_AM106PTB625",
        "modelPartNo": "AM106-PT-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_29_AM107PTD20",
        "modelPartNo": "AM107-PT-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_30_AM111NFF22",
        "modelPartNo": "AM111-NF-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_31_AM111FR22",
        "modelPartNo": "AM111-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_32_AM111PD24",
        "modelPartNo": "AM111-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_33_AM111T323",
        "modelPartNo": "AM111-T323",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_34_AM111AM23",
        "modelPartNo": "AM111-AM23",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_35_AM111TT26",
        "modelPartNo": "AM111-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_36_AM111PTNFF22",
        "modelPartNo": "AM111-PT-NF-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_37_AM111PTFR22",
        "modelPartNo": "AM111-PT-FR22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_38_AM111PTD24",
        "modelPartNo": "AM111-PT-D24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_39_AM111PTPD24",
        "modelPartNo": "AM111-PT-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_40_AM111PTL723",
        "modelPartNo": "AM111-PT-L723",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_41_AM111PTT323",
        "modelPartNo": "AM111-PT-T323",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_42_AM114PTL723",
        "modelPartNo": "AM114-PT-L723",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_43_MX204F12",
        "modelPartNo": "MX204-F12",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_44_MX204F22",
        "modelPartNo": "MX204-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_45_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_46_MX204RE15",
        "modelPartNo": "MX204-RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_47_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_48_MX204AM23",
        "modelPartNo": "MX204-AM23",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_49_MX204BT20",
        "modelPartNo": "MX204-BT20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_50_MX204BP26",
        "modelPartNo": "MX204-BP26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_51_MX204N20",
        "modelPartNo": "MX204-N20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_52_MX209L712",
        "modelPartNo": "MX209-L712",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_53_MX209FJ06",
        "modelPartNo": "MX209-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_54_SB1902AA",
        "modelPartNo": "SB1902-AA",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_55_SB1902FF",
        "modelPartNo": "SB1902-FF",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_56_SB1902PAA",
        "modelPartNo": "SB1902-P-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_57_SB2000EE",
        "modelPartNo": "SB2000-EE",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_58_SB2100AA",
        "modelPartNo": "SB2100-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_59_RL503RE15",
        "modelPartNo": "RL503-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_60_RL503B625",
        "modelPartNo": "RL503-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_61_HR161CCT323",
        "modelPartNo": "HR161-CC-T323",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_62_HR161BBB625",
        "modelPartNo": "HR161-BB-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_63_HR161GGRE15",
        "modelPartNo": "HR161-GG-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_64_HC601TT26",
        "modelPartNo": "HC601-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_65_HA444TT26C",
        "modelPartNo": "HA444-TT26-C",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_66_SM105F12",
        "modelPartNo": "SM105-F12",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_67_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_68_SM105D20",
        "modelPartNo": "SM105-D20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_69_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_70_SM105CMB625",
        "modelPartNo": "SM105-CM-B625",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_71_H001AF22",
        "modelPartNo": "H001A-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_72_H001A4WTT26",
        "modelPartNo": "H001A-4W-TT26",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_73_H001AKDPD10",
        "modelPartNo": "H001A-KD-PD10",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_74_H001APD10",
        "modelPartNo": "H001A-PD10",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_75_H001APD24",
        "modelPartNo": "H001A-PD24",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_76_H001AL210",
        "modelPartNo": "H001A-L210",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_77_H001AFJ06",
        "modelPartNo": "H001A-FJ06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_78_H001AVXRL322ARD",
        "modelPartNo": "H001A-VXR-L322-A-R D",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_79_H001AGRL322ARD",
        "modelPartNo": "H001A-GR-L322-A-R D",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_80_H001AFR22",
        "modelPartNo": "H001A-FR22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_81_H001BF22",
        "modelPartNo": "H001B-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_82_H001CF22",
        "modelPartNo": "H001C-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_83_H001CV6F22",
        "modelPartNo": "H001C-V6-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_84_H001VXRL322RD",
        "modelPartNo": "H001-VXR-L322-RD",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_85_H001GRL322RD",
        "modelPartNo": "H001-GR-L322-RD",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_86_H0014WTT26",
        "modelPartNo": "H001-4W-TT26",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_87_H001FJ06",
        "modelPartNo": "H001-FJ06",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_88_HL0404",
        "modelPartNo": "HL040-4",
        "planQty": 20,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_89_HP904B625",
        "modelPartNo": "HP904-B625",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_90_HA302RE15",
        "modelPartNo": "HA302-RE15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_91_TL058",
        "modelPartNo": "TL058",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_92_TL012",
        "modelPartNo": "TL012",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_93_TL029",
        "modelPartNo": "TL029",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_94_TL03530",
        "modelPartNo": "TL035-30",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_95_HN8065S",
        "modelPartNo": "HN80-65S",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_96_HN8065R",
        "modelPartNo": "HN80-65R",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_97_HN80NL",
        "modelPartNo": "HN80-NL",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_98_HN8065CH",
        "modelPartNo": "HN80-65CH",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "SOUTH_AFICA",
    "name": "SOUTH AFICA",
    "date": "เดือน 12",
    "items": [
      {
        "id": "SOUTH_AFICA_2_AM106NFF22",
        "modelPartNo": "AM106-NF-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_3_AM106FR18",
        "modelPartNo": "AM106-FR18",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_4_AM106FRC20",
        "modelPartNo": "AM106-F-RC20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_5_AM106TT26",
        "modelPartNo": "AM106-TT26",
        "planQty": 15,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_6_AM106L210",
        "modelPartNo": "AM106-L210",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_7_AM106PD14",
        "modelPartNo": "AM106-PD14",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_8_AM106PD18",
        "modelPartNo": "AM106-PD18",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_9_AM106L1L322",
        "modelPartNo": "AM106-L1-L322",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_10_AM106L2L322",
        "modelPartNo": "AM106-L2-L322",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_11_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_12_AM106FJ26",
        "modelPartNo": "AM106-FJ26",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_13_AM106D24",
        "modelPartNo": "AM106-D24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_14_AM106PTNFF22",
        "modelPartNo": "AM106-PT-NF-F22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_15_AM106PTTT26",
        "modelPartNo": "AM106-PT-TT26",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_16_AM106PTLETF20",
        "modelPartNo": "AM106-PT.LE-TF20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_17_AM106PTFJ06",
        "modelPartNo": "AM106-PT-FJ06",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_18_AM111NFF22",
        "modelPartNo": "AM111-NF-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_19_AM111PD24",
        "modelPartNo": "AM111-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_20_AM111FR22",
        "modelPartNo": "AM111-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_21_AM111AM23",
        "modelPartNo": "AM111-AM23",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_22_AM111T323",
        "modelPartNo": "AM111-T323",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_23_AM111TT26",
        "modelPartNo": "AM111-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_24_AM111PTT323",
        "modelPartNo": "AM111-PT-T323",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_25_AM111PTTT26",
        "modelPartNo": "AM111-PT-TT26",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_26_AM111PTNFF22",
        "modelPartNo": "AM111-PT-NF-F22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_27_AM111PTPD24",
        "modelPartNo": "AM111-PT-PD24",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_28_MX204F22",
        "modelPartNo": "MX204-F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_29_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_30_MX204AM23",
        "modelPartNo": "MX204-AM23",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_31_MX204D24",
        "modelPartNo": "MX204-D24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_32_SB1902AA",
        "modelPartNo": "SB1902-AA",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_33_SB1902FF",
        "modelPartNo": "SB1902-FF",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_34_SB1902PAA",
        "modelPartNo": "SB1902-P-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_35_SB2000EE",
        "modelPartNo": "SB2000-EE",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_36_SB2000GG",
        "modelPartNo": "SB2000-GG",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_37_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_38_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_39_SM105L210",
        "modelPartNo": "SM105-L210",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_40_RL503RE15",
        "modelPartNo": "RL503-RE15",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_41_HR161BBF22",
        "modelPartNo": "HR161-BB-F22",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_42_HR161BBRC20",
        "modelPartNo": "HR161-BB-RC20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_43_H001RGR24",
        "modelPartNo": "H001-RGR24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_44_H0014WTT26",
        "modelPartNo": "H001-4W-TT26",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_45_H001PD24",
        "modelPartNo": "H001-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_46_H001AFR22",
        "modelPartNo": "H001A-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_47_H001AF22",
        "modelPartNo": "H001A-F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_48_H001A4WTT26",
        "modelPartNo": "H001A-4W-TT26",
        "planQty": 15,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_49_H001AKDPD10",
        "modelPartNo": "H001A-KD-PD10",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_50_H001APD10",
        "modelPartNo": "H001A-PD10",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_51_H001APD24",
        "modelPartNo": "H001A-PD24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_52_H001AL210",
        "modelPartNo": "H001A-L210",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_53_H001ARGR24",
        "modelPartNo": "H001A-RGR24",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_54_HL03820",
        "modelPartNo": "HL038-20",
        "planQty": 30,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_55_HL03830",
        "modelPartNo": "HL038-30",
        "planQty": 20,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_56_HL0404",
        "modelPartNo": "HL040-4",
        "planQty": 20,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_57_H003RHSFR22",
        "modelPartNo": "H003-RHS-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "SOUTH_AFICA_58_H003LHSFR22",
        "modelPartNo": "H003-LHS-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "PO_LAND",
    "name": "PO LAND",
    "date": "",
    "items": [
      {
        "id": "PO_LAND_2_AM106AM10",
        "modelPartNo": "AM106-AM10",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_3_AM106D20",
        "modelPartNo": "AM106-D20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_4_AM106DS11",
        "modelPartNo": "AM106-DS11",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_5_AM106F15",
        "modelPartNo": "AM106-F15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_6_AM106F518",
        "modelPartNo": "AM106-F518",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_7_AM106FR18",
        "modelPartNo": "AM106-FR18",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_8_AM111FF22",
        "modelPartNo": "AM111-F-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_9_AM111AM23",
        "modelPartNo": "AM111-AM23",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_10_AM111FR22",
        "modelPartNo": "AM111-FR22",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_11_AM111TT26",
        "modelPartNo": "AM111-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_12_MX204AM23",
        "modelPartNo": "MX204-AM23",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_13_MX204FR18",
        "modelPartNo": "MX204-FR18",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_14_MX204FR22",
        "modelPartNo": "MX204-FR22",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_15_MX204RC20",
        "modelPartNo": "MX204-RC20",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_16_MX204TT26",
        "modelPartNo": "MX204-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_17_MX209F150",
        "modelPartNo": "MX209-F150",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_18_H001AM23",
        "modelPartNo": "H001-AM23",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_19_H001DFR22",
        "modelPartNo": "H001-D-FR22",
        "planQty": 6,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_20_H001D20",
        "modelPartNo": "H001-D20",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_21_H001F22",
        "modelPartNo": "H001-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_22_H001GFR22",
        "modelPartNo": "H001-G-FR22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_23_H001JB74",
        "modelPartNo": "H001-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_24_H001N15",
        "modelPartNo": "H001-N15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_25_H001PD24",
        "modelPartNo": "H001-PD24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_26_H0014WTT26",
        "modelPartNo": "H001-4W-TT26",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_27_H001V6F22",
        "modelPartNo": "H001-V6-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_28_H003LHSFR22",
        "modelPartNo": "H003-LHS-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_29_H003RHSFR22",
        "modelPartNo": "H003-RHS-FR22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_30_HA324",
        "modelPartNo": "HA324",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_31_HA356BB",
        "modelPartNo": "HA356-BB",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_32_HA356CC",
        "modelPartNo": "HA356-CC",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_33_HR153JB74",
        "modelPartNo": "HR153-JB74",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_34_HR159FS",
        "modelPartNo": "HR159-FS",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_35_HR165AA",
        "modelPartNo": "HR165-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_36_RL50058NRBDT20",
        "modelPartNo": "RL500-58.NRB-DT2 0",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_37_RL503F22",
        "modelPartNo": "RL503-F22",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_38_RL503RE15",
        "modelPartNo": "RL503-RE15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_39_RL503B625",
        "modelPartNo": "RL503-B625",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_40_SB1602AA",
        "modelPartNo": "SB1602-AA",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_41_SB1602BB",
        "modelPartNo": "SB1602-BB",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_42_SB1701AA",
        "modelPartNo": "SB1701-AA",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_43_SB1801BB",
        "modelPartNo": "SB1801-BB",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_44_SB1801GG",
        "modelPartNo": "SB1801-GG",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_45_SB1902AA",
        "modelPartNo": "SB1902-AA",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_46_SB1902PAA",
        "modelPartNo": "SB1902-P-AA",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_47_SB1902EE",
        "modelPartNo": "SB1902-EE",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_48_SB2000AA",
        "modelPartNo": "SB2000-AA",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_49_SB2000GG",
        "modelPartNo": "SB2000-GG",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_50_SB2100AA",
        "modelPartNo": "SB2100-AA",
        "planQty": 8,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_51_SB2400AA",
        "modelPartNo": "SB2400-AA",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_52_SB2600AA",
        "modelPartNo": "SB2600-AA",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_53_SM104NCBJB74",
        "modelPartNo": "SM104-NCB-JB74",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_54_SM105CMFR22",
        "modelPartNo": "SM105-CM-FR22",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_55_SM105F22",
        "modelPartNo": "SM105-F22",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_56_HR161BBTT26",
        "modelPartNo": "HR161-BB-TT26",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "PO_LAND_57_HR161BBF22",
        "modelPartNo": "HR161-BB-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "ANDREY_BAILEY_BERMUDA",
    "name": "ANDREY BAILEY-BERMUDA",
    "date": "รอตาราง",
    "items": [
      {
        "id": "ANDREY_BAILEY_BERMUDA_2_HR153JB74",
        "modelPartNo": "HR153-JB74",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ANDREY_BAILEY_BERMUDA_3_HA324",
        "modelPartNo": "HA324 บันไดลิง",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ANDREY_BAILEY_BERMUDA_4_HL010",
        "modelPartNo": "HL010",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ANDREY_BAILEY_BERMUDA_5_HA30910",
        "modelPartNo": "HA309-10",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ANDREY_BAILEY_BERMUDA_6_HA409FSJB23",
        "modelPartNo": "HA409-FS-JB23",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "ANDREY_BAILEY_BERMUDA_7_HA409RSJB23",
        "modelPartNo": "HA409-RS-JB23",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "TUNING",
    "name": "TUNING",
    "date": "ไม่แน่ใจ",
    "items": [
      {
        "id": "TUNING_2_AM106PTNFF22",
        "modelPartNo": "AM106-PT-NF-F22",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_3_AM106PT4WT19",
        "modelPartNo": "AM106-PT-4W-T19",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_4_AM106PTN20",
        "modelPartNo": "AM106-PT-N20",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_5_AM106PTT24",
        "modelPartNo": "AM106-PT-T24",
        "planQty": 1,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_6_HR161RC20",
        "modelPartNo": "HR161-RC20",
        "planQty": 4,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_7_HR161T19",
        "modelPartNo": "HR161-T19",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_8_HR161T24",
        "modelPartNo": "HR161-T24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_9_RL504TS9T15",
        "modelPartNo": "RL504-TS9-T15",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_10_RL504TS9T24",
        "modelPartNo": "RL504-TS9-T24",
        "planQty": 2,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "TUNING_11_H001N20",
        "modelPartNo": "H001-N20",
        "planQty": 7,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่",
    "name": "เตรียมงาน trial  ไลน์ EDP โรงงานใหม่",
    "date": "16/01/26",
    "items": [
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_2_AM106PTF22NF",
        "modelPartNo": "AM106 PT F22 NF",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_3_AM106PTF15",
        "modelPartNo": "AM106 PT F15",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_4_AM106PTL210",
        "modelPartNo": "AM106 PT L210",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_5_AM106PTL216",
        "modelPartNo": "AM106 PT L216",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_6_AM106PTT194WD",
        "modelPartNo": "AM106 PT T19 4WD",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_7_AM106PTB625",
        "modelPartNo": "AM106 PT B625",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_8_AM106PTPD18",
        "modelPartNo": "AM106 PT PD18",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_9_AM106PTPD14",
        "modelPartNo": "AM106 PT PD14",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_10_AM106PTPD10",
        "modelPartNo": "AM106 PT PD10",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_11_AM106PTF22F",
        "modelPartNo": "AM106 PT F22 F",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_12_AM106PTBT20",
        "modelPartNo": "AM106 PT BT20",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_13_AM106T19",
        "modelPartNo": "AM106 T19",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_14_AM106RC18",
        "modelPartNo": "AM106 RC18",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_15_AM106PJ",
        "modelPartNo": "AM 106 PJ",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_16_AM111D24",
        "modelPartNo": "AM 111 D24",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_17_AM106AM10",
        "modelPartNo": "AM 106 AM10 (ใหญ่กว่าทุกตัว)",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_18_AM106PD18",
        "modelPartNo": "AM106 PD18",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_19_MX204PTF22",
        "modelPartNo": "MX204 PT F22",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_20_MX204PTD24",
        "modelPartNo": "MX204 PT D24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_21_MX209L712",
        "modelPartNo": "MX209 L712",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_22_MX201N15",
        "modelPartNo": "MX201 N15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_23_MX201RE15",
        "modelPartNo": "MX201 RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_24_MX204PTF22",
        "modelPartNo": "MX204 PT F22",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_25_MX204PTD24",
        "modelPartNo": "MX204 PT D24",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_26_SM105",
        "modelPartNo": "SM105",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_27_SM109",
        "modelPartNo": "SM109",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_28_SAR30",
        "modelPartNo": "SAR 3.0",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_29_AM106FR18",
        "modelPartNo": "AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_30_AM106FR18",
        "modelPartNo": "ขาตั้ง AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_31_AM106FR18",
        "modelPartNo": "กันแคร้ง ซ้าย ขวา  กลาง AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_32_AM106FR18",
        "modelPartNo": "เพลทหน้า AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_33_AM106FR18",
        "modelPartNo": "เบ้าไฟ AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_34_AM106FR18",
        "modelPartNo": "ดามปีก AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_35_AM106FR18",
        "modelPartNo": "ขาเสริม (สีแดง) AM106 FR18",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_36_SB2000",
        "modelPartNo": "โรลบาร์ SB2000",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_37_SB2000",
        "modelPartNo": "บูทรอง SB2000",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_38_",
        "modelPartNo": "แผ่นเพลท",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_39_SB2000",
        "modelPartNo": "คาน SB2000",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_40_",
        "modelPartNo": "ฝาครอบ",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_41_",
        "modelPartNo": "กรอบครอบไฟ",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_42_L12",
        "modelPartNo": "แขนข้าง L12",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_43_SB2100",
        "modelPartNo": "คานSB2100",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_44_AM106T19",
        "modelPartNo": "กันชนท้าย AM106 T19",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_45_",
        "modelPartNo": "ขาเสริมกันชน",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_46_24mmSB2000",
        "modelPartNo": "บูทขนาด 24 mm  SB2000",
        "planQty": 100,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_47_SB2100",
        "modelPartNo": "คาน SB2100",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_48_SB2000",
        "modelPartNo": "โรลบาร์ SB2000",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_49_SB1801SCsinglecap",
        "modelPartNo": "โรลบาร์ SB1801 - SC single cap (ตัวยาวที่สุด)",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_50_",
        "modelPartNo": "อะไหล่ท่อทุกขนาด",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_51_",
        "modelPartNo": "แหวนอะไหล่",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_52_",
        "modelPartNo": "แซนวิส",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_53_Omega",
        "modelPartNo": "แผ่นเพลท Omega",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_54_",
        "modelPartNo": "ป้ายทะเบียน",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_55_LSreject",
        "modelPartNo": "อะไหล่ที่ LS (งานที่จะ reject ก็ได้)",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "เตรียมงาน_TRIAL__ไลน์_EDP_โรงงานใหม่_56_",
        "modelPartNo": "น็อตพิเศษ",
        "planQty": 200,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  },
  {
    "id": "BASIT___PAKISTAN",
    "name": "BASIT - PAKISTAN",
    "date": "8/6",
    "items": [
      {
        "id": "BASIT___PAKISTAN_2_AM106B625",
        "modelPartNo": "AM106-B625",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_3_AM106PTFRC20",
        "modelPartNo": "AM106-PT-F-RC20",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_4_MX204B625",
        "modelPartNo": "MX204-B625",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_5_MX204RC20",
        "modelPartNo": "MX204-RC20",
        "planQty": 10,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_6_AM106BT25",
        "modelPartNo": "AM106-BT25",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_7_SB2000GGB625",
        "modelPartNo": "SB2000-GG  B625",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_8_RL503B625",
        "modelPartNo": "RL503-B625",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_9_SM105RE15",
        "modelPartNo": "SM105-RE15",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_10_SM105CMB625",
        "modelPartNo": "SM105-CM-B625",
        "planQty": 3,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_11_H001AB625",
        "modelPartNo": "H001A-B625",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      },
      {
        "id": "BASIT___PAKISTAN_12_H001ARGR24",
        "modelPartNo": "H001A-RGR24",
        "planQty": 5,
        "pcStatus": "",
        "note": "",
        "isClosed": false
      }
    ]
  }
];
