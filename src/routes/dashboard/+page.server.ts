// import type { PageServerLoad } from './$types';
// import { BaseAPIURL, UserCST, UserXSecurityToken, SignedIntoAccount } from "$lib/stores";
// import type { Account, BaseAPIURLType, CapitalComUserAccounts } from '$lib/types';
// import { redirect } from '@sveltejs/kit';

// let userCST: string;
// UserCST.subscribe((value: string) => {
//     userCST = value;
// });

// let userXSecurityToken: string;
// UserXSecurityToken.subscribe((value: string) => {
//     userXSecurityToken = value;
// });

// let baseAPIURL: BaseAPIURLType = "";
// BaseAPIURL.subscribe((value: BaseAPIURLType) => {
//     baseAPIURL = value;
// });

// let signedIntoAccount: string;
// SignedIntoAccount.subscribe((value: string) => {
//     signedIntoAccount = value;
// });

// export const load: PageServerLoad = async () => {
//     const response: Response = await fetch(`${baseAPIURL}/api/v1/accounts`, {
//         method: "GET",
//         headers: {
//             "X-SECURITY-TOKEN": userXSecurityToken,
//             "CST": userCST,
//             "Content-Type" : "application/json"
//         }
//     });

//     const parsedResponse: CapitalComUserAccounts = await response.json();
//     const signedIntoAccountFromBroker: string | undefined = parsedResponse.accounts?.find(account => account.accountName === signedIntoAccount)!.accountName

//     const actualSignedIntoAccountObject: Account = parsedResponse.accounts?.find(account => signedIntoAccountFromBroker === signedIntoAccount)!
    
//     if(signedIntoAccountFromBroker === undefined || signedIntoAccountFromBroker !== signedIntoAccount) { redirect(302, "/login") }

// 	return {
// 		currentAccountObject: actualSignedIntoAccountObject
// 	};
// };

export const ssr = false;