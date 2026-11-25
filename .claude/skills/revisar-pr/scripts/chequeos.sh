#!/usr/bin/env bash
# Chequeos automáticos de la skill revisar-pr.
# Uso (desde cualquier carpeta del repo):
#   bash .claude/skills/revisar-pr/scripts/chequeos.sh               # cambios de la rama vs origin/main
#   bash .claude/skills/revisar-pr/scripts/chequeos.sh --base main   # otra base
#   bash .claude/skills/revisar-pr/scripts/chequeos.sh --todo        # todo frontend/src y database/
#   bash .claude/skills/revisar-pr/scripts/chequeos.sh --sin-build   # no corre lint ni build
# Los avisos son candidatos: hay que confirmarlos leyendo el código.

set -u

BASE="origin/main"
TODO=0
CORRER_BUILD=1
while [ $# -gt 0 ]; do
  case "$1" in
    --todo) TODO=1 ;;
    --base) shift; BASE="$1" ;;
    --sin-build) CORRER_BUILD=0 ;;
    *) echo "Opción desconocida: $1"; exit 2 ;;
  esac
  shift
done

RAIZ="$(git rev-parse --show-toplevel)" || exit 2
cd "$RAIZ" || exit 2

TOTAL_B=0
TOTAL_I=0
TOTAL_S=0
LISTA="$(mktemp)"
SALIDA_NPM="$(mktemp)"
trap 'rm -f "$LISTA" "$SALIDA_NPM"' EXIT

# ---------------------------------------------------------------- archivos a revisar
if [ "$TODO" -eq 1 ]; then
  find frontend/src database -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.css' -o -name '*.json' \) | sort > "$LISTA"
  echo "Alcance: todo frontend/src y database/"
else
  if ! git rev-parse --verify --quiet "$BASE" > /dev/null; then
    echo "No existe la base '$BASE'. Probá: git fetch origin main"; exit 2
  fi
  {
    git diff --name-only --diff-filter=ACMR "$BASE"...HEAD
    git diff --name-only --diff-filter=ACMR HEAD
    git ls-files --others --exclude-standard
  } | sort -u > "$LISTA"
  echo "Alcance: cambios contra $BASE ($(wc -l < "$LISTA" | tr -d ' ') archivos)"
  echo
  echo "== Archivos que no deberían estar en un PR"
  PROHIBIDOS="$(grep -E '(^|/)(dist|node_modules)/|(^|/)\.env($|\.)' "$LISTA" | grep -v '\.env\.example$')"
  if [ -n "$PROHIBIDOS" ]; then
    echo "  [B] $PROHIBIDOS"; TOTAL_B=$((TOTAL_B + 1))
  else
    echo "  ok"
  fi
fi

# Filtra la lista por patrón de ruta y saca los que coinciden con una exclusión.
archivos() { # $1 = regex de ruta, $2 = regex de exclusión (opcional)
  local sel
  sel="$(grep -E "$1" "$LISTA" 2> /dev/null)"
  if [ -n "${2:-}" ]; then sel="$(printf '%s\n' "$sel" | grep -vE "$2")"; fi
  printf '%s\n' "$sel" | while read -r f; do [ -n "$f" ] && [ -f "$f" ] && echo "$f"; done
}

# check GRAVEDAD "Título" "regex" "regex de rutas" ["exclusión de rutas"] ["regex a ignorar en la línea"]
check() {
  local grav="$1" titulo="$2" patron="$3" rutas="$4" excl="${5:-}" ignorar="${6:-}"
  local salida="" f res
  for f in $(archivos "$rutas" "$excl"); do
    res="$(grep -nE "$patron" "$f" 2> /dev/null)"
    if [ -n "$res" ]; then res="$(printf '%s\n' "$res" | grep -vE '^[0-9]+:[[:space:]]*(\*|//|/\*)')"; fi
    if [ -n "$ignorar" ] && [ -n "$res" ]; then res="$(printf '%s\n' "$res" | grep -vE "$ignorar")"; fi
    if [ -n "$res" ]; then
      salida="$salida$(printf '%s\n' "$res" | sed "s|^|    $f:|" | cut -c1-200)
"
    fi
  done
  if [ -n "$salida" ]; then
    local n
    n="$(printf '%s' "$salida" | grep -c .)"
    echo "  [$grav] $titulo ($n)"
    printf '%s' "$salida" | head -15
    [ "$n" -gt 15 ] && echo "    … y $((n - 15)) más"
    case "$grav" in B) TOTAL_B=$((TOTAL_B + 1)) ;; I) TOTAL_I=$((TOTAL_I + 1)) ;; S) TOTAL_S=$((TOTAL_S + 1)) ;; esac
  fi
}

