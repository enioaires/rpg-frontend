<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import { authStore, isAuthenticated, currentUser, isAuthLoading } from '$lib/stores/auth';
	import {
		characters,
		charactersStats,
		isLoadingCharacters,
		loadCharacters
	} from '$lib/stores/characters';
	import { logger } from '$lib/utils/logger';

	// ==========================================
	// PROPS DO SERVER
	// ==========================================

	let { data } = $props();

	// ==========================================
	// LIFECYCLE
	// ==========================================

	onMount(() => {
		logger.pageView('/dashboard');

		// Se server disse que está autenticado, inicializa
		if (data.isAuthenticated) {
			authStore.initialize();
		}

		// Carrega personagens se autenticado
		if ($isAuthenticated) {
			loadCharacters();
		}
	});
</script>

<svelte:head>
	<title>Dashboard - RPG Digital</title>
	<meta name="description" content="Seus personagens RPG" />
</svelte:head>

<!-- Server-side já garantiu que só chega aqui se autenticado -->
<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	<!-- Header Único -->
	<Header />

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Welcome Section -->
		<div class="mb-8">
			<h2 class="mb-2 text-3xl font-bold text-gray-900">Bem-vindo de volta!</h2>
			<p class="text-gray-600">Gerencie seus personagens RPG e continue suas aventuras</p>
		</div>

		<!-- Stats Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Total Characters Card -->
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

			<!-- Max Level Card -->
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

			<!-- Classes Card -->
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
							{$isLoadingCharacters ? '...' : $charactersStats.classes}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<!-- Create Character Action -->
			<a
				href="/characters/create"
				class="group rounded-xl border bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
			>
				<div class="flex items-center">
					<div
						class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200"
					>
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
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Novo Personagem</h3>
						<p class="text-sm text-gray-600">Crie um novo personagem RPG</p>
					</div>
				</div>
			</a>

			<!-- View Characters Action -->
			<a
				href="/characters"
				class="group rounded-xl border bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
			>
				<div class="flex items-center">
					<div
						class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200"
					>
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
								d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Ver Personagens</h3>
						<p class="text-sm text-gray-600">Lista todos os seus personagens</p>
					</div>
				</div>
			</a>
		</div>
	</main>
</div>
