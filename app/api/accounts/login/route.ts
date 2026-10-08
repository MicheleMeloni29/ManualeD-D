import { NextRequest } from "next/server";
import { verifyAccountCredentials } from "@/config/accounts";
import { loadAccountSave } from "@/lib/accountStorage";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      masterName?: string;
      characterName?: string;
    };

    const masterName = body.masterName ?? "";
    const characterName = body.characterName ?? "";

    const account = verifyAccountCredentials(masterName, characterName);

    if (!account) {
      return Response.json(
        {
          error: "Credenziali non valide",
        },
        { status: 401 }
      );
    }

    const { data, backend } = await loadAccountSave(
      account.id,
      account.characterName
    );

    return Response.json(
      {
        account,
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
    console.error("Errore durante il login account D&D:", err);
    return Response.json(
      {
        error: "Errore interno durante la verifica dell'account.",
      },
      { status: 500 }
    );
  }
}
