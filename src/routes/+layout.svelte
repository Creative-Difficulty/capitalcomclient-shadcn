<script lang="ts">
    import { page } from "$app/stores";
    import type { CapitalComPingResponse } from "$lib/types"
    import { UserCST, UserXSecurityToken } from "$lib/stores";
    import "../app.postcss";
    import { redirect } from "@sveltejs/kit";

    if($page.route.id?.startsWith("/dashboard")) {
        setInterval(async () => {
            const response: Response  = await fetch("https://api-capital.backend-capital.com/api/v1/ping", {
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
            console.debug("Layout auth check ran!");
        }, 580000)
    }
</script>
<slot />
