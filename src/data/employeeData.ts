// รายชื่อพนักงานแยกตามแผนกสำหรับส่ง-รับงานพ่นสี

export interface EmployeeItem {
  name: string;
  empId: string;
  dept: string;
  displayName: string;
}

// รายชื่อพนักงานส่งงานเข้าพ่นสี (แยกตามแผนกต้นทาง)
export const SENDERS_BY_DEPARTMENT: Record<string, EmployeeItem[]> = {
  "Laser(LS)": [
    {
      "name": "นายวิษณุ ศิริสุข (เขียว)",
      "empId": "100724",
      "dept": "Laser(LS)",
      "displayName": "นายวิษณุ ศิริสุข (เขียว) (100724)"
    },
    {
      "name": "นายวราวุฒิ สุขโสภา (โป้ง)",
      "empId": "100690",
      "dept": "Laser(LS)",
      "displayName": "นายวราวุฒิ สุขโสภา (โป้ง) (100690)"
    },
    {
      "name": "น.ส.รัตติกาล ศรีบุญเรือง (เปรม)",
      "empId": "100727",
      "dept": "Laser(LS)",
      "displayName": "น.ส.รัตติกาล ศรีบุญเรือง (เปรม) (100727)"
    },
    {
      "name": "น.ส สุดารัตน์ ภูคงกิ่ง (เปรี้ยว)",
      "empId": "100881",
      "dept": "Laser(LS)",
      "displayName": "น.ส สุดารัตน์ ภูคงกิ่ง (เปรี้ยว) (100881)"
    },
    {
      "name": "น.ส.นิตยา ชูรัตน์ (ยา)",
      "empId": "100703",
      "dept": "Laser(LS)",
      "displayName": "น.ส.นิตยา ชูรัตน์ (ยา) (100703)"
    },
    {
      "name": "นายMR.CHAN (ชาน)",
      "empId": "301069",
      "dept": "Laser(LS)",
      "displayName": "นายMR.CHAN (ชาน) (301069)"
    },
    {
      "name": "MR.MUNG WIN KO KO (มองวินโกโก)",
      "empId": "301045",
      "dept": "Laser(LS)",
      "displayName": "MR.MUNG WIN KO KO (มองวินโกโก) (301045)"
    },
    {
      "name": "นาย เจษฏาพร โพธิ์ศรี (ม่อน)",
      "empId": "600075",
      "dept": "Laser(LS)",
      "displayName": "นาย เจษฏาพร โพธิ์ศรี (ม่อน) (600075)"
    },
    {
      "name": "นายวิฑิต เรืองนิมิตร (นิว)",
      "empId": "600087",
      "dept": "Laser(LS)",
      "displayName": "นายวิฑิต เรืองนิมิตร (นิว) (600087)"
    },
    {
      "name": "MR.KYAW MIN TUN (จอมินทู)",
      "empId": "301145",
      "dept": "Laser(LS)",
      "displayName": "MR.KYAW MIN TUN (จอมินทู) (301145)"
    },
    {
      "name": "MR.PYAW PHYOE HTET AUNG",
      "empId": "301148",
      "dept": "Laser(LS)",
      "displayName": "MR.PYAW PHYOE HTET AUNG (301148)"
    }
  ],
  "Bending (BD)": [
    {
      "name": "นายทอน แก้วบุญธรรม (ทอน)",
      "empId": "100009",
      "dept": "Bending (BD)",
      "displayName": "นายทอน แก้วบุญธรรม (ทอน) (100009)"
    },
    {
      "name": "นายอัษฎาวุธ จำรัสแนว (อ้น)",
      "empId": "100842",
      "dept": "Bending (BD)",
      "displayName": "นายอัษฎาวุธ จำรัสแนว (อ้น) (100842)"
    },
    {
      "name": "นายปฐมพร ภูมิคอนสาร (ปาน)",
      "empId": "100843",
      "dept": "Bending (BD)",
      "displayName": "นายปฐมพร ภูมิคอนสาร (ปาน) (100843)"
    },
    {
      "name": "นาย ทรงพล ขจรรุ่งโรจน์ (เบียร์)",
      "empId": "100809",
      "dept": "Bending (BD)",
      "displayName": "นาย ทรงพล ขจรรุ่งโรจน์ (เบียร์) (100809)"
    },
    {
      "name": "นายจุลจักร ชินโชติ (กล้วยเจ๋ง)",
      "empId": "100929",
      "dept": "Bending (BD)",
      "displayName": "นายจุลจักร ชินโชติ (กล้วยเจ๋ง) (100929)"
    },
    {
      "name": "MR.HTET WAI AUNG (เฮดเวยออง)",
      "empId": "300832",
      "dept": "Bending (BD)",
      "displayName": "MR.HTET WAI AUNG (เฮดเวยออง) (300832)"
    },
    {
      "name": "MR.MAUNG TUN KHAING (หม่องตูคาย)",
      "empId": "301085",
      "dept": "Bending (BD)",
      "displayName": "MR.MAUNG TUN KHAING (หม่องตูคาย) (301085)"
    },
    {
      "name": "นายเทวฤทธิ์ ม่วงชูอิน (วาย)",
      "empId": "600081",
      "dept": "Bending (BD)",
      "displayName": "นายเทวฤทธิ์ ม่วงชูอิน (วาย) (600081)"
    },
    {
      "name": "MR.YAR ZAR OO (ยาซาอู)",
      "empId": "301150",
      "dept": "Bending (BD)",
      "displayName": "MR.YAR ZAR OO (ยาซาอู) (301150)"
    },
    {
      "name": "นายธิเบศร์ ช่างปลูก (แม็ก)",
      "empId": "600103",
      "dept": "Bending (BD)",
      "displayName": "นายธิเบศร์ ช่างปลูก (แม็ก) (600103)"
    }
  ],
  "Tube Bending (TB)": [
    {
      "name": "นายกมล ภูมิภาคสุวรรณ (สไปร์ท)",
      "empId": "100831",
      "dept": "Tube Bending (TB)",
      "displayName": "นายกมล ภูมิภาคสุวรรณ (สไปร์ท) (100831)"
    },
    {
      "name": "นายปฏิมากร ร่มโพธิ์ (หนุน)",
      "empId": "100697",
      "dept": "Tube Bending (TB)",
      "displayName": "นายปฏิมากร ร่มโพธิ์ (หนุน) (100697)"
    },
    {
      "name": "นายสมัย ยุวบุตร (เชียง)",
      "empId": "100844",
      "dept": "Tube Bending (TB)",
      "displayName": "นายสมัย ยุวบุตร (เชียง) (100844)"
    },
    {
      "name": "นายสา งิ้วเชอร์ (สา)",
      "empId": "300561",
      "dept": "Tube Bending (TB)",
      "displayName": "นายสา งิ้วเชอร์ (สา) (300561)"
    },
    {
      "name": "MR.THEIN TUN (เตนตุน)",
      "empId": "300620",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.THEIN TUN (เตนตุน) (300620)"
    },
    {
      "name": "MR.TUN OO (ทุนอู)",
      "empId": "300777",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.TUN OO (ทุนอู) (300777)"
    },
    {
      "name": "MR.NAY LIN TUN (เนลินทุน)",
      "empId": "300833",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.NAY LIN TUN (เนลินทุน) (300833)"
    },
    {
      "name": "MR.SIT NAING HTWE (ชิทนายทวย)",
      "empId": "301063",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.SIT NAING HTWE (ชิทนายทวย) (301063)"
    },
    {
      "name": "MR.HLA TUN THEIN (ฮาทูเท็น)",
      "empId": "301091",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.HLA TUN THEIN (ฮาทูเท็น) (301091)"
    },
    {
      "name": "MR.PHOE CHIT THAE (โพชิดแท)",
      "empId": "301124",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.PHOE CHIT THAE (โพชิดแท) (301124)"
    },
    {
      "name": "MR. MIN HTET KO (มินเฮ็นโก)",
      "empId": "301126",
      "dept": "Tube Bending (TB)",
      "displayName": "MR. MIN HTET KO (มินเฮ็นโก) (301126)"
    },
    {
      "name": "MR.NAING LIN AUNG (เนลินออง)",
      "empId": "301138",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.NAING LIN AUNG (เนลินออง) (301138)"
    },
    {
      "name": "MR.OAK KAR TUN (ออคาทูน)",
      "empId": "800002",
      "dept": "Tube Bending (TB)",
      "displayName": "MR.OAK KAR TUN (ออคาทูน) (800002)"
    }
  ],
  "Welding (WD)": [
    {
      "name": "ประสิทธิ์ วงศ์สกุล (เบนซ์)",
      "empId": "100477",
      "dept": "Welding (WD)",
      "displayName": "ประสิทธิ์ วงศ์สกุล (เบนซ์) (100477)"
    },
    {
      "name": "นายสุรเดช แสงดี (เดช)",
      "empId": "100441",
      "dept": "Welding (WD)",
      "displayName": "นายสุรเดช แสงดี (เดช) (100441)"
    },
    {
      "name": "นายอนุรักษ์ ขุนณรงค์ (ขวัญ)",
      "empId": "100518",
      "dept": "Welding (WD)",
      "displayName": "นายอนุรักษ์ ขุนณรงค์ (ขวัญ) (100518)"
    },
    {
      "name": "นายพิชิต ชานอก (ต้น)",
      "empId": "100560",
      "dept": "Welding (WD)",
      "displayName": "นายพิชิต ชานอก (ต้น) (100560)"
    },
    {
      "name": "นายสมคิด ผลรักษา (ติ๊ก)",
      "empId": "100574",
      "dept": "Welding (WD)",
      "displayName": "นายสมคิด ผลรักษา (ติ๊ก) (100574)"
    },
    {
      "name": "นายเดชา สังข์เยาะ (เดย์)",
      "empId": "100627",
      "dept": "Welding (WD)",
      "displayName": "นายเดชา สังข์เยาะ (เดย์) (100627)"
    },
    {
      "name": "นายอานันท์ ศรีวงษ์ (เนม)",
      "empId": "100712",
      "dept": "Welding (WD)",
      "displayName": "นายอานันท์ ศรีวงษ์ (เนม) (100712)"
    },
    {
      "name": "นายจตุพร มีสุข (กาย)",
      "empId": "100723",
      "dept": "Welding (WD)",
      "displayName": "นายจตุพร มีสุข (กาย) (100723)"
    },
    {
      "name": "นายพงษ์พิษณุ สวนชูผล (บิ๊ก)",
      "empId": "100780",
      "dept": "Welding (WD)",
      "displayName": "นายพงษ์พิษณุ สวนชูผล (บิ๊ก) (100780)"
    },
    {
      "name": "นายสกล มีสุข (กล)",
      "empId": "100783",
      "dept": "Welding (WD)",
      "displayName": "นายสกล มีสุข (กล) (100783)"
    },
    {
      "name": "นายสุธิมนต์ แวววงค์ (ปิ๊ก)",
      "empId": "100800",
      "dept": "Welding (WD)",
      "displayName": "นายสุธิมนต์ แวววงค์ (ปิ๊ก) (100800)"
    },
    {
      "name": "นายวีรชัย ภางาม (เอฟ)",
      "empId": "100867",
      "dept": "Welding (WD)",
      "displayName": "นายวีรชัย ภางาม (เอฟ) (100867)"
    },
    {
      "name": "นายเกียรติชัย ไพโรจน์ (กอล์ฟ)",
      "empId": "100902",
      "dept": "Welding (WD)",
      "displayName": "นายเกียรติชัย ไพโรจน์ (กอล์ฟ) (100902)"
    },
    {
      "name": "นาย เทียนทอง สีสุดดา (เทียน)",
      "empId": "100924",
      "dept": "Welding (WD)",
      "displayName": "นาย เทียนทอง สีสุดดา (เทียน) (100924)"
    },
    {
      "name": "นายนวพล ทองโท (ป้อม)",
      "empId": "100759",
      "dept": "Welding (WD)",
      "displayName": "นายนวพล ทองโท (ป้อม) (100759)"
    },
    {
      "name": "MR.ZAW HTWE AUNG (ซอ เฮด ออง)",
      "empId": "300533",
      "dept": "Welding (WD)",
      "displayName": "MR.ZAW HTWE AUNG (ซอ เฮด ออง) (300533)"
    },
    {
      "name": "MR.THU RA SOE (ทูราโซ)",
      "empId": "300585",
      "dept": "Welding (WD)",
      "displayName": "MR.THU RA SOE (ทูราโซ) (300585)"
    },
    {
      "name": "SAN THEIN (ซานเตน)",
      "empId": "300714",
      "dept": "Welding (WD)",
      "displayName": "SAN THEIN (ซานเตน) (300714)"
    },
    {
      "name": "MR.ZAW MIN HTIKE (ซอมินไท้)",
      "empId": "300806",
      "dept": "Welding (WD)",
      "displayName": "MR.ZAW MIN HTIKE (ซอมินไท้) (300806)"
    },
    {
      "name": "MR.YAN LIN MAUNG (ยานลินหม่อง)",
      "empId": "300926",
      "dept": "Welding (WD)",
      "displayName": "MR.YAN LIN MAUNG (ยานลินหม่อง) (300926)"
    },
    {
      "name": "MR.THAN ZAW WIN (ตานซอวิน)",
      "empId": "300991",
      "dept": "Welding (WD)",
      "displayName": "MR.THAN ZAW WIN (ตานซอวิน) (300991)"
    },
    {
      "name": "MR.KYAW YIN TUN (จอยินทุน)",
      "empId": "301067",
      "dept": "Welding (WD)",
      "displayName": "MR.KYAW YIN TUN (จอยินทุน) (301067)"
    },
    {
      "name": "MR.THU REIN (ทูเรียน)",
      "empId": "301074",
      "dept": "Welding (WD)",
      "displayName": "MR.THU REIN (ทูเรียน) (301074)"
    },
    {
      "name": "MR.YE NANG (ยีนาย)",
      "empId": "301075",
      "dept": "Welding (WD)",
      "displayName": "MR.YE NANG (ยีนาย) (301075)"
    },
    {
      "name": "MR.THET OO (เท้ดอู)",
      "empId": "301082",
      "dept": "Welding (WD)",
      "displayName": "MR.THET OO (เท้ดอู) (301082)"
    },
    {
      "name": "MR KHUN MAUNG MYINT หม่องเมี๊ย",
      "empId": "301086",
      "dept": "Welding (WD)",
      "displayName": "MR KHUN MAUNG MYINT หม่องเมี๊ย (301086)"
    },
    {
      "name": "CHIT SAN MAUNG (ทิชานหม่อง)",
      "empId": "301105",
      "dept": "Welding (WD)",
      "displayName": "CHIT SAN MAUNG (ทิชานหม่อง) (301105)"
    },
    {
      "name": "MR.MYO MIN AUNG (โมมินออง)",
      "empId": "301107",
      "dept": "Welding (WD)",
      "displayName": "MR.MYO MIN AUNG (โมมินออง) (301107)"
    },
    {
      "name": "MR.ZAR NI LIN (ซานิลิน)",
      "empId": "301108",
      "dept": "Welding (WD)",
      "displayName": "MR.ZAR NI LIN (ซานิลิน) (301108)"
    },
    {
      "name": "MR.WIN MYINT (วินเมีย)",
      "empId": "301123",
      "dept": "Welding (WD)",
      "displayName": "MR.WIN MYINT (วินเมีย) (301123)"
    },
    {
      "name": "MR.MYO MIN OO (มโยมินอู)",
      "empId": "301127",
      "dept": "Welding (WD)",
      "displayName": "MR.MYO MIN OO (มโยมินอู) (301127)"
    },
    {
      "name": "MR.KYAW THU (จอตู)",
      "empId": "301129",
      "dept": "Welding (WD)",
      "displayName": "MR.KYAW THU (จอตู) (301129)"
    },
    {
      "name": "MR.YE HTET (เยเท็ต)",
      "empId": "301130",
      "dept": "Welding (WD)",
      "displayName": "MR.YE HTET (เยเท็ต) (301130)"
    },
    {
      "name": "MR.THET PAING OO (เท็ดไป๋อู)",
      "empId": "301133",
      "dept": "Welding (WD)",
      "displayName": "MR.THET PAING OO (เท็ดไป๋อู) (301133)"
    },
    {
      "name": "MR.MAUNG KON (หม่องคอน)",
      "empId": "301135",
      "dept": "Welding (WD)",
      "displayName": "MR.MAUNG KON (หม่องคอน) (301135)"
    },
    {
      "name": "MR.YAN NUNG TUN (ยานหน่องทู)",
      "empId": "301134",
      "dept": "Welding (WD)",
      "displayName": "MR.YAN NUNG TUN (ยานหน่องทู) (301134)"
    },
    {
      "name": "MR.NAY MYO AUNG (เนเมียวออง)",
      "empId": "301136",
      "dept": "Welding (WD)",
      "displayName": "MR.NAY MYO AUNG (เนเมียวออง) (301136)"
    },
    {
      "name": "MR.AUNG MYINT (อองเมี๊ย)",
      "empId": "301146",
      "dept": "Welding (WD)",
      "displayName": "MR.AUNG MYINT (อองเมี๊ย) (301146)"
    },
    {
      "name": "นายวีระพงษ์ ยะระพันธุ์ (เบียร์)",
      "empId": "600006",
      "dept": "Welding (WD)",
      "displayName": "นายวีระพงษ์ ยะระพันธุ์ (เบียร์) (600006)"
    },
    {
      "name": "นายดำรงศักดิ์ สุขศรีจันทร์ (เล็ก)",
      "empId": "600058",
      "dept": "Welding (WD)",
      "displayName": "นายดำรงศักดิ์ สุขศรีจันทร์ (เล็ก) (600058)"
    },
    {
      "name": "นายประดิษฐ์ ครุธจู (แกะ)",
      "empId": "600061",
      "dept": "Welding (WD)",
      "displayName": "นายประดิษฐ์ ครุธจู (แกะ) (600061)"
    },
    {
      "name": "MR.AUNG KYAW MOE (อองจอโม)",
      "empId": "800012",
      "dept": "Welding (WD)",
      "displayName": "MR.AUNG KYAW MOE (อองจอโม) (800012)"
    },
    {
      "name": "MR.WAI PHYO THU (วายพโยทู)",
      "empId": "800024",
      "dept": "Welding (WD)",
      "displayName": "MR.WAI PHYO THU (วายพโยทู) (800024)"
    }
  ],
  "Grinding (GD)": [
    {
      "name": "ปฏิพัทธ์ พุ่มแก้ว (เต๋า",
      "empId": "100801",
      "dept": "Grinding (GD)",
      "displayName": "ปฏิพัทธ์ พุ่มแก้ว (เต๋า (100801)"
    },
    {
      "name": "ณัฐวุฒิ จันทร์ทอง (เจมส์)",
      "empId": "100833",
      "dept": "Grinding (GD)",
      "displayName": "ณัฐวุฒิ จันทร์ทอง (เจมส์) (100833)"
    },
    {
      "name": "MR. KYAW NAING (จอนาย)",
      "empId": "300368",
      "dept": "Grinding (GD)",
      "displayName": "MR. KYAW NAING (จอนาย) (300368)"
    },
    {
      "name": "MR.MYO THAN MAUNG (เมียวทานหม่อง)",
      "empId": "300654",
      "dept": "Grinding (GD)",
      "displayName": "MR.MYO THAN MAUNG (เมียวทานหม่อง) (300654)"
    },
    {
      "name": "MR.SOE THU WIN (โซตูวิน)",
      "empId": "300708",
      "dept": "Grinding (GD)",
      "displayName": "MR.SOE THU WIN (โซตูวิน) (300708)"
    },
    {
      "name": "MR.WIN LWIN (วินลวิน)",
      "empId": "300759",
      "dept": "Grinding (GD)",
      "displayName": "MR.WIN LWIN (วินลวิน) (300759)"
    },
    {
      "name": "MR.KYAW YE AUNG (จอยีออง)",
      "empId": "300804",
      "dept": "Grinding (GD)",
      "displayName": "MR.KYAW YE AUNG (จอยีออง) (300804)"
    },
    {
      "name": "MR.KYAW SAN WIN (จอซานวิน)",
      "empId": "300820",
      "dept": "Grinding (GD)",
      "displayName": "MR.KYAW SAN WIN (จอซานวิน) (300820)"
    },
    {
      "name": "MR.THEIN ZAW (เต๊กซอ)",
      "empId": "300850",
      "dept": "Grinding (GD)",
      "displayName": "MR.THEIN ZAW (เต๊กซอ) (300850)"
    },
    {
      "name": "MR.ZAW MYO WIN (ซอโมวิน)",
      "empId": "300852",
      "dept": "Grinding (GD)",
      "displayName": "MR.ZAW MYO WIN (ซอโมวิน) (300852)"
    },
    {
      "name": "MR.PHYO WIN KYAW (พิววินจอ)",
      "empId": "300863",
      "dept": "Grinding (GD)",
      "displayName": "MR.PHYO WIN KYAW (พิววินจอ) (300863)"
    },
    {
      "name": "MR.SAN HTAY (ซันเท)",
      "empId": "300864",
      "dept": "Grinding (GD)",
      "displayName": "MR.SAN HTAY (ซันเท) (300864)"
    },
    {
      "name": "MR.AUNG AUNG OO (อองอองอู)",
      "empId": "300867",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG AUNG OO (อองอองอู) (300867)"
    },
    {
      "name": "MR.SANG HLEI AYE (แซงเลเอ)",
      "empId": "300875",
      "dept": "Grinding (GD)",
      "displayName": "MR.SANG HLEI AYE (แซงเลเอ) (300875)"
    },
    {
      "name": "MR.U KYAW SOE WIN (ยูจอโซวิน)",
      "empId": "300916",
      "dept": "Grinding (GD)",
      "displayName": "MR.U KYAW SOE WIN (ยูจอโซวิน) (300916)"
    },
    {
      "name": "MR.ZAW MOE (ซอโม)",
      "empId": "300918",
      "dept": "Grinding (GD)",
      "displayName": "MR.ZAW MOE (ซอโม) (300918)"
    },
    {
      "name": "MR.ZIN MIN AUNG (ซินมินออง)",
      "empId": "300922",
      "dept": "Grinding (GD)",
      "displayName": "MR.ZIN MIN AUNG (ซินมินออง) (300922)"
    },
    {
      "name": "MR.THAT NAING LIN (แท๊ดนายลิน)",
      "empId": "300923",
      "dept": "Grinding (GD)",
      "displayName": "MR.THAT NAING LIN (แท๊ดนายลิน) (300923)"
    },
    {
      "name": "MR.MOE THET KO (โมเท็ตโก)",
      "empId": "300929",
      "dept": "Grinding (GD)",
      "displayName": "MR.MOE THET KO (โมเท็ตโก) (300929)"
    },
    {
      "name": "MR.ZAW MIN (ซอมิน) หน้าเหมือนไมค์นักร้อง",
      "empId": "300937",
      "dept": "Grinding (GD)",
      "displayName": "MR.ZAW MIN (ซอมิน) หน้าเหมือนไมค์นักร้อง (300937)"
    },
    {
      "name": "MR.AUNG THIKE TUN (อองไทตุน)",
      "empId": "300943",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG THIKE TUN (อองไทตุน) (300943)"
    },
    {
      "name": "MR.NAY KYAW LIN (เนจอลิน)",
      "empId": "300949",
      "dept": "Grinding (GD)",
      "displayName": "MR.NAY KYAW LIN (เนจอลิน) (300949)"
    },
    {
      "name": "MR.MYO ZAE HTET (โมแซเทต)",
      "empId": "300951",
      "dept": "Grinding (GD)",
      "displayName": "MR.MYO ZAE HTET (โมแซเทต) (300951)"
    },
    {
      "name": "MR.AUNG SOE OO (อองโซอู)",
      "empId": "300953",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG SOE OO (อองโซอู) (300953)"
    },
    {
      "name": "MR.WAI PHYO ZAW (วายพิวซอ)",
      "empId": "300966",
      "dept": "Grinding (GD)",
      "displayName": "MR.WAI PHYO ZAW (วายพิวซอ) (300966)"
    },
    {
      "name": "MR.NYI NYI WIN (ยียีวิน)",
      "empId": "300967",
      "dept": "Grinding (GD)",
      "displayName": "MR.NYI NYI WIN (ยียีวิน) (300967)"
    },
    {
      "name": "MR.KAUNG YEE LIN (คุยยีลิน)",
      "empId": "300972",
      "dept": "Grinding (GD)",
      "displayName": "MR.KAUNG YEE LIN (คุยยีลิน) (300972)"
    },
    {
      "name": "MR.AUNG ZAW CHIT (อองซอชิด)",
      "empId": "300974",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG ZAW CHIT (อองซอชิด) (300974)"
    },
    {
      "name": "MR.HEIN HTET NAING (เฮียงเทดนาย)",
      "empId": "300975",
      "dept": "Grinding (GD)",
      "displayName": "MR.HEIN HTET NAING (เฮียงเทดนาย) (300975)"
    },
    {
      "name": "MR.TAE NAI TA (เตไนเท)",
      "empId": "300979",
      "dept": "Grinding (GD)",
      "displayName": "MR.TAE NAI TA (เตไนเท) (300979)"
    },
    {
      "name": "MR.AYE KO SHINE (เอโกชาย)",
      "empId": "300989",
      "dept": "Grinding (GD)",
      "displayName": "MR.AYE KO SHINE (เอโกชาย) (300989)"
    },
    {
      "name": "MR.MO CHA (โมชา)",
      "empId": "300994",
      "dept": "Grinding (GD)",
      "displayName": "MR.MO CHA (โมชา) (300994)"
    },
    {
      "name": "MR.YO MEN PHAY (โยเมนเพล)",
      "empId": "301015",
      "dept": "Grinding (GD)",
      "displayName": "MR.YO MEN PHAY (โยเมนเพล) (301015)"
    },
    {
      "name": "MR.KYAW MIN HTAY (จอมินเท)",
      "empId": "301016",
      "dept": "Grinding (GD)",
      "displayName": "MR.KYAW MIN HTAY (จอมินเท) (301016)"
    },
    {
      "name": "MR.MYO NAING TUN (โมนายตุน)",
      "empId": "301018",
      "dept": "Grinding (GD)",
      "displayName": "MR.MYO NAING TUN (โมนายตุน) (301018)"
    },
    {
      "name": "MR.KAUNG HTET PO (กองเต็ทโป)",
      "empId": "301027",
      "dept": "Grinding (GD)",
      "displayName": "MR.KAUNG HTET PO (กองเต็ทโป) (301027)"
    },
    {
      "name": "MR.AUNG MOE NAING (อองโมนาย)",
      "empId": "301043",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG MOE NAING (อองโมนาย) (301043)"
    },
    {
      "name": "MR.YI LA PAR (ยี่ลาพาร์)",
      "empId": "301049",
      "dept": "Grinding (GD)",
      "displayName": "MR.YI LA PAR (ยี่ลาพาร์) (301049)"
    },
    {
      "name": "MR.MYO MIN OO (มิวมินอู)",
      "empId": "301051",
      "dept": "Grinding (GD)",
      "displayName": "MR.MYO MIN OO (มิวมินอู) (301051)"
    },
    {
      "name": "MR.KHUN BIN KO KO (คุนบินโกโก)",
      "empId": "301053",
      "dept": "Grinding (GD)",
      "displayName": "MR.KHUN BIN KO KO (คุนบินโกโก) (301053)"
    },
    {
      "name": "MR.SI THU AUNG (ซีตูออง)",
      "empId": "301060",
      "dept": "Grinding (GD)",
      "displayName": "MR.SI THU AUNG (ซีตูออง) (301060)"
    },
    {
      "name": "MR.TANG SENG OO (แตงเซงอู)",
      "empId": "301061",
      "dept": "Grinding (GD)",
      "displayName": "MR.TANG SENG OO (แตงเซงอู) (301061)"
    },
    {
      "name": "MR.WIN KO OO (วินโกโก)",
      "empId": "301097",
      "dept": "Grinding (GD)",
      "displayName": "MR.WIN KO OO (วินโกโก) (301097)"
    },
    {
      "name": "MR. YE KO OO (ยีโกอู)",
      "empId": "301098",
      "dept": "Grinding (GD)",
      "displayName": "MR. YE KO OO (ยีโกอู) (301098)"
    },
    {
      "name": "MR.NAING WIN (นายวิน)",
      "empId": "301099",
      "dept": "Grinding (GD)",
      "displayName": "MR.NAING WIN (นายวิน) (301099)"
    },
    {
      "name": "MR.WIN MYINT ( วินเมียน )",
      "empId": "301102",
      "dept": "Grinding (GD)",
      "displayName": "MR.WIN MYINT ( วินเมียน ) (301102)"
    },
    {
      "name": "MR.AUNG TIN WIN (อองตินวิน)",
      "empId": "301163",
      "dept": "Grinding (GD)",
      "displayName": "MR.AUNG TIN WIN (อองตินวิน) (301163)"
    },
    {
      "name": "นายเพขร อินทิราช (เพชร)",
      "empId": "800001",
      "dept": "Grinding (GD)",
      "displayName": "นายเพขร อินทิราช (เพชร) (800001)"
    },
    {
      "name": "MR.SHINE MYAT AUNG (ชายเมียดออง)",
      "empId": "800003",
      "dept": "Grinding (GD)",
      "displayName": "MR.SHINE MYAT AUNG (ชายเมียดออง) (800003)"
    },
    {
      "name": "MR.HTET LIN AUNG (เท็ตลินออง)",
      "empId": "800016",
      "dept": "Grinding (GD)",
      "displayName": "MR.HTET LIN AUNG (เท็ตลินออง) (800016)"
    }
  ]
};

