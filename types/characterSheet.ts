/**
 * Tipi, strutture dati e funzioni di calcolo per la Scheda Personaggio D&D 5e (formato Toradol 2023 a 3 pagine).
 */

export type AbilityKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityDefinition {
  key: AbilityKey;
  label: string;
  shortLabel: string;
  pdfScoreField: string;
  pdfModField: string;
  pdfSaveProfField: string;
  pdfSaveValField: string;
}

export const ABILITIES: AbilityDefinition[] = [
  {
    key: "STR",
    label: "Forza",
    shortLabel: "For",
    pdfScoreField: "STR",
    pdfModField: "STRmod",
    pdfSaveProfField: "STRprof",
    pdfSaveValField: "ST Strength",
  },
  {
    key: "DEX",
    label: "Destrezza",
    shortLabel: "Des",
    pdfScoreField: "DEX",
    pdfModField: "DEXmod",
    pdfSaveProfField: "DEXprof",
    pdfSaveValField: "ST Dexterity",
  },
  {
    key: "CON",
    label: "Costituzione",
    shortLabel: "Cos",
    pdfScoreField: "CON",
    pdfModField: "CONmod",
    pdfSaveProfField: "CONprof",
    pdfSaveValField: "ST Constitution",
  },
  {
    key: "INT",
    label: "Intelligenza",
    shortLabel: "Int",
    pdfScoreField: "INT",
    pdfModField: "INTmod",
    pdfSaveProfField: "INTprof",
    pdfSaveValField: "ST Intelligence",
  },
  {
    key: "WIS",
    label: "Saggezza",
    shortLabel: "Sag",
    pdfScoreField: "WIS",
    pdfModField: "WISmod",
    pdfSaveProfField: "WISprof",
    pdfSaveValField: "ST Wisdom",
  },
  {
    key: "CHA",
    label: "Carisma",
    shortLabel: "Car",
    pdfScoreField: "CHA",
    pdfModField: "CHAmod",
    pdfSaveProfField: "CHAprof",
    pdfSaveValField: "ST Charisma",
  },
];

export type SkillKey =
  | "ACRO"
  | "ANIM"
  | "ARC"
  | "ATH"
  | "STLTH"
  | "INV"
  | "DEC"
  | "INTI"
  | "PERF"
  | "INS"
  | "MED"
  | "NAT"
  | "PERC"
  | "PERS"
  | "SLE"
  | "REL"
  | "SURV"
  | "HIST";

export interface SkillDefinition {
  key: SkillKey;
  label: string;
  ability: AbilityKey;
  pdfValField: string;
  pdfProfField: string;
  pdfExpField: string;
}

