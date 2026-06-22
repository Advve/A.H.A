# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Run the bot
node index.js

# Deploy/refresh slash commands to Discord
node deploy-commands.js

# Delete all slash commands
node delete-commands.js

# Lint
npx eslint .
```

## Environment Variables

Required in `.env`:
```
DISCORD_TOKEN=
CLIENT_ID=
# Optional Uptime Kuma monitoring
UPTIME_KUMA_PUSH_URL=
UPTIME_KUMA_PUSH_INTERVAL_MS=60000
```

## Architecture

**Entry point:** `index.js` — creates the Discord client, auto-loads all event files from `events/` and all command files from `commands/`, then logs in.

**Event system:** Each file in `events/` exports `{ name, once?, execute }`. Multiple files can share the same `name` — the loader merges their handlers into a single listener array, so both run on every event. Example: `guildMemberAdd.js` (restores saved roles) and `welcomeMessage.js` (sends the welcome embed) both register on `guildMemberAdd` and run together. Note: the ready event uses Discord.js v14's `clientReady` name (not `ready`) — see `events/ready.js` and `deploy-commands.js`. The slash-command dispatcher (looks up `client.commands` and calls `execute`, with error handling) is registered directly in `index.js`, separate from the `events/` loader; `events/InteractionCreate.js` only logs interactions.

**Command system:** Commands live in two subfolders:
- `commands/global/` — deployed globally (available in all guilds and DMs)
- `commands/guild/` — deployed per-guild (instant updates, guild-only)

Each command file exports `{ data: SlashCommandBuilder, execute(interaction) }`. `deploy-commands.js` pushes command registrations to Discord's API. It is run manually, and is also spawned automatically as a child process by `events/guildCreate.js` whenever the bot joins a new guild, so guild commands appear without a manual redeploy.

**Database:** SQLite via `better-sqlite3` (synchronous API — no `await` on queries), stored in `bot_data.db` with WAL journaling. `database/db.js` opens the connection, creates the schema (`CREATE TABLE IF NOT EXISTS`), and exports the shared `db` handle. Two tables:
- `settings(guild_id, key, value)` — per-guild config. Accessed through `database/settings.js` (`Settings` class: `get(guildId, key)`, `set(guildId, key, value)`, `delete(guildId, key)`).
- `user_roles(user_id, guild_id, roles)` — roles stored as a JSON array. `guildMemberRemove.js` saves a leaving member's roles; `guildMemberAdd.js` restores them on rejoin (guarding against missing/managed/too-high roles and missing Manage Roles permission). These events use the `db` handle from `database/db.js` directly via `db.prepare(...)`, not the `Settings` class.

`client.settings` is an instance of `Settings`, attached to the client in `index.js` and available in all event/command handlers via `client`.

## Code Style

ESLint enforces: tabs for indentation, single quotes, semicolons, stroustrup brace style, trailing commas on multiline, no inline comments, `const` over `let/var`.
