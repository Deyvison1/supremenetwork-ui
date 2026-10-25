#!/bin/sh

set -e

echo "🚀 Iniciando deploy DEV..."

node ./scripts/publish.js

echo "✅ Deploy finalizado!"