import ExcelJS from 'exceljs';

const GOOGLE_SHEET_XLSX_URL =
  'https://docs.google.com/spreadsheets/d/1hZa5qYVzlQJlTOZGWgFz1SnE8-QbJywf/export?format=xlsx&gid=1962169336';

const makePlanItemKey = (containerIdOrName, modelPartNo) => {
  const cleanContainer = (containerIdOrName || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9ก-๙]/g, '_');
  const cleanModel = (modelPartNo || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  return `${cleanContainer}__${cleanModel}`;
};

const formatDateValue = (dateObj, numFmt = '') => {
  const d = dateObj.getUTCDate();
  const m = dateObj.getUTCMonth() + 1;
  const y = dateObj.getUTCFullYear();
  if (String(numFmt).toLowerCase().includes('y')) {
    const dd = String(d).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const yy = String(y).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }
  return `${d}/${m}`;
};

const getCellText = (cell) => {
  const v = cell?.value;
  if (v === null || v === undefined) return '';
  if (v instanceof Date) {
    return formatDateValue(v, cell?.numFmt);
  }
  if (typeof v === 'object') {
    if ('result' in v) {
      if (v.result instanceof Date) return formatDateValue(v.result, cell?.numFmt);
      return v.result != null ? String(v.result).trim() : '';
    }
    if ('richText' in v && Array.isArray(v.richText)) {
      return v.richText.map((r) => r.text || '').join('').trim();
    }
    if ('text' in v) return String(v.text).trim();
    return '';
  }
  return String(v).trim();
};

const getCellArgb = (cell) => {
  const f = cell?.fill;
  if (!f || f.type !== 'pattern' || f.pattern === 'none') return null;
  if (f.fgColor && f.fgColor.argb) return String(f.fgColor.argb).toUpperCase();
  return null;
};

/**
 * จำแนกสีพื้นหลังของเซลล์จากรหัส ARGB จริงของ Google Sheet ฝ่ายวางแผน
 * - GREEN: เช่น FFB6D7A8 (Light Green 2), FF9BD7B9, FFD4EDBC, หรือโทนเขียวอื่นๆ
 * - RED: เช่น FFFF0000 (Red), FFE06666, FFCC0000, FFEA9999
 * - YELLOW: เช่น FFFFFF00 (Yellow), FFFFF2CC (Light Yellow)
 */
const classifyArgbColor = (argb) => {
  if (!argb || argb.length < 6) return null;
  const hex = argb.length === 8 ? argb.slice(2) : argb;
  if (hex === 'FFFFFF' || hex === '000000' || hex === 'B7B7B7') return null;

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;

  // RED (แดงชัด — ไม่จับสีชมพูม่วงอ่อนอย่าง FFEAD1DC ที่ r=234,b=220)
  if (r >= 180 && r - g >= 45 && r - b >= 45) {
    return 'RED';
  }

  // YELLOW (เหลืองสด FFFFFF00 หรือเหลืองอ่อน FFFFF2CC)
  if (r >= 225 && g >= 200 && b <= 210 && r - b >= 40 && Math.abs(r - g) <= 45) {
    return 'YELLOW';
  }

  // GREEN (เขียวอ่อน/เขียวกลาง เช่น FFB6D7A8, FF9BD7B9, FFD4EDBC)
  if (g >= 150 && g - r >= 18 && g - b >= 12) {
    return 'GREEN';
  }

  return null;
};