export const SKILLS: SkillDefinition[] = [
  {
    key: "ACRO",
    label: "Acrobazia",
    ability: "DEX",
    pdfValField: "ACRO",
    pdfProfField: "ACROP",
    pdfExpField: "ACROPE",
  },
  {
    key: "ANIM",
    label: "Addestrare Animali",
    ability: "WIS",
    pdfValField: "ANIM",
    pdfProfField: "ANIMP",
    pdfExpField: "ANIMPE",
  },
  {
    key: "ARC",
    label: "Arcano",
    ability: "INT",
    pdfValField: "ARC",
    pdfProfField: "ARCP",
    pdfExpField: "ARCPE",
  },
  {
    key: "ATH",
    label: "Atletica",
    ability: "STR",
    pdfValField: "ATH",
    pdfProfField: "ATHP",
    pdfExpField: "ATHPE",
  },
  {
    key: "STLTH",
    label: "Furtività",
    ability: "DEX",
    pdfValField: "STLTH",
    pdfProfField: "STLTHP",
    pdfExpField: "STLTHPE",
  },
  {
    key: "INV",
    label: "Indagare",
    ability: "INT",
    pdfValField: "INV",
    pdfProfField: "INVP",
    pdfExpField: "INVPE",
  },
  {
    key: "DEC",
    label: "Inganno",
    ability: "CHA",
    pdfValField: "DEC",
    pdfProfField: "DECP",
    pdfExpField: "DECPE",
  },
  {
    key: "INTI",
    label: "Intimidire",
    ability: "CHA",
    pdfValField: "INTI",
    pdfProfField: "INTIP",
    pdfExpField: "INTIPE",
  },
  {
    key: "PERF",
    label: "Intrattenere",
    ability: "CHA",
    pdfValField: "PERF",
    pdfProfField: "PERFP",
    pdfExpField: "PERFPE",
  },
  {
    key: "INS",
    label: "Intuizione",
    ability: "WIS",
    pdfValField: "INS",
    pdfProfField: "INSP",
    pdfExpField: "INSPE",
  },
  {
    key: "MED",
    label: "Medicina",
    ability: "WIS",
    pdfValField: "MED",
    pdfProfField: "MEDP",
    pdfExpField: "MEDPE",
  },
  {
    key: "NAT",
    label: "Natura",
    ability: "INT",
    pdfValField: "NAT",
    pdfProfField: "NATP",
    pdfExpField: "NATPE",
  },
  {
    key: "PERC",
    label: "Percezione",
    ability: "WIS",
    pdfValField: "PERC",
    pdfProfField: "PERCP",
    pdfExpField: "PERCPE",
  },
  {
    key: "PERS",
    label: "Persuasione",
    ability: "CHA",
    pdfValField: "PERS",
    pdfProfField: "PERSP",
    pdfExpField: "PERSPE",
  },
  {
    key: "SLE",
    label: "Rapidità di Mano",
    ability: "DEX",
    pdfValField: "SLE",
    pdfProfField: "SLEP",
    pdfExpField: "SLEPE",
  },
  {
    key: "REL",
    label: "Religione",
    ability: "INT",
    pdfValField: "REL",
    pdfProfField: "RELP",
    pdfExpField: "RELPE",
  },
  {
    key: "SURV",
    label: "Sopravvivenza",
    ability: "WIS",
    pdfValField: "SURV",
    pdfProfField: "SURVP",
    pdfExpField: "SURVPE",
  },
  {
    key: "HIST",
    label: "Storia",
    ability: "INT",
    pdfValField: "HIST",
    pdfProfField: "HISTP",
    pdfExpField: "HISTPE",
  },
];

export interface AbilityState {
  score: string;
  modOverride: string;
  saveProficient: boolean;
  saveOverride: string;
}

export interface SkillState {
  proficient: boolean;
  expertise: boolean;
  override: string;
}

export interface AttackEntry {
  name: string;
  atkBonus: string;
  damage: string;
}

export interface AmmoEntry {
  name: string;
  quantity: string;
}

export interface ConsumableEntry {
  name: string;
  uses: string;
}

export interface LimitedFeatureEntry {
  name: string;
  recoverySR: boolean; // RB: Riposo Breve
  recoveryLR: boolean; // RL: Riposo Lungo
  recoveryDawn: boolean; // AL: Alba
  total: string;
  used: string;
}

export interface InventoryItemEntry {
  name: string;
  weight: string;
}

export interface SpellEntry {
  prepared: boolean;
  name: string;
}

export interface SpellLevelSection {
  level: number;
  slotsTotal: string;
  slotsUsed: string;
  spells: SpellEntry[];
}

export interface CharacterSheetData {
  // --- PAGINA 1: Intestazione e Valori Principali ---
  characterName: string;
  className: string; // PDF: ClassLevel
  level: string; // PDF: Background
  playerName: string; // PDF: PlayerName
  race: string; // PDF: "Race "
  background: string; // PDF: Alignment
  alignment: string; // PDF: XP
  gender: string; // PDF: Nex_XP

  inspiration: [boolean, boolean, boolean, boolean]; // insp1..insp4
  proficiencyBonusOverride: string; // ProfBonus
  passivePerceptionOverride: string; // Passive

  abilities: Record<AbilityKey, AbilityState>;
  skills: Record<SkillKey, SkillState>;

  // Difesa, Salute e Stato
  ac: string; // AC
  acTemp: string; // AC_Temp
  initiativeOverride: string; // Initiative
  speed: string; // Speed
  vision: string; // Vision
  darkvision: boolean; // Check Box 12
  exhaustion: string; // Exhaustion
  madnessLevel: string; // MadnessLvl
  abilitySaveDC: string; // AbilitySaveDC

