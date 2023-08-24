import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import type { CapitalComUserAccounts, SwitchAccountsResponse } from "$lib/types";
import { UserCST, UserXSecurityToken } from "$lib/stores";

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});


export const POST: RequestHandler = (async ({ cookies, request }) => {
    const capitalComCST = cookies.get("CAPITALCOM-CST");
    const capitalComSecurityToken = cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
	if(userCST !== capitalComCST || userXSecurityToken !== capitalComSecurityToken) { throw redirect(302, "/login") }
    
    const userAccountsResponse: Response = await fetch("https://api-capital.backend-capital.com/api/v1/accounts", {
        method: "GET",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST,
            "Content-Type" : "application/json"
        },
        redirect: "follow"
    });
            
    let parsedUserAccountsResponse: CapitalComUserAccounts = await userAccountsResponse.json();
    if(parsedUserAccountsResponse.errorCode !== undefined) { console.log(`Error while getting all acounts for user: ${parsedUserAccountsResponse.errorCode}`); return json({ error: `Error while getting all acounts for user: ${parsedUserAccountsResponse.errorCode}` }, { status: 500 }); }
    if(parsedUserAccountsResponse.accounts?.length === 0) { console.log(`User has no accounts!: ${parsedUserAccountsResponse}`); return json({ error: "The selected account does not have any trading accounts." }, { status: 500 }); }
    
    let submittedAccountName = JSON.parse((await request.text())).selectedAccount;
    if(parsedUserAccountsResponse.accounts!.find(account => account.accountName === submittedAccountName) !== undefined) {
        const parsedSwitchAccountResponse: SwitchAccountsResponse = await (await fetch("https://api-capital.backend-capital.com/api/v1/session", {
            method: "PUT",
            headers: {
                "X-SECURITY-TOKEN": userXSecurityToken,
                "CST": userCST,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                accountId: parsedUserAccountsResponse.accounts!.find(account => account.accountName === submittedAccountName)?.accountId
            }),
            redirect: "follow"
        })).json();

        if(parsedSwitchAccountResponse.errorCode !== undefined && parsedSwitchAccountResponse.errorCode !== "error.not-different.accountId") {
            console.log(`Error while selecting account: ${parsedSwitchAccountResponse.errorCode!}`); return json({ error: `Error while switching account: ${parsedSwitchAccountResponse.errorCode!}` }, { status: 500 });
        } else if(parsedSwitchAccountResponse.errorCode === "error.not-different.accountId") {
            return json({ success: true, msg: `Already signed in to ${submittedAccountName}.` }, { status: 200 });
        }
        
        return json({ success: true }, { status: 200 });
    } else {
        return json({ error: `The selected trading account "${submittedAccountName}" does not exist.`.replace("\"", "") }, { status: 500 });
    }

});