async function parseXlsxBuffer(buffer) {
  const Workbook = ExcelJS.Workbook || ExcelJS.default?.Workbook;
  const wb = new Workbook();
  await wb.xlsx.load(buffer);
  const ws = wb.worksheets[0];
  if (!ws) {
    throw new Error('No worksheet found in exported xlsx');
  }

  const containers = [];
  let current = null;
  let greenCount = 0;
  let redCount = 0;
  let yellowCount = 0;

  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const colB = row.getCell(2);
    const colC = row.getCell(3);
    const colD = row.getCell(4);

    const valB = getCellText(colB);
    const valC = getCellText(colC);
    const valD = getCellText(colD);

    if (!valB) continue;

    // ตรวจจับแถวหัวข้อตู้สินค้า (Col D มีคำว่า "เลเซอร์")
    if (valD && (valD === 'เลเซอร์' || valD.includes('เลเซอร์'))) {
      if (current && current.items.length > 0) {
        containers.push(current);
      }
      const rawName = valB;
      const date = valC || '';
      current = {
        id: rawName.replace(/[^a-zA-Z0-9ก-๙]/g, '_').toUpperCase(),
        name: rawName,
        date,
        items: [],
      };
      continue;
    }

    if (!current) continue;

    // ข้ามแถวหัวตาราง / แถวที่ไม่ใช่รหัสโมเดล
    if (
      valB === 'รหัสสินค้า' ||
      valB.includes('รหัสสินค้า') ||
      valB === '3' ||
      valB.startsWith('฿') ||
      valB === 'LS' ||
      valB === 'BD' ||
      valB === 'WD'
    ) {
      continue;
    }

    const planQty = parseInt(valC, 10) || 1;
    const rawQtyText = valC && String(planQty) !== valC ? valC : undefined;
    const pcStatus = getCellText(row.getCell(11)); // Col K (index 11)
    const note = getCellText(row.getCell(16)); // Col P (index 16)

    const colorB = classifyArgbColor(getCellArgb(colB));
    const colorC = classifyArgbColor(getCellArgb(colC));

    // สีหลักของโมเดลดูจากช่อง Col B (ชื่อโมเดล) เป็นหลัก
    // ยกเว้นถ้า Col B ไม่มีสีแต่ Col C เป็นสีเหลือง/แดง ให้จับได้ด้วย
    const sheetColor = colorB || (colorC === 'YELLOW' || colorC === 'RED' ? colorC : null);
    const isQtyYellow = colorB === 'YELLOW' || colorC === 'YELLOW';

    if (sheetColor === 'GREEN') greenCount++;
    if (sheetColor === 'RED') redCount++;
    if (isQtyYellow) yellowCount++;

    const itemKey = makePlanItemKey(current.id, valB);
    current.items.push({
      id: itemKey,
      modelPartNo: valB,
      planQty,
      rawQtyText,
      pcStatus,
      note,
      isClosed: sheetColor === 'GREEN',
      sheetColor,
      isQtyYellow,
    });
  }

  if (current && current.items.length > 0) {
    containers.push(current);
  }

  // แยกแยะตู้สินค้าที่มีชื่อซ้ำกัน (เช่น SOUTH AFICA คนละวันที่ หรือ K'FRANZ 2 รอบ) ให้มี id และ date ไม่ชนกัน 100%
  const baseIdCounts = new Map();
  containers.forEach((c) => {
    baseIdCounts.set(c.id, (baseIdCounts.get(c.id) || 0) + 1);
  });

  const seenOccurrences = new Map();
  const usedIds = new Set();

  containers.forEach((c) => {
    const baseId = c.id;
    const totalSameName = baseIdCounts.get(baseId) || 1;
    if (totalSameName > 1) {
      const occ = (seenOccurrences.get(baseId) || 0) + 1;
      seenOccurrences.set(baseId, occ);

      if (!c.date) {
        c.date = `รอบที่ ${occ}`;
      }
      const dateSlug = c.date.replace(/[^a-zA-Z0-9ก-๙]/g, '_').toUpperCase();
      let candidateId = `${baseId}_${dateSlug}`;
      if (usedIds.has(candidateId)) {
        candidateId = `${candidateId}_${occ}`;
      }
      c.id = candidateId;
      c.items = c.items.map((it) => ({
        ...it,
        id: makePlanItemKey(c.id, it.modelPartNo),
      }));
    }
    usedIds.add(c.id);
  });

  return {
    plans: containers,
    summary: {
      totalContainers: containers.length,
      greenCount,
      redCount,
      yellowCount,
    },
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(GOOGLE_SHEET_XLSX_URL, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PowderCoatTracker/1.0)',
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: `Google Sheet returned HTTP ${response.status}`,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { plans, summary } = await parseXlsxBuffer(buffer);

    return res.status(200).json({
      success: true,
      syncedAt: new Date().toISOString(),
      plans,
      summary,
    });
  } catch (err) {
    console.error('sync-plan error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to parse Google Sheet xlsx',
    });
  }
}
