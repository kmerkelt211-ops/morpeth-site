import { NextResponse } from "next/server";

type JsonBody = Record<string, unknown>;

export function jsonOk(body: JsonBody, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...body }, init);
}

export function jsonError(error: string, init?: ResponseInit, extra?: JsonBody) {
  return NextResponse.json({ ok: false, error, ...(extra || {}) }, init);
}
