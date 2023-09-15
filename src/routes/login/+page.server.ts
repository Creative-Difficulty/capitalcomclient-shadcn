import type { CapitalComCreateSessionResponse, CapitalComUserAccounts } from "$lib/types";
import type { Actions } from "./$types";
import { UserCST, UserXSecurityToken } from "$lib/stores"

// export const ssr = false;

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});

export const actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const userEmail = formData.get("user_email")!.toString();
        const userPassword = formData.get("user_password")!.toString();
        const userAPIKey = formData.get("user_api_key")!.toString();

        const response: Response = await fetch("https://api-capital.backend-capital.com/api/v1/session", {
            method: "POST",
            headers: {
                "X-CAP-API-KEY": userAPIKey, //SO6ZbQW5AIXmqE7A
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "identifier": userEmail, //dh2jttwtj5@privaterelay.appleid.com
                "password": userPassword //Neu9Sept!
            })
        });

        let parsedResponse: CapitalComCreateSessionResponse = await response.json();
        
        if(parsedResponse.errorCode !== undefined) {
            if(parsedResponse.errorCode === "error.invalid.api.key") {
                return {
                    error: "invalid_api_key"
                }
            } else if(parsedResponse.errorCode === "error.invalid.details") {
                return {
                    error: "invalid_details"
                }
            } else if(parsedResponse.errorCode === "error.null.api.key") {
                return {
                    error: "invalid_api_key"
                }
            } else {
                return {
                    error: "invalid_unknown"
                }
            }
        } else if(parsedResponse.errorCode === undefined) {
            UserCST.set(response.headers.get("CST")!);
            UserXSecurityToken.set(response.headers.get("X-SECURITY-TOKEN")!);

            cookies.set("CAPITALCOM-CST", response.headers.get("CST")!, {
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            });
            
            cookies.set("CAPITALCOM-X-SECURITY-TOKEN", response.headers.get("X-SECURITY-TOKEN")!, {
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            });


            //get all available accounts for user
            const userAccountsResponse: Response = await fetch("https://api-capital.backend-capital.com/api/v1/accounts", {
                method: "GET",
                headers: {
                    "X-SECURITY-TOKEN": userXSecurityToken,
                    "CST": userCST
                },
                redirect: "follow"
            });
            
            let parsedUserAccountsResponse: CapitalComUserAccounts = await userAccountsResponse.json();
            if(parsedUserAccountsResponse.errorCode !== undefined) { console.error(`Error while getting all acounts for user: ${parsedUserAccountsResponse.errorCode}`); }
            
            return {
                "showSelectAccountDialog": true,
                "accounts": parsedUserAccountsResponse.accounts
            };

            // throw redirect(303, "/dashboard");
        }
    }
} satisfies Actions;