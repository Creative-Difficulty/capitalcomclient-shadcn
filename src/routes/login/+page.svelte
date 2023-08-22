	
<script lang="ts">
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle
    } from "$components/ui/card";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle
    } from "$components/ui/dialog";
    import { Button } from "$components/ui/button";
    import { Input } from "$components/ui/input";
    import { Label } from "$components/ui/label";
    import { Checkbox } from "$components/ui/checkbox";
    import { RadioGroup, RadioGroupItem } from "$components/ui/radio-group";
    import { Badge } from "$components/ui/badge";

    import { LogIn } from 'lucide-svelte';
    import { Loader2 } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    let disclaimerAcknowledged = false;

    let progressiveWrongEmail = false;
    let progressiveWrongPassword = false;
    let progressiveWrongAPIKey = false;
    let showLoadingButton = false;

    let selectedAccount: string;
    $: console.log(selectedAccount);
    export let form: ActionData;
</script>

<div class="flex justify-center items-center h-screen">
    <Card class="shadow-2xl rounded-lg w-3/4 max-w-[3/4] md:w-[400px] md:pb-5">
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your capital.com account.</CardDescription>
        </CardHeader>
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
            <CardContent class="space-y-2">
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
                
                <Dialog open={form?.showSelectAccountDialog ?? false} modal={true}>
                    <DialogContent class="max-w-[3/4] w-[400px]">
                        <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Select the trading account, which you want to use for trading.
                        </DialogDescription>
                        </DialogHeader>
                        {#if form?.accounts}
                            <!-- <div class="grid gap-4">
                                <RadioGroup value={form?.accounts[0].accountName.toLowerCase()} on:change:data-state={(event) => console.log(event)}>
                                    {#each (form?.accounts ?? []) as account, index}
                                        <div class="flex items-center space-x-2">
                                            <RadioGroupItem value={account.accountName.toLowerCase()} id="r-{index}" name={index}/>
                                            <Label for="r-{index}">{account.accountName}</Label>
                                            <Badge variant="secondary">{account.balance.balance} {account.currency}</Badge>
                                            {#if account.preferred}
                                                <Badge variant="secondary" class="border-green-400 bg-green-300">preferred</Badge>
                                            {/if}
                                        </div>
                                    {/each}
                                </RadioGroup>
                            </div> -->
                            
                            <div class="grid gap-4">
                                <form class="grid gap-2">
                                    {#each (form?.accounts ?? []) as account, index}
                                        <div class="flex items-center space-x-2">
                                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                <input type="radio" bind:group={selectedAccount} value={account.accountName.toLowerCase()} name={index.toString()} />
                                                {account.accountName}
                                            </label>
                                            <Badge variant="secondary">{account.balance.balance} {account.currency}</Badge>
                                            {#if account.preferred}
                                                <Badge variant="secondary" class="border-green-400 bg-green-300">preferred</Badge>
                                            {/if}
                                        </div>
                                    {/each}

                                </form>
                            </div>
                        {/if}
                        <DialogFooter>
                            <Button type="submit">Select account</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
            <CardFooter>
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
            </CardFooter>
        </form>
    </Card>
</div>