"use client";

import { useState, useCallback, useMemo, useSyncExternalStore } from "react";
import {
  createEmptyCharacterSheet,
  type AbilityKey,
  type AbilityState,
  type AmmoEntry,
  type AttackEntry,
  type CharacterSheetData,
  type ConsumableEntry,
  type InventoryItemEntry,
  type LimitedFeatureEntry,
  type SkillKey,
  type SkillState,
  type SpellEntry,
} from "@/types/characterSheet";
import {
  importCharacterSheetFromPdf,
  exportCharacterSheetToPdf,
  buildPdfFieldValuesMap,
  applyPdfFieldChange,
} from "@/lib/characterSheetPdf";

const STORAGE_KEY_CHARACTER_SHEET = "manuale_dnd_character_sheet_v2";

function getCharacterSheetStorageKey(accountId?: string): string {
  return accountId
    ? `${STORAGE_KEY_CHARACTER_SHEET}_${accountId}`
    : STORAGE_KEY_CHARACTER_SHEET;
}

function mergeWithEmptyCharacterSheet(
  parsed: Partial<CharacterSheetData> | null | undefined,
  defaultCharacterName = ""
): CharacterSheetData {
  const fallback = createEmptyCharacterSheet();
  if (defaultCharacterName) {
    fallback.characterName = defaultCharacterName;
  }
  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }
  return {
    ...fallback,
    ...parsed,
    characterName: parsed.characterName?.trim() || fallback.characterName,
    abilities: {
      ...fallback.abilities,
      ...(parsed.abilities ?? {}),
    },
    skills: {
      ...fallback.skills,
      ...(parsed.skills ?? {}),
    },
    armorInfo: {
      ...fallback.armorInfo,
      ...(parsed.armorInfo ?? {}),
    },
    coins: {
      ...fallback.coins,
      ...(parsed.coins ?? {}),
    },
    proficiencies: {
      ...fallback.proficiencies,
      ...(parsed.proficiencies ?? {}),
    },
    hitDice1: {
      ...fallback.hitDice1,
      ...(parsed.hitDice1 ?? {}),
    },
    hitDice2: {
      ...fallback.hitDice2,
      ...(parsed.hitDice2 ?? {}),
    },
    deathSaves: {
      ...fallback.deathSaves,
      ...(parsed.deathSaves ?? {}),
    },
    spellLevels: {
      ...fallback.spellLevels,
      ...(parsed.spellLevels ?? {}),
    },
  };
}

