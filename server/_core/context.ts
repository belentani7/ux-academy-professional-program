import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { randomBytes } from "node:crypto";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const ANONYMOUS_ID_PREFIX = "anon_";
const ANONYMOUS_DISPLAY_NAME = "Alumno invitado";

function createAnonymousOpenId() {
  // 32 bytes provide 256 bits of entropy; the value is only useful together
  // with the signed, HttpOnly session cookie issued below.
  return `${ANONYMOUS_ID_PREFIX}${randomBytes(32).toString("hex")}`;
}

async function createAnonymousSession(
  opts: CreateExpressContextOptions
): Promise<User | null> {
  const openId = createAnonymousOpenId();
  await upsertUser({
    openId,
    name: ANONYMOUS_DISPLAY_NAME,
    email: null,
    loginMethod: "anonymous",
    lastSignedIn: new Date(),
  });

  const user = await getUserByOpenId(openId);
  if (!user) return null;

  const token = await sdk.createSessionToken(openId, {
    name: ANONYMOUS_DISPLAY_NAME,
    expiresInMs: ONE_YEAR_MS,
  });

  opts.res.cookie(COOKIE_NAME, token, {
    ...getSessionCookieOptions(opts.req),
    maxAge: ONE_YEAR_MS,
  });

  return user;
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // OAuth remains available for explicit administrative access, but course
    // access is intentionally open: every new browser receives its own
    // cryptographically random, signed anonymous identity.
    try {
      user = await createAnonymousSession(opts);
    } catch (anonymousError) {
      console.warn("[Auth] Anonymous session unavailable", anonymousError);
    }
    if (!user) console.warn("[Auth] Request has no authenticated user", error);
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
