import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  region: {
    _id: string;
    name: string;
  };
  site: {
    _id: string;
    name: string;
  };
  team?: {
    _id: string;
    name: string;
  };
  rol: string;
  coins: number;
}

export interface Site {
    _id?: string;
    name: string;
    region: {
      _id: string;
      name: string;
    };
    country: {
      name: string;
      code: string;
    };
}

export interface Region {
    _id?: string;
    name: string;
}

export interface Category {
  _id?: string;
  name: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface GameJam {
  _id?: string;
  edition: string;
  region: {
    _id: string;
    name: string;
  };
  site: {
    _id: string;
    name: string;
  };
}

export interface Stage {
  _id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  gameJam: {
    _id: string;
    edition: string;
  };
}

