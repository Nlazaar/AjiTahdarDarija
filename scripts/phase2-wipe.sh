#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Phase 2 — Archive legacy content + wipe course/exercise data
#
# Usage:
#   ./scripts/phase2-wipe.sh              # DRY-RUN (default — nothing modified)
#   ./scripts/phase2-wipe.sh --execute    # ACTUALLY archive + wipe
#
# What it does (when --execute is passed):
#   1. Creates _archive/YYYY-MM-DD/ with:
#      - db-dump.sql          (full pg_dump before wipe)
#      - seed/seed.ts         (copy of backend/prisma/seed.ts)
#      - web-data/            (legacy web/data/*.ts files)
#      - scripts/             (legacy one-shot scripts)
#   2. Wipes DB tables: Exercise, Lesson, Module, Vocabulary
#   3. Resets UserProgress (completedLessons, xp, streak) for remaining user
#   4. Deletes the duplicate user (najib_lazaa@hotmail.com — typo account)
#   5. Deletes archived source files from the working tree
#
# Preserved:
#   - User najib_lazaar@hotmail.com + their session/auth
#   - Prisma schema + migrations
#   - backend/public/audio/*.mp3 (4961 cached files)
#   - web/data/courses.ts + types.ts + letterGroups.ts + alphabet.ts
#   - The 7 exercise components + LessonClient.tsx
# ─────────────────────────────────────────────────────────────────────────────

set -u

# ── Config ───────────────────────────────────────────────────────────────────
ROOT="/Users/lazaar/DarijaMaroc"
DB_URL="postgresql://darija:darija@localhost:5432/darija_db"
DATE=$(date +%Y-%m-%d)
ARCHIVE="$ROOT/_archive/$DATE"

# ── Files to archive ─────────────────────────────────────────────────────────
WEB_DATA_LEGACY=(
  "web/data/salutations.ts"
  "web/data/chiffres.ts"
  "web/data/couleurs.ts"
  "web/data/corps.ts"
  "web/data/famille.ts"
  "web/data/nourriture.ts"
  "web/data/logement.ts"
  "web/data/directions.ts"
  "web/data/transports.ts"
  "web/data/travail.ts"
  "web/data/temps.ts"
  "web/data/achats.ts"
  "web/data/expressions.ts"
  "web/data/darija-avance.ts"
  "web/data/se-presenter.ts"
  "web/data/index.ts"
)

BACKEND_SEED="backend/prisma/seed.ts"

# ── Mode ─────────────────────────────────────────────────────────────────────
MODE="DRY-RUN"
RESUME=0
if [[ "${1:-}" == "--execute" ]]; then
  MODE="EXECUTE"
elif [[ "${1:-}" == "--resume-wipe" ]]; then
  MODE="EXECUTE"
  RESUME=1
fi

# ── Resolve pg_dump v18 (avoids server version mismatch) ─────────────────────
PG_DUMP="pg_dump"
for p in \
  /opt/homebrew/opt/postgresql@18/bin/pg_dump \
  /usr/local/opt/postgresql@18/bin/pg_dump \
  /opt/homebrew/opt/postgresql/bin/pg_dump ; do
  if [[ -x "$p" ]]; then PG_DUMP="$p"; break; fi
done

# ── Helpers ──────────────────────────────────────────────────────────────────
c_reset=$'\033[0m'
c_bold=$'\033[1m'
c_green=$'\033[32m'
c_yellow=$'\033[33m'
c_red=$'\033[31m'
c_blue=$'\033[34m'
c_dim=$'\033[2m'

banner() {
  echo ""
  echo "${c_bold}${c_blue}==============================================================${c_reset}"
  echo "${c_bold}${c_blue}  $1${c_reset}"
  echo "${c_bold}${c_blue}==============================================================${c_reset}"
}

action() {
  # $1 = description, $2 = command
  if [[ "$MODE" == "DRY-RUN" ]]; then
    echo "  ${c_yellow}[DRY-RUN]${c_reset} $1"
    echo "  ${c_dim}       → $2${c_reset}"
  else
    echo "  ${c_green}[EXEC]${c_reset}    $1"
    eval "$2"
  fi
}

