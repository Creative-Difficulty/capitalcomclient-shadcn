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
    // export let data: PageData;
    let accountBalanceCardComponent: AccountBalanceCard;
    let AccountBalanceCardUpdatetimeout: number;
    onMount(async () => {
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
</script>

<header class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
    <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <h1 class="flex-none text-xl font-semibold dark:text-white"><img alt="The project logo" src={logo}/></h1>
        <div class="flex flex-row items-right gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5">
            <a class="font-medium text-blue-500" href="#" aria-current="page">Landing</a>
            <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Account</a>
            <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Work</a>
            <a class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500" href="#">Blog</a>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild let:builder>
                    <!-- <Button builders={[builder]}> -->
                        <Avatar.Root>
                            <Avatar.Fallback>{$SignedIntoAccount.substring(0, 1).toUpperCase()}</Avatar.Fallback>
                        </Avatar.Root>
                    <!-- </Button> -->
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="w-56">
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                    <Users class="mr-2 h-4 w-4" />
                    <span>Team</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>
                        <UserPlus class="mr-2 h-4 w-4" />
                        <span>Invite users</span>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                        <DropdownMenu.Item>
                        <Mail class="mr-2 h-4 w-4" />
                        <span>Email</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                        <MessageSquare class="mr-2 h-4 w-4" />
                        <span>Message</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                        <PlusCircle class="mr-2 h-4 w-4" />
                        <span>More...</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Item>
                        <Plus class="mr-2 h-4 w-4" />
                            <span>New Team</span>
                        <DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
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
                        <span>Log out</span>
                        <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
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

