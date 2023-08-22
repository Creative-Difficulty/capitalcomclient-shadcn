	
<script lang="ts">
    import { Button } from "$components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle
    } from "$components/ui/card";
    import { Switch } from "$components/ui/switch";
    import { Check } from 'lucide-svelte';
    import { UserCST, UserXSecurityToken } from "$lib/stores";
    import { browser } from "$app/environment";
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
        
        if(trades[0].error !== undefined) { 
            errorWhenGettingTrades = true;
            clearInterval(getTradesInterval);
        }
    }, 10000);
    
</script>


<div class="p-5 flex flex-wrap flex-initial gap-4">
    <Card class="shadow-2xl rounded-lg">
        <CardHeader>
            <CardTitle>Trades</CardTitle>
            <!--  -->
            <CardDescription>within the last 10 minutes</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
            <!-- <div class=" flex items-center space-x-4 rounded-md border p-4">
                <div class="flex-1 space-y-1">
                    <p class="text-sm font-medium leading-none">Push Notifications</p>
                    <p class="text-sm text-muted-foreground">Send notifications to device.</p>
                </div>
                <Switch />
            </div> -->
            {#if errorWhenGettingTrades}
                <p>Error when getting recent trades: "{trades[0].error}"</p>
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
            
        </CardContent>
        <CardFooter>
            <Button class="w-full">
                Mark all as read
            </Button>
        </CardFooter>
    </Card>
</div>