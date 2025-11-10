#!/bin/bash

# Delete all universities found in app/assets/json/universities via the app container
# Usage:
#   ./scripts/delete-all-universities.sh [--yes] [--dry-run]
# Notes:
#   - By default runs in dry-run mode (no deletions). Pass --yes to actually delete.
#   - Uses scripts/delete-university.ts which requires slug and locale.

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directory containing university JSON files (inside container)
UNIVERSITIES_DIR="/app/app/assets/json/universities"

# Flags
YES=false
DRY_RUN=true
for arg in "$@"; do
  case "$arg" in
    --yes|-y)
      YES=true
      DRY_RUN=false
      ;;
    --dry-run)
      DRY_RUN=true
      ;;
  esac
done

if [ "$DRY_RUN" = true ]; then
  echo -e "${BLUE}Starting bulk university deletion (dry-run)…${NC}"
else
  echo -e "${BLUE}Starting bulk university deletion…${NC}"
fi

echo ""

# Get list of JSON files inside the container
JSON_FILES=$(docker compose exec -T app sh -c "find ${UNIVERSITIES_DIR} -maxdepth 1 -type f -name '*.json' | sort")

if [ -z "$JSON_FILES" ]; then
  echo -e "${RED}No JSON files found in ${UNIVERSITIES_DIR}${NC}"
  exit 1
fi

# Counters
TOTAL=$(echo "$JSON_FILES" | wc -l)
CURRENT=0
DELETED=0
FAILED=0
SKIPPED=0

echo -e "${BLUE}Found ${TOTAL} university files to process${NC}"
echo ""

for FILE in $JSON_FILES; do
  CURRENT=$((CURRENT + 1))
  FILENAME=$(basename "$FILE")

  # Extract slug and locale from JSON inside container using Node
  if SLUG_LOCALE=$(docker compose exec -T app node -e "const fs=require('fs');const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(String(j.slug||''));process.stdout.write(' ');process.stdout.write(String(j.locale||''));" "$FILE"); then
    :
  else
    echo -e "${RED}[${CURRENT}/${TOTAL}] Failed to read JSON: ${FILENAME}${NC}"
    FAILED=$((FAILED + 1))
    echo ""
    continue
  fi

  SLUG=$(echo "$SLUG_LOCALE" | awk '{print $1}')
  LOCALE=$(echo "$SLUG_LOCALE" | awk '{print $2}')

  if [ -z "$SLUG" ] || [ -z "$LOCALE" ]; then
    echo -e "${RED}[${CURRENT}/${TOTAL}] Invalid JSON (missing slug or locale): ${FILENAME}${NC}"
    FAILED=$((FAILED + 1))
    echo ""
    continue
  fi

  echo -e "${BLUE}[${CURRENT}/${TOTAL}] Deleting slug='${SLUG}' (locale='${LOCALE}') from ${FILENAME}…${NC}"

  # Build optional flags
  DRY_FLAG=""
  YES_FLAG=""
  if [ "$DRY_RUN" = true ]; then
    DRY_FLAG="--dry-run"
  fi
  if [ "$YES" = true ]; then
    YES_FLAG="--yes"
  fi

  # Execute deletion inside container and capture output
  if OUTPUT=$(docker compose exec -T app npx tsx scripts/delete-university.ts --slug="$SLUG" --locale="$LOCALE" $DRY_FLAG $YES_FLAG 2>&1); then
    if echo "$OUTPUT" | grep -q "Deleted university"; then
      echo -e "${GREEN}✓ Successfully deleted ${SLUG} (${LOCALE})${NC}"
      DELETED=$((DELETED + 1))
    elif echo "$OUTPUT" | grep -q "\[DryRun\]" || echo "$OUTPUT" | grep -q "Aborted"; then
      echo -e "${BLUE}⏭ Skipped (dry-run/aborted) ${SLUG} (${LOCALE})${NC}"
      SKIPPED=$((SKIPPED + 1))
    else
      # Completed without explicit delete marker — treat as skipped
      echo -e "${BLUE}⏭ Skipped ${SLUG} (${LOCALE})${NC}"
      SKIPPED=$((SKIPPED + 1))
    fi
  else
    echo -e "${RED}✗ Failed to delete ${SLUG} (${LOCALE})${NC}"
    echo "$OUTPUT"
    FAILED=$((FAILED + 1))
  fi

  echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Delete Summary:${NC}"
echo -e "${GREEN}  Deleted: ${DELETED}${NC}"
if [ $SKIPPED -gt 0 ]; then
  echo -e "${BLUE}  Skipped: ${SKIPPED}${NC}"
fi
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}  Failed: ${FAILED}${NC}"
fi
echo -e "${BLUE}  Total: ${TOTAL}${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $FAILED -gt 0 ]; then
  exit 1
fi

if [ "$DRY_RUN" = true ]; then
  echo -e "${GREEN}Dry-run completed. No universities were deleted. Re-run with --yes to apply.${NC}"
else
  echo -e "${GREEN}Bulk deletion completed.${NC}"
fi
