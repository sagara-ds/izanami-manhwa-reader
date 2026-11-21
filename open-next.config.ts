import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

/**
 * OpenNext Cloudflare adapter config.
 *
 * ISR: pages use time-based `revalidate` (120-600s), so a revalidation queue is
 * required. The Durable Object queue is backed by SQLite and works on the
 * Workers Free plan. The incremental cache stays in-memory for now (per-isolate);
 * add an R2 bucket later for a shared cache if upstream API load becomes a concern.
 */
export default defineCloudflareConfig({
  queue: doQueue,
});