  hpMax: string; // HPMax
  hpCurrent: string; // HPCurrent
  hpTemp: string; // HPTemp

  hitDice1: { die: string; total: string; used: string }; // HD, HDTotal, HDLeft
  hitDice2: { die: string; total: string; used: string }; // HD2, HDTotal2, HDLeft2

  deathSaves: {
    successes: [boolean, boolean, boolean]; // Check Box 120000, 13, 14
    failures: [boolean, boolean, boolean]; // Check Box 15, 16, 17
  };

  // Attacchi & Munizioni (Pag 1)
  attacks: AttackEntry[]; // 6 righe
  ammo: AmmoEntry[]; // 3 righe
  page1SpellSaveDC: string; // SpellSaveDC  2
  page1SpellAtkBonus: string; // SpellAtkBonus 2

  // Equipaggiamento Rapido, Armatura e Monete (Pag 1)
  armorInfo: {
    name: string; // Armor
    stealthDisadvantage: boolean; // StealthDisv
    ac: string; // ArmorAC
    maxDex: string; // ArmorDex
    strReq: string; // ArmorStr
    shield: string; // Shield
  };

  coins: {
    cp: string; // CP (MR)
    sp: string; // SP (MA)
    ep: string; // EP (ME)
    gp: string; // GP (MO)
    pp: string; // PP (MP)
  };

  consumables: ConsumableEntry[]; // 6 righe (Consum 1..6, ConsumLeft 1..6)
  attunedItems: [string, string, string]; // AttunedMagic 1..3

  // Competenze, Linguaggi e Talenti (Pag 1)
  proficiencies: {
    armorLight: boolean; // ArmorLight
    armorMedium: boolean; // ArmorMed
    armorHeavy: boolean; // ArmorHea
    shields: boolean; // Shields
    weaponsSimple: boolean; // WpnSim
    weaponsMartial: boolean; // WpnMar
    weaponsOtherCheck: boolean; // WpnOth 1
    weaponsOtherText1: string; // WpnOth 2
    weaponsOtherText2: string; // WEAPONStype 1
    weaponsOtherText3: string; // WEAPONStype 2
    tools1: string; // TOOLS 1
    tools2: string; // TOOLS 2
    tools3: string; // TOOLS 3
    languages1: string; // Languages 1
    languages2: string; // Languages 2
  };
  feats: string; // Talenti1

  // Privilegi e Tratti (Pag 1)
  limitedFeatures: LimitedFeatureEntry[]; // 6 righe
  racialAndBackgroundTraits: string; // Testo2
  classFeatures: string; // Testo3

  // --- PAGINA 2: Background, Personalità e Inventario ---
  age: string; // AGE
  height: string; // HEIGHT
  weight: string; // WEIGHT
  eyes: string; // EYES
  skin: string; // SKIN
  hair: string; // HAIR

  appearanceText: string; // AppearanceText
  symbolName: string; // SymbolNAME
  faction: string; // Fazione
  portraitImage?: string; // Image1_af_image (Data URL)
  symbolImage?: string; // Image2_af_image (Data URL)

  personalityTraits: string; // Tratti car
  ideals: string; // Ideali1
  bonds: string; // LEgami1
  flaws: string; // DIfetti1
  enemies: string; // Nemici1
  additionalTraits: string; // Testo6

  inventoryCol1: InventoryItemEntry[]; // 24 righe (eq2..eq25, Peso2..Peso26)
  inventoryCol2: InventoryItemEntry[]; // 21 righe (eq27..eq47, Peso28..Peso48)
  carriedWeightOverride: string; // PesoTrasportabile (nel PDF: "PESO TRASPORTATO Kg")
  maxCarryWeightOverride: string; // PesoMassimo (nel PDF: "PESO MASSIMO TRASPORTABILE Kg")

  // --- PAGINA 3: Incantesimi ---
  spellcastingClass: string; // Spellcasting Class 2
  spellcastingAbility: string; // SpellcastingAbility 2
  spellSaveDCOverride: string; // SpellSaveDC  21
  spellAtkBonusOverride: string; // SpellAtkBonus 21

  cantrips: string[]; // 8 righe (0 1..0 8)
  spellLevels: Record<number, SpellLevelSection>; // Livelli 1..9
}

