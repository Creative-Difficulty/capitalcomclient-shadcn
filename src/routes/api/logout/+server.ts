import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import type { BaseAPIURLType, CapitalComUserAccounts } from "$lib/types";
import { BaseAPIURL, UserCST, UserXSecurityToken, SignedIntoAccount } from "$lib/stores";

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

let signedIntoAccount: string;
SignedIntoAccount.subscribe((value: string) => {
    signedIntoAccount = value;
});


export const GET: RequestHandler = (async ({ cookies }) => {
    const capitalComCST = cookies.get("CAPITALCOM-CST");
    const capitalComSecurityToken = cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
	if(userCST !== capitalComCST || userXSecurityToken !== capitalComSecurityToken || signedIntoAccount === "" || baseAPIURL === undefined) { throw redirect(302, "/login") }

    const response: Response = await fetch(`${baseAPIURL}/api/v1/session`, {
        method: "DELETE",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST,
            "Content-Type" : "application/json",
            "redirect": "follow"
        }
    });

    const parsedResponse: { status?: "SUCCESS" | string; errorCode?: string } = await response.json();
    
    if(parsedResponse.status !== "SUCCESS" || parsedResponse.errorCode !== undefined) {
        return json({
            error: "Something went wrong"
        }, { status: 200 });
    }

    return json({
        status: "success"
    }, { status: 200 });
})