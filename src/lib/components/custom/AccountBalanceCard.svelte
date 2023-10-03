<svelte:options accessors />
<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { UserCST, UserXSecurityToken } from "$lib/stores";
    import type { AccountBalanceObject } from "$lib/types";
    import { Skeleton } from "$lib/components/ui/skeleton";

    export let errorWhenUpdatingBalance = false;
    
    export let errorContent: undefined | string = undefined;
    let accountBalanceObject: AccountBalanceObject;
    let accountBalance: number | undefined = undefined;
    let accountProfitLoss: number | undefined = undefined;
    let accountAvailable: number | undefined = undefined;
    let accountCurrency: string | undefined = undefined;

    export async function updateBalanceData() {
        accountBalanceObject = await (await fetch("/api/getbalance", {
            method: "GET",
            headers: {
                "CAPITALCOM-CST": $UserCST,
                "CAPITALCOM-X-SECURITY-TOKEN": $UserXSecurityToken,
                "Content-Type" : "application/json"
            }
        })).json();
        
        if(accountBalanceObject.error !== undefined || accountBalanceObject.balance === undefined) { 
            console.log(accountBalanceObject);
            errorWhenUpdatingBalance = true;
            return;
        }
        
        accountBalance = accountBalanceObject.balance!;
        accountProfitLoss = accountBalanceObject.profitloss!;
        accountAvailable = accountBalanceObject.available!;
        accountCurrency = accountBalanceObject.currency!;
    }
    // $: formattedAccountCurrency = accountCurrency!.substring(0, accountCurrency!.lastIndexOf("d")) + accountCurrency!.substring(accountCurrency!.lastIndexOf("d") + 1)
</script>

<Card.Root  class="shadow-2xl rounded-lg">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title>Balance</Card.Title>        
        <!-- <EuroSign class="h-4 w-4 text-muted-foreground" /> -->
    </Card.Header>
    <Card.Content>
        {#if errorWhenUpdatingBalance}
            <div class="items-center justify-center">
                <p>Error when getting account balance: "{accountBalanceObject.error}"</p>
            </div>
        {:else}
            <!-- <div class="text-2xl font-bold">{accountBalance} {formattedAccountCurrency}</div> -->
            {#if accountBalance === undefined}
                <Skeleton class="w-[7rem] h-[1.6rem]" />
            {:else}
                <p class="text-2xl font-bold">{accountBalance}</p>
            {/if}
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
        {/if}
    </Card.Content>
</Card.Root>

