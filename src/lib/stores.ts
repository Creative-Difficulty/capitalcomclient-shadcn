import { writable, type Writable } from "svelte/store";
import type { BaseAPIURLType } from "$lib/types";

export const UserCST: Writable<string> = writable("");
export const UserXSecurityToken: Writable<string> = writable("");
export const BaseAPIURL: Writable<BaseAPIURLType> = writable("");
export const SignedIntoAccount: Writable<string> = writable("");
