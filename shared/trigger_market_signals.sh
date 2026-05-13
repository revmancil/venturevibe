#!/bin/bash
# Trigger IdeaValidator market signals digest endpoint
set -euo pipefail

TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
DATE_STAMP=$(date -u '+%Y-%m-%d')
URL="https://mc3-idea-validator.abacusai.app/api/cron/market-signals-digest"
LOG_FILE="/home/ubuntu/market_signals_digest_${DATE_STAMP}.md"

echo "# Market Signals Digest Trigger Log" > "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Execution Time (UTC):** ${TIMESTAMP}" >> "$LOG_FILE"
echo "**Request URL:** ${URL}" >> "$LOG_FILE"
echo "**HTTP Method:** POST" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"secret": "iv_cron_secret_a7b3c9d2e4f6"}' \
  --max-time 30 2>&1) || true

HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

echo "## Response" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Status Code:** ${HTTP_STATUS}" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Response Body:**" >> "$LOG_FILE"
echo '```json' >> "$LOG_FILE"
echo "${HTTP_BODY}" >> "$LOG_FILE"
echo '```' >> "$LOG_FILE"

echo "Done. Status: ${HTTP_STATUS}"
