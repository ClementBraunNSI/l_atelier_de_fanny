# Construit BoutiqueAdmin.exe (Windows, mode dossier). À lancer sur Windows avec Python 3.10+.
$ErrorActionPreference = 'Stop'
$AdminDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $AdminDir

$Env:PYINSTALLER_CONFIG_DIR = Join-Path $AdminDir '.pyinstaller-cache'

if (-not (Get-Command python -ErrorAction SilentlyContinue) -and -not (Get-Command py -ErrorAction SilentlyContinue)) {
    Write-Error "Python introuvable. Installez Python 3.10+ depuis python.org."
}

if (Get-Command py -ErrorAction SilentlyContinue) {
    py -3 -m venv .venv-build
} else {
    python -m venv .venv-build
}

$activate = Join-Path $AdminDir '.venv-build\Scripts\Activate.ps1'
. $activate

pip install -q -r requirements-build.txt
pyinstaller --noconfirm boutique-admin.spec

Write-Host ""
Write-Host "OK — sortie : $AdminDir\dist\BoutiqueAdmin\BoutiqueAdmin.exe"
Write-Host ""
Write-Host "Copiez le dossier dist\BoutiqueAdmin\ à la racine du dépôt (à côté de src\),"
Write-Host "ou définissez BOUTIQUE_ADMIN_PROJECT_ROOT vers cette racine."