JS='^frontend/src/.*\.(js|jsx)$'
JSX='^frontend/src/.*\.jsx$'
CSS='^frontend/src/.*\.css$'

echo
echo "== Arquitectura"
check B "fetch fuera de api/cliente.js (usar el service de la feature + pedir())" \
  '(^|[^A-Za-z_.])fetch\(' "$JS" '^frontend/src/api/cliente\.js$'
check B "Import a archivos internos de otra feature (usar su index.js)" \
  'from ["'"'"'](\.\./)+[a-z]+/(components|pages|services|hooks|utils)/' '^frontend/src/features/' '' \
  'from ["'"'"'](\.\./)+(shared|api|app|assets)/'
check B "shared/ importa algo de features/" 'from .*features/' '^frontend/src/shared/'
check I "Ruta a /database escrita a mano (usar ENDPOINTS)" \
  '["'"'"'`]/database' "$JS" '^frontend/src/api/endpoints\.js$'
check I "localStorage directo (usar shared/hooks/useLocalStorage)" \
  'localStorage\.' "$JS" '^frontend/src/shared/hooks/useLocalStorage\.js$'

echo
echo "== React"
check B "Manipulación manual del DOM (React no se entera)" \
  'innerHTML|dangerouslySetInnerHTML|appendChild|document\.createElement|document\.querySelector|getElementById' \
  "$JS" '^frontend/src/app/main\.jsx$'
check B "key con el índice del map (usar un id estable)" \
  'key=\{ *(i|idx|index|indice|índice)( |\}|\))' "$JSX"
check B "Manejador ejecutado al renderizar (pasar la referencia)" \
  ' on[A-Z][A-Za-z]*=\{[A-Za-z_.]+\([^)]*\)\}' "$JSX"
check I "useMemo / useCallback / memo manual (React Compiler está activo)" \
  'useMemo|useCallback|React\.memo|(^|[^A-Za-z])memo\(' "$JS"
check I "export default (el repo usa exportaciones nombradas, salvo App.jsx)" \
  'export default' "$JS" '^frontend/src/app/App\.jsx$'
check S "style inline (preferir clases de Bootstrap o CSS del componente)" 'style=\{\{' "$JSX"

echo
echo "== JavaScript"
check B "var (usar const / let)" '(^|[^A-Za-z_$.])var [A-Za-z_$]' "$JS"
check I "== o != (usar === y !==)" '[^=!<>]==[^=]|!=[^=]' "$JS"
check S "console.log olvidado" 'console\.log' "$JS"

echo
echo "== Bootstrap y CSS"
check B "Clases o atributos de Bootstrap 4" \
  '["'"'"' ](ml|mr|pl|pr)-([0-5]|auto)([ "'"'"']|$)|data-toggle|data-target|form-group|custom-select|custom-checkbox|float-(left|right)|text-(left|right)([ "'"'"']|$)|jquery' \
  "$JSX"
check I "bg-white / text-dark (usar bg-body / text-body)" '(bg-white|text-dark)([ "'"'"']|$)' "$JSX"
check I "!important en CSS propio" '!important' "$CSS"
check S "Color fijo en CSS (preferir variables --bs-*)" '#[0-9A-Fa-f]{3,8}([; ]|$)|rgb\(' "$CSS"

echo
echo "== Seguridad"
check B "Posible secreto en el código" \
  '(password|secret|token|api_?key|jwt_?secret)["'"'"']? *[:=] *["'"'"'][^"'"'"']{6,}' \
  '^(frontend/src/|frontend/vite\.config\.js$)'
check B "Variable VITE_ con pinta de secreto (llega al navegador)" 'VITE_[A-Z_]*(SECRET|TOKEN|PASSWORD|KEY)' \
  '^(frontend/|\.env)'

echo
echo "== Revisión guiada (confirmar a mano)"
# Imágenes sin alt (el tag puede ocupar varias líneas)
SIN_ALT=""
for f in $(archivos "$JSX"); do
  r="$(awk '
    /<img/ { dentro=1; inicio=NR; tag="" }
    dentro { tag = tag $0; if ($0 ~ />/) { if (tag !~ /alt=/) print inicio": <img> sin alt"; dentro=0 } }
  ' "$f")"
  [ -n "$r" ] && SIN_ALT="$SIN_ALT$(printf '%s\n' "$r" | sed "s|^|    $f:|")
