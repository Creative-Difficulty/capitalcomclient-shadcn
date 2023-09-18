<script lang="ts">
    import { page } from "$app/stores";
    import type { CapitalComPingResponse } from "$lib/types";
    import { BaseAPIURL, UserCST, UserXSecurityToken } from "$lib/stores";
    import "../app.postcss";
    import { redirect } from "@sveltejs/kit";
    import { Toaster } from "svelte-french-toast";

    if($page.route.id?.startsWith("/dashboard")) {
        setInterval(async () => {
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
        }, 580000)
    }
</script>

<Toaster/>
<slot />
