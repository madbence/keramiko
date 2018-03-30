import {readFileSync} from 'fs';
import {safeLoad} from 'js-yaml';

const file = process.env.SETTINGS_FILE;

export default safeLoad(readFileSync(file, 'utf-8'));
