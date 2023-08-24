import { redirect, type Handle } from '@sveltejs/kit';
import type { CapitalComUserAccounts } from "$lib/types"
import { UserCST, UserXSecurityToken } from "$lib/stores";

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});

export const handle: Handle = (async ({ event, resolve }) => {
    if (event.url.pathname.startsWith("/dashboard") || event.url.pathname.startsWith("/api") || event.url.pathname === "/") {
        const capitalComCST = event.cookies.get("CAPITALCOM-CST");
        const capitalComSecurityToken = event.cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
        
        if(capitalComCST === undefined || capitalComSecurityToken === undefined) {
            throw redirect(302, "/login");
        }
        const response: Response  = await fetch("https://api-capital.backend-capital.com/api/v1/accounts", {
            method: "GET",
            headers: {
                "X-SECURITY-TOKEN": capitalComSecurityToken!,
                "CST" : capitalComCST!,
                "Content-Type" : "application/json"
            },
            redirect: "follow"
        });

        let parsedResponse: CapitalComUserAccounts = await response.json();

        if(parsedResponse.errorCode !== undefined) {
            throw redirect(302, "/login");
        }

        if(parsedResponse.errorCode === undefined && capitalComCST !== userCST || parsedResponse.errorCode === undefined && capitalComSecurityToken !== userXSecurityToken) {
            UserCST.set(capitalComCST);
            UserXSecurityToken.set(capitalComSecurityToken);
        }

        if(event.url.pathname === "/") {
            throw redirect(303, "/dashboard");
        }
    }

    const response = await resolve(event);
    return response;

});