import { interfaces } from 'inversify';

export interface IIocContainer {
   get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T;
}
