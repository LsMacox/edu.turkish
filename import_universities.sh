#!/usr/bin/env bash
set -euo pipefail

# Bulk import all university JSON files by calling the existing importer once per file.

# Resolve repo root (script is expected at REPO/hack/import_universities.sh)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
UNIVERSITIES_DIR="$REPO_ROOT/app/assets/json/universities"

UPSERT_BY="${UPSERT_BY:-slug}"

usage() {
  cat <<EOF
Usage: bash hack/import_universities.sh [--upsert-by=slug|title]

Environment variables:
  UPSERT_BY   Upsert mode for importer (slug|title). Default: slug

Examples:
  bash hack/import_universities.sh
  bash hack/import_universities.sh --upsert-by=title
  UPSERT_BY=title bash hack/import_universities.sh
EOF
}

for arg in "$@"; do
  case "$arg" in
    --upsert-by=*) UPSERT_BY="${arg#*=}" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage; exit 2 ;;
  esac
done

if [[ ! -d "$UNIVERSITIES_DIR" ]]; then
  echo "Directory not found: $UNIVERSITIES_DIR" >&2
  exit 1
fi

shopt -s nullglob
files=("$UNIVERSITIES_DIR"/*.json)
shopt -u nullglob

if (( ${#files[@]} == 0 )); then
  echo "No JSON files found in $UNIVERSITIES_DIR" >&2
  exit 1
fi

echo "Found ${#files[@]} JSON file(s) in $UNIVERSITIES_DIR"
echo "Upsert mode: $UPSERT_BY"

failures=()
for file in "${files[@]}"; do
  echo "\n—— Importing: $file"
  if ! npm run -s import:university -- "$file" --upsert-by="$UPSERT_BY"; then
    echo "Failed: $file" >&2
    failures+=("$file")
  fi
done

echo "\nSummary: $(( ${#files[@]} - ${#failures[@]} )) succeeded, ${#failures[@]} failed"
if (( ${#failures[@]} > 0 )); then
  echo "Failed files:" >&2
  for f in "${failures[@]}"; do echo " - $f" >&2; done
  exit 1
fi

exit 0


