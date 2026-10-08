/**
 * Coordinate esatte e metadati dei campi AcroForm estratti dalle 3 pagine di scheda-personaggio-template.pdf
 */

export interface PdfFieldLayoutItem {
  name: string;
  type: string;
  rect: [number, number, number, number];
  multiLine: boolean;
  align?: number | null;
  fontSize: number;
  checkBox: boolean;
  pushButton: boolean;
}

export interface PdfPageLayout {
  pageNumber: number;
  width: number;
  height: number;
  fields: PdfFieldLayoutItem[];
}

export const PDF_SHEET_PAGES_LAYOUT: PdfPageLayout[] = [
  {
    "pageNumber": 1,
    "width": 595.276,
    "height": 841.89,
    "fields": [
      {
        "name": "RESETTA LA SCHEDA",
        "type": "Btn",
        "rect": [
          379.5,
          802.72,
          563.09,
          827.25
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": true
      },
      {
        "name": "ClassLevel",
        "type": "Tx",
        "rect": [
          263.85,
          769.98,
          369.69,
          785.63
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Background",
        "type": "Tx",
        "rect": [
          374.93,
          769.98,
          461.01,
          785.63
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PlayerName",
        "type": "Tx",
        "rect": [
          468.09,
          769.98,
          558.09,
          785.63
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "CharacterName",
        "type": "Tx",
        "rect": [
          47.74,
          753.14,
          220.93,
          774.02
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Race ",
        "type": "Tx",
        "rect": [
          263.85,
          743.89,
          370.69,
          759.55
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Alignment",
        "type": "Tx",
        "rect": [
          374.32,
          743.89,
          451.59,
          759.55
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "XP",
        "type": "Tx",
        "rect": [
          456.09,
          743.89,
          501.52,
          759.55
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Nex_XP",
        "type": "Tx",
        "rect": [
          508.53,
          744.29,
          553.97,
          759.95
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "STRmod",
        "type": "Tx",
        "rect": [
          36.21,
          656.04,
          78.36,
          684.35
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "insp1",
        "type": "Btn",
        "rect": [
          96.51,
          694.9,
          104.84,
          703.6
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "insp2",
        "type": "Btn",
        "rect": [
          105.56,
          694.9,
          114.26,
          703.6
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "AbilitySaveDC",
        "type": "Tx",
        "rect": [
          525.25,
          684.58,
          568.5,
          706.45
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "insp3",
        "type": "Btn",
        "rect": [
          96.14,
          685.77,
          104.85,
          694.48
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "insp4",
        "type": "Btn",
        "rect": [
          105.56,
          685.77,
          114.27,
          694.48
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "AC",
        "type": "Tx",
        "rect": [
          227,
          664.3,
          258.99,
          693.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Initiative",
        "type": "Tx",
        "rect": [
          335.62,
          662.98,
          371.62,
          696.1
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "MadnessLvl",
        "type": "Tx",
        "rect": [
          401.13,
          681.71,
          425.38,
          701.83
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AC_Temp",
        "type": "Tx",
        "rect": [
          282.88,
          663.07,
          312.35,
          686.43
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ProfBonus",
        "type": "Tx",
        "rect": [
          96.7,
          652.21,
          117.94,
          668.77
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 1",
        "type": "Tx",
        "rect": [
          405.04,
          644.25,
          485.94,
          659.78
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 1",
        "type": "Btn",
        "rect": [
          494.73,
          647.15,
          501.27,
          655.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 1",
        "type": "Btn",
        "rect": [
          501.86,
          647.15,
          508.39,
          655.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 1",
        "type": "Btn",
        "rect": [
          509.36,
          647.4,
          515.89,
          655.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 1",
        "type": "Tx",
        "rect": [
          526.83,
          644.25,
          544.21,
          659.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 1",
        "type": "Tx",
        "rect": [
          547.68,
          644.37,
          565.07,
          659.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "STR",
        "type": "Tx",
        "rect": [
          46.17,
          638.28,
          69.02,
          651.44
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 2",
        "type": "Tx",
        "rect": [
          405.11,
          625.5,
          486.02,
          641.03
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "STRprof",
        "type": "Btn",
        "rect": [
          99.26,
          623.14,
          106.35,
          630.23
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ST Strength",
        "type": "Tx",
        "rect": [
          110.71,
          622.74,
          126.3,
          631.24
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HPMax",
        "type": "Tx",
        "rect": [
          225.34,
          599.57,
          258.96,
          630.73
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HPCurrent",
        "type": "Tx",
        "rect": [
          280.1,
          623.04,
          373.75,
          638
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 2",
        "type": "Btn",
        "rect": [
          494.81,
          628.4,
          501.34,
          636.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 2",
        "type": "Btn",
        "rect": [
          501.93,
          628.4,
          508.46,
          636.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 2",
        "type": "Btn",
        "rect": [
          509.43,
          628.65,
          515.96,
          636.88
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 2",
        "type": "Tx",
        "rect": [
          526.9,
          625.5,
          544.28,
          640.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 2",
        "type": "Tx",
        "rect": [
          547.76,
          625.62,
          565.14,
          639.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "DEXmod",
        "type": "Tx",
        "rect": [
          36.21,
          585.93,
          78.36,
          614.24
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ST Dexterity",
        "type": "Tx",
        "rect": [
          110.71,
          609.22,
          126.3,
          617.73
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 3",
        "type": "Tx",
        "rect": [
          405.11,
          606,
          486.02,
          621.53
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 3",
        "type": "Btn",
        "rect": [
          494.81,
          608.9,
          501.34,
          617.13
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 3",
        "type": "Btn",
        "rect": [
          501.93,
          608.9,
          508.46,
          617.13
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 3",
        "type": "Btn",
        "rect": [
          509.43,
          609.15,
          515.96,
          617.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 3",
        "type": "Tx",
        "rect": [
          526.9,
          606,
          544.28,
          621.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 3",
        "type": "Tx",
        "rect": [
          547.76,
          606.12,
          565.14,
          621.41
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "DEX",
        "type": "Tx",
        "rect": [
          46.17,
          568.41,
          69.02,
          581.57
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "DEXprof",
        "type": "Btn",
        "rect": [
          99.26,
          610.28,
          106.35,
          617.37
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "CONprof",
        "type": "Btn",
        "rect": [
          99.26,
          597.1,
          106.35,
          604.19
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INTprof",
        "type": "Btn",
        "rect": [
          99.26,
          583.95,
          106.35,
          591.03
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "WISprof",
        "type": "Btn",
        "rect": [
          99.26,
          570.49,
          106.35,
          577.58
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "CHAprof",
        "type": "Btn",
        "rect": [
          99.26,
          557.68,
          106.35,
          564.77
        ],
        "multiLine": false,
        "fontSize": 5,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ST Constitution",
        "type": "Tx",
        "rect": [
          110.71,
          596.75,
          126.3,
          605.25
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HPTemp",
        "type": "Tx",
        "rect": [
          279.46,
          595.02,
          373.75,
          608.71
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ST Intelligence",
        "type": "Tx",
        "rect": [
          110.71,
          583.21,
          126.3,
          591.72
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ST Wisdom",
        "type": "Tx",
        "rect": [
          110.71,
          569.68,
          126.3,
          578.18
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 12",
        "type": "Btn",
        "rect": [
          279.74,
          565.21,
          289.09,
          577.44
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ST Charisma",
        "type": "Tx",
        "rect": [
          110.71,
          557.28,
          126.3,
          565.79
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 4",
        "type": "Tx",
        "rect": [
          404.86,
          587.25,
          485.77,
          602.78
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 4",
        "type": "Btn",
        "rect": [
          494.56,
          590.15,
          501.09,
          598.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 4",
        "type": "Btn",
        "rect": [
          501.68,
          590.15,
          508.21,
          598.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 4",
        "type": "Btn",
        "rect": [
          509.18,
          590.4,
          515.71,
          598.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 4",
        "type": "Tx",
        "rect": [
          526.65,
          587.25,
          544.03,
          602.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 4",
        "type": "Tx",
        "rect": [
          547.51,
          587.37,
          564.89,
          602.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Exhaustion",
        "type": "Tx",
        "rect": [
          227.28,
          542.58,
          263.28,
          575.7
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Speed",
        "type": "Tx",
        "rect": [
          337.26,
          542.29,
          373.26,
          575.41
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 5",
        "type": "Tx",
        "rect": [
          405.11,
          568.25,
          486.02,
          583.78
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 5",
        "type": "Btn",
        "rect": [
          494.81,
          571.15,
          501.34,
          579.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 5",
        "type": "Btn",
        "rect": [
          501.93,
          571.15,
          508.46,
          579.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 5",
        "type": "Btn",
        "rect": [
          509.43,
          571.4,
          515.96,
          579.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 5",
        "type": "Tx",
        "rect": [
          526.9,
          568.25,
          544.28,
          583.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 5",
        "type": "Tx",
        "rect": [
          547.76,
          568.37,
          565.14,
          583.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Vision",
        "type": "Tx",
        "rect": [
          282.32,
          541.3,
          318.32,
          566.14
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Limited Feat 6",
        "type": "Tx",
        "rect": [
          405.11,
          549.25,
          486.02,
          564.78
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RecoverySR 6",
        "type": "Btn",
        "rect": [
          494.81,
          552.15,
          501.34,
          560.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryLR 6",
        "type": "Btn",
        "rect": [
          501.93,
          552.15,
          508.46,
          560.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RecoveryDN 6",
        "type": "Btn",
        "rect": [
          509.43,
          552.4,
          515.96,
          560.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "FeatTot 6",
        "type": "Tx",
        "rect": [
          526.9,
          549.25,
          544.28,
          564.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "FeatLeft 6",
        "type": "Tx",
        "rect": [
          547.76,
          549.37,
          565.14,
          564.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "CONmod",
        "type": "Tx",
        "rect": [
          36.21,
          515.77,
          78.36,
          544.09
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "INT",
        "type": "Tx",
        "rect": [
          46.17,
          428.84,
          69.02,
          442
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ACROPE",
        "type": "Btn",
        "rect": [
          96.65,
          516.36,
          102.28,
          522.64
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ACROP",
        "type": "Btn",
        "rect": [
          102.47,
          515.2,
          108.59,
          523.89
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ACRO",
        "type": "Tx",
        "rect": [
          110.55,
          516.4,
          124.72,
          525.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ANIMP",
        "type": "Btn",
        "rect": [
          102.47,
          501.59,
          108.59,
          510.28
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ANIM",
        "type": "Tx",
        "rect": [
          110.55,
          503.19,
          124.72,
          511.7
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HD",
        "type": "Tx",
        "rect": [
          229.75,
          505.16,
          243.93,
          516.5
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HDTotal",
        "type": "Tx",
        "rect": [
          251.26,
          505.4,
          265.44,
          516.74
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HDLeft",
        "type": "Tx",
        "rect": [
          272.57,
          504.99,
          286.75,
          516.33
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 120000",
        "type": "Btn",
        "rect": [
          338.97,
          507.8,
          348.32,
          520.03
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 13",
        "type": "Btn",
        "rect": [
          350.85,
          507.8,
          360.13,
          520.03
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 14",
        "type": "Btn",
        "rect": [
          363.81,
          507.8,
          373.09,
          520.03
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Testo2",
        "type": "Tx",
        "rect": [
          400.06,
          439.31,
          568.88,
          525.86
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ANIMPE",
        "type": "Btn",
        "rect": [
          96.52,
          502.88,
          102.15,
          509.17
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ARCPE",
        "type": "Btn",
        "rect": [
          96.77,
          488.3,
          102.4,
          494.59
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ARCP",
        "type": "Btn",
        "rect": [
          102.47,
          487.05,
          108.59,
          495.74
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ARC",
        "type": "Tx",
        "rect": [
          110.55,
          488.66,
          124.72,
          497.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HD2",
        "type": "Tx",
        "rect": [
          230.47,
          488.52,
          244.65,
          499.86
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HDTotal2",
        "type": "Tx",
        "rect": [
          251.01,
          488.63,
          265.19,
          499.96
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HDLeft2",
        "type": "Tx",
        "rect": [
          272.38,
          488.91,
          286.55,
          500.25
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 15",
        "type": "Btn",
        "rect": [
          338.97,
          492.71,
          348.25,
          504.94
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 16",
        "type": "Btn",
        "rect": [
          350.87,
          492.71,
          360.15,
          504.94
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 17",
        "type": "Btn",
        "rect": [
          363.77,
          492.71,
          373.05,
          504.94
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ATHPE",
        "type": "Btn",
        "rect": [
          96.61,
          476.05,
          102.23,
          482.34
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ATHP",
        "type": "Btn",
        "rect": [
          102.47,
          474.7,
          108.59,
          483.39
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ATH",
        "type": "Tx",
        "rect": [
          110.55,
          475.19,
          124.72,
          483.7
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "STLTHPE",
        "type": "Btn",
        "rect": [
          96.69,
          462.63,
          102.32,
          468.92
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "STLTHP",
        "type": "Btn",
        "rect": [
          102.47,
          461.37,
          108.59,
          470.06
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "STLTH",
        "type": "Tx",
        "rect": [
          110.55,
          461.66,
          124.72,
          470.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "INVPE",
        "type": "Btn",
        "rect": [
          96.77,
          449.13,
          102.4,
          455.42
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INVP",
        "type": "Btn",
        "rect": [
          102.47,
          447.83,
          108.59,
          456.52
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INV",
        "type": "Tx",
        "rect": [
          110.55,
          448.12,
          124.72,
          456.62
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "INTmod",
        "type": "Tx",
        "rect": [
          36.21,
          445.59,
          78.36,
          473.9
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "DECPE",
        "type": "Btn",
        "rect": [
          96.85,
          435.38,
          102.48,
          441.67
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "DECP",
        "type": "Btn",
        "rect": [
          102.47,
          434.07,
          108.59,
          442.76
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "DEC",
        "type": "Tx",
        "rect": [
          110.55,
          434.66,
          124.72,
          443.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name",
        "type": "Tx",
        "rect": [
          218.27,
          435.96,
          280.63,
          450
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn1 AtkBonus",
        "type": "Tx",
        "rect": [
          285.67,
          435.71,
          315.55,
          449.75
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn1 Damage",
        "type": "Tx",
        "rect": [
          320.67,
          435.71,
          381.51,
          449.75
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "INTIPE",
        "type": "Btn",
        "rect": [
          96.77,
          422.29,
          102.4,
          428.58
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INTIP",
        "type": "Btn",
        "rect": [
          102.47,
          420.9,
          108.59,
          429.59
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INTI",
        "type": "Tx",
        "rect": [
          110.55,
          421.36,
          124.72,
          429.86
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name 2",
        "type": "Tx",
        "rect": [
          218.27,
          417.55,
          280.63,
          431.59
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn2 AtkBonus ",
        "type": "Tx",
        "rect": [
          285.67,
          417.55,
          315.55,
          431.59
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn2 Damage ",
        "type": "Tx",
        "rect": [
          320.67,
          417.55,
          381.51,
          431.59
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PERFPE",
        "type": "Btn",
        "rect": [
          96.85,
          408.63,
          102.48,
          414.92
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "PERFP",
        "type": "Btn",
        "rect": [
          102.47,
          407.37,
          108.59,
          416.06
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "PERF",
        "type": "Tx",
        "rect": [
          110.55,
          408.58,
          124.72,
          417.09
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name 3",
        "type": "Tx",
        "rect": [
          218.27,
          399.67,
          280.63,
          413.71
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn3 AtkBonus  ",
        "type": "Tx",
        "rect": [
          286.09,
          399.67,
          315.55,
          413.71
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn3 Damage ",
        "type": "Tx",
        "rect": [
          320.67,
          399.67,
          381.51,
          413.71
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Testo3",
        "type": "Tx",
        "rect": [
          399.22,
          42.8,
          569.72,
          415.44
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "INSPE",
        "type": "Btn",
        "rect": [
          96.81,
          396,
          102.44,
          402.29
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INSP",
        "type": "Btn",
        "rect": [
          102.47,
          394.83,
          108.59,
          403.52
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "INS",
        "type": "Tx",
        "rect": [
          110.55,
          395.19,
          124.72,
          403.7
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "MEDPE",
        "type": "Btn",
        "rect": [
          96.85,
          381.38,
          102.48,
          387.67
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "MEDP",
        "type": "Btn",
        "rect": [
          102.47,
          380.13,
          108.59,
          388.82
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "MED",
        "type": "Tx",
        "rect": [
          110.55,
          381.58,
          124.72,
          390.09
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name 4",
        "type": "Tx",
        "rect": [
          218.22,
          381.25,
          280.63,
          395.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn4 AtkBonus",
        "type": "Tx",
        "rect": [
          285.26,
          381.25,
          315.14,
          395.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn4 Damage",
        "type": "Tx",
        "rect": [
          320.26,
          381.25,
          381.11,
          395.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "NATPE",
        "type": "Btn",
        "rect": [
          96.77,
          367.8,
          102.4,
          374.09
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "NATP",
        "type": "Btn",
        "rect": [
          102.47,
          366.62,
          108.59,
          375.31
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "NAT",
        "type": "Tx",
        "rect": [
          110.55,
          368.12,
          124.72,
          376.62
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name 5",
        "type": "Tx",
        "rect": [
          218.22,
          363.25,
          280.63,
          377.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn5 AtkBonus",
        "type": "Tx",
        "rect": [
          285.26,
          363.25,
          315.14,
          377.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "CON",
        "type": "Tx",
        "rect": [
          46.17,
          499.01,
          69.02,
          512.17
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WIS",
        "type": "Tx",
        "rect": [
          46.17,
          358.41,
          69.02,
          371.57
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn5 Damage",
        "type": "Tx",
        "rect": [
          320.26,
          363.25,
          381.11,
          377.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PERCPE",
        "type": "Btn",
        "rect": [
          96.9,
          355.17,
          102.53,
          361.46
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "PERCP",
        "type": "Btn",
        "rect": [
          102.47,
          354.04,
          108.59,
          362.73
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "PERC",
        "type": "Tx",
        "rect": [
          110.55,
          354.66,
          124.72,
          363.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PERSPE",
        "type": "Btn",
        "rect": [
          96.85,
          342.05,
          102.48,
          348.34
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "PERSP",
        "type": "Btn",
        "rect": [
          102.47,
          340.59,
          108.59,
          349.28
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "WISmod",
        "type": "Tx",
        "rect": [
          36.21,
          376.87,
          78.36,
          405.18
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PERS",
        "type": "Tx",
        "rect": [
          110.55,
          342.12,
          124.72,
          350.62
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn Name 6",
        "type": "Tx",
        "rect": [
          218.19,
          345.25,
          280.59,
          359.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn6 AtkBonus",
        "type": "Tx",
        "rect": [
          285.23,
          345.25,
          315.11,
          359.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Wpn6 Damage",
        "type": "Tx",
        "rect": [
          320.23,
          345.25,
          381.06,
          359.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SLEPE",
        "type": "Btn",
        "rect": [
          96.85,
          329.63,
          102.48,
          335.92
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SLEP",
        "type": "Btn",
        "rect": [
          102.47,
          328.05,
          108.59,
          336.74
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SLE",
        "type": "Tx",
        "rect": [
          110.55,
          328.66,
          124.72,
          337.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "RELPE",
        "type": "Btn",
        "rect": [
          96.9,
          317.08,
          102.53,
          323.37
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "RELP",
        "type": "Btn",
        "rect": [
          101.82,
          315.58,
          108.59,
          323.61
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "REL",
        "type": "Tx",
        "rect": [
          110.55,
          316.19,
          124.72,
          324.7
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Ammo 1",
        "type": "Tx",
        "rect": [
          219.41,
          318,
          270.32,
          332.04
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AmmoLeft 1",
        "type": "Tx",
        "rect": [
          274.95,
          318.25,
          293.58,
          332.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SURVPE",
        "type": "Btn",
        "rect": [
          96.85,
          300.55,
          102.48,
          306.84
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SURVP",
        "type": "Btn",
        "rect": [
          102.47,
          299.04,
          108.59,
          307.73
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SURV",
        "type": "Tx",
        "rect": [
          110.55,
          299.58,
          124.72,
          308.09
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Ammo 2",
        "type": "Tx",
        "rect": [
          219.79,
          299.62,
          270.69,
          313.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AmmoLeft 2",
        "type": "Tx",
        "rect": [
          275.33,
          299.87,
          293.96,
          313.91
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SpellSaveDC  2",
        "type": "Tx",
        "rect": [
          306.3,
          296.32,
          336.9,
          313.71
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SpellAtkBonus 2",
        "type": "Tx",
        "rect": [
          346.35,
          296.57,
          376.95,
          313.46
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "CHA",
        "type": "Tx",
        "rect": [
          46.17,
          289.27,
          69.02,
          302.43
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HISTPE",
        "type": "Btn",
        "rect": [
          96.93,
          288.05,
          102.56,
          294.34
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "HISTP",
        "type": "Btn",
        "rect": [
          102.47,
          286.55,
          108.59,
          295.24
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "CHAmod",
        "type": "Tx",
        "rect": [
          36.21,
          305.83,
          78.36,
          334.14
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HIST",
        "type": "Tx",
        "rect": [
          110.55,
          286.79,
          124.72,
          295.29
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 8,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Ammo 3",
        "type": "Tx",
        "rect": [
          219.54,
          281.87,
          270.44,
          295.91
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AmmoLeft 3",
        "type": "Tx",
        "rect": [
          275.08,
          282.12,
          293.71,
          296.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Passive",
        "type": "Tx",
        "rect": [
          32.76,
          240.24,
          53.99,
          256.8
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "StealthDisv",
        "type": "Btn",
        "rect": [
          266.06,
          248.7,
          273.34,
          257.68
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ArmorAC",
        "type": "Tx",
        "rect": [
          294.08,
          232.87,
          311.46,
          248.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ArmorDex",
        "type": "Tx",
        "rect": [
          315.44,
          232.62,
          332.81,
          247.91
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ArmorStr",
        "type": "Tx",
        "rect": [
          336.19,
          232.87,
          353.56,
          248.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Shield",
        "type": "Tx",
        "rect": [
          361.44,
          233.62,
          378.81,
          248.91
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ArmorLight",
        "type": "Btn",
        "rect": [
          68.23,
          217.65,
          75.52,
          226.63
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ArmorMed",
        "type": "Btn",
        "rect": [
          95.48,
          217.78,
          102.77,
          226.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "ArmorHea",
        "type": "Btn",
        "rect": [
          127.48,
          217.78,
          134.77,
          226.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Shields",
        "type": "Btn",
        "rect": [
          156.73,
          217.53,
          164.02,
          226.5
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "CP",
        "type": "Tx",
        "rect": [
          225.04,
          209.62,
          254.21,
          227.23
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WpnOth 2",
        "type": "Tx",
        "rect": [
          151.08,
          209.64,
          196.8,
          219.12
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WpnSim",
        "type": "Btn",
        "rect": [
          68.23,
          207.28,
          75.52,
          216.25
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "WpnMar",
        "type": "Btn",
        "rect": [
          95.48,
          206.78,
          102.77,
          215.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "WpnOth 1",
        "type": "Btn",
        "rect": [
          127.48,
          206.78,
          134.77,
          215.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Consum 1",
        "type": "Tx",
        "rect": [
          265.29,
          206.62,
          339.69,
          221.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 1",
        "type": "Tx",
        "rect": [
          349.33,
          206.62,
          378.96,
          221.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WEAPONStype 1",
        "type": "Tx",
        "rect": [
          36.36,
          198.36,
          196.8,
          208.44
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WEAPONStype 2",
        "type": "Tx",
        "rect": [
          36.36,
          187.92,
          196.8,
          198
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SP",
        "type": "Tx",
        "rect": [
          225.04,
          184.67,
          254.21,
          202.27
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Consum 2",
        "type": "Tx",
        "rect": [
          265.54,
          187.5,
          339.94,
          202.03
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 2",
        "type": "Tx",
        "rect": [
          349.58,
          187.5,
          379.21,
          202.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "TOOLS 1",
        "type": "Tx",
        "rect": [
          70.18,
          177.19,
          196.8,
          187.26
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "TOOLS 2",
        "type": "Tx",
        "rect": [
          36.36,
          165.96,
          196.8,
          176.04
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "EP",
        "type": "Tx",
        "rect": [
          225.04,
          158.71,
          254.21,
          176.32
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Consum 3",
        "type": "Tx",
        "rect": [
          265.29,
          168.5,
          339.69,
          183.03
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 3",
        "type": "Tx",
        "rect": [
          349.33,
          168.5,
          378.96,
          183.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "TOOLS 3",
        "type": "Tx",
        "rect": [
          36.36,
          155.65,
          196.8,
          165.73
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Consum 4",
        "type": "Tx",
        "rect": [
          265.79,
          149.25,
          340.19,
          163.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 4",
        "type": "Tx",
        "rect": [
          349.83,
          149.25,
          379.46,
          164.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "GP",
        "type": "Tx",
        "rect": [
          225.04,
          133.76,
          254.21,
          151.36
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Consum 5",
        "type": "Tx",
        "rect": [
          265.79,
          129.75,
          340.19,
          144.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 5",
        "type": "Tx",
        "rect": [
          349.83,
          129.75,
          379.46,
          144.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Languages 1",
        "type": "Tx",
        "rect": [
          32.27,
          124.34,
          200.64,
          134.43
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Languages 2",
        "type": "Tx",
        "rect": [
          31.69,
          113.59,
          200.06,
          123.67
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PP",
        "type": "Tx",
        "rect": [
          225.04,
          108.8,
          254.21,
          126.41
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Consum 6",
        "type": "Tx",
        "rect": [
          265.54,
          110.75,
          339.94,
          125.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "ConsumLeft 6",
        "type": "Tx",
        "rect": [
          349.58,
          110.75,
          379.21,
          125.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AttunedMagic 1",
        "type": "Tx",
        "rect": [
          220.17,
          81.5,
          379.33,
          96.03
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Talenti1",
        "type": "Tx",
        "rect": [
          31,
          42.19,
          198.98,
          95.29
        ],
        "multiLine": true,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AttunedMagic 2",
        "type": "Tx",
        "rect": [
          220.3,
          62.99,
          379.45,
          77.53
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AttunedMagic 3",
        "type": "Tx",
        "rect": [
          220.3,
          44.74,
          379.45,
          59.28
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Armor",
        "type": "Tx",
        "rect": [
          219.29,
          232.62,
          290.19,
          248.16
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      }
    ]
  },
  {
    "pageNumber": 2,
    "width": 595.276,
    "height": 841.89,
    "fields": [
      {
        "name": "AGE",
        "type": "Tx",
        "rect": [
          257.36,
          772.2,
          364.64,
          789.21
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HEIGHT",
        "type": "Tx",
        "rect": [
          367.28,
          772.2,
          459.08,
          789.21
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "WEIGHT",
        "type": "Tx",
        "rect": [
          461.72,
          772.2,
          557,
          789.21
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "CharacterName",
        "type": "Tx",
        "rect": [
          43.93,
          753.14,
          247.67,
          774.02
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "EYES",
        "type": "Tx",
        "rect": [
          257.36,
          746.76,
          364.64,
          763.77
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SKIN",
        "type": "Tx",
        "rect": [
          367.28,
          746.76,
          459.08,
          763.77
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "HAIR",
        "type": "Tx",
        "rect": [
          461.72,
          746.76,
          557,
          763.77
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Image1_af_image",
        "type": "Btn",
        "rect": [
          28.17,
          533.29,
          196.76,
          713.66
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": true
      },
      {
        "name": "Tratti car",
        "type": "Tx",
        "rect": [
          404.65,
          655.05,
          559.65,
          698.62
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SymbolNAME",
        "type": "Tx",
        "rect": [
          227.88,
          671.59,
          370.2,
          688.46
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Image2_af_image",
        "type": "Btn",
        "rect": [
          226.48,
          551.58,
          370.9,
          669.02
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": true
      },
      {
        "name": "Ideali1",
        "type": "Tx",
        "rect": [
          406.35,
          598.92,
          561.34,
          635.37
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "LEgami1",
        "type": "Tx",
        "rect": [
          405.03,
          544.46,
          560.03,
          579.65
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "AppearanceText",
        "type": "Tx",
        "rect": [
          28.35,
          487.06,
          197.22,
          534.19
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Fazione",
        "type": "Tx",
        "rect": [
          213.65,
          426.33,
          384.56,
          535.25
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "DIfetti1",
        "type": "Tx",
        "rect": [
          405.4,
          489.5,
          560.4,
          524.69
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Nemici1",
        "type": "Tx",
        "rect": [
          405.77,
          434.13,
          560.77,
          471.41
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Testo6",
        "type": "Tx",
        "rect": [
          30.13,
          37.1,
          196.05,
          457.57
        ],
        "multiLine": true,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq2",
        "type": "Tx",
        "rect": [
          213.31,
          372.83,
          373.72,
          387.35
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso2",
        "type": "Tx",
        "rect": [
          373.8,
          372.65,
          388.94,
          387.17
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq27",
        "type": "Tx",
        "rect": [
          389.85,
          372.49,
          550.26,
          387.01
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso28",
        "type": "Tx",
        "rect": [
          550.98,
          372.58,
          566.12,
          387.1
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq3",
        "type": "Tx",
        "rect": [
          213.31,
          358.18,
          373.72,
          372.7
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso3",
        "type": "Tx",
        "rect": [
          373.8,
          358.03,
          388.94,
          372.55
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq28",
        "type": "Tx",
        "rect": [
          389.85,
          357.84,
          550.26,
          372.36
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso29",
        "type": "Tx",
        "rect": [
          550.98,
          357.96,
          566.12,
          372.48
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq4",
        "type": "Tx",
        "rect": [
          213.31,
          343.53,
          373.72,
          358.05
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso4",
        "type": "Tx",
        "rect": [
          373.8,
          343.41,
          388.94,
          357.93
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq29",
        "type": "Tx",
        "rect": [
          389.85,
          343.19,
          550.26,
          357.71
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso30",
        "type": "Tx",
        "rect": [
          550.98,
          343.33,
          566.12,
          357.86
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq5",
        "type": "Tx",
        "rect": [
          213.31,
          328.88,
          373.72,
          343.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso5",
        "type": "Tx",
        "rect": [
          373.8,
          328.79,
          388.94,
          343.31
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq30",
        "type": "Tx",
        "rect": [
          389.85,
          328.54,
          550.26,
          343.06
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso31",
        "type": "Tx",
        "rect": [
          550.98,
          328.71,
          566.12,
          343.23
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq6",
        "type": "Tx",
        "rect": [
          213.31,
          314.23,
          373.72,
          328.75
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso6",
        "type": "Tx",
        "rect": [
          373.8,
          314.17,
          388.94,
          328.69
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq31",
        "type": "Tx",
        "rect": [
          389.85,
          313.89,
          550.26,
          328.41
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso32",
        "type": "Tx",
        "rect": [
          550.98,
          314.09,
          566.12,
          328.61
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq7",
        "type": "Tx",
        "rect": [
          213.31,
          299.58,
          373.72,
          314.1
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso7",
        "type": "Tx",
        "rect": [
          373.8,
          299.55,
          388.94,
          314.06
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq32",
        "type": "Tx",
        "rect": [
          389.85,
          299.24,
          550.26,
          313.76
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso33",
        "type": "Tx",
        "rect": [
          550.98,
          299.46,
          566.12,
          313.99
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq8",
        "type": "Tx",
        "rect": [
          213.31,
          284.93,
          373.72,
          299.45
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso8",
        "type": "Tx",
        "rect": [
          373.8,
          284.92,
          388.94,
          299.44
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq33",
        "type": "Tx",
        "rect": [
          389.85,
          284.59,
          550.26,
          299.11
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso34",
        "type": "Tx",
        "rect": [
          550.98,
          284.84,
          566.12,
          299.36
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq9",
        "type": "Tx",
        "rect": [
          213.31,
          270.28,
          373.72,
          284.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso9",
        "type": "Tx",
        "rect": [
          373.8,
          270.3,
          388.94,
          284.82
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq34",
        "type": "Tx",
        "rect": [
          389.85,
          269.94,
          550.26,
          284.46
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso35",
        "type": "Tx",
        "rect": [
          550.98,
          270.22,
          566.12,
          284.74
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq10",
        "type": "Tx",
        "rect": [
          213.31,
          255.63,
          373.72,
          270.15
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso10",
        "type": "Tx",
        "rect": [
          373.8,
          255.68,
          388.94,
          270.2
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq35",
        "type": "Tx",
        "rect": [
          389.85,
          255.29,
          550.26,
          269.81
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso36",
        "type": "Tx",
        "rect": [
          550.98,
          255.6,
          566.12,
          270.12
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq11",
        "type": "Tx",
        "rect": [
          213.31,
          240.98,
          373.72,
          255.5
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso11",
        "type": "Tx",
        "rect": [
          373.8,
          241.06,
          388.94,
          255.58
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq36",
        "type": "Tx",
        "rect": [
          389.85,
          240.64,
          550.26,
          255.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso37",
        "type": "Tx",
        "rect": [
          550.98,
          240.97,
          566.12,
          255.49
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq12",
        "type": "Tx",
        "rect": [
          213.31,
          226.33,
          373.72,
          240.85
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso12",
        "type": "Tx",
        "rect": [
          373.8,
          226.44,
          388.94,
          240.96
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq37",
        "type": "Tx",
        "rect": [
          389.85,
          225.99,
          550.26,
          240.51
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso38",
        "type": "Tx",
        "rect": [
          550.98,
          226.35,
          566.12,
          240.87
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq13",
        "type": "Tx",
        "rect": [
          213.31,
          211.68,
          373.72,
          226.2
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso13",
        "type": "Tx",
        "rect": [
          373.8,
          211.82,
          388.94,
          226.34
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq38",
        "type": "Tx",
        "rect": [
          389.85,
          211.34,
          550.26,
          225.86
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso39",
        "type": "Tx",
        "rect": [
          550.98,
          211.73,
          566.12,
          226.25
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq14",
        "type": "Tx",
        "rect": [
          213.31,
          197.03,
          373.72,
          211.55
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso14",
        "type": "Tx",
        "rect": [
          374.06,
          196.94,
          389.21,
          211.46
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq39",
        "type": "Tx",
        "rect": [
          389.85,
          196.69,
          550.26,
          211.21
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso40",
        "type": "Tx",
        "rect": [
          550.98,
          197.1,
          566.12,
          211.62
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq15",
        "type": "Tx",
        "rect": [
          213.31,
          182.38,
          373.72,
          196.9
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso15",
        "type": "Tx",
        "rect": [
          373.8,
          182.58,
          388.94,
          197.1
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq40",
        "type": "Tx",
        "rect": [
          389.85,
          182.04,
          550.26,
          196.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso41",
        "type": "Tx",
        "rect": [
          550.98,
          182.48,
          566.12,
          197
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq16",
        "type": "Tx",
        "rect": [
          213.31,
          167.73,
          373.72,
          182.25
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso16",
        "type": "Tx",
        "rect": [
          373.8,
          167.96,
          388.94,
          182.48
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq41",
        "type": "Tx",
        "rect": [
          389.85,
          167.39,
          550.26,
          181.91
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso42",
        "type": "Tx",
        "rect": [
          550.98,
          167.86,
          566.12,
          182.38
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq17",
        "type": "Tx",
        "rect": [
          213.31,
          153.08,
          373.72,
          167.6
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso18",
        "type": "Tx",
        "rect": [
          373.8,
          153.16,
          388.94,
          168.03
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq42",
        "type": "Tx",
        "rect": [
          389.85,
          152.75,
          550.26,
          167.26
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso43",
        "type": "Tx",
        "rect": [
          550.98,
          153.24,
          566.12,
          167.75
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq18",
        "type": "Tx",
        "rect": [
          213.31,
          138.43,
          373.72,
          152.95
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso19",
        "type": "Tx",
        "rect": [
          373.8,
          138.72,
          388.94,
          153.24
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq43",
        "type": "Tx",
        "rect": [
          389.85,
          138.09,
          550.26,
          152.62
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso44",
        "type": "Tx",
        "rect": [
          550.98,
          138.61,
          566.12,
          153.13
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq19",
        "type": "Tx",
        "rect": [
          213.31,
          123.78,
          373.72,
          138.31
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso20",
        "type": "Tx",
        "rect": [
          373.8,
          124.1,
          388.94,
          138.62
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq44",
        "type": "Tx",
        "rect": [
          389.85,
          123.44,
          550.26,
          137.97
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso45",
        "type": "Tx",
        "rect": [
          550.98,
          123.99,
          566.12,
          138.51
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq20",
        "type": "Tx",
        "rect": [
          213.31,
          109.14,
          373.72,
          123.66
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso21",
        "type": "Tx",
        "rect": [
          373.8,
          109.48,
          388.94,
          124
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq45",
        "type": "Tx",
        "rect": [
          389.85,
          108.8,
          550.26,
          123.32
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso46",
        "type": "Tx",
        "rect": [
          550.98,
          109.37,
          566.12,
          123.89
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq21",
        "type": "Tx",
        "rect": [
          213.31,
          94.49,
          373.72,
          109
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso22",
        "type": "Tx",
        "rect": [
          373.8,
          94.86,
          388.94,
          109.38
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq46",
        "type": "Tx",
        "rect": [
          389.85,
          94.15,
          550.26,
          108.67
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso47",
        "type": "Tx",
        "rect": [
          550.98,
          94.74,
          566.12,
          109.26
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq22",
        "type": "Tx",
        "rect": [
          213.31,
          79.84,
          373.72,
          94.36
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso23",
        "type": "Tx",
        "rect": [
          373.8,
          80.24,
          388.94,
          94.76
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq47",
        "type": "Tx",
        "rect": [
          389.85,
          79.5,
          550.26,
          94.02
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso48",
        "type": "Tx",
        "rect": [
          550.98,
          80.12,
          566.12,
          94.64
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq23",
        "type": "Tx",
        "rect": [
          213.31,
          65.19,
          373.72,
          79.71
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso24",
        "type": "Tx",
        "rect": [
          373.8,
          65.61,
          388.94,
          80.13
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq24",
        "type": "Tx",
        "rect": [
          213.31,
          50.54,
          373.72,
          65.06
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso25",
        "type": "Tx",
        "rect": [
          373.8,
          50.99,
          388.94,
          65.51
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "eq25",
        "type": "Tx",
        "rect": [
          213.31,
          35.89,
          373.72,
          50.41
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Peso26",
        "type": "Tx",
        "rect": [
          373.8,
          36.37,
          388.94,
          50.89
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PesoMassimo",
        "type": "Tx",
        "rect": [
          525.55,
          30.1,
          547.62,
          50.42
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "PesoTrasportabile",
        "type": "Tx",
        "rect": [
          525.74,
          55.8,
          547.81,
          76.12
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      }
    ]
  },
  {
    "pageNumber": 3,
    "width": 595.276,
    "height": 841.89,
    "fields": [
      {
        "name": "SpellcastingAbility 2",
        "type": "Tx",
        "rect": [
          273.04,
          755.96,
          340.52,
          786.13
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SpellSaveDC  21",
        "type": "Tx",
        "rect": [
          373.33,
          756.49,
          440.81,
          786.66
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SpellAtkBonus 21",
        "type": "Tx",
        "rect": [
          476.65,
          755.96,
          544.13,
          786.13
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Spellcasting Class 2",
        "type": "Tx",
        "rect": [
          39.73,
          750.41,
          252.37,
          777.08
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 21",
        "type": "Tx",
        "rect": [
          233.47,
          665.42,
          272.71,
          686.3
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 21",
        "type": "Tx",
        "rect": [
          284.62,
          665.42,
          377.45,
          686.3
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 24",
        "type": "Tx",
        "rect": [
          418.18,
          665.97,
          457.42,
          686.85
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 24",
        "type": "Tx",
        "rect": [
          469.33,
          665.97,
          562.17,
          686.85
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 1",
        "type": "Tx",
        "rect": [
          27.72,
          645.84,
          196.68,
          660.36
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "1_12",
        "type": "Tx",
        "rect": [
          222.52,
          644.4,
          382.93,
          658.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "1_15",
        "type": "Tx",
        "rect": [
          406.77,
          644.4,
          567.35,
          658.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 2",
        "type": "Tx",
        "rect": [
          27.72,
          630.96,
          196.68,
          645.48
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 251011",
        "type": "Btn",
        "rect": [
          213.07,
          642.57,
          221.57,
          651.04
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_12",
        "type": "Tx",
        "rect": [
          222.24,
          629.52,
          382.92,
          644.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 2513",
        "type": "Btn",
        "rect": [
          397.07,
          642.94,
          405.57,
          651.41
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_15",
        "type": "Tx",
        "rect": [
          406.56,
          629.52,
          567.36,
          644.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 3",
        "type": "Tx",
        "rect": [
          27.72,
          616.08,
          196.68,
          630.6
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25111",
        "type": "Btn",
        "rect": [
          213.07,
          627.21,
          221.57,
          635.68
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_12",
        "type": "Tx",
        "rect": [
          222.24,
          614.64,
          382.92,
          629.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3093",
        "type": "Btn",
        "rect": [
          397.07,
          628.96,
          405.57,
          637.43
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_15",
        "type": "Tx",
        "rect": [
          406.56,
          614.64,
          567.36,
          629.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 4",
        "type": "Tx",
        "rect": [
          27.72,
          601.2,
          196.68,
          615.72
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3099",
        "type": "Btn",
        "rect": [
          213.07,
          613.23,
          221.57,
          621.7
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_8",
        "type": "Tx",
        "rect": [
          222.24,
          599.76,
          382.92,
          614.28
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30103",
        "type": "Btn",
        "rect": [
          397.07,
          613.97,
          405.57,
          622.45
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_11",
        "type": "Tx",
        "rect": [
          406.56,
          599.76,
          567.36,
          614.28
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 5",
        "type": "Tx",
        "rect": [
          27.72,
          586.32,
          196.68,
          600.84
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30109",
        "type": "Btn",
        "rect": [
          213.07,
          598.24,
          221.57,
          606.72
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_7",
        "type": "Tx",
        "rect": [
          222.24,
          584.88,
          382.92,
          599.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30113",
        "type": "Btn",
        "rect": [
          397.07,
          598.99,
          405.57,
          607.46
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_10",
        "type": "Tx",
        "rect": [
          406.56,
          584.88,
          567.36,
          599.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 6",
        "type": "Tx",
        "rect": [
          27.72,
          571.44,
          196.68,
          585.96
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30119",
        "type": "Btn",
        "rect": [
          213.07,
          583.26,
          221.57,
          591.73
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_6",
        "type": "Tx",
        "rect": [
          222.24,
          570,
          382.92,
          584.52
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30123",
        "type": "Btn",
        "rect": [
          397.07,
          584,
          405.57,
          592.48
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_9",
        "type": "Tx",
        "rect": [
          406.56,
          570,
          567.36,
          584.52
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 7",
        "type": "Tx",
        "rect": [
          27.72,
          556.56,
          196.68,
          571.08
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30129",
        "type": "Btn",
        "rect": [
          213.07,
          568.27,
          221.57,
          576.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_6",
        "type": "Tx",
        "rect": [
          222.24,
          555.12,
          382.92,
          569.64
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30133",
        "type": "Btn",
        "rect": [
          397.07,
          569.02,
          405.57,
          577.49
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_9",
        "type": "Tx",
        "rect": [
          406.56,
          555.12,
          567.36,
          569.64
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "0 8",
        "type": "Tx",
        "rect": [
          27.72,
          541.68,
          196.68,
          556.2
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30139",
        "type": "Btn",
        "rect": [
          213.07,
          553.29,
          221.57,
          561.76
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "8_6",
        "type": "Tx",
        "rect": [
          222.24,
          540.24,
          382.92,
          554.76
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30143",
        "type": "Btn",
        "rect": [
          397.07,
          554.03,
          405.57,
          562.51
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 30149",
        "type": "Btn",
        "rect": [
          213.07,
          538.3,
          221.57,
          546.78
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "8_9",
        "type": "Tx",
        "rect": [
          406.56,
          540.24,
          567.36,
          554.76
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "9_6",
        "type": "Tx",
        "rect": [
          222.24,
          525.36,
          382.92,
          539.88
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30153",
        "type": "Btn",
        "rect": [
          397.07,
          540.05,
          405.57,
          548.52
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 30159",
        "type": "Btn",
        "rect": [
          213.07,
          524.32,
          221.57,
          532.79
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "9_9",
        "type": "Tx",
        "rect": [
          406.56,
          525.36,
          567.36,
          539.88
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "10_6",
        "type": "Tx",
        "rect": [
          222.24,
          510.48,
          382.92,
          525
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30163",
        "type": "Btn",
        "rect": [
          397.07,
          525.07,
          405.57,
          533.54
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 30169",
        "type": "Btn",
        "rect": [
          213.07,
          509.34,
          221.57,
          517.81
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 19",
        "type": "Tx",
        "rect": [
          47.06,
          487.02,
          86.3,
          507.9
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 19",
        "type": "Tx",
        "rect": [
          98.21,
          487.02,
          191.05,
          507.9
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30179",
        "type": "Btn",
        "rect": [
          213.07,
          494.35,
          221.57,
          502.83
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "11_6",
        "type": "Tx",
        "rect": [
          222.24,
          495.6,
          382.92,
          510.12
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 25",
        "type": "Tx",
        "rect": [
          417.21,
          485.49,
          456.45,
          506.37
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 25",
        "type": "Tx",
        "rect": [
          468.36,
          485.49,
          561.2,
          506.37
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30189",
        "type": "Btn",
        "rect": [
          213.07,
          479.37,
          221.57,
          487.84
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "12_6",
        "type": "Tx",
        "rect": [
          222.24,
          480.72,
          382.92,
          495.24
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 2510",
        "type": "Btn",
        "rect": [
          26.51,
          463.11,
          35.02,
          471.58
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 111",
        "type": "Tx",
        "rect": [
          36.85,
          464.09,
          197.01,
          478.61
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30199",
        "type": "Btn",
        "rect": [
          213.07,
          464.38,
          221.57,
          472.86
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "13_6",
        "type": "Tx",
        "rect": [
          222.24,
          465.84,
          382.92,
          480.36
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 2516",
        "type": "Btn",
        "rect": [
          397.07,
          461.94,
          405.57,
          470.41
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_16",
        "type": "Tx",
        "rect": [
          406.77,
          464.04,
          567.35,
          478.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25100",
        "type": "Btn",
        "rect": [
          26.51,
          447.75,
          35.02,
          456.23
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 1",
        "type": "Tx",
        "rect": [
          36,
          449.16,
          196.68,
          463.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3096",
        "type": "Btn",
        "rect": [
          397.07,
          447.95,
          405.57,
          456.43
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_16",
        "type": "Tx",
        "rect": [
          406.56,
          449.16,
          567.36,
          463.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30900",
        "type": "Btn",
        "rect": [
          26.51,
          433.77,
          35.02,
          442.24
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 2",
        "type": "Tx",
        "rect": [
          36,
          434.28,
          196.68,
          448.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 22",
        "type": "Tx",
        "rect": [
          233.05,
          425.81,
          272.29,
          446.69
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 22",
        "type": "Tx",
        "rect": [
          284.2,
          425.81,
          377.04,
          446.69
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30106",
        "type": "Btn",
        "rect": [
          397.07,
          432.97,
          405.57,
          441.44
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_16",
        "type": "Tx",
        "rect": [
          406.56,
          434.28,
          567.36,
          448.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301000",
        "type": "Btn",
        "rect": [
          26.51,
          418.78,
          35.02,
          427.26
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 3",
        "type": "Tx",
        "rect": [
          36,
          419.4,
          196.68,
          433.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30116",
        "type": "Btn",
        "rect": [
          397.07,
          417.99,
          405.57,
          426.46
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_12",
        "type": "Tx",
        "rect": [
          406.56,
          419.4,
          567.36,
          433.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301100",
        "type": "Btn",
        "rect": [
          26.51,
          403.8,
          35.02,
          412.27
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 4",
        "type": "Tx",
        "rect": [
          36,
          404.52,
          196.68,
          419.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25102",
        "type": "Btn",
        "rect": [
          213.07,
          403.57,
          221.57,
          412.05
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_13",
        "type": "Tx",
        "rect": [
          222.52,
          404.64,
          382.93,
          419.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30126",
        "type": "Btn",
        "rect": [
          397.07,
          403,
          405.57,
          411.48
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_11",
        "type": "Tx",
        "rect": [
          406.56,
          404.52,
          567.36,
          419.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301200",
        "type": "Btn",
        "rect": [
          26.51,
          388.81,
          35.02,
          397.29
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 5",
        "type": "Tx",
        "rect": [
          36,
          389.64,
          196.68,
          404.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 2512",
        "type": "Btn",
        "rect": [
          213.07,
          388.21,
          221.57,
          396.69
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_13",
        "type": "Tx",
        "rect": [
          222.24,
          389.76,
          382.92,
          404.28
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30136",
        "type": "Btn",
        "rect": [
          397.07,
          388.02,
          405.57,
          396.49
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_10",
        "type": "Tx",
        "rect": [
          406.56,
          389.64,
          567.36,
          404.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301300",
        "type": "Btn",
        "rect": [
          26.51,
          373.83,
          35.02,
          382.3
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 6",
        "type": "Tx",
        "rect": [
          36,
          374.76,
          196.68,
          389.28
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3092",
        "type": "Btn",
        "rect": [
          213.07,
          374.23,
          221.57,
          382.7
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_13",
        "type": "Tx",
        "rect": [
          222.24,
          374.88,
          382.92,
          389.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30146",
        "type": "Btn",
        "rect": [
          397.07,
          373.03,
          405.57,
          381.51
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_10",
        "type": "Tx",
        "rect": [
          406.56,
          374.76,
          567.36,
          389.28
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301400",
        "type": "Btn",
        "rect": [
          26.51,
          358.85,
          35.02,
          367.32
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 7",
        "type": "Tx",
        "rect": [
          36,
          359.88,
          196.68,
          374.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30102",
        "type": "Btn",
        "rect": [
          213.07,
          359.24,
          221.57,
          367.72
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_9",
        "type": "Tx",
        "rect": [
          222.24,
          360,
          382.92,
          374.52
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30156",
        "type": "Btn",
        "rect": [
          397.07,
          359.05,
          405.57,
          367.52
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "8_10",
        "type": "Tx",
        "rect": [
          406.56,
          359.88,
          567.36,
          374.4
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301500",
        "type": "Btn",
        "rect": [
          26.51,
          344.86,
          35.02,
          353.33
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 8",
        "type": "Tx",
        "rect": [
          36,
          345,
          196.68,
          359.52
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30112",
        "type": "Btn",
        "rect": [
          213.07,
          344.26,
          221.57,
          352.73
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_8",
        "type": "Tx",
        "rect": [
          222.24,
          345.12,
          382.92,
          359.64
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30166",
        "type": "Btn",
        "rect": [
          397.07,
          344.07,
          405.57,
          352.54
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "9_10",
        "type": "Tx",
        "rect": [
          406.56,
          345,
          567.36,
          359.52
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301600",
        "type": "Btn",
        "rect": [
          26.51,
          329.88,
          35.02,
          338.35
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 9",
        "type": "Tx",
        "rect": [
          36,
          330.12,
          196.68,
          344.64
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "6_7",
        "type": "Tx",
        "rect": [
          222.24,
          330.24,
          382.92,
          344.76
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3017",
        "type": "Btn",
        "rect": [
          26.51,
          314.89,
          35.02,
          323.37
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 10",
        "type": "Tx",
        "rect": [
          36,
          315.24,
          196.68,
          329.76
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30122",
        "type": "Btn",
        "rect": [
          213.07,
          329.27,
          221.57,
          337.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 30132",
        "type": "Btn",
        "rect": [
          213.07,
          314.29,
          221.57,
          322.76
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_7",
        "type": "Tx",
        "rect": [
          222.24,
          315.36,
          382.92,
          329.88
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 191",
        "type": "Tx",
        "rect": [
          417.93,
          303.96,
          457.17,
          324.84
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 26",
        "type": "Tx",
        "rect": [
          469.08,
          303.96,
          561.92,
          324.84
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3018",
        "type": "Btn",
        "rect": [
          26.51,
          299.91,
          35.02,
          308.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 11",
        "type": "Tx",
        "rect": [
          36,
          300.36,
          196.68,
          314.88
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "8_7",
        "type": "Tx",
        "rect": [
          222.24,
          300.48,
          382.92,
          315
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3019",
        "type": "Btn",
        "rect": [
          26.51,
          284.92,
          35.02,
          293.4
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SPELL NAME 12",
        "type": "Tx",
        "rect": [
          36,
          285.48,
          196.68,
          300
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30142",
        "type": "Btn",
        "rect": [
          213.07,
          299.31,
          221.57,
          307.78
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 30152",
        "type": "Btn",
        "rect": [
          213.07,
          285.32,
          221.57,
          293.8
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "9_7",
        "type": "Tx",
        "rect": [
          222.24,
          285.6,
          382.92,
          300.12
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "10_7",
        "type": "Tx",
        "rect": [
          222.24,
          270.72,
          382.92,
          285.24
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25161",
        "type": "Btn",
        "rect": [
          397.07,
          283.42,
          405.57,
          291.89
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_17",
        "type": "Tx",
        "rect": [
          406.77,
          283.56,
          567.35,
          298.08
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30162",
        "type": "Btn",
        "rect": [
          213.07,
          270.34,
          221.57,
          278.81
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "11_7",
        "type": "Tx",
        "rect": [
          222.24,
          255.84,
          382.92,
          270.36
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30961",
        "type": "Btn",
        "rect": [
          397.07,
          268.43,
          405.57,
          276.9
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_17",
        "type": "Tx",
        "rect": [
          406.56,
          268.68,
          567.36,
          283.2
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 20",
        "type": "Tx",
        "rect": [
          46.43,
          242.77,
          85.67,
          265.33
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 20",
        "type": "Tx",
        "rect": [
          97.58,
          244.45,
          190.41,
          265.33
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30172",
        "type": "Btn",
        "rect": [
          213.07,
          255.35,
          221.57,
          263.83
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "12_7",
        "type": "Tx",
        "rect": [
          222.24,
          240.96,
          382.92,
          255.48
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301061",
        "type": "Btn",
        "rect": [
          397.07,
          253.45,
          405.57,
          261.92
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_17",
        "type": "Tx",
        "rect": [
          406.56,
          253.8,
          567.36,
          268.32
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30182",
        "type": "Btn",
        "rect": [
          213.07,
          240.37,
          221.57,
          248.84
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "13_7",
        "type": "Tx",
        "rect": [
          222.24,
          226.08,
          382.92,
          240.6
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301161",
        "type": "Btn",
        "rect": [
          397.07,
          238.46,
          405.57,
          246.94
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_13",
        "type": "Tx",
        "rect": [
          406.56,
          238.8,
          567.36,
          253.32
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25101",
        "type": "Btn",
        "rect": [
          27.07,
          222.13,
          35.57,
          230.6
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_11",
        "type": "Tx",
        "rect": [
          36.85,
          223.2,
          197.01,
          237.72
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30192",
        "type": "Btn",
        "rect": [
          213.07,
          225.38,
          221.57,
          233.86
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 301261",
        "type": "Btn",
        "rect": [
          397.07,
          223.48,
          405.57,
          231.95
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_12",
        "type": "Tx",
        "rect": [
          406.56,
          223.92,
          567.36,
          238.44
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 2511",
        "type": "Btn",
        "rect": [
          27.07,
          206.77,
          35.57,
          215.24
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_11",
        "type": "Tx",
        "rect": [
          36,
          208.32,
          196.68,
          222.84
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "3_11",
        "type": "Tx",
        "rect": [
          36,
          193.44,
          196.68,
          207.96
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301361",
        "type": "Btn",
        "rect": [
          397.07,
          208.49,
          405.57,
          216.97
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_11",
        "type": "Tx",
        "rect": [
          406.56,
          209.04,
          567.36,
          223.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3091",
        "type": "Btn",
        "rect": [
          27.07,
          192.78,
          35.57,
          201.26
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 23",
        "type": "Tx",
        "rect": [
          233.13,
          183.19,
          272.38,
          206.59
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 23",
        "type": "Tx",
        "rect": [
          284.29,
          185.71,
          377.12,
          206.59
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301461",
        "type": "Btn",
        "rect": [
          397.07,
          193.51,
          405.57,
          201.98
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_11",
        "type": "Tx",
        "rect": [
          406.56,
          194.16,
          567.36,
          208.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30101",
        "type": "Btn",
        "rect": [
          27.07,
          177.8,
          35.57,
          186.27
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_7",
        "type": "Tx",
        "rect": [
          36,
          178.56,
          196.68,
          193.08
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30111",
        "type": "Btn",
        "rect": [
          27.07,
          162.81,
          35.57,
          171.29
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_6",
        "type": "Tx",
        "rect": [
          36,
          163.68,
          196.68,
          178.2
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 25123",
        "type": "Btn",
        "rect": [
          213.07,
          162.21,
          221.57,
          170.69
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_14",
        "type": "Tx",
        "rect": [
          222.52,
          163.8,
          382.93,
          178.32
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsTotal 27",
        "type": "Tx",
        "rect": [
          417.18,
          152.8,
          457.68,
          177.46
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "SlotsRemaining 27",
        "type": "Tx",
        "rect": [
          469.17,
          154.9,
          562,
          175.78
        ],
        "multiLine": false,
        "align": 1,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30121",
        "type": "Btn",
        "rect": [
          27.07,
          147.83,
          35.57,
          156.31
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_5",
        "type": "Tx",
        "rect": [
          36,
          148.8,
          196.68,
          163.32
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30923",
        "type": "Btn",
        "rect": [
          213.07,
          148.23,
          221.57,
          156.7
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_14",
        "type": "Tx",
        "rect": [
          222.24,
          148.92,
          382.92,
          163.44
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30131",
        "type": "Btn",
        "rect": [
          27.07,
          132.85,
          35.57,
          141.32
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_5",
        "type": "Tx",
        "rect": [
          36,
          133.92,
          196.68,
          148.44
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301023",
        "type": "Btn",
        "rect": [
          213.07,
          133.24,
          221.57,
          141.72
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_14",
        "type": "Tx",
        "rect": [
          222.24,
          134.04,
          382.92,
          148.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "8_5",
        "type": "Tx",
        "rect": [
          36,
          119.04,
          196.68,
          133.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "4_10",
        "type": "Tx",
        "rect": [
          222.24,
          119.16,
          382.92,
          133.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 251",
        "type": "Btn",
        "rect": [
          397.07,
          133.43,
          405.57,
          141.91
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "1_18",
        "type": "Tx",
        "rect": [
          406.77,
          133.92,
          567.35,
          148.44
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30141",
        "type": "Btn",
        "rect": [
          27.07,
          117.86,
          35.57,
          126.34
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "9_5",
        "type": "Tx",
        "rect": [
          36,
          104.16,
          196.68,
          118.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301123",
        "type": "Btn",
        "rect": [
          213.07,
          118.26,
          221.57,
          126.73
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_9",
        "type": "Tx",
        "rect": [
          222.24,
          104.28,
          382.92,
          118.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 309",
        "type": "Btn",
        "rect": [
          397.07,
          118.45,
          405.57,
          126.92
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "2_18",
        "type": "Tx",
        "rect": [
          406.56,
          119.04,
          567.36,
          133.56
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30151",
        "type": "Btn",
        "rect": [
          27.07,
          103.88,
          35.57,
          112.35
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "10_5",
        "type": "Tx",
        "rect": [
          36,
          89.28,
          196.68,
          103.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301223",
        "type": "Btn",
        "rect": [
          213.07,
          103.27,
          221.57,
          111.75
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_8",
        "type": "Tx",
        "rect": [
          222.24,
          89.4,
          382.92,
          103.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3010",
        "type": "Btn",
        "rect": [
          397.07,
          103.46,
          405.57,
          111.94
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "3_18",
        "type": "Tx",
        "rect": [
          406.56,
          104.16,
          567.36,
          118.68
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30161",
        "type": "Btn",
        "rect": [
          27.07,
          88.89,
          35.57,
          97.37
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "11_5",
        "type": "Tx",
        "rect": [
          36,
          74.4,
          196.68,
          88.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301323",
        "type": "Btn",
        "rect": [
          213.07,
          88.29,
          221.57,
          96.76
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_8",
        "type": "Tx",
        "rect": [
          222.24,
          74.52,
          382.92,
          89.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3011",
        "type": "Btn",
        "rect": [
          397.07,
          88.48,
          405.57,
          96.95
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "4_14",
        "type": "Tx",
        "rect": [
          406.56,
          89.28,
          567.36,
          103.8
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30171",
        "type": "Btn",
        "rect": [
          27.07,
          73.91,
          35.57,
          82.38
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "12_5",
        "type": "Tx",
        "rect": [
          36,
          59.52,
          196.68,
          74.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 301423",
        "type": "Btn",
        "rect": [
          213.07,
          73.31,
          221.57,
          81.78
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "8_8",
        "type": "Tx",
        "rect": [
          222.24,
          59.64,
          382.92,
          74.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3012",
        "type": "Btn",
        "rect": [
          397.07,
          73.49,
          405.57,
          81.97
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "5_13",
        "type": "Tx",
        "rect": [
          406.56,
          74.4,
          567.36,
          88.92
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30181",
        "type": "Btn",
        "rect": [
          27.07,
          58.92,
          35.57,
          67.4
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 3015",
        "type": "Btn",
        "rect": [
          213.07,
          59.32,
          221.57,
          67.8
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "9_8",
        "type": "Tx",
        "rect": [
          222.24,
          44.64,
          382.92,
          59.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3013",
        "type": "Btn",
        "rect": [
          397.07,
          58.51,
          405.57,
          66.98
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "6_12",
        "type": "Tx",
        "rect": [
          406.56,
          59.52,
          567.36,
          74.04
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 30191",
        "type": "Btn",
        "rect": [
          27.07,
          43.94,
          35.57,
          52.41
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "13_5",
        "type": "Tx",
        "rect": [
          36,
          44.64,
          196.68,
          59.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      },
      {
        "name": "Check Box 3016",
        "type": "Btn",
        "rect": [
          213.07,
          44.34,
          221.57,
          52.81
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "Check Box 3014",
        "type": "Btn",
        "rect": [
          397.07,
          43.52,
          405.57,
          52
        ],
        "multiLine": false,
        "fontSize": 12,
        "checkBox": true,
        "pushButton": false
      },
      {
        "name": "7_12",
        "type": "Tx",
        "rect": [
          406.56,
          44.64,
          567.36,
          59.16
        ],
        "multiLine": false,
        "align": null,
        "fontSize": 12,
        "checkBox": false,
        "pushButton": false
      }
    ]
  }
];
