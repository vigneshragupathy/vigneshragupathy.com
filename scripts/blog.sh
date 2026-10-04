#!/usr/bin/env bash
# Manage the local blog server (wraps Astro's background server mode).
#
#   scripts/blog.sh start [dev|preview]   start in background (default: dev)
#   scripts/blog.sh stop                  stop whichever mode is running
#   scripts/blog.sh restart [dev|preview]
#   scripts/blog.sh status
#   scripts/blog.sh logs [-f]             show (or follow) the server log
#
# dev      -> `astro dev`      hot reload, http://localhost:4321
# preview  -> `astro build` then `astro preview` of dist/, http://localhost:4321
#
# Astro keeps state in .astro/<mode>.json (pid, url) and .astro/<mode>.log (gitignored).
# Override port/host with BLOG_PORT / BLOG_HOST.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${BLOG_PORT:-4321}"
HOST="${BLOG_HOST:-localhost}"
URL="http://${HOST}:${PORT}"
MODES=(dev preview)

cd "$ROOT"

lockfile() { echo "$ROOT/.astro/$1.json"; }
logfile()  { echo "$ROOT/.astro/$1.log"; }

# Read a field from a mode's lockfile; empty if missing.
lock_field() {
  local lf; lf="$(lockfile "$1")"
  [[ -f "$lf" ]] || return 0
  node -e 'try{const d=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));const v=d[process.argv[2]];if(v!=null)process.stdout.write(String(v))}catch{}' "$lf" "$2"
}

# PID of mode $1 if it is alive; removes a stale lockfile otherwise.
running_pid() {
  local pid; pid="$(lock_field "$1" pid)"
  [[ -n "$pid" ]] || return 1
  if kill -0 "$pid" 2>/dev/null; then echo "$pid"; return 0; fi
  rm -f "$(lockfile "$1")"
  return 1
}

# Which mode is running, if any.
running_mode() {
  local m
  for m in "${MODES[@]}"; do
    if running_pid "$m" >/dev/null; then echo "$m"; return 0; fi
  done
  return 1
}

port_owner() {
  ss -ltnp 2>/dev/null | awk -v p=":$PORT" '$4 ~ p"$" {print $NF}' | head -1
}

wait_for_port() {
  local i
  for i in $(seq 1 60); do
    if curl -fso /dev/null "$URL/"; then return 0; fi
    sleep 0.5
  done
  return 1
}

cmd_start() {
  local mode="${1:-dev}"
  case "$mode" in dev|preview) ;; *) echo "unknown mode: $mode (dev|preview)" >&2; exit 2 ;; esac

  local cur
  if cur="$(running_mode)"; then
    echo "already running ($cur, pid $(running_pid "$cur")) at $(lock_field "$cur" url)"
    [[ "$cur" == "$mode" ]] && return 0
    echo "stop it first: scripts/blog.sh stop" >&2
    exit 1
  fi

  local owner; owner="$(port_owner)"
  if [[ -n "$owner" ]]; then
    echo "port $PORT already in use by $owner" >&2
    exit 1
  fi

  [[ -d node_modules ]] || { echo "installing dependencies..."; npm install; }

  if [[ "$mode" == "preview" ]]; then
    echo "building dist/ ..."
    npm run build
  fi

  # --background: Astro detaches, writes .astro/<mode>.json + .log, and returns.
  npx astro "$mode" --background --host "$HOST" --port "$PORT" >/dev/null 2>&1 || {
    echo "astro $mode --background failed" >&2
    [[ -f "$(logfile "$mode")" ]] && tail -20 "$(logfile "$mode")" >&2
    exit 1
  }

  if wait_for_port; then
    echo "started $mode (pid $(running_pid "$mode")) at $(lock_field "$mode" url)"
    echo "log: $(logfile "$mode")"
  else
    echo "failed to respond on $URL within 30s" >&2
    tail -20 "$(logfile "$mode")" >&2
    npx astro "$mode" stop >/dev/null 2>&1 || true
    exit 1
  fi
}

cmd_stop() {
  local mode pid stopped=0
  for mode in "${MODES[@]}"; do
    if pid="$(running_pid "$mode")"; then
      if ! npx astro "$mode" stop >/dev/null 2>&1; then
        # Fallback: kill it ourselves.
        kill -TERM "$pid" 2>/dev/null || true
      fi
      local i
      for i in $(seq 1 40); do
        kill -0 "$pid" 2>/dev/null || break
        sleep 0.25
      done
      kill -0 "$pid" 2>/dev/null && kill -KILL "$pid" 2>/dev/null
      rm -f "$(lockfile "$mode")"
      echo "stopped $mode (pid $pid)"
      stopped=1
    fi
  done
  if [[ $stopped -eq 0 ]]; then
    echo "not running"
    local owner; owner="$(port_owner)"
    [[ -n "$owner" ]] && echo "note: port $PORT is held by $owner (not started by this script)"
  fi
  return 0
}

cmd_status() {
  local mode pid
  if mode="$(running_mode)"; then
    pid="$(running_pid "$mode")"
    local url; url="$(lock_field "$mode" url)"
    local up; up="$(ps -o etime= -p "$pid" 2>/dev/null | tr -d ' ')"
    local http; http="$(curl -so /dev/null -w '%{http_code}' "${url:-$URL}/" || true)"
    echo "running   mode=$mode pid=$pid uptime=${up:-?} url=${url:-$URL} http=${http:-down}"
    echo "log:      $(logfile "$mode")"
    return 0
  fi
  echo "stopped"
  local owner; owner="$(port_owner)"
  [[ -n "$owner" ]] && echo "note: port $PORT is held by $owner (not started by this script)"
  return 3
}

cmd_logs() {
  local mode
  mode="$(running_mode)" || mode="dev"
  local log; log="$(logfile "$mode")"
  [[ -f "$log" ]] || { echo "no log at $log"; exit 1; }
  if [[ "${1:-}" == "-f" ]]; then tail -f "$log"; else tail -n 50 "$log"; fi
}

cmd_restart() {
  local mode="${1:-}"
  [[ -n "$mode" ]] || mode="$(running_mode || echo dev)"
  cmd_stop
  cmd_start "$mode"
}

usage() { sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'; }

case "${1:-}" in
  start)   cmd_start "${2:-dev}" ;;
  stop)    cmd_stop ;;
  restart) cmd_restart "${2:-}" ;;
  status)  cmd_status ;;
  logs)    cmd_logs "${2:-}" ;;
  -h|--help|help|"") usage ;;
  *) echo "unknown command: $1" >&2; usage >&2; exit 2 ;;
esac
