#!/usr/bin/env bash
# Construit BoutiqueAdmin.app (macOS). À lancer sur un Mac avec Python 3.10+.
set -euo pipefail
ADMIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ADMIN_DIR"

# Cache PyInstaller dans le dépôt (évite ~/Library/... et permet les builds en sandbox CI)
export PYINSTALLER_CONFIG_DIR="$ADMIN_DIR/.pyinstaller-cache"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 introuvable." >&2
  exit 1
fi

python3 -m venv .venv-build
# shellcheck source=/dev/null
source .venv-build/bin/activate
pip install -q -r requirements-build.txt
pyinstaller --noconfirm boutique-admin.spec

echo ""
echo "OK — sortie :"
echo "  $ADMIN_DIR/dist/BoutiqueAdmin.app"
echo ""
echo "Copiez cette app à la racine du dépôt l_atelier_de_fanny (à côté du dossier src/),"
echo "ou définissez BOUTIQUE_ADMIN_PROJECT_ROOT vers cette racine avant de lancer."
