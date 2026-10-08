import {
  PDFBool,
  PDFCheckBox,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFString,
  PDFTextField,
} from "pdf-lib";
import {
  ABILITIES,
  SKILLS,
  createEmptyCharacterSheet,
  computeAbilityModifier,
  computeProficiencyBonus,
  getEffectiveAbilityMod,
  getEffectiveProficiencyBonus,
  getEffectiveSavingThrow,
  getEffectiveSkillBonus,
  getEffectivePassivePerception,
  getEffectiveInitiative,
  getEffectiveSpellSaveDC,
  getEffectiveSpellAtkBonus,
  getEffectiveCarriedWeight,
  getEffectiveMaxCarryWeight,
  type CharacterSheetData,
} from "@/types/characterSheet";

/**
 * Mappatura esatta dei campi AcroForm per gli Attacchi (Pagina 1)
 */
export const ATTACK_PDF_FIELDS: {
  name: string;
  atkBonus: string;
  damage: string;
}[] = [
  { name: "Wpn Name", atkBonus: "Wpn1 AtkBonus", damage: "Wpn1 Damage" },
  { name: "Wpn Name 2", atkBonus: "Wpn2 AtkBonus ", damage: "Wpn2 Damage " },
  { name: "Wpn Name 3", atkBonus: "Wpn3 AtkBonus  ", damage: "Wpn3 Damage " },
  { name: "Wpn Name 4", atkBonus: "Wpn4 AtkBonus", damage: "Wpn4 Damage" },
  { name: "Wpn Name 5", atkBonus: "Wpn5 AtkBonus", damage: "Wpn5 Damage" },
  { name: "Wpn Name 6", atkBonus: "Wpn6 AtkBonus", damage: "Wpn6 Damage" },
];

/**
 * Mappatura esatta della Colonna 1 e Colonna 2 dell'Inventario (Pagina 2)
 */
export const INVENTORY_COL1_FIELDS: { nameField: string; weightField: string }[] =
  [
    { nameField: "eq2", weightField: "Peso2" },
    { nameField: "eq3", weightField: "Peso3" },
    { nameField: "eq4", weightField: "Peso4" },
    { nameField: "eq5", weightField: "Peso5" },
    { nameField: "eq6", weightField: "Peso6" },
    { nameField: "eq7", weightField: "Peso7" },
    { nameField: "eq8", weightField: "Peso8" },
    { nameField: "eq9", weightField: "Peso9" },
    { nameField: "eq10", weightField: "Peso10" },
    { nameField: "eq11", weightField: "Peso11" },
    { nameField: "eq12", weightField: "Peso12" },
    { nameField: "eq13", weightField: "Peso13" },
    { nameField: "eq14", weightField: "Peso14" },
    { nameField: "eq15", weightField: "Peso15" },
    { nameField: "eq16", weightField: "Peso16" },
    { nameField: "eq17", weightField: "Peso18" },
    { nameField: "eq18", weightField: "Peso19" },
    { nameField: "eq19", weightField: "Peso20" },
    { nameField: "eq20", weightField: "Peso21" },
    { nameField: "eq21", weightField: "Peso22" },
    { nameField: "eq22", weightField: "Peso23" },
    { nameField: "eq23", weightField: "Peso24" },
    { nameField: "eq24", weightField: "Peso25" },
    { nameField: "eq25", weightField: "Peso26" },
  ];

export const INVENTORY_COL2_FIELDS: { nameField: string; weightField: string }[] =
  [
    { nameField: "eq27", weightField: "Peso28" },
    { nameField: "eq28", weightField: "Peso29" },
    { nameField: "eq29", weightField: "Peso30" },
    { nameField: "eq30", weightField: "Peso31" },
    { nameField: "eq31", weightField: "Peso32" },
    { nameField: "eq32", weightField: "Peso33" },
    { nameField: "eq33", weightField: "Peso34" },
    { nameField: "eq34", weightField: "Peso35" },
    { nameField: "eq35", weightField: "Peso36" },
    { nameField: "eq36", weightField: "Peso37" },
    { nameField: "eq37", weightField: "Peso38" },
    { nameField: "eq38", weightField: "Peso39" },
    { nameField: "eq39", weightField: "Peso40" },
    { nameField: "eq40", weightField: "Peso41" },
    { nameField: "eq41", weightField: "Peso42" },
    { nameField: "eq42", weightField: "Peso43" },
    { nameField: "eq43", weightField: "Peso44" },
    { nameField: "eq44", weightField: "Peso45" },
    { nameField: "eq45", weightField: "Peso46" },
    { nameField: "eq46", weightField: "Peso47" },
    { nameField: "eq47", weightField: "Peso48" },
  ];

/**
 * Mappatura esatta dei campi AcroForm per gli Incantesimi di Livello 1..9 (Pagina 3)
 */
export const SPELL_LEVEL_PDF_FIELDS: Record<
  number,
  {
    slotsTotalField: string;
    slotsUsedField: string;
    rows: { checkField: string; nameField: string }[];
  }
