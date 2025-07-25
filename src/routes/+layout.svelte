<!-- ==========================================
    LAYOUT PRINCIPAL COM AUTH MIDDLEWARE
    ==========================================
    Arquivo: src/routes/+layout.svelte
-->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { handleNavigation, setupTokenWatcher } from '../hooks.client';
	import { authStore, isAuthenticated, isAuthLoading } from '$lib/stores/auth';
	import { logger } from '$lib/utils/logger';
	import '../app.css'; // Tailwind CSS

	// ==========================================
	// PROPS DO SERVER
	// ==========================================

	let { data, children } = $props();

	// ==========================================
	// MIDDLEWARE DE NAVEGAÇÃO
	// ==========================================

	let tokenWatcherCleanup: (() => void) | undefined;

	// Executa antes de cada navegação (client-side apenas)
	beforeNavigate(async ({ to }) => {
		if (!to) return;

		try {
			await handleNavigation({ url: to.url });
		} catch (error) {
			logger.error('❌ Navigation middleware error', error);
		}
	});

	// Executa após cada navegação
	afterNavigate(({ from, to }) => {
		logger.debug('✅ After navigate', {
			from: from?.url.pathname,
			to: to?.url.pathname
		});
	});

	// ==========================================
	// INICIALIZAÇÃO
	// ==========================================

	onMount(() => {
		logger.info('🚀 App layout mounted');

		// Inicializa auth store
		authStore.initialize();

		// Configura watcher de token
		tokenWatcherCleanup = setupTokenWatcher();
	});

	onDestroy(() => {
		if (tokenWatcherCleanup) {
			tokenWatcherCleanup();
		}
	});

	// ==========================================
	// DERIVED STATES (Svelte 5)
	// ==========================================

	const showLoadingScreen = $derived($isAuthLoading);

	// Effects para logs (Svelte 5)
	$effect(() => {
		if ($isAuthenticated) {
			logger.info('🔓 User authenticated');
		} else if (!$isAuthLoading) {
			logger.info('🔒 User not authenticated');
		}
	});
</script>

<!-- ==========================================
     LOADING SCREEN
     ========================================== -->
{#if showLoadingScreen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-white">
		<div class="flex flex-col items-center space-y-4">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
			<p class="text-sm text-gray-600">Verificando autenticação...</p>
		</div>
	</div>
{/if}

<!-- ==========================================
     LAYOUT PRINCIPAL - SEM HEADER
     ========================================== -->
<div class="min-h-screen bg-gray-50">
	<!-- Main Content - Cada página cuida do próprio header -->
	<main class="w-full">
		{@render children()}
	</main>
</div>

<!-- ==========================================
     GLOBAL ERROR BOUNDARY
     ========================================== -->
<svelte:window
	on:error={(event: any) => {
		logger.error('🚨 Unhandled error', event.error);
	}}
	on:unhandledrejection={(event) => {
		logger.error('🚨 Unhandled promise rejection', event.reason);
	}}
/>