file_size() {
  if [[ -f "$1" ]]; then
    du -h "$1" | awk '{print $1}'
  else
    echo "MISSING"
  fi
}

# ── Banner ───────────────────────────────────────────────────────────────────
banner "Phase 2 — Wipe & Archive  [MODE: $MODE]"
if [[ "$MODE" == "DRY-RUN" ]]; then
  echo "${c_yellow}Nothing will be modified. Re-run with --execute to apply.${c_reset}"
else
  echo "${c_red}${c_bold}⚠  EXECUTE MODE — this WILL modify files and DB.${c_reset}"
  echo -n "${c_red}Type 'WIPE' to confirm: ${c_reset}"
  read -r CONFIRM
  if [[ "$CONFIRM" != "WIPE" ]]; then
    echo "${c_red}Cancelled.${c_reset}"
    exit 1
  fi
fi

# ── 1. Create archive dir ────────────────────────────────────────────────────
banner "1. Prepare archive dir"
echo "  Target: $ARCHIVE"
action "mkdir -p archive subdirs" "mkdir -p '$ARCHIVE/seed' '$ARCHIVE/web-data' '$ARCHIVE/scripts'"

# ── 2. Pre-flight DB counts ──────────────────────────────────────────────────
banner "2. DB state (before)"
psql "$DB_URL" -c "SELECT
  (SELECT COUNT(*) FROM \"Module\")     AS modules,
  (SELECT COUNT(*) FROM \"Lesson\")     AS lessons,
  (SELECT COUNT(*) FROM \"Exercise\")   AS exercises,
  (SELECT COUNT(*) FROM \"Vocabulary\") AS vocabulary,
  (SELECT COUNT(*) FROM \"User\")       AS users;" 2>&1

# ── 3. DB dump ───────────────────────────────────────────────────────────────
banner "3. Dump DB to archive"
DUMP_FILE="$ARCHIVE/db-dump.sql"
echo "  Using: $PG_DUMP ($($PG_DUMP --version 2>/dev/null | head -1))"
action "pg_dump full database" "'$PG_DUMP' '$DB_URL' > '$DUMP_FILE' && echo '    saved:' \$(du -h '$DUMP_FILE' | awk '{print \$1}')"

if [[ $RESUME -eq 1 ]]; then
  echo ""
  echo "${c_yellow}[RESUME] Skipping archive steps 4–8 — jumping to DB wipe (step 9)${c_reset}"
else

# ── 4. Archive backend seed ──────────────────────────────────────────────────
banner "4. Archive backend/prisma/seed.ts"
src="$ROOT/$BACKEND_SEED"
dst="$ARCHIVE/seed/seed.ts"
echo "  $BACKEND_SEED ($(file_size "$src"))"
action "copy seed.ts" "cp '$src' '$dst'"

# ── 5. Archive backend one-shot scripts ──────────────────────────────────────
banner "5. Archive backend/scripts/ one-shot scripts"
SCRIPT_COUNT=0
for f in "$ROOT/backend/scripts/"_*.ts "$ROOT/backend/scripts/"_*.js; do
  [[ -f "$f" ]] || continue
  name=$(basename "$f")
  echo "  $name ($(file_size "$f"))"
  action "copy $name" "cp '$f' '$ARCHIVE/scripts/$name'"
  SCRIPT_COUNT=$((SCRIPT_COUNT + 1))
done
# Also generate-audio.js (not underscore-prefixed but related)
if [[ -f "$ROOT/backend/scripts/generate-audio.js" ]]; then
  echo "  generate-audio.js ($(file_size "$ROOT/backend/scripts/generate-audio.js"))"
  action "copy generate-audio.js" "cp '$ROOT/backend/scripts/generate-audio.js' '$ARCHIVE/scripts/generate-audio.js'"
  SCRIPT_COUNT=$((SCRIPT_COUNT + 1))
fi
echo "  ${c_dim}Total scripts to archive: $SCRIPT_COUNT${c_reset}"

# ── 6. Archive web/data legacy files ─────────────────────────────────────────
banner "6. Archive web/data/ legacy theme files"
for f in "${WEB_DATA_LEGACY[@]}"; do
  src="$ROOT/$f"
  echo "  $f ($(file_size "$src"))"
  if [[ -f "$src" ]]; then
    action "copy $(basename "$f")" "cp '$src' '$ARCHIVE/web-data/$(basename "$f")'"
  fi
done

# ── 7. Archive README ────────────────────────────────────────────────────────
banner "7. Write archive README"
README_CONTENT="# Archive $DATE\n\nContent archived on $DATE before full course/exercise wipe.\n\nContains:\n- \`db-dump.sql\`: full Postgres dump before TRUNCATE\n- \`seed/seed.ts\`: backend/prisma/seed.ts as of wipe date\n- \`scripts/\`: one-shot scripts used for legacy seeding\n- \`web-data/\`: legacy theme data files (salutations, chiffres, couleurs, etc.)\n\nRestore:\n- DB: \`psql $DB_URL < db-dump.sql\`\n- Files: copy back into place\n\nFully safe to delete after new content is validated and shipped.\n"
action "write README.md" "printf '$README_CONTENT' > '$ARCHIVE/README.md'"

# ── 8. Delete archived source files from working tree ────────────────────────
banner "8. Delete archived source files from working tree"
echo "  ${c_dim}(files are safe — copies live in $ARCHIVE)${c_reset}"
for f in "${WEB_DATA_LEGACY[@]}"; do
  action "rm $f" "rm -f '$ROOT/$f'"
done

fi  # end of RESUME skip block

# ── 9. DB wipe SQL ───────────────────────────────────────────────────────────
banner "9. Wipe course/exercise data + duplicate user"
SQL_FILE="$ARCHIVE/wipe.sql"
cat > "$SQL_FILE" <<'EOF'
-- Truncate content tables (CASCADE handles FK chains)
TRUNCATE "Exercise", "Lesson", "Module", "Vocabulary" CASCADE;

-- Reset progress counters for remaining user
UPDATE "UserProgress" SET "completedLessons" = '{}', "xp" = 0, "streak" = 0;

-- Delete the duplicate account (typo email)
DELETE FROM "UserProgress" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'najib_lazaa@hotmail.com');
DELETE FROM "User" WHERE email = 'najib_lazaa@hotmail.com';
EOF
echo "${c_dim}$(cat "$SQL_FILE")${c_reset}"
action "run wipe SQL" "psql '$DB_URL' -v ON_ERROR_STOP=1 -f '$SQL_FILE'"

# ── 10. Post-flight DB counts ────────────────────────────────────────────────
if [[ "$MODE" == "EXECUTE" ]]; then
  banner "10. DB state (after)"
  psql "$DB_URL" -c "SELECT
    (SELECT COUNT(*) FROM \"Module\")     AS modules,
    (SELECT COUNT(*) FROM \"Lesson\")     AS lessons,
    (SELECT COUNT(*) FROM \"Exercise\")   AS exercises,
    (SELECT COUNT(*) FROM \"Vocabulary\") AS vocabulary,
    (SELECT COUNT(*) FROM \"User\")       AS users;" 2>&1
fi

# ── Summary ──────────────────────────────────────────────────────────────────
banner "Summary"
if [[ "$MODE" == "DRY-RUN" ]]; then
  echo "${c_yellow}  DRY-RUN complete. Nothing was modified.${c_reset}"
  echo "  Re-run with: ${c_bold}./scripts/phase2-wipe.sh --execute${c_reset}"
else
  echo "${c_green}  Wipe complete.${c_reset}"
  echo "  Archive: $ARCHIVE"
  echo ""
  echo "  Next steps (Phase 3):"
  echo "    - Extend ExerciseType enum in schema.prisma"
  echo "    - Seed pilot lesson: Tanger — Salutations (8 items, 7 exercise types)"
  echo "    - Adapt LessonClient for 'mot' mode with tips"
fi
echo ""
