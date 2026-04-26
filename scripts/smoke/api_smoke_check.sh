#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://wanandroid.com}"

check() {
  local path="$1"
  local name="$2"
  echo "[SMOKE] ${name} -> ${BASE_URL}${path}"
  local code
  code=$(curl -sS -o /tmp/wanandroid_smoke_body.json -w "%{http_code}" "${BASE_URL}${path}")
  if [[ "${code}" != "200" ]]; then
    echo "[FAIL] ${name}: http=${code}"
    return 1
  fi
  if ! rg -q "\"errorCode\"" /tmp/wanandroid_smoke_body.json; then
    echo "[FAIL] ${name}: missing errorCode field"
    return 1
  fi
  echo "[PASS] ${name}"
}

check "/banner/json" "Banner"
check "/article/list/0/json" "首页文章"
check "/tree/json" "体系"
check "/project/tree/json" "项目分类"
check "/wenda/list/1/json" "问答列表"
check "/popular/wenda/json" "热门问答"
check "/harmony/index/json" "鸿蒙专栏"
check "/hotkey/json" "热词"

echo "All smoke checks passed."
