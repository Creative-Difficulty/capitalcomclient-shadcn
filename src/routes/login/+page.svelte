<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import { Badge } from "$lib/components/ui/badge";

    import { LogIn } from 'lucide-svelte';
    import { Loader2 } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { UserCST, UserXSecurityToken } from "$lib/stores";
    import toast from "svelte-french-toast";
    import { goto } from "$app/navigation";
    
    export let form: ActionData;

    let disclaimerAcknowledged = false;
    let showLoadingButton = false;
    let showDialogLoadingButton = false;

    let progressiveWrongEmail = false;
    let progressiveWrongPassword = false;
    let progressiveWrongAPIKey = false;

    let selectedAccount: string | undefined = undefined;
    $: dialogOpen = form?.showSelectAccountDialog ?? false;

    async function handleSelectedAcountSubmit() {
        showDialogLoadingButton = true;
        if(selectedAccount === undefined || dialogOpen === false) { return; }

        const apiResponse = await (await fetch("/api/selectaccount", {
            method: "POST",
            headers: {
                "CAPITALCOM-CST": $UserCST,
                "CAPITALCOM-X-SECURITY-TOKEN": $UserXSecurityToken, 
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                selectedAccount: selectedAccount
            })
        })).json();

        showDialogLoadingButton = false
        if(apiResponse.success === true) {
            toast.success("Successfully signed in!");
            dialogOpen = false;
            goto("/dashboard");
        } else if(apiResponse.error) {
            toast.error(apiResponse.error);
        } else if(apiResponse.msg !== undefined && apiResponse.success === true) {
            toast.success(apiResponse.msg);
            dialogOpen = false;
            goto("/dashboard");
        } else {
            toast.error(`An Error ocurred: ${apiResponse}`);
        }
    }
    
</script>