> = {
  1: {
    slotsTotalField: "SlotsTotal 19",
    slotsUsedField: "SlotsRemaining 19",
    rows: [
      { checkField: "Check Box 2510", nameField: "SPELL NAME 111" },
      { checkField: "Check Box 25100", nameField: "SPELL NAME 1" },
      { checkField: "Check Box 30900", nameField: "SPELL NAME 2" },
      { checkField: "Check Box 301000", nameField: "SPELL NAME 3" },
      { checkField: "Check Box 301100", nameField: "SPELL NAME 4" },
      { checkField: "Check Box 301200", nameField: "SPELL NAME 5" },
      { checkField: "Check Box 301300", nameField: "SPELL NAME 6" },
      { checkField: "Check Box 301400", nameField: "SPELL NAME 7" },
      { checkField: "Check Box 301500", nameField: "SPELL NAME 8" },
      { checkField: "Check Box 301600", nameField: "SPELL NAME 9" },
      { checkField: "Check Box 3017", nameField: "SPELL NAME 10" },
      { checkField: "Check Box 3018", nameField: "SPELL NAME 11" },
      { checkField: "Check Box 3019", nameField: "SPELL NAME 12" },
    ],
  },
  2: {
    slotsTotalField: "SlotsTotal 20",
    slotsUsedField: "SlotsRemaining 20",
    rows: [
      { checkField: "Check Box 25101", nameField: "1_11" },
      { checkField: "Check Box 2511", nameField: "2_11" },
      { checkField: "Check Box 3091", nameField: "3_11" },
      { checkField: "Check Box 30101", nameField: "4_7" },
      { checkField: "Check Box 30111", nameField: "5_6" },
      { checkField: "Check Box 30121", nameField: "6_5" },
      { checkField: "Check Box 30131", nameField: "7_5" },
      { checkField: "Check Box 30141", nameField: "8_5" },
      { checkField: "Check Box 30151", nameField: "9_5" },
      { checkField: "Check Box 30161", nameField: "10_5" },
      { checkField: "Check Box 30171", nameField: "11_5" },
      { checkField: "Check Box 30181", nameField: "12_5" },
      { checkField: "Check Box 30191", nameField: "13_5" },
    ],
  },
  3: {
    slotsTotalField: "SlotsTotal 21",
    slotsUsedField: "SlotsRemaining 21",
    rows: [
      { checkField: "Check Box 251011", nameField: "1_12" },
      { checkField: "Check Box 25111", nameField: "2_12" },
      { checkField: "Check Box 3099", nameField: "3_12" },
      { checkField: "Check Box 30109", nameField: "4_8" },
      { checkField: "Check Box 30119", nameField: "5_7" },
      { checkField: "Check Box 30129", nameField: "6_6" },
      { checkField: "Check Box 30139", nameField: "7_6" },
      { checkField: "Check Box 30149", nameField: "8_6" },
      { checkField: "Check Box 30159", nameField: "9_6" },
      { checkField: "Check Box 30169", nameField: "10_6" },
      { checkField: "Check Box 30179", nameField: "11_6" },
      { checkField: "Check Box 30189", nameField: "12_6" },
      { checkField: "Check Box 30199", nameField: "13_6" },
    ],
  },
  4: {
    slotsTotalField: "SlotsTotal 22",
    slotsUsedField: "SlotsRemaining 22",
    rows: [
      { checkField: "Check Box 25102", nameField: "1_13" },
      { checkField: "Check Box 2512", nameField: "2_13" },
      { checkField: "Check Box 3092", nameField: "3_13" },
      { checkField: "Check Box 30102", nameField: "4_9" },
      { checkField: "Check Box 30112", nameField: "5_8" },
      { checkField: "Check Box 30122", nameField: "6_7" },
      { checkField: "Check Box 30132", nameField: "7_7" },
      { checkField: "Check Box 30142", nameField: "8_7" },
      { checkField: "Check Box 30152", nameField: "9_7" },
      { checkField: "Check Box 30162", nameField: "10_7" },
      { checkField: "Check Box 30172", nameField: "11_7" },
      { checkField: "Check Box 30182", nameField: "12_7" },
      { checkField: "Check Box 30192", nameField: "13_7" },
    ],
  },
  5: {
    slotsTotalField: "SlotsTotal 23",
    slotsUsedField: "SlotsRemaining 23",
    rows: [
      { checkField: "Check Box 25123", nameField: "1_14" },
      { checkField: "Check Box 30923", nameField: "2_14" },
      { checkField: "Check Box 301023", nameField: "3_14" },
      { checkField: "Check Box 301123", nameField: "4_10" },
      { checkField: "Check Box 301223", nameField: "5_9" },
      { checkField: "Check Box 301323", nameField: "6_8" },
      { checkField: "Check Box 301423", nameField: "7_8" },
      { checkField: "Check Box 3015", nameField: "8_8" },
      { checkField: "Check Box 3016", nameField: "9_8" },
    ],
  },
  6: {
    slotsTotalField: "SlotsTotal 24",
    slotsUsedField: "SlotsRemaining 24",
    rows: [
      { checkField: "Check Box 2513", nameField: "1_15" },
      { checkField: "Check Box 3093", nameField: "2_15" },
      { checkField: "Check Box 30103", nameField: "3_15" },
      { checkField: "Check Box 30113", nameField: "4_11" },
      { checkField: "Check Box 30123", nameField: "5_10" },
      { checkField: "Check Box 30133", nameField: "6_9" },
      { checkField: "Check Box 30143", nameField: "7_9" },
      { checkField: "Check Box 30153", nameField: "8_9" },
      { checkField: "Check Box 30163", nameField: "9_9" },
    ],
  },
  7: {
    slotsTotalField: "SlotsTotal 25",
    slotsUsedField: "SlotsRemaining 25",
    rows: [
      { checkField: "Check Box 2516", nameField: "1_16" },
      { checkField: "Check Box 3096", nameField: "2_16" },
      { checkField: "Check Box 30106", nameField: "3_16" },
      { checkField: "Check Box 30116", nameField: "4_12" },
      { checkField: "Check Box 30126", nameField: "5_11" },
      { checkField: "Check Box 30136", nameField: "6_10" },
      { checkField: "Check Box 30146", nameField: "7_10" },
      { checkField: "Check Box 30156", nameField: "8_10" },
      { checkField: "Check Box 30166", nameField: "9_10" },
    ],
  },
  8: {
    slotsTotalField: "SlotsTotal 191",
    slotsUsedField: "SlotsRemaining 26",
    rows: [
      { checkField: "Check Box 25161", nameField: "1_17" },
      { checkField: "Check Box 30961", nameField: "2_17" },
      { checkField: "Check Box 301061", nameField: "3_17" },
      { checkField: "Check Box 301161", nameField: "4_13" },
      { checkField: "Check Box 301261", nameField: "5_12" },
      { checkField: "Check Box 301361", nameField: "6_11" },
      { checkField: "Check Box 301461", nameField: "7_11" },
    ],
  },
  9: {
    slotsTotalField: "SlotsTotal 27",
    slotsUsedField: "SlotsRemaining 27",
    rows: [
      { checkField: "Check Box 251", nameField: "1_18" },
      { checkField: "Check Box 309", nameField: "2_18" },
      { checkField: "Check Box 3010", nameField: "3_18" },
      { checkField: "Check Box 3011", nameField: "4_14" },
      { checkField: "Check Box 3012", nameField: "5_13" },
      { checkField: "Check Box 3013", nameField: "6_12" },
      { checkField: "Check Box 3014", nameField: "7_12" },
    ],
  },
};

function isSameNumericValue(a: string, b: string): boolean {
  const cleanA = a.trim().replace(/^\+/, "");
  const cleanB = b.trim().replace(/^\+/, "");
  return cleanA === cleanB;
}

/**
 * Costruisce una mappa completa { [pdfFieldName]: valore } a partire da CharacterSheetData,
 * includendo i valori derivati calcolati automaticamente quando non sovrascritti manualmente.
 */
