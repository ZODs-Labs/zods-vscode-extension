/**
 * Copyright (c) ZODs Labs. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { EventEmitter, Disposable } from 'vscode';

import { IVSCodeService } from '@models/service';
import { IGlobalStateStore } from '@models/store';
import { IVSCodeExtensionContext } from '@models/vscode';

/**
 * Class representing a store for global state in a VS Code extension.
 * It provides methods to get and update state, and emits events when specific keys change.
 */
export class GlobalStateStore implements IGlobalStateStore {
   private context: IVSCodeExtensionContext;
   private emitters: Map<string, EventEmitter<any>> = new Map();

   constructor(vscodeService: IVSCodeService) {
      this.context = vscodeService.context;
   }

   /**
    * Gets the value for the given key from the global state.
    * @param key The key to retrieve the value for.
    * @param defaultValue The default value to return if the key does not exist.
    * @returns The value associated with the key, or the default value.
    */
   public get<T>(key: string, defaultValue: T): T {
      return this.context.globalState.get<T>(key, defaultValue);
   }

   /**
    * Updates the value for the given key in the global state and fires an event for the key.
    * @param key The key to update the value for.
    * @param value The new value to set.
    */
   public async update<T>(key: string, value: T): Promise<void> {
      await this.context.globalState.update(key, value);
      this.getEmitter<T>(key).fire(value);
   }

   /**
    * Subscribes to changes for the given key.
    * @param key The key to listen for changes.
    * @param listener The callback to execute when the value for the key changes.
    * @returns A disposable to unsubscribe from the event.
    */
   public onDidChange<T>(key: string, listener: (value: T) => any): Disposable {
      return this.getEmitter<T>(key).event(listener);
   }

   /**
    * Gets or creates an event emitter for the specified key.
    * @param key The key to get the emitter for.
    * @returns The event emitter for the key.
    */
   private getEmitter<T>(key: string): EventEmitter<T> {
      if (!this.emitters.has(key)) {
         this.emitters.set(key, new EventEmitter<T>());
      }
      return this.emitters.get(key)!;
   }
}
