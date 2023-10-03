<script lang="ts">
    import AccountBalanceCard from "$lib/components/custom/AccountBalanceCard.svelte";
    import RecentTradesCard from "$lib/components/custom/RecentTradesCard.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import * as Avatar from "$lib/components/ui/avatar";
    import { SignedIntoAccount } from "$lib/stores";
    import type { PageData } from './$types';
    import { onMount, onDestroy } from "svelte";
    import logo from "$lib/assets/logo.png";

    import {
        Cloud,
        CreditCard,
        Github,
        Keyboard,
        LifeBuoy,
        LogOut,
        Mail,
        MessageSquare,
        Plus,
        PlusCircle,
        Settings,
        User,
        UserPlus,
        Users
    } from "lucide-svelte";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { goto, invalidateAll } from "$app/navigation";
    import toast from "svelte-french-toast";
    // export let data: PageData;
    let accountBalanceCardComponent: AccountBalanceCard;
    let AccountBalanceCardUpdatetimeout: number;
    onMount(async () => {
        console.log($SignedIntoAccount);
        let i = 1;
        const AccountBalanceCardUpdatetimeout = setTimeout(async function run() {
            await accountBalanceCardComponent.updateBalanceData();
            if(accountBalanceCardComponent.errorWhenUpdatingBalance === true) {
                clearInterval(AccountBalanceCardUpdatetimeout);
                console.log(`Error while getting balance: ${accountBalanceCardComponent.errorContent}`);
            }
            setTimeout(run, 1000);
        }, 1000);
    })
    onDestroy(() => {
        clearTimeout(AccountBalanceCardUpdatetimeout);
    })

    async function logOut() {
        const logOutResponse = await (await fetch("/api/logout", {
            method: "GET"
        })).json();

        if(logOutResponse.status !== "success") {
            toast.error(logOutResponse.error)
            goto("/login");
            await invalidateAll();
            return;
        }

        if(logOutResponse.status === "success") {
            toast.success("Logged out successfully")
            goto("/login");
            await invalidateAll();
            return;
        }

    }
</script>

<header class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
    <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <h1 class="flex-none text-xl font-semibold dark:text-white"><img alt="The project logo" src={logo}/></h1>
        <div class="flex flex-row items-right gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <Button builders={[builder]} class=" bg-white focus:bg-white hover:bg-white">
                        <Avatar.Root >
                            <Avatar.Fallback>{$SignedIntoAccount.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                        </Avatar.Root>
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56">
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    <Github class="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                    <LifeBuoy class="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                    <Cloud class="mr-2 h-4 w-4" />
                    <span>API</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                        <LogOut class="mr-2 h-4 w-4" />
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div on:click={async () => await logOut()}>Log out</div>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
          </DropdownMenu.Root>
      </div>
    </nav>
</header>
<div class="p-5 flex flex-wrap flex-initial gap-4">
    <RecentTradesCard/>
    <AccountBalanceCard bind:this={accountBalanceCardComponent}/>
</div>