export function buildPdfFieldValuesMap(
  sheet: CharacterSheetData
): Record<string, string | boolean> {
  const map: Record<string, string | boolean> = {};

  // --- PAGINA 1 ---
  map["CharacterName"] = sheet.characterName;
  map["ClassLevel"] = sheet.className;
  map["Background"] = sheet.level;
  map["PlayerName"] = sheet.playerName;
  map["Race "] = sheet.race;
  map["Alignment"] = sheet.background;
  map["XP"] = sheet.alignment;
  map["Nex_XP"] = sheet.gender;

  map["insp1"] = sheet.inspiration[0];
  map["insp2"] = sheet.inspiration[1];
  map["insp3"] = sheet.inspiration[2];
  map["insp4"] = sheet.inspiration[3];

  const hasAnyCharData =
    sheet.level.trim() !== "" ||
    Object.values(sheet.abilities).some((a) => a.score.trim() !== "");

  map["ProfBonus"] =
    sheet.proficiencyBonusOverride.trim() !== ""
      ? sheet.proficiencyBonusOverride.trim()
      : hasAnyCharData
      ? `+${getEffectiveProficiencyBonus(sheet)}`
      : "";

  for (const ab of ABILITIES) {
    const state = sheet.abilities[ab.key];
    map[ab.pdfScoreField] = state.score;
    const mod = getEffectiveAbilityMod(state);
    map[ab.pdfModField] = mod !== null ? String(mod) : state.modOverride;
    map[ab.pdfSaveProfField] = state.saveProficient;
    map[ab.pdfSaveValField] = getEffectiveSavingThrow(sheet, ab.key);
  }

  for (const sk of SKILLS) {
    const state = sheet.skills[sk.key];
    map[sk.pdfProfField] = state.proficient;
    map[sk.pdfExpField] = state.expertise;
    map[sk.pdfValField] = getEffectiveSkillBonus(sheet, sk.key);
  }

  map["Passive"] = getEffectivePassivePerception(sheet);

  map["AC"] = sheet.ac;
  map["AC_Temp"] = sheet.acTemp;
  map["Initiative"] = getEffectiveInitiative(sheet);
  map["Speed"] = sheet.speed;
  map["Vision"] = sheet.vision;
  map["Check Box 12"] = sheet.darkvision;
  map["Exhaustion"] = sheet.exhaustion;
  map["MadnessLvl"] = sheet.madnessLevel;
  map["AbilitySaveDC"] = sheet.abilitySaveDC;

  map["HPMax"] = sheet.hpMax;
  map["HPCurrent"] = sheet.hpCurrent;
  map["HPTemp"] = sheet.hpTemp;

  map["HD"] = sheet.hitDice1.die;
  map["HDTotal"] = sheet.hitDice1.total;
  map["HDLeft"] = sheet.hitDice1.used;

  map["HD2"] = sheet.hitDice2.die;
  map["HDTotal2"] = sheet.hitDice2.total;
  map["HDLeft2"] = sheet.hitDice2.used;

  map["Check Box 120000"] = sheet.deathSaves.successes[0];
  map["Check Box 13"] = sheet.deathSaves.successes[1];
  map["Check Box 14"] = sheet.deathSaves.successes[2];
  map["Check Box 15"] = sheet.deathSaves.failures[0];
  map["Check Box 16"] = sheet.deathSaves.failures[1];
  map["Check Box 17"] = sheet.deathSaves.failures[2];

  ATTACK_PDF_FIELDS.forEach((f, idx) => {
    const atk = sheet.attacks[idx];
    if (!atk) return;
    map[f.name] = atk.name;
    map[f.atkBonus] = atk.atkBonus;
    map[f.damage] = atk.damage;
  });

  [1, 2, 3].forEach((idx, i) => {
    const am = sheet.ammo[i];
    if (!am) return;
    map[`Ammo ${idx}`] = am.name;
    map[`AmmoLeft ${idx}`] = am.quantity;
  });

  map["SpellSaveDC  2"] =
    sheet.page1SpellSaveDC.trim() !== ""
      ? sheet.page1SpellSaveDC
      : getEffectiveSpellSaveDC(sheet);
  map["SpellAtkBonus 2"] =
    sheet.page1SpellAtkBonus.trim() !== ""
      ? sheet.page1SpellAtkBonus
      : getEffectiveSpellAtkBonus(sheet);

  map["Armor"] = sheet.armorInfo.name;
  map["StealthDisv"] = sheet.armorInfo.stealthDisadvantage;
  map["ArmorAC"] = sheet.armorInfo.ac;
  map["ArmorDex"] = sheet.armorInfo.maxDex;
  map["ArmorStr"] = sheet.armorInfo.strReq;
  map["Shield"] = sheet.armorInfo.shield;

  map["CP"] = sheet.coins.cp;
  map["SP"] = sheet.coins.sp;
  map["EP"] = sheet.coins.ep;
  map["GP"] = sheet.coins.gp;
  map["PP"] = sheet.coins.pp;

  [1, 2, 3, 4, 5, 6].forEach((idx, i) => {
    const c = sheet.consumables[i];
    if (!c) return;
    map[`Consum ${idx}`] = c.name;
    map[`ConsumLeft ${idx}`] = c.uses;
  });

  map["AttunedMagic 1"] = sheet.attunedItems[0];
  map["AttunedMagic 2"] = sheet.attunedItems[1];
  map["AttunedMagic 3"] = sheet.attunedItems[2];

  map["ArmorLight"] = sheet.proficiencies.armorLight;
  map["ArmorMed"] = sheet.proficiencies.armorMedium;
  map["ArmorHea"] = sheet.proficiencies.armorHeavy;
  map["Shields"] = sheet.proficiencies.shields;
  map["WpnSim"] = sheet.proficiencies.weaponsSimple;
  map["WpnMar"] = sheet.proficiencies.weaponsMartial;
  map["WpnOth 1"] = sheet.proficiencies.weaponsOtherCheck;
  map["WpnOth 2"] = sheet.proficiencies.weaponsOtherText1;
  map["WEAPONStype 1"] = sheet.proficiencies.weaponsOtherText2;
  map["WEAPONStype 2"] = sheet.proficiencies.weaponsOtherText3;
  map["TOOLS 1"] = sheet.proficiencies.tools1;
  map["TOOLS 2"] = sheet.proficiencies.tools2;
  map["TOOLS 3"] = sheet.proficiencies.tools3;
  map["Languages 1"] = sheet.proficiencies.languages1;
  map["Languages 2"] = sheet.proficiencies.languages2;
  map["Talenti1"] = sheet.feats;

  [1, 2, 3, 4, 5, 6].forEach((idx, i) => {
    const lf = sheet.limitedFeatures[i];
    if (!lf) return;
    map[`Limited Feat ${idx}`] = lf.name;
    map[`RecoverySR ${idx}`] = lf.recoverySR;
    map[`RecoveryLR ${idx}`] = lf.recoveryLR;
    map[`RecoveryDN ${idx}`] = lf.recoveryDawn;
    map[`FeatTot ${idx}`] = lf.total;
    map[`FeatLeft ${idx}`] = lf.used;
  });

  map["Testo2"] = sheet.racialAndBackgroundTraits;
  map["Testo3"] = sheet.classFeatures;

  // --- PAGINA 2 ---
  map["AGE"] = sheet.age;
  map["HEIGHT"] = sheet.height;
  map["WEIGHT"] = sheet.weight;
  map["EYES"] = sheet.eyes;
  map["SKIN"] = sheet.skin;
  map["HAIR"] = sheet.hair;

  map["AppearanceText"] = sheet.appearanceText;
  map["SymbolNAME"] = sheet.symbolName;
  map["Fazione"] = sheet.faction;

  map["Tratti car"] = sheet.personalityTraits;
  map["Ideali1"] = sheet.ideals;
  map["LEgami1"] = sheet.bonds;
  map["DIfetti1"] = sheet.flaws;
  map["Nemici1"] = sheet.enemies;
  map["Testo6"] = sheet.additionalTraits;

  INVENTORY_COL1_FIELDS.forEach((f, i) => {
    const item = sheet.inventoryCol1[i];
    if (!item) return;
    map[f.nameField] = item.name;
    map[f.weightField] = item.weight;
  });

  INVENTORY_COL2_FIELDS.forEach((f, i) => {
    const item = sheet.inventoryCol2[i];
    if (!item) return;
    map[f.nameField] = item.name;
    map[f.weightField] = item.weight;
  });

  const hasAnyInventory = [...sheet.inventoryCol1, ...sheet.inventoryCol2].some(
    (item) => item.name.trim() !== "" || item.weight.trim() !== ""
  );
  map["PesoTrasportabile"] =
    sheet.carriedWeightOverride.trim() !== ""
      ? sheet.carriedWeightOverride.trim()
      : hasAnyInventory || hasAnyCharData
      ? getEffectiveCarriedWeight(sheet)
      : "";
  map["PesoMassimo"] = getEffectiveMaxCarryWeight(sheet);

  // --- PAGINA 3 ---
  map["Spellcasting Class 2"] = sheet.spellcastingClass;
  map["SpellcastingAbility 2"] = sheet.spellcastingAbility;
  map["SpellSaveDC  21"] = getEffectiveSpellSaveDC(sheet);
  map["SpellAtkBonus 21"] = getEffectiveSpellAtkBonus(sheet);

  [1, 2, 3, 4, 5, 6, 7, 8].forEach((idx, i) => {
    map[`0 ${idx}`] = sheet.cantrips[i] ?? "";
  });

  for (let lvl = 1; lvl <= 9; lvl++) {
    const def = SPELL_LEVEL_PDF_FIELDS[lvl];
    const section = sheet.spellLevels[lvl];
    if (!def || !section) continue;
    map[def.slotsTotalField] = section.slotsTotal;
    map[def.slotsUsedField] = section.slotsUsed;
    def.rows.forEach((r, i) => {
      const sp = section.spells[i];
      if (!sp) return;
      map[r.checkField] = sp.prepared;
      map[r.nameField] = sp.name;
    });
  }

  return map;
}

