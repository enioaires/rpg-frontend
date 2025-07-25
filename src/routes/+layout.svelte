<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { isAuthenticated, currentUser } from '$lib/stores/auth';
	import { logger } from '$lib/utils/logger';
	import '$lib/init'; // Auto-inicialização

	let { children } = $props();

	// ==========================================
	// LIFECYCLE
	// ==========================================

	onMount(() => {
		logger.info('Layout montado');
	});
</script>

<!-- ==========================================
     GLOBAL HEAD
     ========================================== -->
<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#2563eb" />
</svelte:head>

<!-- ==========================================
     LAYOUT CONTENT
     ========================================== -->

<!-- Main Content -->
<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>

<!-- Toast Notifications -->
<Toaster position="top-right" richColors closeButton duration={4000} />

<!-- Debug Info (desenvolvimento) -->
{#if import.meta.env.DEV}
	<div class="fixed bottom-4 left-4 z-50">
		<details class="max-w-xs rounded bg-black/80 p-2 text-xs text-white">
			<summary class="cursor-pointer">Debug Info</summary>
			<div class="mt-2 space-y-1">
				<div>Auth: {$isAuthenticated ? '✅' : '❌'}</div>
				{#if $currentUser}
					<div>User: {$currentUser.username}</div>
				{/if}
				<div>Env: {import.meta.env.MODE}</div>
			</div>
		</details>
	</div>
{/if}

<style>
	/* Global mobile-first styles */
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Improve focus visibility */
	:global(*:focus-visible) {
		outline: 2px solid #3b82f6; /* blue-500 */
		outline-offset: 2px;
	}

	/* Better touch targets on mobile */
	:global(button),
	:global(a),
	:global(input),
	:global(select) {
		min-height: 44px;
		min-width: 44px;
	}
</style>
