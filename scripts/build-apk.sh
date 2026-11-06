#!/usr/bin/env bash
set -e

echo "=========================================="
echo " SpeakUp AI - Genuine Android APK Builder "
echo "=========================================="

APPLET_DIR="/app/applet"
BUILD_DIR="/tmp/apk_build"
PLATFORM_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
FRAMEWORK_RES="/usr/share/android-framework-res/framework-res.apk"
KEYSTORE="$APPLET_DIR/android/speakup-release-key.keystore"
KEY_ALIAS="speakup_key"
STORE_PASS="speakup123"

cd "$APPLET_DIR"

# 1. Compile web assets with Vite
echo "[1/7] Building web application with Vite..."
npm run build

# 2. Prepare directories
echo "[2/7] Preparing APK build environment..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen" "$BUILD_DIR/classes" "$BUILD_DIR/assets/www"

# Copy compiled web assets into APK assets
cp -r "$APPLET_DIR/dist/"* "$BUILD_DIR/assets/www/"
rm -rf "$BUILD_DIR/assets/www/downloads"

# 3. Generate Android R.java
echo "[3/7] Compiling Android resources with aapt..."
aapt package -f -m \
  -J "$BUILD_DIR/gen" \
  -M "$APPLET_DIR/android/app/src/main/AndroidManifest.xml" \
  -S "$APPLET_DIR/android/app/src/main/res" \
  -I "$FRAMEWORK_RES" \
  --custom-package com.speakupai.english

# 4. Compile Java source code
echo "[4/7] Compiling Java classes with javac..."
javac -encoding UTF-8 \
  -source 8 -target 8 \
  -cp "$PLATFORM_JAR" \
  -d "$BUILD_DIR/classes" \
  "$BUILD_DIR/gen/com/speakupai/english/R.java" \
  "$APPLET_DIR/android/app/src/main/java/com/speakupai/english/MainActivity.java"

# 5. Convert class bytecode to Dalvik Executable (classes.dex)
echo "[5/7] Converting bytecode to Dalvik DEX format with dalvik-exchange..."
dalvik-exchange --dex --output="$BUILD_DIR/classes.dex" "$BUILD_DIR/classes"

# 6. Package resources and assets into unaligned APK
echo "[6/7] Packaging resources, AndroidManifest.xml, and web assets..."
aapt package -f \
  -M "$APPLET_DIR/android/app/src/main/AndroidManifest.xml" \
  -S "$APPLET_DIR/android/app/src/main/res" \
  -A "$BUILD_DIR/assets" \
  -I "$FRAMEWORK_RES" \
  -F "$BUILD_DIR/unaligned.apk"

# Add classes.dex to APK
cd "$BUILD_DIR"
aapt add unaligned.apk classes.dex

# 7. Sign APK with release keystore and zipalign
echo "[7/7] Signing APK with release keystore and zipaligning..."
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkey -v \
    -keystore "$KEYSTORE" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$STORE_PASS" \
    -keypass "$STORE_PASS" \
    -dname "CN=SpeakUp AI, OU=Mobile, O=SpeakUpAI, L=San Francisco, ST=CA, C=US"
fi

jarsigner -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore "$KEYSTORE" \
  -storepass "$STORE_PASS" \
  -keypass "$STORE_PASS" \
  "$BUILD_DIR/unaligned.apk" "$KEY_ALIAS"

# 4-byte zipalign
zipalign -f -p 4 "$BUILD_DIR/unaligned.apk" "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk"

# Copy to distribution and public folders
mkdir -p "$APPLET_DIR/public/downloads" "$APPLET_DIR/dist/downloads" "$APPLET_DIR/android/app/build/outputs/apk/release"

cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/public/downloads/SpeakUp-AI-v1.0.0.apk"
cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/public/downloads/speakup-ai.apk"
cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/dist/downloads/SpeakUp-AI-v1.0.0.apk"
cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/dist/downloads/speakup-ai.apk"
cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/android/app/build/outputs/apk/release/SpeakUp-AI-v1.0.0.apk"
cp "$BUILD_DIR/SpeakUp-AI-v1.0.0.apk" "$APPLET_DIR/android/app/build/outputs/apk/release/app-release-unsigned.apk"

echo "=========================================="
echo " APK Build Success!"
echo " Output: $APPLET_DIR/public/downloads/SpeakUp-AI-v1.0.0.apk"
echo " Size: $(ls -lh "$APPLET_DIR/public/downloads/SpeakUp-AI-v1.0.0.apk" | awk '{print $5}')"
echo " SHA256: $(sha256sum "$APPLET_DIR/public/downloads/SpeakUp-AI-v1.0.0.apk" | awk '{print $1}')"
echo "=========================================="

aapt dump badging "$APPLET_DIR/public/downloads/SpeakUp-AI-v1.0.0.apk" | grep -E "package|application-label|launchable-activity|sdkVersion"