/**
 * Applica la modifica di un singolo campo del PDF (identificato dal suo fieldName AcroForm) a CharacterSheetData.
 */
export function applyPdfFieldChange(
  prev: CharacterSheetData,
  fieldName: string,
  value: string | boolean
): CharacterSheetData {
  const strVal = typeof value === "string" ? value : "";
  const boolVal = Boolean(value);

  // Intestazione Pag 1 & 2
  if (fieldName === "CharacterName") return { ...prev, characterName: strVal };
  if (fieldName === "ClassLevel") return { ...prev, className: strVal };
  if (fieldName === "Background") return { ...prev, level: strVal };
  if (fieldName === "PlayerName") return { ...prev, playerName: strVal };
  if (fieldName === "Race ") return { ...prev, race: strVal };
  if (fieldName === "Alignment") return { ...prev, background: strVal };
  if (fieldName === "XP") return { ...prev, alignment: strVal };
  if (fieldName === "Nex_XP") return { ...prev, gender: strVal };

  // Ispirazione
  if (fieldName === "insp1" || fieldName === "insp2" || fieldName === "insp3" || fieldName === "insp4") {
    const idx = parseInt(fieldName.replace("insp", ""), 10) - 1;
    const nextInsp: [boolean, boolean, boolean, boolean] = [...prev.inspiration];
    nextInsp[idx] = boolVal;
    return { ...prev, inspiration: nextInsp };
  }

  // Bonus competenza
  if (fieldName === "ProfBonus") {
    const auto = String(computeProficiencyBonus(prev.level));
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, auto) ? "" : strVal;
    return { ...prev, proficiencyBonusOverride: override };
  }

  // Caratteristiche e Tiri Salvezza
  for (const ab of ABILITIES) {
    if (fieldName === ab.pdfScoreField) {
      return {
        ...prev,
        abilities: {
          ...prev.abilities,
          [ab.key]: { ...prev.abilities[ab.key], score: strVal },
        },
      };
    }
    if (fieldName === ab.pdfModField) {
      const autoMod = computeAbilityModifier(prev.abilities[ab.key].score);
      const override =
        strVal.trim() === "" ||
        (autoMod !== null && isSameNumericValue(strVal, String(autoMod)))
          ? ""
          : strVal;
      return {
        ...prev,
        abilities: {
          ...prev.abilities,
          [ab.key]: { ...prev.abilities[ab.key], modOverride: override },
        },
      };
    }
    if (fieldName === ab.pdfSaveProfField) {
      return {
        ...prev,
        abilities: {
          ...prev.abilities,
          [ab.key]: { ...prev.abilities[ab.key], saveProficient: boolVal },
        },
      };
    }
    if (fieldName === ab.pdfSaveValField) {
      const tempSheet: CharacterSheetData = {
        ...prev,
        abilities: {
          ...prev.abilities,
          [ab.key]: { ...prev.abilities[ab.key], saveOverride: "" },
        },
      };
      const autoSave = getEffectiveSavingThrow(tempSheet, ab.key);
      const override =
        strVal.trim() === "" || isSameNumericValue(strVal, autoSave)
          ? ""
          : strVal;
      return {
        ...prev,
        abilities: {
          ...prev.abilities,
          [ab.key]: { ...prev.abilities[ab.key], saveOverride: override },
        },
      };
    }
  }

  // 18 Abilità
  for (const sk of SKILLS) {
    if (fieldName === sk.pdfProfField) {
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [sk.key]: {
            ...prev.skills[sk.key],
            proficient: boolVal,
            expertise: !boolVal ? false : prev.skills[sk.key].expertise,
          },
        },
      };
    }
    if (fieldName === sk.pdfExpField) {
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [sk.key]: {
            ...prev.skills[sk.key],
            expertise: boolVal,
            proficient: boolVal ? true : prev.skills[sk.key].proficient,
          },
        },
      };
    }
    if (fieldName === sk.pdfValField) {
      const tempSheet: CharacterSheetData = {
        ...prev,
        skills: {
          ...prev.skills,
          [sk.key]: { ...prev.skills[sk.key], override: "" },
        },
      };
      const autoSkill = getEffectiveSkillBonus(tempSheet, sk.key);
      const override =
        strVal.trim() === "" || isSameNumericValue(strVal, autoSkill)
          ? ""
          : strVal;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [sk.key]: { ...prev.skills[sk.key], override },
        },
      };
    }
  }

  // Percezione Passiva
  if (fieldName === "Passive") {
    const tempSheet = { ...prev, passivePerceptionOverride: "" };
    const autoPassive = getEffectivePassivePerception(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoPassive)
        ? ""
        : strVal;
    return { ...prev, passivePerceptionOverride: override };
  }

  // Difesa, Salute e Stato
  if (fieldName === "AC") return { ...prev, ac: strVal };
  if (fieldName === "AC_Temp") return { ...prev, acTemp: strVal };
  if (fieldName === "Initiative") {
    const tempSheet = { ...prev, initiativeOverride: "" };
    const autoInit = getEffectiveInitiative(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoInit)
        ? ""
        : strVal;
    return { ...prev, initiativeOverride: override };
  }
  if (fieldName === "Speed") return { ...prev, speed: strVal };
  if (fieldName === "Vision") return { ...prev, vision: strVal };
  if (fieldName === "Check Box 12") return { ...prev, darkvision: boolVal };
  if (fieldName === "Exhaustion") return { ...prev, exhaustion: strVal };
  if (fieldName === "MadnessLvl") return { ...prev, madnessLevel: strVal };
  if (fieldName === "AbilitySaveDC") return { ...prev, abilitySaveDC: strVal };

  if (fieldName === "HPMax") return { ...prev, hpMax: strVal };
  if (fieldName === "HPCurrent") return { ...prev, hpCurrent: strVal };
  if (fieldName === "HPTemp") return { ...prev, hpTemp: strVal };

  if (fieldName === "HD")
    return { ...prev, hitDice1: { ...prev.hitDice1, die: strVal } };
  if (fieldName === "HDTotal")
    return { ...prev, hitDice1: { ...prev.hitDice1, total: strVal } };
  if (fieldName === "HDLeft")
    return { ...prev, hitDice1: { ...prev.hitDice1, used: strVal } };

  if (fieldName === "HD2")
    return { ...prev, hitDice2: { ...prev.hitDice2, die: strVal } };
  if (fieldName === "HDTotal2")
    return { ...prev, hitDice2: { ...prev.hitDice2, total: strVal } };
  if (fieldName === "HDLeft2")
    return { ...prev, hitDice2: { ...prev.hitDice2, used: strVal } };

  // TS Contro Morte
  const deathSuccessFields = ["Check Box 120000", "Check Box 13", "Check Box 14"];
  const dsIdx = deathSuccessFields.indexOf(fieldName);
  if (dsIdx !== -1) {
    const next: [boolean, boolean, boolean] = [...prev.deathSaves.successes];
    next[dsIdx] = boolVal;
    return {
      ...prev,
      deathSaves: { ...prev.deathSaves, successes: next },
    };
  }
  const deathFailFields = ["Check Box 15", "Check Box 16", "Check Box 17"];
  const dfIdx = deathFailFields.indexOf(fieldName);
  if (dfIdx !== -1) {
    const next: [boolean, boolean, boolean] = [...prev.deathSaves.failures];
    next[dfIdx] = boolVal;
    return {
      ...prev,
      deathSaves: { ...prev.deathSaves, failures: next },
    };
  }

  // Attacchi (6 righe)
  for (let i = 0; i < ATTACK_PDF_FIELDS.length; i++) {
    const f = ATTACK_PDF_FIELDS[i];
    if (fieldName === f.name) {
      const next = [...prev.attacks];
      next[i] = { ...next[i], name: strVal };
      return { ...prev, attacks: next };
    }
    if (fieldName === f.atkBonus) {
      const next = [...prev.attacks];
      next[i] = { ...next[i], atkBonus: strVal };
      return { ...prev, attacks: next };
    }
    if (fieldName === f.damage) {
      const next = [...prev.attacks];
      next[i] = { ...next[i], damage: strVal };
      return { ...prev, attacks: next };
    }
  }

  // Munizioni
  for (let idx = 1; idx <= 3; idx++) {
    if (fieldName === `Ammo ${idx}`) {
      const next = [...prev.ammo];
      next[idx - 1] = { ...next[idx - 1], name: strVal };
      return { ...prev, ammo: next };
    }
    if (fieldName === `AmmoLeft ${idx}`) {
      const next = [...prev.ammo];
      next[idx - 1] = { ...next[idx - 1], quantity: strVal };
      return { ...prev, ammo: next };
    }
  }

  if (fieldName === "SpellSaveDC  2") {
    return { ...prev, page1SpellSaveDC: strVal };
  }
  if (fieldName === "SpellAtkBonus 2") {
    return { ...prev, page1SpellAtkBonus: strVal };
  }

  // Armatura, Monete, Consumabili, Oggetti Armonizzati
  if (fieldName === "Armor")
    return { ...prev, armorInfo: { ...prev.armorInfo, name: strVal } };
  if (fieldName === "StealthDisv")
    return {
      ...prev,
      armorInfo: { ...prev.armorInfo, stealthDisadvantage: boolVal },
    };
  if (fieldName === "ArmorAC")
    return { ...prev, armorInfo: { ...prev.armorInfo, ac: strVal } };
  if (fieldName === "ArmorDex")
    return { ...prev, armorInfo: { ...prev.armorInfo, maxDex: strVal } };
  if (fieldName === "ArmorStr")
    return { ...prev, armorInfo: { ...prev.armorInfo, strReq: strVal } };
  if (fieldName === "Shield")
    return { ...prev, armorInfo: { ...prev.armorInfo, shield: strVal } };

  if (fieldName === "CP") return { ...prev, coins: { ...prev.coins, cp: strVal } };
  if (fieldName === "SP") return { ...prev, coins: { ...prev.coins, sp: strVal } };
  if (fieldName === "EP") return { ...prev, coins: { ...prev.coins, ep: strVal } };
  if (fieldName === "GP") return { ...prev, coins: { ...prev.coins, gp: strVal } };
  if (fieldName === "PP") return { ...prev, coins: { ...prev.coins, pp: strVal } };

  for (let idx = 1; idx <= 6; idx++) {
    if (fieldName === `Consum ${idx}`) {
      const next = [...prev.consumables];
      next[idx - 1] = { ...next[idx - 1], name: strVal };
      return { ...prev, consumables: next };
    }
    if (fieldName === `ConsumLeft ${idx}`) {
      const next = [...prev.consumables];
      next[idx - 1] = { ...next[idx - 1], uses: strVal };
      return { ...prev, consumables: next };
    }
  }

  if (
    fieldName === "AttunedMagic 1" ||
    fieldName === "AttunedMagic 2" ||
    fieldName === "AttunedMagic 3"
  ) {
    const idx = parseInt(fieldName.replace("AttunedMagic ", ""), 10) - 1;
    const next: [string, string, string] = [...prev.attunedItems];
    next[idx] = strVal;
    return { ...prev, attunedItems: next };
  }

  // Competenze, Strumenti, Linguaggi, Talenti
  if (fieldName === "ArmorLight")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, armorLight: boolVal },
    };
  if (fieldName === "ArmorMed")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, armorMedium: boolVal },
    };
  if (fieldName === "ArmorHea")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, armorHeavy: boolVal },
    };
  if (fieldName === "Shields")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, shields: boolVal },
    };
  if (fieldName === "WpnSim")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsSimple: boolVal },
    };
  if (fieldName === "WpnMar")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsMartial: boolVal },
    };
  if (fieldName === "WpnOth 1")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsOtherCheck: boolVal },
    };
  if (fieldName === "WpnOth 2")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsOtherText1: strVal },
    };
  if (fieldName === "WEAPONStype 1")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsOtherText2: strVal },
    };
  if (fieldName === "WEAPONStype 2")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, weaponsOtherText3: strVal },
    };
  if (fieldName === "TOOLS 1")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, tools1: strVal },
    };
  if (fieldName === "TOOLS 2")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, tools2: strVal },
    };
  if (fieldName === "TOOLS 3")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, tools3: strVal },
    };
  if (fieldName === "Languages 1")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, languages1: strVal },
    };
  if (fieldName === "Languages 2")
    return {
      ...prev,
      proficiencies: { ...prev.proficiencies, languages2: strVal },
    };
  if (fieldName === "Talenti1") return { ...prev, feats: strVal };

  // Privilegi Limitati (6 righe)
  for (let idx = 1; idx <= 6; idx++) {
    const i = idx - 1;
    if (fieldName === `Limited Feat ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], name: strVal };
      return { ...prev, limitedFeatures: next };
    }
    if (fieldName === `RecoverySR ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], recoverySR: boolVal };
      return { ...prev, limitedFeatures: next };
    }
    if (fieldName === `RecoveryLR ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], recoveryLR: boolVal };
      return { ...prev, limitedFeatures: next };
    }
    if (fieldName === `RecoveryDN ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], recoveryDawn: boolVal };
      return { ...prev, limitedFeatures: next };
    }
    if (fieldName === `FeatTot ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], total: strVal };
      return { ...prev, limitedFeatures: next };
    }
    if (fieldName === `FeatLeft ${idx}`) {
      const next = [...prev.limitedFeatures];
      next[i] = { ...next[i], used: strVal };
      return { ...prev, limitedFeatures: next };
    }
  }

  if (fieldName === "Testo2")
    return { ...prev, racialAndBackgroundTraits: strVal };
  if (fieldName === "Testo3") return { ...prev, classFeatures: strVal };

  // --- PAGINA 2 ---
  if (fieldName === "AGE") return { ...prev, age: strVal };
  if (fieldName === "HEIGHT") return { ...prev, height: strVal };
  if (fieldName === "WEIGHT") return { ...prev, weight: strVal };
  if (fieldName === "EYES") return { ...prev, eyes: strVal };
  if (fieldName === "SKIN") return { ...prev, skin: strVal };
  if (fieldName === "HAIR") return { ...prev, hair: strVal };

  if (fieldName === "AppearanceText") return { ...prev, appearanceText: strVal };
  if (fieldName === "SymbolNAME") return { ...prev, symbolName: strVal };
  if (fieldName === "Fazione") return { ...prev, faction: strVal };

  if (fieldName === "Tratti car") return { ...prev, personalityTraits: strVal };
  if (fieldName === "Ideali1") return { ...prev, ideals: strVal };
  if (fieldName === "LEgami1") return { ...prev, bonds: strVal };
  if (fieldName === "DIfetti1") return { ...prev, flaws: strVal };
  if (fieldName === "Nemici1") return { ...prev, enemies: strVal };
  if (fieldName === "Testo6") return { ...prev, additionalTraits: strVal };

  for (let i = 0; i < INVENTORY_COL1_FIELDS.length; i++) {
    const f = INVENTORY_COL1_FIELDS[i];
    if (fieldName === f.nameField) {
      const next = [...prev.inventoryCol1];
      next[i] = { ...next[i], name: strVal };
      return { ...prev, inventoryCol1: next };
    }
    if (fieldName === f.weightField) {
      const next = [...prev.inventoryCol1];
      next[i] = { ...next[i], weight: strVal };
      return { ...prev, inventoryCol1: next };
    }
  }

  for (let i = 0; i < INVENTORY_COL2_FIELDS.length; i++) {
    const f = INVENTORY_COL2_FIELDS[i];
    if (fieldName === f.nameField) {
      const next = [...prev.inventoryCol2];
      next[i] = { ...next[i], name: strVal };
      return { ...prev, inventoryCol2: next };
    }
    if (fieldName === f.weightField) {
      const next = [...prev.inventoryCol2];
      next[i] = { ...next[i], weight: strVal };
      return { ...prev, inventoryCol2: next };
    }
  }

  if (fieldName === "PesoTrasportabile") {
    const tempSheet = { ...prev, carriedWeightOverride: "" };
    const autoCarried = getEffectiveCarriedWeight(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoCarried)
        ? ""
        : strVal;
    return { ...prev, carriedWeightOverride: override };
  }

  if (fieldName === "PesoMassimo") {
    const tempSheet = { ...prev, maxCarryWeightOverride: "" };
    const autoMax = getEffectiveMaxCarryWeight(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoMax)
        ? ""
        : strVal;
    return { ...prev, maxCarryWeightOverride: override };
  }

  // --- PAGINA 3 ---
  if (fieldName === "Spellcasting Class 2")
    return { ...prev, spellcastingClass: strVal };
  if (fieldName === "SpellcastingAbility 2")
    return { ...prev, spellcastingAbility: strVal };

  if (fieldName === "SpellSaveDC  21") {
    const tempSheet = { ...prev, spellSaveDCOverride: "" };
    const autoDC = getEffectiveSpellSaveDC(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoDC) ? "" : strVal;
    return { ...prev, spellSaveDCOverride: override };
  }

  if (fieldName === "SpellAtkBonus 21") {
    const tempSheet = { ...prev, spellAtkBonusOverride: "" };
    const autoAtk = getEffectiveSpellAtkBonus(tempSheet);
    const override =
      strVal.trim() === "" || isSameNumericValue(strVal, autoAtk) ? "" : strVal;
    return { ...prev, spellAtkBonusOverride: override };
  }

  for (let idx = 1; idx <= 8; idx++) {
    if (fieldName === `0 ${idx}`) {
      const next = [...prev.cantrips];
      next[idx - 1] = strVal;
      return { ...prev, cantrips: next };
    }
  }

  for (let lvl = 1; lvl <= 9; lvl++) {
    const def = SPELL_LEVEL_PDF_FIELDS[lvl];
    const section = prev.spellLevels[lvl];
    if (!def || !section) continue;
    if (fieldName === def.slotsTotalField) {
      return {
        ...prev,
        spellLevels: {
          ...prev.spellLevels,
          [lvl]: { ...section, slotsTotal: strVal },
        },
      };
    }
    if (fieldName === def.slotsUsedField) {
      return {
        ...prev,
        spellLevels: {
          ...prev.spellLevels,
          [lvl]: { ...section, slotsUsed: strVal },
        },
      };
    }
    for (let i = 0; i < def.rows.length; i++) {
      const r = def.rows[i];
      if (fieldName === r.checkField) {
        const nextSpells = [...section.spells];
        nextSpells[i] = { ...nextSpells[i], prepared: boolVal };
        return {
          ...prev,
          spellLevels: {
            ...prev.spellLevels,
            [lvl]: { ...section, spells: nextSpells },
          },
        };
      }
      if (fieldName === r.nameField) {
        const nextSpells = [...section.spells];
        nextSpells[i] = { ...nextSpells[i], name: strVal };
        return {
          ...prev,
          spellLevels: {
            ...prev.spellLevels,
            [lvl]: { ...section, spells: nextSpells },
          },
        };
      }
    }
  }

  return prev;
}

/**
 * Importa i dati di un personaggio leggendo i campi AcroForm e le Annotazioni di un file PDF editabile D&D 5e.
 */
export async function importCharacterSheetFromPdf(
  pdfBuffer: ArrayBuffer | Uint8Array
): Promise<CharacterSheetData> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();

  const textMap = new Map<string, string>();
  const checkMap = new Map<string, boolean>();

  for (const field of form.getFields()) {
    const name = field.getName();
    if (field instanceof PDFTextField) {
      textMap.set(name, field.getText() ?? "");
    } else if (field instanceof PDFCheckBox) {
      checkMap.set(name, field.isChecked());
    }
  }

  // Legge anche eventuali annotazioni di pagina modificate direttamente da viewer PDF esterni
  for (const page of pdfDoc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i++) {
      const dict = pdfDoc.context.lookup(annots.get(i));
      if (!(dict instanceof PDFDict)) continue;
      const tObj = dict.get(PDFName.of("T"));
      const name =
        tObj instanceof PDFString ? tObj.decodeText() : undefined;
      if (!name) continue;
      const ft = dict.get(PDFName.of("FT"))?.toString();
      const vObj = dict.get(PDFName.of("V"));
      if (ft === "/Tx" && vObj instanceof PDFString) {
        const val = vObj.decodeText();
        if (val && !textMap.get(name)) {
          textMap.set(name, val);
        }
      } else if (ft === "/Btn" && vObj) {
        const vStr = vObj.toString();
        if (vStr !== "/Off" && !checkMap.get(name)) {
          checkMap.set(name, true);
        }
      }
    }
  }

  const getTxt = (name: string, trim = true): string => {
    const raw = textMap.get(name) ?? "";
    return trim ? raw.trim() : raw;
  };
  const getChk = (name: string): boolean => Boolean(checkMap.get(name));

  const sheet = createEmptyCharacterSheet();

  // --- PAGINA 1: Intestazione ---
  sheet.characterName = getTxt("CharacterName");
  sheet.className = getTxt("ClassLevel");
  sheet.level = getTxt("Background");
  sheet.playerName = getTxt("PlayerName");
  sheet.race = getTxt("Race ");
  sheet.background = getTxt("Alignment");
  sheet.alignment = getTxt("XP");
  sheet.gender = getTxt("Nex_XP");

  sheet.inspiration = [
    getChk("insp1"),
    getChk("insp2"),
    getChk("insp3"),
    getChk("insp4"),
  ];

  const rawProf = getTxt("ProfBonus");
  const autoProf = String(computeProficiencyBonus(sheet.level));
  sheet.proficiencyBonusOverride =
    rawProf && !isSameNumericValue(rawProf, autoProf) ? rawProf : "";

  for (const ab of ABILITIES) {
    const score = getTxt(ab.pdfScoreField);
    const rawMod = getTxt(ab.pdfModField);
    const saveProficient = getChk(ab.pdfSaveProfField);
    const rawSave = getTxt(ab.pdfSaveValField);

    const autoMod = computeAbilityModifier(score);
    const modOverride =
      rawMod && autoMod !== null && !isSameNumericValue(rawMod, String(autoMod))
        ? rawMod
        : score === "" && rawMod !== ""
        ? rawMod
        : "";

    sheet.abilities[ab.key] = {
      score,
      modOverride,
      saveProficient,
      saveOverride: "",
    };

    const autoSave = getEffectiveSavingThrow(sheet, ab.key);
    if (rawSave && !isSameNumericValue(rawSave, autoSave)) {
      sheet.abilities[ab.key].saveOverride = rawSave;
    }
  }

  for (const sk of SKILLS) {
    const proficient = getChk(sk.pdfProfField);
    const expertise = getChk(sk.pdfExpField);
    const rawVal = getTxt(sk.pdfValField);

    sheet.skills[sk.key] = {
      proficient,
      expertise,
      override: "",
    };

    const autoSkill = getEffectiveSkillBonus(sheet, sk.key);
    if (rawVal && !isSameNumericValue(rawVal, autoSkill)) {
      sheet.skills[sk.key].override = rawVal;
    }
  }

  const rawPassive = getTxt("Passive");
  const autoPassive = getEffectivePassivePerception(sheet);
  sheet.passivePerceptionOverride =
    rawPassive && !isSameNumericValue(rawPassive, autoPassive) ? rawPassive : "";

  sheet.ac = getTxt("AC");
  sheet.acTemp = getTxt("AC_Temp");

  const rawInit = getTxt("Initiative");
  const autoInit = getEffectiveInitiative(sheet);
  sheet.initiativeOverride =
    rawInit && !isSameNumericValue(rawInit, autoInit) ? rawInit : "";

  sheet.speed = getTxt("Speed");
  sheet.vision = getTxt("Vision");
  sheet.darkvision = getChk("Check Box 12");
  sheet.exhaustion = getTxt("Exhaustion");
  sheet.madnessLevel = getTxt("MadnessLvl");
  sheet.abilitySaveDC = getTxt("AbilitySaveDC");

  sheet.hpMax = getTxt("HPMax");
  sheet.hpCurrent = getTxt("HPCurrent");
  sheet.hpTemp = getTxt("HPTemp");

  sheet.hitDice1 = {
    die: getTxt("HD"),
    total: getTxt("HDTotal"),
    used: getTxt("HDLeft"),
  };
  sheet.hitDice2 = {
    die: getTxt("HD2"),
    total: getTxt("HDTotal2"),
    used: getTxt("HDLeft2"),
  };

  sheet.deathSaves = {
    successes: [
      getChk("Check Box 120000"),
      getChk("Check Box 13"),
      getChk("Check Box 14"),
    ],
    failures: [
      getChk("Check Box 15"),
      getChk("Check Box 16"),
      getChk("Check Box 17"),
    ],
  };

  sheet.attacks = ATTACK_PDF_FIELDS.map((f) => ({
    name: getTxt(f.name),
    atkBonus: getTxt(f.atkBonus),
    damage: getTxt(f.damage),
  }));

  sheet.ammo = [1, 2, 3].map((idx) => ({
    name: getTxt(`Ammo ${idx}`),
    quantity: getTxt(`AmmoLeft ${idx}`),
  }));
  sheet.page1SpellSaveDC = getTxt("SpellSaveDC  2");
  sheet.page1SpellAtkBonus = getTxt("SpellAtkBonus 2");

  sheet.armorInfo = {
    name: getTxt("Armor"),
    stealthDisadvantage: getChk("StealthDisv"),
    ac: getTxt("ArmorAC"),
    maxDex: getTxt("ArmorDex"),
    strReq: getTxt("ArmorStr"),
    shield: getTxt("Shield"),
  };

  sheet.coins = {
    cp: getTxt("CP"),
    sp: getTxt("SP"),
    ep: getTxt("EP"),
    gp: getTxt("GP"),
    pp: getTxt("PP"),
  };

  sheet.consumables = [1, 2, 3, 4, 5, 6].map((idx) => ({
    name: getTxt(`Consum ${idx}`),
    uses: getTxt(`ConsumLeft ${idx}`),
  }));

  sheet.attunedItems = [
    getTxt("AttunedMagic 1"),
    getTxt("AttunedMagic 2"),
    getTxt("AttunedMagic 3"),
  ];

  sheet.proficiencies = {
    armorLight: getChk("ArmorLight"),
    armorMedium: getChk("ArmorMed"),
    armorHeavy: getChk("ArmorHea"),
    shields: getChk("Shields"),
    weaponsSimple: getChk("WpnSim"),
    weaponsMartial: getChk("WpnMar"),
    weaponsOtherCheck: getChk("WpnOth 1"),
    weaponsOtherText1: getTxt("WpnOth 2"),
    weaponsOtherText2: getTxt("WEAPONStype 1"),
    weaponsOtherText3: getTxt("WEAPONStype 2"),
    tools1: getTxt("TOOLS 1"),
    tools2: getTxt("TOOLS 2"),
    tools3: getTxt("TOOLS 3"),
    languages1: getTxt("Languages 1"),
    languages2: getTxt("Languages 2"),
  };
  sheet.feats = getTxt("Talenti1", false).replace(/\r\n/g, "\n").trim();

  sheet.limitedFeatures = [1, 2, 3, 4, 5, 6].map((idx) => ({
    name: getTxt(`Limited Feat ${idx}`),
    recoverySR: getChk(`RecoverySR ${idx}`),
    recoveryLR: getChk(`RecoveryLR ${idx}`),
    recoveryDawn: getChk(`RecoveryDN ${idx}`),
    total: getTxt(`FeatTot ${idx}`),
    used: getTxt(`FeatLeft ${idx}`),
  }));

  sheet.racialAndBackgroundTraits = getTxt("Testo2", false)
    .replace(/\r\n/g, "\n")
    .trim();
  sheet.classFeatures = getTxt("Testo3", false).replace(/\r\n/g, "\n").trim();

  // --- PAGINA 2 ---
  sheet.age = getTxt("AGE");
  sheet.height = getTxt("HEIGHT");
  sheet.weight = getTxt("WEIGHT");
  sheet.eyes = getTxt("EYES");
  sheet.skin = getTxt("SKIN");
  sheet.hair = getTxt("HAIR");

  sheet.appearanceText = getTxt("AppearanceText", false)
    .replace(/\r\n/g, "\n")
    .trim();
  sheet.symbolName = getTxt("SymbolNAME");
  sheet.faction = getTxt("Fazione", false).replace(/\r\n/g, "\n").trim();

  sheet.personalityTraits = getTxt("Tratti car", false)
    .replace(/\r\n/g, "\n")
    .trim();
  sheet.ideals = getTxt("Ideali1", false).replace(/\r\n/g, "\n").trim();
  sheet.bonds = getTxt("LEgami1", false).replace(/\r\n/g, "\n").trim();
  sheet.flaws = getTxt("DIfetti1", false).replace(/\r\n/g, "\n").trim();
  sheet.enemies = getTxt("Nemici1", false).replace(/\r\n/g, "\n").trim();
  sheet.additionalTraits = getTxt("Testo6", false)
    .replace(/\r\n/g, "\n")
    .trim();

  sheet.inventoryCol1 = INVENTORY_COL1_FIELDS.map((f) => ({
    name: getTxt(f.nameField),
    weight: getTxt(f.weightField),
  }));
  sheet.inventoryCol2 = INVENTORY_COL2_FIELDS.map((f) => ({
    name: getTxt(f.nameField),
    weight: getTxt(f.weightField),
  }));

  const rawCarried = getTxt("PesoTrasportabile");
  const autoCarried = getEffectiveCarriedWeight(sheet);
  sheet.carriedWeightOverride =
    rawCarried && !isSameNumericValue(rawCarried, autoCarried)
      ? rawCarried
      : "";

  const rawMaxCarry = getTxt("PesoMassimo");
  const autoMaxCarry = getEffectiveMaxCarryWeight(sheet);
  sheet.maxCarryWeightOverride =
    rawMaxCarry && !isSameNumericValue(rawMaxCarry, autoMaxCarry)
      ? rawMaxCarry
      : "";

  // --- PAGINA 3 ---
  sheet.spellcastingClass = getTxt("Spellcasting Class 2");
  sheet.spellcastingAbility = getTxt("SpellcastingAbility 2");

  const rawSpellDC = getTxt("SpellSaveDC  21");
  const autoSpellDC = getEffectiveSpellSaveDC(sheet);
  sheet.spellSaveDCOverride =
    rawSpellDC && !isSameNumericValue(rawSpellDC, autoSpellDC)
      ? rawSpellDC
      : "";

  const rawSpellAtk = getTxt("SpellAtkBonus 21");
  const autoSpellAtk = getEffectiveSpellAtkBonus(sheet);
  sheet.spellAtkBonusOverride =
    rawSpellAtk && !isSameNumericValue(rawSpellAtk, autoSpellAtk)
      ? rawSpellAtk
      : "";

  sheet.cantrips = [1, 2, 3, 4, 5, 6, 7, 8].map((idx) => getTxt(`0 ${idx}`));

  for (let lvl = 1; lvl <= 9; lvl++) {
    const def = SPELL_LEVEL_PDF_FIELDS[lvl];
    if (!def) continue;
    sheet.spellLevels[lvl] = {
      level: lvl,
      slotsTotal: getTxt(def.slotsTotalField),
      slotsUsed: getTxt(def.slotsUsedField),
      spells: def.rows.map((r) => ({
        prepared: getChk(r.checkField),
        name: getTxt(r.nameField),
      })),
    };
  }

  return sheet;
}

/**
 * Compila il template PDF editabile con tutti i dati di CharacterSheetData (sincronizzando sia AcroForm che Page.Annots)
 * e restituisce i byte del PDF pronto per il download.
 */
export async function exportCharacterSheetToPdf(
  sheet: CharacterSheetData,
  templateBuffer?: ArrayBuffer | Uint8Array
): Promise<Uint8Array> {
  let bytes = templateBuffer;
  if (!bytes) {
    const res = await fetch("/scheda-personaggio-vuota.pdf");
    if (!res.ok) {
      throw new Error(
        "Impossibile caricare il template PDF della scheda personaggio."
      );
    }
    bytes = await res.arrayBuffer();
  }

  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fieldValues = buildPdfFieldValuesMap(sheet);

  for (const [name, val] of Object.entries(fieldValues)) {
    if (typeof val === "string") {
      try {
        const f = form.getTextField(name);
        f.setText(val);
      } catch {
        // Campo non presente in AcroForm
      }
    } else if (typeof val === "boolean") {
      try {
        const f = form.getCheckBox(name);
        if (val) f.check();
        else f.uncheck();
      } catch {
        // Campo non presente in AcroForm
      }
    }
  }

  // Sincronizza anche i dizionari Widget (e relativi Parent) in page.node.Annots()
  for (const page of pdfDoc.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i++) {
      const dict = pdfDoc.context.lookup(annots.get(i));
      if (!(dict instanceof PDFDict)) continue;
      const parentRef = dict.get(PDFName.of("Parent"));
      const parentDict = parentRef ? pdfDoc.context.lookup(parentRef) : null;
      const pDict = parentDict instanceof PDFDict ? parentDict : null;

      const tObj = dict.get(PDFName.of("T")) || pDict?.get(PDFName.of("T"));
      const name =
        tObj instanceof PDFString ? tObj.decodeText() : undefined;
      if (!name || !(name in fieldValues)) continue;

      const val = fieldValues[name];
      const ft = (
        dict.get(PDFName.of("FT")) || pDict?.get(PDFName.of("FT"))
      )?.toString();
      if (ft === "/Tx" && typeof val === "string") {
        dict.set(PDFName.of("V"), PDFString.of(val));
        dict.delete(PDFName.of("AP"));
        if (pDict) {
          pDict.set(PDFName.of("V"), PDFString.of(val));
          pDict.delete(PDFName.of("AP"));
        }
      } else if (ft === "/Btn" && typeof val === "boolean") {
        const stateName = PDFName.of(val ? "Yes" : "Off");
        dict.set(PDFName.of("V"), stateName);
        dict.set(PDFName.of("AS"), stateName);
      }
    }
  }

  // Incorpora eventuali immagini caricate in Pagina 2 (Aspetto del Personaggio e Simbolo)
  const pages = pdfDoc.getPages();
  if (pages[1]) {
    const page2 = pages[1];
    const embedDataUrlImage = async (
      dataUrl: string,
      rect: [number, number, number, number]
    ) => {
      try {
        const isPng = dataUrl.startsWith("data:image/png");
        const base64 = dataUrl.split(",")[1];
        if (!base64) return;
        const binStr = atob(base64);
        const imgBytes = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          imgBytes[i] = binStr.charCodeAt(i);
        }
        const pdfImg = isPng
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);
        const [x1, y1, x2, y2] = rect;
        const boxW = x2 - x1;
        const boxH = y2 - y1;
        const scale = Math.min(boxW / pdfImg.width, boxH / pdfImg.height);
        const drawW = pdfImg.width * scale;
        const drawH = pdfImg.height * scale;
        page2.drawImage(pdfImg, {
          x: x1 + (boxW - drawW) / 2,
          y: y1 + (boxH - drawH) / 2,
          width: drawW,
          height: drawH,
        });
      } catch {
        // Ignora formati immagine non supportati da pdf-lib
      }
    };

    if (sheet.portraitImage) {
      await embedDataUrlImage(sheet.portraitImage, [28.17, 533.29, 196.76, 713.66]);
    }
    if (sheet.symbolImage) {
      await embedDataUrlImage(sheet.symbolImage, [226.48, 551.58, 370.9, 669.02]);
    }
  }

  // Imposta NeedAppearances affinché i lettori PDF rigenerino l'aspetto dei campi di testo
  form.acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);

  return pdfDoc.save();
}
