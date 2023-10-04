<script lang="ts">
    import { page } from "$app/stores";
    import type { CapitalComPingResponse } from "$lib/types";
    import { BaseAPIURL, UserCST, UserXSecurityToken } from "$lib/stores";
    import "../app.postcss";
    import { redirect } from "@sveltejs/kit";
    import toast, { Toaster } from "svelte-french-toast";
    import { onDestroy, onMount } from "svelte";

    let refreshTimeout: NodeJS.Timeout;

    onMount(() => {
        if($BaseAPIURL === undefined && !$page.route.id?.startsWith("/login")) {
            toast.error("Could not refresh authetication state");
            return;
        }
        if($page.route.id?.startsWith("/dashboard")) {
            refreshTimeout = setTimeout(async function run() {
                const response: Response = await fetch(`${$BaseAPIURL}/api/v1/ping`, {
                    method: "GET",
                    headers: {
                        "X-SECURITY-TOKEN": $UserXSecurityToken.toString(),
                        "CST" : $UserCST.toString(),
                        "Content-Type" : "application/json"
                    },
                    redirect: "follow"
                });
        
                let parsedResponse: CapitalComPingResponse = await response.json();
                
                if(parsedResponse.errorCode !== undefined) {
                    throw redirect(302, "/login");
                }
                setTimeout(run, 580000);
            }, 580000)
        }
    })

    onDestroy(() => {
        clearTimeout(refreshTimeout)
    })
</script>

<Toaster/>
<slot />
