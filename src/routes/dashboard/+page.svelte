<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
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
	<!-- Main Content - Header agora está no layout -->
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
							{$isLoadingCharacters ? '...' : $charactersStats.uniqueClasses}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mb-8">
			<h3 class="mb-4 text-lg font-semibold text-gray-900">Ações Rápidas</h3>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Criar Personagem -->
				<a
					href="/characters/create"
					class="group rounded-xl border border-dashed border-gray-300 p-6 transition-colors hover:border-blue-300 hover:bg-blue-50"
				>
					<div class="flex items-center">
						<div
							class="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700"
						>
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Criar Personagem</p>
							<p class="text-sm text-gray-600">Novo personagem RPG</p>
						</div>
					</div>
				</a>

				<!-- Ver Personagens -->
				<a
					href="/characters"
					class="group rounded-xl border border-dashed border-gray-300 p-6 transition-colors hover:border-green-300 hover:bg-green-50"
				>
					<div class="flex items-center">
						<div
							class="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 group-hover:bg-green-700"
						>
							<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Meus Personagens</p>
							<p class="text-sm text-gray-600">Gerenciar fichas</p>
						</div>
					</div>
				</a>
			</div>
		</div>

		<!-- Recent Characters -->
		{#if $characters && $characters.length > 0}
			<div>
				<h3 class="mb-4 text-lg font-semibold text-gray-900">Personagens Recentes</h3>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each $characters.slice(0, 3) as character}
						<a
							href="/characters/{character.id}"
							class="group rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
						>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h4 class="font-medium text-gray-900 group-hover:text-blue-600">
										{character.name}
									</h4>
									<p class="mt-1 text-sm text-gray-600">
										{character.data?.basicInfo?.class || 'Classe não definida'} •
										{character.data?.basicInfo?.race || 'Raça não definida'}
									</p>
									<p class="mt-2 text-xs text-gray-500">
										Nível {character.data?.basicInfo?.currentLevel || 0}
									</p>
								</div>
								<svg
									class="h-5 w-5 text-gray-400 group-hover:text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{:else if !$isLoadingCharacters}
			<!-- Empty State -->
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
				>
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Nenhum personagem ainda</h3>
				<p class="mb-6 text-gray-600">Comece criando seu primeiro personagem RPG!</p>
				<a
					href="/characters/create"
					class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Criar Primeiro Personagem
				</a>
			</div>
		{/if}
	</main>
</div>
