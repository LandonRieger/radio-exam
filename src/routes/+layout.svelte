<script>
    import "../app.postcss";
    import { dev } from '$app/environment'
    import { inject } from '@vercel/analytics'

    inject({mode: dev ? 'development' : 'production'})
</script>

<div class="bg-gray-50 dark:bg-gray-900 h-screen">
<slot />
</div>
