export interface Env {
  CRON_SECRET: string;
  BASE_URL?: string;
  TARGET_URL?: string;
  AUTO_CLOSE_DAYS?: string;
  DRY_RUN?: string;
}

const DEFAULT_AUTO_CLOSE_DAYS = 7;

function buildBody(env: Env) {
  const dryRun = env.DRY_RUN === "true";
  if (dryRun) return { dryRun: true };

  const autoClose = Number(env.AUTO_CLOSE_DAYS ?? DEFAULT_AUTO_CLOSE_DAYS);
  return { autoCloseAfterDays: Number.isFinite(autoClose) ? autoClose : DEFAULT_AUTO_CLOSE_DAYS };
}

function resolveTarget(env: Env) {
  if (env.TARGET_URL) return env.TARGET_URL;
  const base = env.BASE_URL || "https://bandofbakers.co.uk";
  return `${base.replace(/\/$/, "")}/api/admin/cron/overdue-orders`;
}

async function callCronEndpoint(env: Env) {
  const target = resolveTarget(env);
  const body = buildBody(env);

  const res = await fetch(target, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-cron-secret": env.CRON_SECRET ?? "",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return { ok: res.ok, status: res.status, statusText: res.statusText, body: text };
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      callCronEndpoint(env)
        .then((result) => {
          if (!result.ok) {
            console.error("overdue-cron: failed", result);
          } else {
            console.log("overdue-cron: success", result.status, result.body?.slice(0, 200));
          }
        })
        .catch((err) => {
          console.error("overdue-cron: error", err);
        })
    );
  },
};
import type { ScheduledEvent, ExecutionContext } from "@cloudflare/workers-types";