"
done
if [ -n "$SIN_ALT" ]; then echo "  [I] Imágenes sin alt"; printf '%s' "$SIN_ALT"; TOTAL_I=$((TOTAL_I + 1)); fi

# useEffect que pide datos sin descartar respuestas viejas
EFECTOS=""
for f in $(archivos "$JSX"); do
  if grep -q 'useEffect' "$f" && grep -qE '\.then\(|await ' "$f" && ! grep -qE 'ignore[A-Za-z]* *= *true|AbortController' "$f"; then
    EFECTOS="$EFECTOS    $f
"
  fi
done
if [ -n "$EFECTOS" ]; then
  echo "  [I] useEffect que pide datos sin limpieza (patrón ignoreResponse)"; printf '%s' "$EFECTOS"; TOTAL_I=$((TOTAL_I + 1))
fi

# Funciones o componentes exportados sin JSDoc justo antes
SIN_DOC=""
for f in $(archivos "$JS" '/index\.js$'); do
  r="$(awk '
    /^export (default )?(async )?function / {
      if (previa !~ /\*\/[[:space:]]*$/) { linea=$0; sub(/\(.*/, "", linea); print NR": " linea }
    }
    /[^[:space:]]/ { previa=$0 }
  ' "$f")"
  [ -n "$r" ] && SIN_DOC="$SIN_DOC$(printf '%s\n' "$r" | sed "s|^|    $f:|")
"
done
if [ -n "$SIN_DOC" ]; then echo "  [I] Exportados sin JSDoc"; printf '%s' "$SIN_DOC"; TOTAL_I=$((TOTAL_I + 1)); fi

# JSON válidos
JSON_MAL=""
for f in $(archivos '^database/.*\.json$'); do
  node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" 2> /dev/null || JSON_MAL="$JSON_MAL    $f
"
done
if [ -n "$JSON_MAL" ]; then echo "  [B] JSON inválido"; printf '%s' "$JSON_MAL"; TOTAL_B=$((TOTAL_B + 1)); fi

# Recordatorios según lo que toca el cambio (solo al revisar una rama)
if [ "$TODO" -eq 0 ] && grep -qE '^database/productos\.json$' "$LISTA"; then
  echo "  [recordatorio] Cambió productos.json: ¿specs clave → valor, mismas claves por categoría, marca nueva en marcas.json?"
fi
if [ "$TODO" -eq 0 ] && grep -qE '^frontend/src/app/router\.jsx$' "$LISTA"; then
  echo "  [recordatorio] Cambió el router: ¿la ruta cuelga del layout correcto? ¿se sacó de PAGINAS_EN_CONSTRUCCION? ¿las de admin están protegidas?"
fi
if [ "$TODO" -eq 0 ] && grep -qE '^frontend/vite\.config\.js$' "$LISTA"; then
  echo "  [recordatorio] Cambió vite.config.js: ¿es solo para desarrollo, está documentado y marcado para borrar con el backend?"
fi

# ---------------------------------------------------------------- lint y build
if [ "$CORRER_BUILD" -eq 1 ]; then
  echo
  echo "== Lint y build (frontend/)"
  if [ ! -d frontend/node_modules ]; then
    echo "  [B] Falta frontend/node_modules: correr 'npm ci' en frontend/ y repetir"; TOTAL_B=$((TOTAL_B + 1))
  else
    if (cd frontend && npm run lint --silent > "$SALIDA_NPM" 2>&1); then
      echo "  lint ok"
    else
      echo "  [B] npm run lint falla:"; sed 's/^/    /' "$SALIDA_NPM" | tail -40; TOTAL_B=$((TOTAL_B + 1))
    fi
    if (cd frontend && npm run build --silent > "$SALIDA_NPM" 2>&1); then
      echo "  build ok"
    else
      echo "  [B] npm run build falla:"; sed 's/^/    /' "$SALIDA_NPM" | tail -40; TOTAL_B=$((TOTAL_B + 1))
    fi
  fi
fi

echo
echo "Resumen: $TOTAL_B bloqueantes · $TOTAL_I importantes · $TOTAL_S sugerencias (candidatos a confirmar)"
