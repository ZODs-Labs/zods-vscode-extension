import { interfaces } from 'inversify';

export interface IRootService {
   get: <T>(identifier: interfaces.ServiceIdentifier<T>) => T;
   dispose: () => void;
}