// รายชื่อพนักงานรับงานเข้าแผนกพ่นสี (Powder Coating)
export const POWDER_COAT_RECEIVERS: EmployeeItem[] = [
  {
    "name": "สุรวุฒิ กระโพธิ์ (ปอนด์)",
    "empId": "600096",
    "dept": "Painting (PC)",
    "displayName": "สุรวุฒิ กระโพธิ์ (ปอนด์) (600096)"
  },
  {
    "name": "นายประสิทธิ์ แดงสี (แก๊ส)",
    "empId": "100664",
    "dept": "Painting (PC)",
    "displayName": "นายประสิทธิ์ แดงสี (แก๊ส) (100664)"
  },
  {
    "name": "นาย ชวาระ ศรีโท (ต้น)",
    "empId": "100826",
    "dept": "Painting (PC)",
    "displayName": "นาย ชวาระ ศรีโท (ต้น) (100826)"
  },
  {
    "name": "MR.THAN OO (ตาน อู)",
    "empId": "300452",
    "dept": "Painting (PC)",
    "displayName": "MR.THAN OO (ตาน อู) (300452)"
  },
  {
    "name": "MR.MIN NAING TUN (มินนายตุน)",
    "empId": "300829",
    "dept": "Painting (PC)",
    "displayName": "MR.MIN NAING TUN (มินนายตุน) (300829)"
  },
  {
    "name": "MR.WIN KO KO (วินโกโก)",
    "empId": "300842",
    "dept": "Painting (PC)",
    "displayName": "MR.WIN KO KO (วินโกโก) (300842)"
  },
  {
    "name": "MR.KYAW LWIN (จอลวิน)",
    "empId": "300920",
    "dept": "Painting (PC)",
    "displayName": "MR.KYAW LWIN (จอลวิน) (300920)"
  },
  {
    "name": "THANT ZIN HTWE (ตานซินทวย)พ่นสี",
    "empId": "300964",
    "dept": "Painting (PC)",
    "displayName": "THANT ZIN HTWE (ตานซินทวย)พ่นสี (300964)"
  },
  {
    "name": "MR.THET AUNG SOE (เท็ทอองโซ)",
    "empId": "300986",
    "dept": "Painting (PC)",
    "displayName": "MR.THET AUNG SOE (เท็ทอองโซ) (300986)"
  },
  {
    "name": "MIN HTET AUNG (มินเฮดออง)",
    "empId": "301005",
    "dept": "Painting (PC)",
    "displayName": "MIN HTET AUNG (มินเฮดออง) (301005)"
  },
  {
    "name": "MR.TIN KO LIN (ตินโกลิน)",
    "empId": "301007",
    "dept": "Painting (PC)",
    "displayName": "MR.TIN KO LIN (ตินโกลิน) (301007)"
  },
  {
    "name": "MR.MIN MIN AUNG (มินมินออง)",
    "empId": "301109",
    "dept": "Painting (PC)",
    "displayName": "MR.MIN MIN AUNG (มินมินออง) (301109)"
  },
  {
    "name": "MR.HAN WIN THU (ฮานวินทู)",
    "empId": "301110",
    "dept": "Painting (PC)",
    "displayName": "MR.HAN WIN THU (ฮานวินทู) (301110)"
  },
  {
    "name": "MR.YE WINT KYAW (เยวินจอ)",
    "empId": "301111",
    "dept": "Painting (PC)",
    "displayName": "MR.YE WINT KYAW (เยวินจอ) (301111)"
  },
  {
    "name": "MR.THUYA AUNG (ทูยาออง)",
    "empId": "301112",
    "dept": "Painting (PC)",
    "displayName": "MR.THUYA AUNG (ทูยาออง) (301112)"
  },
  {
    "name": "MR.THAN THITE OO (ตาลเท็ดอู)",
    "empId": "301114",
    "dept": "Painting (PC)",
    "displayName": "MR.THAN THITE OO (ตาลเท็ดอู) (301114)"
  },
  {
    "name": "MR.AUNG MIN (อังมิน)",
    "empId": "301117",
    "dept": "Painting (PC)",
    "displayName": "MR.AUNG MIN (อังมิน) (301117)"
  },
  {
    "name": "MR.SAW SHINE HTOO AUNG (ซอชินทูออง)",
    "empId": "301119",
    "dept": "Painting (PC)",
    "displayName": "MR.SAW SHINE HTOO AUNG (ซอชินทูออง) (301119)"
  },
  {
    "name": "MR.THI HA SOE (ทิฮาโซ)",
    "empId": "301120",
    "dept": "Painting (PC)",
    "displayName": "MR.THI HA SOE (ทิฮาโซ) (301120)"
  },
  {
    "name": "MR.TUN YIN (ทูยิน)",
    "empId": "301121",
    "dept": "Painting (PC)",
    "displayName": "MR.TUN YIN (ทูยิน) (301121)"
  },
  {
    "name": "MR.THAN THING HTAY (ตานทินเท)",
    "empId": "301125",
    "dept": "Painting (PC)",
    "displayName": "MR.THAN THING HTAY (ตานทินเท) (301125)"
  },
  {
    "name": "MR.ZIN MAUNG MOUNG (ซินหม่องโม)",
    "empId": "301128",
    "dept": "Painting (PC)",
    "displayName": "MR.ZIN MAUNG MOUNG (ซินหม่องโม) (301128)"
  },
  {
    "name": "MR.MYO MYINT AUNG (มโยเมีะยออง)",
    "empId": "301132",
    "dept": "Painting (PC)",
    "displayName": "MR.MYO MYINT AUNG (มโยเมีะยออง) (301132)"
  },
  {
    "name": "MR.AUNG THU PHYO (อองทูพโย)",
    "empId": "301152",
    "dept": "Painting (PC)",
    "displayName": "MR.AUNG THU PHYO (อองทูพโย) (301152)"
  },
  {
    "name": "MR.WIN KO KO (วินโกโก)",
    "empId": "301158",
    "dept": "Painting (PC)",
    "displayName": "MR.WIN KO KO (วินโกโก) (301158)"
  },
  {
    "name": "MR.ZIN NYEIN KYAW (ซินเนียวจอ)",
    "empId": "301159",
    "dept": "Painting (PC)",
    "displayName": "MR.ZIN NYEIN KYAW (ซินเนียวจอ) (301159)"
  }
];

