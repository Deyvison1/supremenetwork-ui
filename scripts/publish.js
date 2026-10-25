
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distPath = path.join(root, 'dist', 'ui');
const packagePath = path.join(distPath, 'package.json');

// Executa o build primeiro
console.log('\n🔨 Buildando library...\n');

execSync('npm run build', {
  cwd: root,
  stdio: 'inherit',
});

// Verifica se o build gerou o package.json
if (!fs.existsSync(packagePath)) {
  console.error('❌ dist/ui/package.json não encontrado após o build.');
  process.exit(1);
}

// Lê a versão atual depois do build
const packageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

const [major, minor, patch] = packageJson.version
  .split('.')
  .map(Number);

const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`\n📦 Versão atual: ${packageJson.version}`);
console.log(`🚀 Nova versão: ${newVersion}\n`);

// Atualiza a versão do pacote gerado
packageJson.version = newVersion;

fs.writeFileSync(
  packagePath,
  JSON.stringify(packageJson, null, 2) + '\n'
);

// Publica no npm
console.log(
  `\n📤 Publicando @supremenetwork/ui@${newVersion}...\n`
);

execSync('npm publish', {
  cwd: distPath,
  stdio: 'inherit',
});

console.log(
  `\n✅ @supremenetwork/ui@${newVersion} publicado com sucesso!\n`
);

