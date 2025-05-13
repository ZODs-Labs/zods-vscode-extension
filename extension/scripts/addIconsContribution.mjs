/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import fs from 'fs';

const packageJSONPromises = Promise.all([
	import('../package.json', { assert: { type: 'json' } }),
	import('../out/icons-contribution.json', { assert: { type: 'json' } }),
]);

let pending = [];

// Update the icons contribution point in package.json
const [{ default: packageJSON }, { default: icons }] = await packageJSONPromises;

if (JSON.stringify(packageJSON.contributes.icons) !== JSON.stringify(icons)) {
	packageJSON.contributes.icons = icons;
	const json = `${JSON.stringify(packageJSON, undefined, '\t')}\n`;
	pending.push(fs.promises.writeFile('../package.json', json));
}

pending.push(fs.promises.rm('../out/icons-contribution.json'), fs.promises.rm('../out/zodsicons.scss'));
await Promise.allSettled(pending);
