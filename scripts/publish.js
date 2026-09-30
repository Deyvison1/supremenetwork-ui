const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distPath = path.join(root, 'dist', 'ui');
const packagePath = path.join(distPath, 'package.json');

if (!fs.existsSync(packagePath)) {
  console.error('❌ dist/ui/package.json não encontrado.');
  console.error('Execute o build antes de publicar.');
  process.exit(1);
}

const packageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

const [major, minor, patch] = packageJson.version
  .split('.')
  .map(Number);

const newVersion = `${major}.${minor}.${patch + 1}`;

console.log(`\n📦 Versão atual: ${packageJson.version}`);
console.log(`🚀 Nova versão:  ${newVersion}\n`);

console.log('🔨 Buildando library...\n');

execSync('npm run build', {
  cwd: root,
  stdio: 'inherit',
});

// O build pode recriar o package.json da dist.
// Por isso lemos novamente depois do build.
const builtPackageJson = JSON.parse(
  fs.readFileSync(packagePath, 'utf8')
);

builtPackageJson.version = newVersion;

fs.writeFileSync(
  packagePath,
  JSON.stringify(builtPackageJson, null, 2) + '\n'
);

console.log(`\n📤 Publicando @supremenetwork/ui@${newVersion}...\n`);

execSync('npm publish', {
  cwd: distPath,
  stdio: 'inherit',
});

console.log(
  `\n✅ @supremenetwork/ui@${newVersion} publicado com sucesso!\n`
);