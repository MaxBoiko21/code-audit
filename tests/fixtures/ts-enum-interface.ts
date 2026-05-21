export enum Status {
  Active = 'active',
  Paused = 'paused',
}

export interface User {
  id: string;
  email: string;
}

declare module 'some-lib' {
  interface Config {
    extra: boolean;
  }
}

export type Role = 'admin' | 'member';
