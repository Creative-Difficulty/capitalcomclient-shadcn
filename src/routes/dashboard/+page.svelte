<script lang="ts">
    import AccountBalanceCard from "$lib/components/custom/AccountBalanceCard.svelte";
    import RecentTradesCard from "$lib/components/custom/RecentTradesCard.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { SignedIntoAccount } from "$lib/stores";
    import type { PageData } from './$types';
    import { onMount } from "svelte";

    export let data: PageData;
    let accountBalanceCardComponent: AccountBalanceCard;

    onMount(async () => {
        const AccountBalanceCardUpdateInterval = setInterval(async () => {
            await accountBalanceCardComponent.updateBalanceData();
            if(accountBalanceCardComponent.errorWhenUpdatingBalance === true) {
                clearInterval(AccountBalanceCardUpdateInterval);
                console.log(`Error while getting balance: ${accountBalanceCardComponent.errorContent}`);
            }
        }, 3000)
    })
</script>


<div class="p-5 flex flex-wrap flex-initial gap-4">
    <RecentTradesCard/>
    <AccountBalanceCard bind:this={accountBalanceCardComponent}/>
</div>

