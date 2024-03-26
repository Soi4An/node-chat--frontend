import { nameKey } from '../config';

function get(): string | null {
  return localStorage.getItem(nameKey);
}

function set(userName: string) {
  return localStorage.setItem(nameKey, userName);
}

function remove() {
  return localStorage.removeItem(nameKey);
}

export const localStorageUser = { get, set, remove };