// รายชื่อพนักงานรับงานออกจากพ่นสี (แผนก Packing)
export const PACKING_RECEIVERS: EmployeeItem[] = [
  {
    "name": "น.ส.นันทนารัตน์ เผือกจันทร์ (ปู)",
    "empId": "100599",
    "dept": "Packing (PK)",
    "displayName": "น.ส.นันทนารัตน์ เผือกจันทร์ (ปู) (100599)"
  },
  {
    "name": "นายณัฐพล พูลสวัสดิ์ (นกเอี้ยง)",
    "empId": "100208",
    "dept": "Packing (PK)",
    "displayName": "นายณัฐพล พูลสวัสดิ์ (นกเอี้ยง) (100208)"
  },
  {
    "name": "นายภานุวัฒ จอมศักดิ์ (เจมส์)",
    "empId": "100965",
    "dept": "Packing (PK)",
    "displayName": "นายภานุวัฒ จอมศักดิ์ (เจมส์) (100965)"
  },
  {
    "name": "นายอุบล คำชะนะ (หำ)",
    "empId": "100755",
    "dept": "Packing (PK)",
    "displayName": "นายอุบล คำชะนะ (หำ) (100755)"
  },
  {
    "name": "MR.SAN AUNG (ชานอ่อง)",
    "empId": "300739",
    "dept": "Packing (PK)",
    "displayName": "MR.SAN AUNG (ชานอ่อง) (300739)"
  },
  {
    "name": "MR.SOE KO (โซโก)",
    "empId": "300811",
    "dept": "Packing (PK)",
    "displayName": "MR.SOE KO (โซโก) (300811)"
  },
  {
    "name": "MR.SAN WIN KYAW (ซานวินจอ)",
    "empId": "300944",
    "dept": "Packing (PK)",
    "displayName": "MR.SAN WIN KYAW (ซานวินจอ) (300944)"
  },
  {
    "name": "AUNG MYO WIN (อองโมวิน)",
    "empId": "301040",
    "dept": "Packing (PK)",
    "displayName": "AUNG MYO WIN (อองโมวิน) (301040)"
  },
  {
    "name": "THAN ZAW SHWE (ตาลซอซุย)",
    "empId": "301046",
    "dept": "Packing (PK)",
    "displayName": "THAN ZAW SHWE (ตาลซอซุย) (301046)"
  },
  {
    "name": "HLA HLA HTAY (เมรา)",
    "empId": "300532",
    "dept": "Packing (PK)",
    "displayName": "HLA HLA HTAY (เมรา) (300532)"
  },
  {
    "name": "MR.NAING LIN THU (นายลินทู)",
    "empId": "300552",
    "dept": "Packing (PK)",
    "displayName": "MR.NAING LIN THU (นายลินทู) (300552)"
  },
  {
    "name": "MR.KYAW YE WIN (จอเยวิน)",
    "empId": "800023",
    "dept": "Packing (PK)",
    "displayName": "MR.KYAW YE WIN (จอเยวิน) (800023)"
  },
  {
    "name": "AUNG MYINT SEIN (อองเมียนซิน)",
    "empId": "300760",
    "dept": "Packing (PK)",
    "displayName": "AUNG MYINT SEIN (อองเมียนซิน) (300760)"
  },
  {
    "name": "THAN SHWE (ตาลซุย)",
    "empId": "300763",
    "dept": "Packing (PK)",
    "displayName": "THAN SHWE (ตาลซุย) (300763)"
  },
  {
    "name": "MISS MAMEE (มามี)",
    "empId": "300815",
    "dept": "Packing (PK)",
    "displayName": "MISS MAMEE (มามี) (300815)"
  },
  {
    "name": "MISS CHANTY VAN (ชานตี้แวน)",
    "empId": "200036",
    "dept": "Packing (PK)",
    "displayName": "MISS CHANTY VAN (ชานตี้แวน) (200036)"
  },
  {
    "name": "MR.SAN WIN AUNG (ชานวินออง)",
    "empId": "300985",
    "dept": "Packing (PK)",
    "displayName": "MR.SAN WIN AUNG (ชานวินออง) (300985)"
  },
  {
    "name": "MR.MAUNG AYE (หมองเอ)",
    "empId": "300987",
    "dept": "Packing (PK)",
    "displayName": "MR.MAUNG AYE (หมองเอ) (300987)"
  },
  {
    "name": "MR.ZAW MIN OO (ซอมินอู)",
    "empId": "300992",
    "dept": "Packing (PK)",
    "displayName": "MR.ZAW MIN OO (ซอมินอู) (300992)"
  },
  {
    "name": "MR MOE MYINT KHAING (โมมิดไข่)",
    "empId": "301002",
    "dept": "Packing (PK)",
    "displayName": "MR MOE MYINT KHAING (โมมิดไข่) (301002)"
  },
  {
    "name": "MR.MIN CHIT THU (มินชิดทู)",
    "empId": "301041",
    "dept": "Packing (PK)",
    "displayName": "MR.MIN CHIT THU (มินชิดทู) (301041)"
  },
  {
    "name": "MR. PAING PAING (ปาย ปาย)",
    "empId": "301066",
    "dept": "Packing (PK)",
    "displayName": "MR. PAING PAING (ปาย ปาย) (301066)"
  },
  {
    "name": "MR. MOE ZAW (โมซอ)",
    "empId": "301070",
    "dept": "Packing (PK)",
    "displayName": "MR. MOE ZAW (โมซอ) (301070)"
  },
  {
    "name": "MR. KYAW CHIT (จอ ชิน)",
    "empId": "301100",
    "dept": "Packing (PK)",
    "displayName": "MR. KYAW CHIT (จอ ชิน) (301100)"
  },
  {
    "name": "MR.KYAW YE AUNG (จอเยออง)",
    "empId": "301103",
    "dept": "Packing (PK)",
    "displayName": "MR.KYAW YE AUNG (จอเยออง) (301103)"
  },
  {
    "name": "MAUNG THUYA AUNG (หม่องทูยาออง)",
    "empId": "301104",
    "dept": "Packing (PK)",
    "displayName": "MAUNG THUYA AUNG (หม่องทูยาออง) (301104)"
  },
  {
    "name": "KYAW THU YA (จอตูยะ)",
    "empId": "301118",
    "dept": "Packing (PK)",
    "displayName": "KYAW THU YA (จอตูยะ) (301118)"
  },
  {
    "name": "MR.YAR ZAR WIN (ยาซอวิน)",
    "empId": "800025",
    "dept": "Packing (PK)",
    "displayName": "MR.YAR ZAR WIN (ยาซอวิน) (800025)"
  },
  {
    "name": "MR.MIN TUN (มินทุน)",
    "empId": "301113",
    "dept": "Packing (PK)",
    "displayName": "MR.MIN TUN (มินทุน) (301113)"
  },
  {
    "name": "MR.KYAW LIN OO (จอลินอู)",
    "empId": "301131",
    "dept": "Packing (PK)",
    "displayName": "MR.KYAW LIN OO (จอลินอู) (301131)"
  },
  {
    "name": "นางประภาพร วาดอักษร (แกลบ)",
    "empId": "100013",
    "dept": "Packing (PK)",
    "displayName": "นางประภาพร วาดอักษร (แกลบ) (100013)"
  },
  {
    "name": "MR.AUNG MIN TUN (อองมินทู)",
    "empId": "301156",
    "dept": "Packing (PK)",
    "displayName": "MR.AUNG MIN TUN (อองมินทู) (301156)"
  },
  {
    "name": "MR.WAI LIN TUN (วินลินทู)",
    "empId": "301157",
    "dept": "Packing (PK)",
    "displayName": "MR.WAI LIN TUN (วินลินทู) (301157)"
  },
  {
    "name": "นาย วุฒิชัย วัฒน์สี (องุ่น)",
    "empId": "600097",
    "dept": "Packing (PK)",
    "displayName": "นาย วุฒิชัย วัฒน์สี (องุ่น) (600097)"
  }
];

// รวมแผนกพ่นสีและแพ็คกิ้งเข้ากับ SENDERS_BY_DEPARTMENT ด้วย
SENDERS_BY_DEPARTMENT["Painting (PC)"] = POWDER_COAT_RECEIVERS;
SENDERS_BY_DEPARTMENT["Packing (PK)"] = PACKING_RECEIVERS;

// ฟังก์ชันช่วยค้นหารายชื่อพนักงานตามชื่อแผนก (แบบยืดหยุ่น)
export const getEmployeesByDepartment = (dept: string): EmployeeItem[] => {
  if (!dept) return [];
  if (SENDERS_BY_DEPARTMENT[dept]) return SENDERS_BY_DEPARTMENT[dept];
  const d = dept.toLowerCase();
  for (const [k, list] of Object.entries(SENDERS_BY_DEPARTMENT)) {
    if (k.toLowerCase().includes(d) || d.includes(k.toLowerCase().split(' ')[0])) {
      return list;
    }
  }
  return [];
};

