
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distPath = path.join(root, 'dist', 'ui');
const packagePath = path.join(distPath, 'package.json');

// Verifica se o package.json da library existe
if (!fs.existsSync(packagePath)) {
  console.error('❌ dist/ui/package.json não encontrado.');
  console.error('Execute o build antes de publicar.');
  process.exit(1);
}

// Lê a versão atual
const packageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

const [major, minor, patch] = packageJson.version
  .split('.')
  .map(Number);

const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`\n📦 Versão atual: ${packageJson.version}`);
console.log(`🚀 Nova versão: ${newVersion}\n`);

// Executa o build da library
console.log('🔨 Buildando library...\n');

execSync('npm run build', {
  cwd: root,
  stdio: 'inherit',
});

// Verifica novamente se o build gerou o package.json
if (!fs.existsSync(packagePath)) {
  console.error('❌ O build não gerou dist/ui/package.json.');
  process.exit(1);
}

// Lê novamente porque o build pode recriar o package.json
const builtPackageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

// Atualiza a versão do pacote gerado
builtPackageJson.version = newVersion;

fs.writeFileSync(
  packagePath,
  JSON.stringify(builtPackageJson, null, 2) + '\n'
);

// Publica no npm
console.log(
  `\n📤 Publicando @supremenetwork/ui@${newVersion}...\n`
);

execSync('npm publish', {
  cwd: distPath,
  stdio: 'inherit',
});

// Confirma o sucesso
console.log(
  `\n✅ @supremenetwork/ui@${newVersion} publicado com sucesso!\n`
);
