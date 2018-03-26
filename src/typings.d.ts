/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
  id: string;
}

// tslint:disable:no-any

declare module 'json-server' {
  export function router(route: string): void;

  export function use(config: any): void;

  export function create(): any;

  export function post(): any;

  export function get(): any;

  export function defaults(): any;
}
