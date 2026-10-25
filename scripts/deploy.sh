
#!/bin/sh

set -e

echo "🚀 Iniciando deploy DEV..."

npm ci

node ./scripts/publish.js

echo "✅ Deploy finalizado!"
