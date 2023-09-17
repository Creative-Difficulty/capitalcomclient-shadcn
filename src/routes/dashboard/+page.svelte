	
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Check } from 'lucide-svelte';
    import { UserCST, UserXSecurityToken } from "$lib/stores";
    let errorWhenGettingTrades = false
    // let trades: { title?: string; description?: string; error?: string }[] = [];
    let trades: Array<{ title?: string; description?: string; error?: string }> = [];

    async () => {
        trades = await (await fetch("/api/getrecenttrades", {
            method: "GET",
            headers: {
                "CAPITALCOM-CST": $UserCST,
                "CAPITALCOM-X-SECURITY-TOKEN": $UserXSecurityToken, 
                "Content-Type" : "application/json"
            }
        })).json();
    };

    const getTradesInterval = setInterval(async () => { 
        trades = await (await fetch("/api/getrecenttrades", {
            method: "GET",
            headers: {
                "CAPITALCOM-CST": $UserCST,
                "CAPITALCOM-X-SECURITY-TOKEN": $UserXSecurityToken, 
                "Content-Type" : "application/json"
            }
        })).json();
        
        // if(trades[0]?) {

        // }
        if((trades[0]?.error ?? undefined) !== undefined) { 
            errorWhenGettingTrades = true;
            clearInterval(getTradesInterval);
        }
    }, 10000);
    
</script>


<div class="p-5 flex flex-wrap flex-initial gap-4">
    <Card.Root class="shadow-2xl rounded-lg">
        <Card.Header>
            <Card.Title>Trade History</Card.Title>
            <!--  -->
            <Card.Description>Your most recent trades will be shown here.</Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-4">
            {#if errorWhenGettingTrades}
                <div class="items-center justify-center">
                    <p>Error when getting recent trades: "{trades[0].error}"</p>
                </div>
            {:else}
                <div>
                    {#each trades as trade, index (index)}
                        <div class="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                            <!-- <span class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" /> -->
                            <Check class="flex h-4 w-4 translate-y-1"/>
                            <div class="space-y-1">
                                <p class="text-sm font-medium leading-none">
                                    {trade.title}
                                </p>
                                <p class="text-sm text-muted-foreground">
                                    {trade.description}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
            
        </Card.Content>
        <Card.Footer>
        </Card.Footer>
    </Card.Root>
</div>