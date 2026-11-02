#!/usr/bin/env bash
# Blocks secrets and env files from entering git history.
#   scan-secrets.sh --staged          scan what is about to be committed
#   scan-secrets.sh <rev-range>       scan commits about to be pushed
# Bypass for a known false positive: git commit/push --no-verify
set -euo pipefail

# Files that must never be committed, whatever they contain.
BLOCKED_FILES='(^|/)(\.env(\..*)?|\.dev\.vars|.*\.pem|.*\.key|.*\.p12|.*\.pfx|id_rsa.*|\.npmrc)$'
ALLOWED_FILES='(^|/)\.env\.example$'

# Content that looks like a credential.
PATTERNS=(
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'   # UUID keys (Web3Forms)
  '(gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}'                         # GitHub tokens
  'sk-[A-Za-z0-9_-]{20,}|sk_(live|test)_[A-Za-z0-9]{16,}'             # OpenAI / Stripe
  'AKIA[0-9A-Z]{16}'                                                  # AWS access key
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'                                # private keys
  # A credential-named key assigned a quoted literal (not a reference such as
  # env.WEB3FORMS_ACCESS_KEY), or a dotenv-style NAME=value line.
  '(api[_-]?key|secret|token|access[_-]?key|password|passwd)["'"'"']?[ ]*[:=][ ]*["'"'"'][A-Za-z0-9_./+=-]{16,}["'"'"']'
  '^\+[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)[A-Z0-9_]*=[^[:space:]]{8,}'
)

if [ "${1:-}" = "--staged" ]; then
  files=$(git diff --cached --name-only --diff-filter=ACMR)
  added=$(git diff --cached -U0 --diff-filter=ACMR | grep -E '^\+[^+]' || true)
else
  files=$(git diff --name-only --diff-filter=ACMR "$1")
  added=$(git log -p --format= "$1" | grep -E '^\+[^+]' || true)
fi

fail=0
bad_files=$(printf '%s\n' "$files" | grep -E "$BLOCKED_FILES" | grep -vE "$ALLOWED_FILES" || true)
if [ -n "$bad_files" ]; then
  echo "✘ Blocked: these files must never be committed:" >&2
  printf '  %s\n' $bad_files >&2
  fail=1
fi

for p in "${PATTERNS[@]}"; do
  hits=$(printf '%s\n' "$added" | grep -inE -- "$p" || true)
  if [ -n "$hits" ]; then
    echo "✘ Possible secret matching /$p/:" >&2
    printf '%s\n' "$hits" | cut -c1-160 | sed 's/^/  /' >&2
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo >&2
  echo "Move secrets to 'npx wrangler@4 secret put <NAME>' or .dev.vars (ignored)." >&2
  echo "If this is a false positive: git commit/push --no-verify" >&2
  exit 1
fi
