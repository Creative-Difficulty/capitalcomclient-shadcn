import { redirect, type Handle, type Page } from '@sveltejs/kit';
import type { BaseAPIURLType, CapitalComUserAccounts } from "$lib/types"
import { UserCST, UserXSecurityToken, BaseAPIURL } from "$lib/stores";

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});

let baseAPIURL: BaseAPIURLType = undefined;
BaseAPIURL.subscribe((value: BaseAPIURLType) => {
    baseAPIURL = value;
});

export const handle: Handle = (async ({ event, resolve }) => {
    if(!event.url.pathname.startsWith("/login") && !event.url.pathname.startsWith("/api/selectaccount") || event.url.pathname === "/") {
        const capitalComCST = event.cookies.get("CAPITALCOM-CST");
        const capitalComSecurityToken = event.cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
        
        if(capitalComCST === undefined || capitalComSecurityToken === undefined) {
            throw redirect(302, "/login");
        }
        
        if(baseAPIURL === undefined) {
            const parsedFetchResponse: CapitalComUserAccounts = await (await fetch("https://api-capital.backend-capital.com/api/v1/accounts", {
                method: "GET",
                headers: {
                    "X-SECURITY-TOKEN": capitalComSecurityToken!,
                    "CST" : capitalComCST!,
                    "Content-Type" : "application/json"
                },
                redirect: "follow"
            })).json();
    
            const parsedDemoFetchResponse: CapitalComUserAccounts = await (await fetch("https://demo-api-capital.backend-capital.com/api/v1/accounts", {
                method: "GET",
                headers: {
                    "X-SECURITY-TOKEN": capitalComSecurityToken!,
                    "CST" : capitalComCST!,
                    "Content-Type" : "application/json"
                },
                redirect: "follow"
            })).json();
    
            if(parsedDemoFetchResponse.errorCode !== undefined || parsedFetchResponse.errorCode !== undefined) { throw redirect(302, "/login") }
            
            //Update the store if it's wrong but the session is still valid
            if(parsedFetchResponse.errorCode === undefined && parsedDemoFetchResponse.errorCode === undefined && capitalComCST !== userCST || parsedFetchResponse.errorCode === undefined && parsedDemoFetchResponse.errorCode === undefined && capitalComSecurityToken !== userXSecurityToken) {
                UserCST.set(capitalComCST);
                UserXSecurityToken.set(capitalComSecurityToken);
            }
        } else {
            const parsedFetchResponse: CapitalComUserAccounts = await (await fetch(`${baseAPIURL}/api/v1/accounts`, {
                method: "GET",
                headers: {
                    "X-SECURITY-TOKEN": capitalComSecurityToken!,
                    "CST" : capitalComCST!,
                    "Content-Type" : "application/json"
                },
                redirect: "follow"
            })).json();
    
            if(parsedFetchResponse.errorCode !== undefined) { throw redirect(302, "/login") }
            
            //Update the store if it's wrong but the session is still valid
            if(parsedFetchResponse.errorCode === undefined && capitalComCST !== userCST || parsedFetchResponse.errorCode === undefined && capitalComCST !== userCST) {
                UserCST.set(capitalComCST);
                UserXSecurityToken.set(capitalComSecurityToken);
            }
        }
    }
    
    const response = await resolve(event);
    return response;
});