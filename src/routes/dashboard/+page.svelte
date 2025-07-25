<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { authStore, isAuthenticated, currentUser, isAuthLoading } from '$lib/stores/auth';
	import {
		characters,
		charactersStats,
		isLoadingCharacters,
		loadCharacters
	} from '$lib/stores/characters';
	import { logger } from '$lib/utils/logger';
	import { ROUTES } from '$lib/utils/constants';

	// ==========================================
	// REACTIVE STATEMENTS
	// ==========================================

	// Redireciona se não autenticado
	$: if (!$isAuthenticated && !$isAuthLoading) {
		goto(ROUTES.LOGIN);
	}

	// ==========================================
	// LIFECYCLE
	// ==========================================

	onMount(() => {
		logger.pageView('/dashboard');

		// Carrega personagens se autenticado
		if ($isAuthenticated) {
			loadCharacters();
		}
	});

	// ==========================================
	// EVENT HANDLERS
	// ==========================================

	async function handleLogout() {
		await authStore.logout();
	}

	function goToCharacters() {
		goto(ROUTES.CHARACTER.LIST);
	}

	function goToCreateCharacter() {
		goto(ROUTES.CHARACTER.CREATE);
	}
</script>

<!-- ==========================================
     PAGE METADATA
     ========================================== -->
<svelte:head>
	<title>Dashboard - RPG Digital</title>
	<meta name="description" content="Seus personagens RPG" />
</svelte:head>

<!-- ==========================================
     LOADING STATE
     ========================================== -->
{#if $isAuthLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
			></div>
			<p class="text-gray-600">Carregando...</p>
		</div>
	</div>

	<!-- ==========================================
     MAIN CONTENT
     ========================================== -->
{:else if $isAuthenticated && $currentUser}
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
		<!-- Header -->
		<header class="border-b bg-white shadow-sm">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<!-- Logo / Title -->
					<div class="flex items-center">
						<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h1 class="text-xl font-bold text-gray-900">RPG Digital</h1>
					</div>

					<!-- User Menu -->
					<div class="flex items-center space-x-4">
						<span class="text-sm text-gray-600">
							Olá, {$currentUser.name}
						</span>
						<Button variant="ghost" size="sm" on:click={handleLogout}>Sair</Button>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<!-- Welcome Section -->
			<div class="mb-8">
				<h2 class="mb-2 text-3xl font-bold text-gray-900">Bem-vindo de volta!</h2>
				<p class="text-gray-600">Gerencie seus personagens RPG e continue suas aventuras</p>
			</div>

			<!-- Stats Cards -->
			<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
				<!-- Total Characters -->
				<div class="rounded-xl border bg-white p-6 shadow-sm">
					<div class="flex items-center">
						<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600">Personagens</p>
							<p class="text-2xl font-bold text-gray-900">
								{$isLoadingCharacters ? '...' : $charactersStats.total}
							</p>
						</div>
					</div>
				</div>

				<!-- Max Level -->
				<div class="rounded-xl border bg-white p-6 shadow-sm">
					<div class="flex items-center">
						<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
							<svg
								class="h-6 w-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600">Nível Máximo</p>
							<p class="text-2xl font-bold text-gray-900">
								{$isLoadingCharacters ? '...' : $charactersStats.maxLevel}
							</p>
						</div>
					</div>
				</div>

				<!-- Classes -->
				<div class="rounded-xl border bg-white p-6 shadow-sm">
					<div class="flex items-center">
						<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
							<svg
								class="h-6 w-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-600">Classes</p>
							<p class="text-2xl font-bold text-gray-900">
								{$isLoadingCharacters ? '...' : $charactersStats.classes.length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Characters Card -->
				<div class="rounded-xl border bg-white p-8 shadow-sm">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"
						>
							<svg
								class="h-8 w-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>

						<h3 class="mb-2 text-xl font-bold text-gray-900">Seus Personagens</h3>

						<p class="mb-6 text-gray-600">Visualize e edite seus personagens existentes</p>

						<Button variant="outline" size="lg" fullWidth on:click={goToCharacters}>
							Ver Personagens
						</Button>
					</div>
				</div>

				<!-- Create Character Card -->
				<div class="rounded-xl border bg-white p-8 shadow-sm">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>

						<h3 class="mb-2 text-xl font-bold text-gray-900">Novo Personagem</h3>

						<p class="mb-6 text-gray-600">Crie um novo personagem para suas aventuras</p>

						<Button variant="primary" size="lg" fullWidth on:click={goToCreateCharacter}>
							Criar Personagem
						</Button>
					</div>
				</div>
			</div>
		</main>
	</div>

	<!-- ==========================================
     NOT AUTHENTICATED
     ========================================== -->
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<p class="text-gray-600">Redirecionando para login...</p>
		</div>
	</div>
{/if}
