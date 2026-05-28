import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const licensePath = resolve(process.cwd(), 'devextreme-license.ts');
const fromEnv = process.env.DEVEXTREME_LICENSE_KEY?.trim();

if (fromEnv) {
  const escaped = fromEnv.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  writeFileSync(licensePath, `export const licenseKey = '${escaped}';\n`, 'utf8');
  console.log('devextreme-license.ts generado desde DEVEXTREME_LICENSE_KEY');
  process.exit(0);
}

if (existsSync(licensePath)) {
  console.log('devextreme-license.ts ya existe (desarrollo local)');
  process.exit(0);
}

console.error(
  'Falta la licencia DevExtreme.\n' +
    '  Local: copia devextreme-license.example.ts → devextreme-license.ts\n' +
    '  Netlify: define la variable DEVEXTREME_LICENSE_KEY',
);
process.exit(1);
