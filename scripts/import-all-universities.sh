#!/bin/bash

# Import all universities from app/assets/json/universities through the app container
# Usage: ./scripts/import-all-universities.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directory containing university JSON files (inside container)
UNIVERSITIES_DIR="/app/prisma/seed/json/universities"

echo -e "${BLUE}Starting bulk university import...${NC}"
echo ""

# Get list of JSON files (excluding types.ts)
JSON_FILES=$(docker compose exec -T app sh -c "find ${UNIVERSITIES_DIR} -maxdepth 1 -type f -name '*.json' | sort")

if [ -z "$JSON_FILES" ]; then
    echo -e "${RED}No JSON files found in ${UNIVERSITIES_DIR}${NC}"
    exit 1
fi

# Count total files
TOTAL=$(echo "$JSON_FILES" | wc -l)
CURRENT=0
SUCCESS=0
FAILED=0

echo -e "${BLUE}Found ${TOTAL} university files to import${NC}"
echo ""

# Import each university
for FILE in $JSON_FILES; do
    CURRENT=$((CURRENT + 1))
    FILENAME=$(basename "$FILE")
    
    echo -e "${BLUE}[${CURRENT}/${TOTAL}] Importing ${FILENAME}...${NC}"
    
    if docker compose exec -T app npx tsx scripts/import-university.ts "$FILE"; then
        echo -e "${GREEN}✓ Successfully imported ${FILENAME}${NC}"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}✗ Failed to import ${FILENAME}${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Import Summary:${NC}"
echo -e "${GREEN}  Successful: ${SUCCESS}${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}  Failed: ${FAILED}${NC}"
fi
echo -e "${BLUE}  Total: ${TOTAL}${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $FAILED -gt 0 ]; then
    exit 1
fi

echo -e "${GREEN}All universities imported successfully!${NC}"
