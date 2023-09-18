import { writable, type Writable } from "svelte/store";
import type { BaseAPIURLType } from "./types";

export const UserCST: Writable<string> = writable("");
export const UserXSecurityToken: Writable<string> = writable("");
export const BaseAPIURL: Writable<BaseAPIURLType> = writable("");