function loadInitialCharacterSheet(
  accountId?: string,
  defaultCharacterName = ""
): CharacterSheetData {
  if (typeof window === "undefined") {
    return mergeWithEmptyCharacterSheet(null, defaultCharacterName);
  }
  try {
    const raw = localStorage.getItem(getCharacterSheetStorageKey(accountId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CharacterSheetData>;
      return mergeWithEmptyCharacterSheet(parsed, defaultCharacterName);
    }
  } catch {
    // Ignora errori di parsing localStorage
  }
  return mergeWithEmptyCharacterSheet(null, defaultCharacterName);
}

const emptySubscribe = () => () => {};

export interface UseCharacterSheetOptions {
  accountId?: string;
  defaultCharacterName?: string;
}

/**
 * Hook per la gestione dello stato, salvataggio in localStorage, sincronizzazione cloud,
 * riposo breve/lungo e import/export PDF della scheda personaggio.
 */
export function useCharacterSheet({
  accountId,
  defaultCharacterName = "",
}: UseCharacterSheetOptions = {}) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const storageKey = useMemo(
    () => getCharacterSheetStorageKey(accountId),
    [accountId]
  );

  const [sheetState, setSheetState] = useState<CharacterSheetData>(() =>
    loadInitialCharacterSheet(accountId, defaultCharacterName)
  );
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(null);

  const sheet = useMemo(
    () =>
      isHydrated
        ? sheetState
        : mergeWithEmptyCharacterSheet(null, defaultCharacterName),
    [isHydrated, sheetState, defaultCharacterName]
  );

  const pdfFieldValues = useMemo(() => buildPdfFieldValuesMap(sheet), [sheet]);

  const showToast = useCallback(
    (type: "success" | "info" | "error", text: string) => {
      setStatusMessage({ type, text });
      setTimeout(() => {
        setStatusMessage((prev) => (prev?.text === text ? null : prev));
      }, 3500);
    },
    []
  );

  const persistAndSet = useCallback(
    (
      updater:
        | CharacterSheetData
        | ((prev: CharacterSheetData) => CharacterSheetData)
    ) => {
      setSheetState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // Ignora errori di quota localStorage
          }
        }
        return next;
      });
    },
    [storageKey]
  );

  /**
   * Idrata la scheda personaggio con i dati caricati dal Cloud per l'account attivo
   */
  const hydrateSheet = useCallback(
    (cloudSheet: Partial<CharacterSheetData>) => {
      const merged = mergeWithEmptyCharacterSheet(
        cloudSheet,
        defaultCharacterName
      );
      setSheetState(merged);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, JSON.stringify(merged));
        } catch {
          // Ignora errori di quota localStorage
        }
      }
    },
    [defaultCharacterName, storageKey]
  );

  /**
   * Aggiorna un campo del PDF direttamente tramite il suo fieldName AcroForm originale,
   * ricalcolando automaticamente i campi derivati non sovrascritti.
   */
  const updatePdfField = useCallback(
    (fieldName: string, value: string | boolean) => {
      persistAndSet((prev) => applyPdfFieldChange(prev, fieldName, value));
    },
    [persistAndSet]
  );

  const updateField = useCallback(
    <K extends keyof CharacterSheetData>(
      key: K,
      value: CharacterSheetData[K]
    ) => {
      persistAndSet((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [persistAndSet]
  );

  const updateAbility = useCallback(
    (abilityKey: AbilityKey, patch: Partial<AbilityState>) => {
      persistAndSet((prev) => ({
        ...prev,
        abilities: {
          ...prev.abilities,
          [abilityKey]: {
            ...prev.abilities[abilityKey],
            ...patch,
          },
        },
      }));
    },
    [persistAndSet]
  );

  const updateSkill = useCallback(
    (skillKey: SkillKey, patch: Partial<SkillState>) => {
      persistAndSet((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillKey]: {
            ...prev.skills[skillKey],
            ...patch,
          },
        },
      }));
    },
    [persistAndSet]
  );

  const toggleInspiration = useCallback(
    (index: 0 | 1 | 2 | 3) => {
      persistAndSet((prev) => {
        const nextInsp: [boolean, boolean, boolean, boolean] = [
          ...prev.inspiration,
        ];
        nextInsp[index] = !nextInsp[index];
        return {
          ...prev,
          inspiration: nextInsp,
        };
      });
    },
    [persistAndSet]
  );

  const toggleDeathSave = useCallback(
    (type: "successes" | "failures", index: 0 | 1 | 2) => {
      persistAndSet((prev) => {
        const nextArr: [boolean, boolean, boolean] = [
          ...prev.deathSaves[type],
        ];
        nextArr[index] = !nextArr[index];
        return {
          ...prev,
          deathSaves: {
            ...prev.deathSaves,
            [type]: nextArr,
          },
        };
      });
    },
    [persistAndSet]
  );

  const adjustHp = useCallback(
    (delta: number) => {
      persistAndSet((prev) => {
        const current = parseInt(prev.hpCurrent.trim() || "0", 10) || 0;
        const max = parseInt(prev.hpMax.trim() || "0", 10);
        const temp = parseInt(prev.hpTemp.trim() || "0", 10) || 0;

        if (delta < 0 && temp > 0) {
          const dmg = Math.abs(delta);
          if (temp >= dmg) {
            const newTemp = temp - dmg;
            return {
              ...prev,
              hpTemp: newTemp > 0 ? String(newTemp) : "",
            };
          } else {
            const remainingDmg = dmg - temp;
            const newCurrent = Math.max(0, current - remainingDmg);
            return {
              ...prev,
              hpTemp: "",
              hpCurrent: String(newCurrent),
            };
          }
        }

        let nextHp = Math.max(0, current + delta);
        if (!Number.isNaN(max) && max > 0 && delta > 0) {
          nextHp = Math.min(max, nextHp);
        }
        return {
          ...prev,
          hpCurrent: String(nextHp),
        };
      });
    },
    [persistAndSet]
  );

  const updateAttack = useCallback(
    (index: number, patch: Partial<AttackEntry>) => {
      persistAndSet((prev) => {
        const next = [...prev.attacks];
        next[index] = { ...next[index], ...patch };
        return { ...prev, attacks: next };
      });
    },
    [persistAndSet]
  );

  const updateAmmo = useCallback(
    (index: number, patch: Partial<AmmoEntry>) => {
      persistAndSet((prev) => {
        const next = [...prev.ammo];
        next[index] = { ...next[index], ...patch };
        return { ...prev, ammo: next };
      });
    },
    [persistAndSet]
  );

  const updateArmorInfo = useCallback(
    (patch: Partial<CharacterSheetData["armorInfo"]>) => {
      persistAndSet((prev) => ({
        ...prev,
        armorInfo: {
          ...prev.armorInfo,
          ...patch,
        },
      }));
    },
    [persistAndSet]
  );

  const updateCoins = useCallback(
    (patch: Partial<CharacterSheetData["coins"]>) => {
      persistAndSet((prev) => ({
        ...prev,
        coins: {
          ...prev.coins,
          ...patch,
        },
      }));
    },
    [persistAndSet]
  );

  const updateConsumable = useCallback(
    (index: number, patch: Partial<ConsumableEntry>) => {
      persistAndSet((prev) => {
        const next = [...prev.consumables];
        next[index] = { ...next[index], ...patch };
        return { ...prev, consumables: next };
      });
    },
    [persistAndSet]
  );

  const updateAttunedItem = useCallback(
    (index: 0 | 1 | 2, value: string) => {
      persistAndSet((prev) => {
        const next: [string, string, string] = [...prev.attunedItems];
        next[index] = value;
        return { ...prev, attunedItems: next };
      });
    },
    [persistAndSet]
  );

  const updateProficiencies = useCallback(
    (patch: Partial<CharacterSheetData["proficiencies"]>) => {
      persistAndSet((prev) => ({
        ...prev,
        proficiencies: {
          ...prev.proficiencies,
          ...patch,
        },
      }));
    },
    [persistAndSet]
  );

  const updateLimitedFeature = useCallback(
    (index: number, patch: Partial<LimitedFeatureEntry>) => {
      persistAndSet((prev) => {
        const next = [...prev.limitedFeatures];
        next[index] = { ...next[index], ...patch };
        return { ...prev, limitedFeatures: next };
      });
    },
    [persistAndSet]
  );

  const updateInventoryItem = useCallback(
    (col: 1 | 2, index: number, patch: Partial<InventoryItemEntry>) => {
      persistAndSet((prev) => {
        if (col === 1) {
          const next = [...prev.inventoryCol1];
          next[index] = { ...next[index], ...patch };
          return { ...prev, inventoryCol1: next };
        } else {
          const next = [...prev.inventoryCol2];
          next[index] = { ...next[index], ...patch };
          return { ...prev, inventoryCol2: next };
        }
      });
    },
    [persistAndSet]
  );

  const updateCantrip = useCallback(
    (index: number, value: string) => {
      persistAndSet((prev) => {
        const next = [...prev.cantrips];
        next[index] = value;
        return { ...prev, cantrips: next };
      });
    },
    [persistAndSet]
  );

  const updateSpellLevelMeta = useCallback(
    (
      level: number,
      patch: Partial<{ slotsTotal: string; slotsUsed: string }>
    ) => {
      persistAndSet((prev) => ({
        ...prev,
        spellLevels: {
          ...prev.spellLevels,
          [level]: {
            ...prev.spellLevels[level],
            ...patch,
          },
        },
      }));
    },
    [persistAndSet]
  );

  const updateSpell = useCallback(
    (level: number, index: number, patch: Partial<SpellEntry>) => {
      persistAndSet((prev) => {
        const section = prev.spellLevels[level];
        if (!section) return prev;
        const nextSpells = [...section.spells];
        nextSpells[index] = { ...nextSpells[index], ...patch };
        return {
          ...prev,
          spellLevels: {
            ...prev.spellLevels,
            [level]: {
              ...section,
              spells: nextSpells,
            },
          },
        };
      });
    },
    [persistAndSet]
  );

  const performShortRest = useCallback(() => {
    persistAndSet((prev) => ({
      ...prev,
      limitedFeatures: prev.limitedFeatures.map((lf) =>
        lf.recoverySR ? { ...lf, used: "0" } : lf
      ),
    }));
    showToast(
      "info",
      "Riposo Breve completato: ricaricati i tratti con recupero RB."
    );
  }, [persistAndSet, showToast]);

  const performLongRest = useCallback(() => {
    persistAndSet((prev) => {
      const nextSpellLevels = { ...prev.spellLevels };
      for (let lvl = 1; lvl <= 9; lvl++) {
        if (nextSpellLevels[lvl]) {
          nextSpellLevels[lvl] = {
            ...nextSpellLevels[lvl],
            slotsUsed: "",
          };
        }
      }

      const recoverHitDice = (hd: {
        die: string;
        total: string;
        used: string;
      }) => {
        const tot = parseInt(hd.total.trim(), 10);
        const used = parseInt(hd.used.trim(), 10);
        if (Number.isNaN(tot) || Number.isNaN(used) || used <= 0) {
          return hd;
        }
        const recovered = Math.max(1, Math.floor(tot / 2));
        const nextUsed = Math.max(0, used - recovered);
        return {
          ...hd,
          used: String(nextUsed),
        };
      };

      return {
        ...prev,
        hpCurrent: prev.hpMax.trim() !== "" ? prev.hpMax : prev.hpCurrent,
        hpTemp: "",
        deathSaves: {
          successes: [false, false, false],
          failures: [false, false, false],
        },
        hitDice1: recoverHitDice(prev.hitDice1),
        hitDice2: recoverHitDice(prev.hitDice2),
        limitedFeatures: prev.limitedFeatures.map((lf) =>
          lf.recoverySR || lf.recoveryLR || lf.recoveryDawn
            ? { ...lf, used: "0" }
            : lf
        ),
        spellLevels: nextSpellLevels,
      };
    });
    showToast(
      "success",
      "Riposo Lungo completato: PF, slot incantesimi e privilegi ripristinati!"
    );
  }, [persistAndSet, showToast]);

  const importFromPdfFile = useCallback(
    async (file: File) => {
      setIsImporting(true);
      try {
        const buffer = await file.arrayBuffer();
        const imported = await importCharacterSheetFromPdf(buffer);
        persistAndSet(imported);
        const charLabel = imported.characterName.trim() || file.name;
        showToast("success", `Scheda di "${charLabel}" importata con successo!`);
      } catch (err) {
        console.error("Errore importazione scheda PDF:", err);
        showToast(
          "error",
          "Impossibile leggere i campi del PDF. Assicurati che sia una scheda D&D 5e editabile."
        );
      } finally {
        setIsImporting(false);
      }
    },
    [persistAndSet, showToast]
  );

  const exportToPdfFile = useCallback(async () => {
    setIsExporting(true);
    try {
      const pdfBytes = await exportCharacterSheetToPdf(sheet);
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = (sheet.characterName.trim() || "Personaggio_DnD5e")
        .replace(/[^a-zA-Z0-9_\-\sÀ-ÿ]/g, "")
        .trim()
        .replace(/\s+/g, "_");
      a.href = url;
      a.download = `Scheda_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("success", `File "Scheda_${safeName}.pdf" scaricato!`);
    } catch (err) {
      console.error("Errore esportazione scheda PDF:", err);
      showToast("error", "Errore durante la generazione del PDF editabile.");
    } finally {
      setIsExporting(false);
    }
  }, [sheet, showToast]);

  const resetSheet = useCallback(() => {
    persistAndSet(mergeWithEmptyCharacterSheet(null, defaultCharacterName));
    showToast("info", "Scheda resettata a nuova scheda vuota.");
  }, [persistAndSet, showToast, defaultCharacterName]);

  return {
    sheet,
    pdfFieldValues,
    isImporting,
    isExporting,
    statusMessage,
    hydrateSheet,
    updatePdfField,
    updateField,
    updateAbility,
    updateSkill,
    toggleInspiration,
    toggleDeathSave,
    adjustHp,
    updateAttack,
    updateAmmo,
    updateArmorInfo,
    updateCoins,
    updateConsumable,
    updateAttunedItem,
    updateProficiencies,
    updateLimitedFeature,
    updateInventoryItem,
    updateCantrip,
    updateSpellLevelMeta,
    updateSpell,
    performShortRest,
    performLongRest,
    importFromPdfFile,
    exportToPdfFile,
    resetSheet,
  };
}
