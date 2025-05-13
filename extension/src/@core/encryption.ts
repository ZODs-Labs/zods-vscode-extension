/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import * as crypto from 'crypto';

import config from '@config/constants';

export class EncryptionUtils {
   private static readonly algorithm = 'aes-256-ctr';
   private static readonly secretKey: string = config.Key;
   private static readonly iv: Buffer = crypto.randomBytes(16);

   public static encrypt(text: string): string {
      const cipher = crypto.createCipheriv(
         this.algorithm,
         EncryptionUtils.getSecretKeyBuffer(),
         this.iv
      );

      const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

      return `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;
   }

   public static decrypt(hash: string): string {
      if (!hash) {
         return '';
      }
      const [iv, content] = hash
         .split(':')
         .map((part) => Buffer.from(part, 'hex'));

      const decipher = crypto.createDecipheriv(
         this.algorithm,
         EncryptionUtils.getSecretKeyBuffer(),
         iv
      );

      const decrypted = Buffer.concat([
         decipher.update(content),
         decipher.final(),
      ]);

      return decrypted.toString();
   }

   private static getSecretKeyBuffer(): Buffer {
      return Buffer.from(EncryptionUtils.secretKey.padEnd(32, '*'));
   }
}
