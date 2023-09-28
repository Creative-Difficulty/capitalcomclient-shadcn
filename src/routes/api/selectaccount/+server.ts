import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import type { Account, CapitalComUserAccounts, SelectUserAPIRequestBody, SwitchAccountsResponse } from "$lib/types";
import { UserCST, UserXSecurityToken, BaseAPIURL, SignedIntoAccount } from "$lib/stores";

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});

let signedIntoAccount: string;
SignedIntoAccount.subscribe((value: string) => {
    signedIntoAccount = value;
});

export const POST: RequestHandler = (async ({ cookies, request }) => {
    const capitalComCST = cookies.get("CAPITALCOM-CST");
    const capitalComSecurityToken = cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
	if(userCST !== capitalComCST || userXSecurityToken !== capitalComSecurityToken) { throw redirect(302, "/login") }
    
    const userAccountsResponse: Response = await fetch("https://api-capital.backend-capital.com/api/v1/accounts", {
        method: "GET",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST
        },
        redirect: "follow"
    });
    
    let parsedUserAccountsResponse: CapitalComUserAccounts = await userAccountsResponse.json();

    const userDemoAccountsResponse: Response = await fetch("https://demo-api-capital.backend-capital.com/api/v1/accounts", {
        method: "GET",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST
        },
        redirect: "follow"
    });
    
    let parsedDemoUserAccountsResponse: CapitalComUserAccounts = await userDemoAccountsResponse.json();

    if(parsedUserAccountsResponse.errorCode !== undefined) { console.error(`Error while getting all accounts for user: ${parsedUserAccountsResponse.errorCode}`); return json({ error: `Error while getting all accounts for user: ${parsedUserAccountsResponse.errorCode}` }, { status: 500 }); }
    if(parsedDemoUserAccountsResponse.errorCode !== undefined) { console.error(`Error while getting all accounts for user: ${parsedDemoUserAccountsResponse.errorCode}`); return json({ error: `Error while getting all accounts for user: ${parsedDemoUserAccountsResponse.errorCode}` }, { status: 500 }); }
    if(parsedDemoUserAccountsResponse.accounts?.length === 0 && parsedUserAccountsResponse.accounts?.length === 0) { console.error(`User has no demo or live trading accounts: ${parsedDemoUserAccountsResponse}`); return json({ error: "The selected account does not have any trading accounts." }, { status: 500 }); }
    
    let submittedRequestBody: SelectUserAPIRequestBody = JSON.parse((await request.clone().text()))
    let submittedAccountName = submittedRequestBody.selectedAccount;
    let submittedAccountIsDemo = submittedRequestBody.isDemo;

    if(submittedAccountIsDemo === true) {
        if(parsedDemoUserAccountsResponse.accounts!.find(account => account.accountName === submittedAccountName) !== undefined) {
            const parsedSignInToAccountResponse: SwitchAccountsResponse = await (await fetch("https://demo-api-capital.backend-capital.com/api/v1/session", {
                method: "PUT",
                headers: {
                    "X-SECURITY-TOKEN": userXSecurityToken,
                    "CST": userCST,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    accountId: parsedDemoUserAccountsResponse.accounts!.find(account => account.accountName === submittedAccountName)?.accountId
                }),
                redirect: "follow"
            })).json();

            if(parsedSignInToAccountResponse.hasActiveDemoAccounts === false && parsedSignInToAccountResponse.hasActiveLiveAccounts === false) {
                { console.error(`User has no demo or live trading accounts: ${parsedDemoUserAccountsResponse}`); return json({ error: "The selected account does not have any trading accounts." }, { status: 500 }); }
            }
    
            if(parsedSignInToAccountResponse.errorCode !== undefined && parsedSignInToAccountResponse.errorCode !== "error.not-different.accountId") {
                console.error(`Error while selecting demo account: ${parsedSignInToAccountResponse.errorCode!}`); return json({ error: `Error while switching account: ${parsedSignInToAccountResponse.errorCode!}` }, { status: 500 });
            } else if(parsedSignInToAccountResponse.errorCode === "error.not-different.accountId") {
                return json({ success: true, msg: `Already signed in to \"${submittedAccountName}\".` }, { status: 200 });
            }
            
            BaseAPIURL.set("https://demo-api-capital.backend-capital.com");
            SignedIntoAccount.set(submittedAccountName);
            return json({ success: true }, { status: 200 });
        } else {
            return json({ error: `The selected account \"${submittedAccountName}\" does not exist.` }, { status: 500 });
        }
    } else {
        if(parsedUserAccountsResponse.accounts!.find(account => account.accountName === submittedAccountName) !== undefined) {
            const parsedSignInToAccountResponse: SwitchAccountsResponse = await (await fetch("https://api-capital.backend-capital.com/api/v1/session", {
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

            if(parsedSignInToAccountResponse.hasActiveDemoAccounts === false && parsedSignInToAccountResponse.hasActiveLiveAccounts === false) {
                { console.error(`User has no demo or live trading accounts: ${parsedDemoUserAccountsResponse}`); return json({ error: "The selected account does not have any trading accounts." }, { status: 500 }); }
            }

            if(parsedSignInToAccountResponse.errorCode !== undefined && parsedSignInToAccountResponse.errorCode !== "error.not-different.accountId") {
                console.error(`Error while selecting account: ${parsedSignInToAccountResponse.errorCode!}`); return json({ error: `Error while switching account: ${parsedSignInToAccountResponse.errorCode!}` }, { status: 500 });
            } else if(parsedSignInToAccountResponse.errorCode === "error.not-different.accountId") {
                return json({ success: true, msg: `Already signed in to \"${submittedAccountName}\".` }, { status: 200 });
            }
            
            BaseAPIURL.set("https://api-capital.backend-capital.com");
            SignedIntoAccount.set(submittedAccountName)
            return json({ success: true }, { status: 200 });
        } else {
            return json({ error: `The selected trading account \"${submittedAccountName}\" does not exist.`}, { status: 500 });
        }
    }

});