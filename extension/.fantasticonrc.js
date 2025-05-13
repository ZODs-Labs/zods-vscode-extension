/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

//@ts-check

/** @type {import('@twbs/fantasticon').RunnerOptions} */
const config = {
   name: 'snippetubicons',
   prefix: 'shicon',
   codepoints: require('./icons/template/mapping.json'),
   inputDir: './icons',
   outputDir: './out',
   fontsUrl: '#{root}/out',
   // @ts-ignore
   fontTypes: ['woff2'],
   normalize: true,
   // @ts-ignore
   assetTypes: ['html', 'json'],
   templates: {
      html: './icons/template/icons-contribution.hbs',
   },
   formatOptions: {
      json: {
         indent: 2,
      },
   },
   pathOptions: {
      woff2: './out/zodsicons.woff2',
      html: './out/icons-contribution.json',
      json: './icons/template/mapping.json',
   },
};

module.exports = config;
