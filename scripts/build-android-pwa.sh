#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="${ROOT_DIR}/.bubblewrap/android"
IMAGE_NAME="myexpense-bubblewrap"
MANIFEST_URL="https://expense.abhijith.me/manifest.webmanifest"

command -v docker >/dev/null 2>&1 || {
  echo "Docker is not installed. Install Docker Desktop and run this script again."
  exit 1
}

docker info >/dev/null 2>&1 || {
  echo "Docker is installed, but the Docker daemon is not running. Start Docker Desktop and try again."
  exit 1
}

mkdir -p "${ANDROID_DIR}"

echo "Building the Bubblewrap tooling image..."
docker build \
  --file "${ROOT_DIR}/Dockerfile.bubblewrap" \
  --tag "${IMAGE_NAME}" \
  "${ROOT_DIR}"

if [[ ! -f "${ANDROID_DIR}/twa-manifest.json" ]]; then
  echo "Initializing the Android project from ${MANIFEST_URL}..."
  docker run --rm -it \
    --volume "${ANDROID_DIR}:/app" \
    "${IMAGE_NAME}" init \
    --manifest="${MANIFEST_URL}"
else
  echo "Using the existing Android project in ${ANDROID_DIR}."
fi

echo "Building the Android APK and App Bundle..."
docker run --rm -it \
  --volume "${ANDROID_DIR}:/app" \
  "${IMAGE_NAME}" build

echo "Build complete. Artifacts are in ${ANDROID_DIR}."