export const SPELL_ROWS_PER_LEVEL: Record<number, number> = {
  1: 13,
  2: 13,
  3: 13,
  4: 13,
  5: 9,
  6: 9,
  7: 9,
  8: 7,
  9: 7,
};

/**
 * Crea una scheda personaggio vuota con tutti gli array inizializzati alle dimensioni della scheda PDF.
 */
export function createEmptyCharacterSheet(): CharacterSheetData {
  const abilities = {} as Record<AbilityKey, AbilityState>;
  for (const ab of ABILITIES) {
    abilities[ab.key] = {
      score: "",
      modOverride: "",
      saveProficient: false,
      saveOverride: "",
    };
  }

  const skills = {} as Record<SkillKey, SkillState>;
  for (const sk of SKILLS) {
    skills[sk.key] = {
      proficient: false,
      expertise: false,
      override: "",
    };
  }

  const spellLevels: Record<number, SpellLevelSection> = {};
  for (let lvl = 1; lvl <= 9; lvl++) {
    const rowCount = SPELL_ROWS_PER_LEVEL[lvl] ?? 9;
    spellLevels[lvl] = {
      level: lvl,
      slotsTotal: "",
      slotsUsed: "",
      spells: Array.from({ length: rowCount }, () => ({
        prepared: false,
        name: "",
      })),
    };
  }

  return {
    characterName: "",
    className: "",
    level: "",
    playerName: "",
    race: "",
    background: "",
    alignment: "",
    gender: "",

    inspiration: [false, false, false, false],
    proficiencyBonusOverride: "",
    passivePerceptionOverride: "",

    abilities,
    skills,

    ac: "",
    acTemp: "",
    initiativeOverride: "",
    speed: "",
    vision: "",
    darkvision: false,
    exhaustion: "",
    madnessLevel: "",
    abilitySaveDC: "",

    hpMax: "",
    hpCurrent: "",
    hpTemp: "",

    hitDice1: { die: "", total: "", used: "" },
    hitDice2: { die: "", total: "", used: "" },

    deathSaves: {
      successes: [false, false, false],
      failures: [false, false, false],
    },

    attacks: Array.from({ length: 6 }, () => ({
      name: "",
      atkBonus: "",
      damage: "",
    })),
    ammo: Array.from({ length: 3 }, () => ({
      name: "",
      quantity: "",
    })),
    page1SpellSaveDC: "",
    page1SpellAtkBonus: "",

    armorInfo: {
      name: "",
      stealthDisadvantage: false,
      ac: "",
      maxDex: "",
      strReq: "",
      shield: "",
    },

    coins: {
      cp: "",
      sp: "",
      ep: "",
      gp: "",
      pp: "",
    },

    consumables: Array.from({ length: 6 }, () => ({
      name: "",
      uses: "",
    })),
    attunedItems: ["", "", ""],

    proficiencies: {
      armorLight: false,
      armorMedium: false,
      armorHeavy: false,
      shields: false,
      weaponsSimple: false,
      weaponsMartial: false,
      weaponsOtherCheck: false,
      weaponsOtherText1: "",
      weaponsOtherText2: "",
      weaponsOtherText3: "",
      tools1: "",
      tools2: "",
      tools3: "",
      languages1: "",
      languages2: "",
    },
    feats: "",

    limitedFeatures: Array.from({ length: 6 }, () => ({
      name: "",
      recoverySR: false,
      recoveryLR: false,
      recoveryDawn: false,
      total: "",
      used: "",
    })),
    racialAndBackgroundTraits: "",
    classFeatures: "",

    age: "",
    height: "",
    weight: "",
    eyes: "",
    skin: "",
    hair: "",

    appearanceText: "",
    symbolName: "",
    faction: "",

    personalityTraits: "",
    ideals: "",
    bonds: "",
    flaws: "",
    enemies: "",
    additionalTraits: "",

    inventoryCol1: Array.from({ length: 24 }, () => ({
      name: "",
      weight: "",
    })),
    inventoryCol2: Array.from({ length: 21 }, () => ({
      name: "",
      weight: "",
    })),
    carriedWeightOverride: "",
    maxCarryWeightOverride: "",

    spellcastingClass: "",
    spellcastingAbility: "",
    spellSaveDCOverride: "",
    spellAtkBonusOverride: "",

    cantrips: Array.from({ length: 8 }, () => ""),
    spellLevels,
  };
}

