import { writable, type Writable } from "svelte/store";

export const UserCST: Writable<string> = writable("");
export const UserXSecurityToken: Writable<string> = writable("");