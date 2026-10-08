import { NextRequest } from "next/server";
import { verifyAccountAccessById } from "@/config/accounts";
import { loadAccountSave, saveAccountData } from "@/lib/accountStorage";
import type { AccountSaveData } from "@/types/account";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId =
      request.headers.get("x-account-id") ||
      searchParams.get("accountId") ||
      "";
    const masterName =
      request.headers.get("x-master-name") ||
      searchParams.get("masterName") ||
      "";
    const characterName =
      request.headers.get("x-character-name") ||
      searchParams.get("characterName") ||
      "";

    const verified = verifyAccountAccessById(
      accountId,
      masterName,
      characterName
    );

    if (!verified) {
      return Response.json(
        { error: "Sessione non valida o credenziali scadute." },
        { status: 401 }
      );
    }

    const { data, backend } = await loadAccountSave(
      verified.id,
      verified.characterName
    );

    return Response.json(
      {
        account: verified,
        saveData: data,
        backend,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("Errore lettura salvataggio cloud:", err);
    return Response.json(
      { error: "Impossibile recuperare i salvataggi dal server." },
      { status: 500 }
    );
  }
}

async function handleSaveRequest(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      accountId?: string;
      masterName?: string;
      characterName?: string;
      saveData?: Partial<AccountSaveData>;
    };

    const accountId = body.accountId ?? "";
    const masterName = body.masterName ?? "";
    const characterName = body.characterName ?? "";

    const verified = verifyAccountAccessById(
      accountId,
      masterName,
      characterName
    );

    if (!verified) {
      return Response.json(
        { error: "Accesso negato: credenziali account non valide." },
        { status: 401 }
      );
    }

    const { data, backend } = await saveAccountData(
      verified.id,
      verified.characterName,
      body.saveData ?? {}
    );

    return Response.json(
      {
        ok: true,
        account: verified,
        saveData: data,
        backend,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("Errore salvataggio cloud:", err);
    return Response.json(
      { error: "Impossibile salvare i dati sul server." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return handleSaveRequest(request);
}

export async function POST(request: NextRequest) {
  return handleSaveRequest(request);
}