// ============================================================================
// FUNZIONI DI CALCOLO AUTOMATICO D&D 5e CON SUPPORTO OVERRIDE MANUALE
// ============================================================================

/**
 * Formatta un numero intero come modificatore D&D (es. +3, 0, -1) o semplice numero come nel PDF Toradol.
 */
export function formatSignedModifier(value: number, forcePlus = false): string {
  if (forcePlus && value >= 0) return `+${value}`;
  return String(value);
}

/**
 * Calcola il modificatore di una caratteristica a partire dal punteggio (es. 16 -> 3, 8 -> -1).
 */
export function computeAbilityModifier(scoreStr: string): number | null {
  const clean = scoreStr.trim();
  if (!clean) return null;
  const parsed = parseInt(clean, 10);
  if (Number.isNaN(parsed)) return null;
  return Math.floor((parsed - 10) / 2);
}

/**
 * Restituisce il modificatore effettivo di una caratteristica (override manuale se presente, altrimenti calcolato dal punteggio).
 */
export function getEffectiveAbilityMod(state: AbilityState): number | null {
  if (state.modOverride.trim() !== "") {
    const parsed = parseInt(state.modOverride.trim(), 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return computeAbilityModifier(state.score);
}

/**
 * Calcola il Bonus di Competenza dal livello del personaggio (1..20 -> +2..+6).
 */
export function computeProficiencyBonus(levelStr: string): number {
  const clean = levelStr.trim();
  if (!clean) return 2;
  // Supporta anche stringhe tipo "4" o "Liv 4" o "3/2"
  const match = clean.match(/\d+/);
  if (!match) return 2;
  const lvl = Math.max(1, Math.min(20, parseInt(match[0], 10)));
  return Math.ceil(lvl / 4) + 1;
}

/**
 * Restituisce il Bonus di Competenza effettivo (override manuale o calcolato dal livello).
 */
export function getEffectiveProficiencyBonus(sheet: CharacterSheetData): number {
  const override = sheet.proficiencyBonusOverride.trim();
  if (override !== "") {
    const parsed = parseInt(override.replace("+", ""), 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return computeProficiencyBonus(sheet.level);
}

/**
 * Calcola il Tiro Salvezza effettivo per una caratteristica.
 */
export function getEffectiveSavingThrow(
  sheet: CharacterSheetData,
  abilityKey: AbilityKey
): string {
  const ab = sheet.abilities[abilityKey];
  if (ab.saveOverride.trim() !== "") {
    return ab.saveOverride.trim();
  }
  const mod = getEffectiveAbilityMod(ab);
  if (mod === null) return "";
  const prof = getEffectiveProficiencyBonus(sheet);
  const total = mod + (ab.saveProficient ? prof : 0);
  return String(total);
}

/**
 * Calcola il bonus effettivo di un'Abilità (considerando Competenza e Maestria).
 */
export function getEffectiveSkillBonus(
  sheet: CharacterSheetData,
  skillKey: SkillKey
): string {
  const sk = sheet.skills[skillKey];
  if (sk.override.trim() !== "") {
    return sk.override.trim();
  }
  const def = SKILLS.find((s) => s.key === skillKey);
  if (!def) return "";
  const mod = getEffectiveAbilityMod(sheet.abilities[def.ability]);
  if (mod === null) return "";
  const prof = getEffectiveProficiencyBonus(sheet);
  const multiplier = sk.expertise ? 2 : sk.proficient ? 1 : 0;
  return String(mod + prof * multiplier);
}

/**
 * Calcola la Saggezza (Percezione) Passiva effettiva (10 + bonus Percezione).
 */
export function getEffectivePassivePerception(sheet: CharacterSheetData): string {
  if (sheet.passivePerceptionOverride.trim() !== "") {
    return sheet.passivePerceptionOverride.trim();
  }
  const percBonusStr = getEffectiveSkillBonus(sheet, "PERC");
  if (percBonusStr === "") return "";
  const parsed = parseInt(percBonusStr, 10);
  if (Number.isNaN(parsed)) return "";
  return String(10 + parsed);
}

/**
 * Calcola l'Iniziativa effettiva (override manuale o modificatore di Destrezza).
 */
export function getEffectiveInitiative(sheet: CharacterSheetData): string {
  if (sheet.initiativeOverride.trim() !== "") {
    return sheet.initiativeOverride.trim();
  }
  const dexMod = getEffectiveAbilityMod(sheet.abilities.DEX);
  return dexMod !== null ? String(dexMod) : "";
}

/**
 * Riconosce la caratteristica da incantatore scritta in italiano o inglese (es. "Intelligenza", "Saggezza", "Carisma")
 */
export function resolveSpellcastingAbilityKey(
  rawAbility: string
): AbilityKey | null {
  const norm = rawAbility.trim().toLowerCase();
  if (!norm) return null;
  if (norm.startsWith("int")) return "INT";
  if (norm.startsWith("sag") || norm.startsWith("wis")) return "WIS";
  if (norm.startsWith("car") || norm.startsWith("cha")) return "CHA";
  if (norm.startsWith("cos") || norm.startsWith("con")) return "CON";
  if (norm.startsWith("des") || norm.startsWith("dex")) return "DEX";
  if (norm.startsWith("for") || norm.startsWith("str")) return "STR";
  return null;
}

/**
 * Calcola la CD Tiro Salvezza Incantesimi effettiva (8 + competenza + mod caratteristica da incantatore).
 */
export function getEffectiveSpellSaveDC(sheet: CharacterSheetData): string {
  if (sheet.spellSaveDCOverride.trim() !== "") {
    return sheet.spellSaveDCOverride.trim();
  }
  const abKey = resolveSpellcastingAbilityKey(sheet.spellcastingAbility);
  if (!abKey) return "";
  const mod = getEffectiveAbilityMod(sheet.abilities[abKey]);
  if (mod === null) return "";
  const prof = getEffectiveProficiencyBonus(sheet);
  return String(8 + prof + mod);
}

/**
 * Calcola il Bonus di Attacco Incantesimi effettivo (competenza + mod caratteristica da incantatore).
 */
export function getEffectiveSpellAtkBonus(sheet: CharacterSheetData): string {
  if (sheet.spellAtkBonusOverride.trim() !== "") {
    return sheet.spellAtkBonusOverride.trim();
  }
  const abKey = resolveSpellcastingAbilityKey(sheet.spellcastingAbility);
  if (!abKey) return "";
  const mod = getEffectiveAbilityMod(sheet.abilities[abKey]);
  if (mod === null) return "";
  const prof = getEffectiveProficiencyBonus(sheet);
  return String(prof + mod);
}

/**
 * Calcola il peso totale trasportato in Kg sommando i pesi dell'inventario.
 */
export function getEffectiveCarriedWeight(sheet: CharacterSheetData): string {
  if (sheet.carriedWeightOverride.trim() !== "") {
    return sheet.carriedWeightOverride.trim();
  }
  let sum = 0;
  let hasAnyWeight = false;
  const allItems = [...sheet.inventoryCol1, ...sheet.inventoryCol2];
  for (const item of allItems) {
    const clean = item.weight.trim().replace(",", ".");
    if (!clean) continue;
    const num = parseFloat(clean);
    if (!Number.isNaN(num)) {
      sum += num;
      hasAnyWeight = true;
    }
  }
  if (!hasAnyWeight) return "0";
  return Number.isInteger(sum) ? String(sum) : sum.toFixed(1);
}

/**
 * Calcola il peso massimo trasportabile in Kg secondo D&D 5e italiano (Punteggio Forza * 7.5 Kg).
 */
export function getEffectiveMaxCarryWeight(sheet: CharacterSheetData): string {
  if (sheet.maxCarryWeightOverride.trim() !== "") {
    return sheet.maxCarryWeightOverride.trim();
  }
  const strScore = parseInt(sheet.abilities.STR.score.trim(), 10);
  if (Number.isNaN(strScore)) return "";
  const maxKg = strScore * 7.5;
  return Number.isInteger(maxKg) ? String(maxKg) : maxKg.toFixed(1);
}
