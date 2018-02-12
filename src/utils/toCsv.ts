/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 * @licence Apache License, Version 2.0
 */

import * as path from 'path';
import * as fs from 'fs';

const filePath = path.join(__dirname, '../../assets/knowledge.json');
const knowledge = require(filePath);

for (let i = 0; i < knowledge.length; i++) {
  let csv = '';
  for (let prop in knowledge[i]) {
    if (prop === 'name') {
      continue;
    }

    csv += `${prop},${knowledge[i][prop].mean},${knowledge[i][prop].standardDeviation}\n`;
  }
  fs.writeFileSync(knowledge[i].name + '.csv', csv, 'utf8');
}
