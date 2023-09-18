import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import type { BaseAPIURLType, CapitalComTradeDetailsResponse, CapitalComTradeHistoryResponse } from "$lib/types";
import { BaseAPIURL, UserCST, UserXSecurityToken } from "$lib/stores";

let userCST: string;
UserCST.subscribe((value: string) => {
    userCST = value;
});

let userXSecurityToken: string;
UserXSecurityToken.subscribe((value: string) => {
    userXSecurityToken = value;
});

let baseAPIURL: BaseAPIURLType = "";
BaseAPIURL.subscribe((value: BaseAPIURLType) => {
    baseAPIURL = value;
});


export const GET = (async ({ cookies }) => {
    const capitalComCST = cookies.get("CAPITALCOM-CST");
    const capitalComSecurityToken = cookies.get("CAPITALCOM-X-SECURITY-TOKEN");
	if(userCST !== capitalComCST || userXSecurityToken !== capitalComSecurityToken) { throw redirect(302, "/login") }
    const response: Response = await fetch(`${baseAPIURL}/api/v1/history/activity?type=POSITION&lastPeriod=86400`, {
        method: "GET",
        headers: {
            "X-SECURITY-TOKEN": userXSecurityToken,
            "CST": userCST,
            "Content-Type" : "application/json"
        }
    });

    const parsedResponse: CapitalComTradeHistoryResponse = await response.json();
    if(parsedResponse.errorCode !== undefined) { return json([{ error: parsedResponse.errorCode }]); }
    let tradeArrayToReturn: Array<{ title?: string; description?: string; error?: string }> = [];

    await Promise.all(parsedResponse.activities!.map(async trade => {
        if(trade.source === "USER" && trade.type === "POSITION") {
            const tradeDetailsResponse: Response  = await fetch(`${baseAPIURL}/api/v1/positions/${trade.dealId}`, {
                method: "GET",
                headers: {
                    "X-SECURITY-TOKEN": userXSecurityToken,
                    "CST": userCST,
                    "Content-Type" : "application/json"
                }
            });
            
            const parsedTradeDetailsResponse: CapitalComTradeDetailsResponse = await tradeDetailsResponse.json();
            if(parsedTradeDetailsResponse.errorCode === undefined) {
                tradeArrayToReturn.push({
                    title: `${parsedTradeDetailsResponse.position!.direction! === "BUY" ? "Bought" : "Sold"} ${parsedTradeDetailsResponse.position!.size!} ${parsedTradeDetailsResponse!.market?.instrumentType.toLowerCase()} of ${parsedTradeDetailsResponse.market!.instrumentName}`,
                    description: `${new Date(new Date().getTime() - new Date(parsedTradeDetailsResponse.position!.createdDate).getTime()).getMinutes()} ${(new Date(new Date().getTime() - new Date(parsedTradeDetailsResponse.position!.createdDate).getTime()).getMinutes()) === 1 ? "minute" : "minutes"} ago`
                })
            } else {
                console.error(`Error when getting details of one trade: ${parsedTradeDetailsResponse.errorCode}`);
            }
        }
    }));
    return json(tradeArrayToReturn, { status: 200 });
}) satisfies RequestHandler