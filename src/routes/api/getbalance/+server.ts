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
	if(userCST !== capitalComCST || userXSecurityToken !== capitalComSecurityToken) { throw redirect(302, "/login") }

    const response: Response = await fetch(`${baseAPIURL}/api/v1/accounts`, {
        method: "GET",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST,
            "Content-Type" : "application/json"
        }
    });

    const parsedResponse: CapitalComUserAccounts = await response.json();
    if(parsedResponse.errorCode !== undefined) { return json({ error: parsedResponse.errorCode }); }
    let accountBalance: number | undefined = undefined;
    let accountProfitLoss: number | undefined = undefined;
    let accountAvailable: number | undefined = undefined;
    let accountCurrency: string | undefined = undefined;

    const accountObject = parsedResponse.accounts!.find(account => account.accountName === signedIntoAccount)
    if(accountObject === undefined) {
        console.error(`The account, which the user is signed into \"${signedIntoAccount}\" does not exist.`);
        return json({ error: `Error: The account, which the user is signed into \"${signedIntoAccount}\" does not exist.` });
    }
    
    accountBalance = accountObject.balance.balance;
    accountProfitLoss = accountObject.balance.profitLoss;
    accountAvailable = accountObject.balance.available;
    accountCurrency = accountObject.currency;

    if(accountBalance === undefined || accountProfitLoss === undefined || accountAvailable === undefined || accountCurrency === undefined) {
        console.error(`One of the properties (balance, P/L, available balance, account currency) of the account \"${signedIntoAccount}\" does not exist.`);
        return json({ error: `Error: One of the properties (balance, P/L, available balance, account currency) of the account \"${signedIntoAccount}\" does not exist.` });
    }

    return json({
        balance: accountBalance,
        profitloss: accountProfitLoss,
        available: accountAvailable,
        currency: accountCurrency
    }, { status: 200 });
})