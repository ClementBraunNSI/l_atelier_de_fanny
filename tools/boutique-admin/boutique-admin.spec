# -*- mode: python ; coding: utf-8 -*-
# PyInstaller — lancer depuis tools/boutique-admin/ (voir scripts/build-*.)
import sys
from pathlib import Path

_spec_dir = Path(SPECPATH)

block_cipher = None

a = Analysis(
    [str(_spec_dir / "main.py")],
    pathex=[str(_spec_dir)],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="BoutiqueAdmin",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name="BoutiqueAdmin",
)

if sys.platform == "darwin":
    app = BUNDLE(
        coll,
        name="BoutiqueAdmin.app",
        icon=None,
        bundle_identifier="fr.latelierdefanny.boutique-admin",
        info_plist={
            "NSHighResolutionCapable": "True",
        },
    )
