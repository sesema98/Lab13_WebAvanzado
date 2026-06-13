import { NextResponse } from "next/server";
import { registerCredentialsUser } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const user = await registerCredentialsUser(payload);

    return NextResponse.json(
      {
        message: "Cuenta creada correctamente. Ya puedes iniciar sesión con credenciales.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo registrar la cuenta.",
      },
      { status: 400 },
    );
  }
}