<div class="flex justify-center items-center h-screen">
    <Card.Root class="shadow-2xl rounded-lg w-3/4 max-w-[3/4] md:w-[400px] md:pb-5">
        <Card.Header>
            <Card.Title>Login</Card.Title>
            <Card.Description>Sign in to your capital.com account.</Card.Description>
        </Card.Header>
        <form method="POST" on:submit={() => showLoadingButton = true}
            use:enhance={({ formElement, formData, action, cancel, submitter }) => {
                showLoadingButton = true;
                // `formElement` is this `<form>` element        // `formData` is its `FormData` object that's about to be submitted        // `action` is the URL to which the form is posted        // calling `cancel()` will prevent the submission        // `submitter` is the `HTMLElement` that caused the form to be submitted
                const formDataObjects = Object.fromEntries(formData);

                const isEmail = new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/).test(String(formDataObjects.user_email).toLowerCase());
                if(!isEmail) {
                    progressiveWrongEmail = true;
                    showLoadingButton = false;
                    cancel();
                } else {
                    progressiveWrongEmail = false;
                }
                
                if(formDataObjects.user_password.toString().length < 8 || !(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<fo>\/?~]/.test(formDataObjects.user_password.toString())) || !(/\d/.test(formDataObjects.user_password.toString())) || formDataObjects.user_password.toString().toUpperCase() === formDataObjects.user_password.toString() || formDataObjects.user_password.toString().toLowerCase() === formDataObjects.user_password.toString()) {
                    progressiveWrongPassword = true;
                    showLoadingButton = false;
                    cancel();
                } else {
                    progressiveWrongPassword = false;
                }
                
                if(formDataObjects.user_password.toString().length < 1) {
                    progressiveWrongAPIKey = true;
                }
                return async ({ result, update }) => {
                    // `result` is an `ActionResult` object            // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set        };
                    await update({ reset: false });
                    showLoadingButton = false;
                }
                
            }}
        >
            <Card.Content class="space-y-2">
                <div class="space-y-1">
                    <Label for="user_email">E-Mail</Label>
                    <Input type="text" name="user_email" class="{progressiveWrongEmail || form?.error === "invalid_details" || form?.error === "invalid_unknown" ? "border-2 border-rose-600" : ""}"/>
                    {#if progressiveWrongEmail || form?.error === "invalid_details" || form?.error === "invalid_unknown"}
                        <p class="text-sm text-muted-foreground text-red-600">Please provide a valid E-Mail address.</p>
                    {/if}
                </div>
                <div class="space-y-1">
                    <Label for="user_password">Password</Label>
                    <Input name="user_password" type="password" class="{progressiveWrongPassword || form?.error === "invalid_details" || form?.error === "invalid_unknown" ? "border-2 border-rose-600" : ""}"/>
                    {#if progressiveWrongPassword || form?.error === "invalid_details" || form?.error === "invalid_unknown"}
                        <p class="text-sm text-muted-foreground text-red-600">Please provide a valid Password.</p>
                    {/if}
                </div>
                <div class="space-y-1">
                    <Label for="user_api_key">API Key</Label>
                    <Input name="user_api_key" type="password" class="{progressiveWrongAPIKey || form?.error === "invalid_api_key" || form?.error === "invalid_unknown" ? "border-2 border-rose-600" : ""}"/>
                    {#if progressiveWrongAPIKey || form?.error === "invalid_api_key" || form?.error === "invalid_unknown"}
                        <p class="text-sm text-muted-foreground text-red-600">Please provide a valid API Key.</p>
                    {/if}
                </div>
                <div class="items-top flex space-x-2 pt-2">
                    <Checkbox id="terms" bind:checked={disclaimerAcknowledged}/>
                    <div class="grid gap-1.5 leading-none">
                    <label for="terms" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Acknowledge disclaimer</label>
                    <p class="text-sm text-muted-foreground">I (the user) acknowledge that the deveopler of this software is not in any way affiliated with capital.com.</p>
                    </div>
                </div>
            </Card.Content>
            <Card.Footer>
                {#if disclaimerAcknowledged}
                    {#if showLoadingButton}
                        <Button disabled>
                            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </Button>
                    {:else}
                        <Button type="submit">
                            <LogIn class="mr-2 h-4 w-4"/>
                            Log in
                        </Button>
                    {/if}
                {:else}
                    <Button disabled>
                        <LogIn class="mr-2 h-4 w-4" />
                        Log in
                    </Button>
                {/if}
            </Card.Footer>
        </form>
    </Card.Root>
</div>


<div class="content-center shadow-2xl w-1/2 md:max-w-[400px] max-w-[3/4]">
    <AlertDialog.Root open={dialogOpen} closeOnOutsideClick={false} closeOnEscape={false} onOpenChange={(open) => { if(open === false) { selectedAccount = undefined; dialogOpen = false } else if(open === true) { dialogOpen = true } } }> 
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Select capital.com account</AlertDialog.Title>
                <AlertDialog.Description>
                    Select the trading account, which you want to use for trading.
                </AlertDialog.Description>
            </AlertDialog.Header>
            {#if form?.accounts}
                <div class="grid gap-4">
                    <RadioGroup.Root onValueChange={selectedValue => selectedAccount = selectedValue}>
                        {#each (form?.accounts ?? []) as account, index}
                            <div class="flex items-center space-x-2">
                                <RadioGroup.Item value={account.accountName} id="r-{index}"/>
                                <Label for="r-{index}">{account.accountName}</Label>
                                <Badge variant="secondary">{account.balance.balance} {account.currency}</Badge>
                                {#if account.preferred}
                                    <Badge variant="secondary" class="border-green-400 bg-green-300">preferred</Badge>
                                {/if}
                            </div>
                        {/each}
                    </RadioGroup.Root>
                </div>
            {/if}
            <AlertDialog.Footer>
                
            {#if selectedAccount !== undefined}
                {#if showDialogLoadingButton}
                    <Button disabled>
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </Button>
                {:else}
                    <AlertDialog.Action on:click={async () => await handleSelectedAcountSubmit()}>Select account</AlertDialog.Action>
                {/if}
            {:else}
                <Button disabled>Select account</Button>
            {/if}
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
</div>
