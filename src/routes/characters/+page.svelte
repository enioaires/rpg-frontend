<!-- src/routes/characters/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		characters,
		charactersStats,
		isLoadingCharacters,
		charactersError,
		loadCharacters,
		deleteCharacter
	} from '$lib/stores/characters';
	import { logger } from '$lib/utils/logger';
	import { ROUTES } from '$lib/utils/constants';
	import Button from '$lib/components/ui/Button.svelte';

	// Estado da página
	let searchTerm = '';
	let showDeleteModal = false;
	let characterToDelete: any = null;

	// Filtrar personagens baseado na busca
	$: filteredCharacters = $characters.filter((character) => {
		if (!searchTerm.trim()) return true;

		const search = searchTerm.toLowerCase();
		const name = character.name?.toLowerCase() || '';
		const className = character.data?.basicInfo?.class?.toLowerCase() || '';
		const race = character.data?.basicInfo?.race?.toLowerCase() || '';
		const playerName = character.data?.basicInfo?.playerName?.toLowerCase() || '';

		return (
			name.includes(search) ||
			className.includes(search) ||
			race.includes(search) ||
			playerName.includes(search)
		);
	});

	// Lifecycle
	onMount(() => {
		logger.pageView('/characters');
		loadCharacters();
	});

	// Actions
	function createCharacter() {
		goto(ROUTES.CHARACTER.CREATE);
	}

	function viewCharacter(id: number) {
		goto(ROUTES.CHARACTER.VIEW(id));
	}

	function editCharacter(id: number) {
		goto(ROUTES.CHARACTER.EDIT(id));
	}

	function confirmDelete(character: any) {
		characterToDelete = character;
		showDeleteModal = true;
	}

	async function handleDelete() {
		if (!characterToDelete) return;

		const success = await deleteCharacter(characterToDelete.id);

		if (success) {
			showDeleteModal = false;
			characterToDelete = null;
		}
	}

	function cancelDelete() {
		showDeleteModal = false;
		characterToDelete = null;
	}

	// Formatação de data
	function formatDate(dateString: string) {
		try {
			return new Date(dateString).toLocaleDateString('pt-BR');
		} catch {
			return 'Data inválida';
		}
	}

	// Calcular vitalidade total
	function getTotalVitality(character: any) {
		const raceBase = character.data?.vitality?.raceBase || 0;
		const classBase = character.data?.vitality?.classBase || 0;
		return raceBase + classBase;
	}

	// Obter cor do nível
	function getLevelColor(level: number) {
		if (level >= 50) return 'text-purple-600 bg-purple-100';
		if (level >= 25) return 'text-blue-600 bg-blue-100';
		if (level >= 10) return 'text-green-600 bg-green-100';
		if (level >= 5) return 'text-yellow-600 bg-yellow-100';
		return 'text-gray-600 bg-gray-100';
	}
</script>

<svelte:head>
	<title>Meus Personagens - RPG Digital</title>
	<meta name="description" content="Lista de todos os seus personagens RPG" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<!-- Header Section -->
		<div class="mb-6">
			<div class="sm:flex sm:items-center sm:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Meus Personagens</h1>
					<p class="mt-1 text-sm text-gray-600">
						Gerencie suas fichas RPG e continue suas aventuras
					</p>
				</div>
				<div class="mt-4 sm:mt-0">
					<Button variant="primary" on:click={createCharacter}>
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Novo Personagem
					</Button>
				</div>
			</div>
		</div>

		<!-- Stats Cards - Mobile First -->
		<div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div class="rounded-lg bg-white p-4 shadow-sm">
				<div class="flex items-center">
					<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
						<svg
							class="h-4 w-4 text-blue-600"
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
						<p class="text-xs text-gray-600">Total</p>
						<p class="text-lg font-semibold text-gray-900">
							{$isLoadingCharacters ? '...' : $charactersStats.total}
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow-sm">
				<div class="flex items-center">
					<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
						<svg
							class="h-4 w-4 text-green-600"
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
						<p class="text-xs text-gray-600">Nível Max</p>
						<p class="text-lg font-semibold text-gray-900">
							{$isLoadingCharacters ? '...' : $charactersStats.maxLevel}
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow-sm">
				<div class="flex items-center">
					<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
						<svg
							class="h-4 w-4 text-purple-600"
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
						<p class="text-xs text-gray-600">Classes</p>
						<p class="text-lg font-semibold text-gray-900">
							{$isLoadingCharacters ? '...' : $charactersStats.uniqueClasses}
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-4 shadow-sm">
				<div class="flex items-center">
					<div class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
						<svg
							class="h-4 w-4 text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<div>
						<p class="text-xs text-gray-600">Encontrados</p>
						<p class="text-lg font-semibold text-gray-900">
							{filteredCharacters.length}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Search Bar -->
		<div class="mb-6">
			<div class="relative">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Buscar por nome, classe, raça ou jogador..."
					class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				/>
			</div>
		</div>

		<!-- Content -->
		{#if $isLoadingCharacters}
			<!-- Loading State -->
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="animate-pulse rounded-lg bg-white p-6 shadow-sm">
						<div class="flex items-center space-x-4">
							<div class="h-12 w-12 rounded-full bg-gray-200"></div>
							<div class="flex-1 space-y-2">
								<div class="h-4 w-3/4 rounded bg-gray-200"></div>
								<div class="h-3 w-1/2 rounded bg-gray-200"></div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if $charactersError}
			<!-- Error State -->
			<div class="rounded-lg bg-red-50 p-6 text-center">
				<svg
					class="mx-auto h-12 w-12 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h3 class="mt-2 text-lg font-medium text-red-900">Erro ao carregar personagens</h3>
				<p class="mt-1 text-sm text-red-700">{$charactersError}</p>
				<div class="mt-4">
					<Button variant="ghost" on:click={() => loadCharacters()} class="cursor-pointer">
						Tentar novamente
					</Button>
				</div>
			</div>
		{:else if filteredCharacters.length === 0}
			<!-- Empty State -->
			<div class="rounded-lg bg-white p-12 text-center shadow-sm">
				{#if searchTerm.trim()}
					<!-- No Results -->
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<h3 class="mt-2 text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
					<p class="mt-1 text-sm text-gray-600">
						Nenhum personagem corresponde à busca "{searchTerm}"
					</p>
					<div class="mt-4">
						<Button variant="ghost" on:click={() => (searchTerm = '')}>Limpar busca</Button>
					</div>
				{:else}
					<!-- No Characters -->
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
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
					<h3 class="mt-2 text-lg font-medium text-gray-900">Nenhum personagem ainda</h3>
					<p class="mt-1 text-sm text-gray-600">Comece criando seu primeiro personagem RPG!</p>
					<div class="mt-6">
						<Button variant="primary" on:click={createCharacter}>
							<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Criar Primeiro Personagem
						</Button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Characters List -->
			<div class="space-y-4">
				{#each filteredCharacters as character (character.id)}
					<div class="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
						<!-- Mobile Layout -->
						<div class="sm:hidden">
							<div class="flex items-start justify-between">
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-lg font-medium text-gray-900">
										{character.name}
									</h3>
									<p class="text-sm text-gray-600">
										{character.data?.basicInfo?.class || 'Sem classe'} •
										{character.data?.basicInfo?.race || 'Sem raça'}
									</p>
									<div class="mt-2 flex items-center space-x-3">
										<span
											class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getLevelColor(
												character.data?.basicInfo?.currentLevel || 0
											)}"
										>
											Nv. {character.data?.basicInfo?.currentLevel || 0}
										</span>
									</div>
								</div>

								<!-- Mobile Actions -->
								<div class="flex space-x-2">
									<button
										on:click={() => viewCharacter(character.id)}
										class="cursor-pointer rounded-md bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									</button>
									<button
										on:click={() => editCharacter(character.id)}
										class="cursor-pointer rounded-md bg-gray-50 p-2 text-gray-600 hover:bg-gray-100"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
											/>
										</svg>
									</button>
									<button
										on:click={() => confirmDelete(character)}
										class="cursor-pointer rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
									>
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div class="mt-3 text-xs text-gray-500">
								Jogador: {character.data?.basicInfo?.playerName || 'Não informado'} • Atualizado em {formatDate(
									character.updatedAt
								)}
							</div>
						</div>

						<!-- Desktop Layout -->
						<div class="hidden sm:flex sm:items-center sm:justify-between">
							<div class="flex items-center space-x-4">
								<!-- Avatar/Icon -->
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
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
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>

								<!-- Character Info -->
								<div>
									<h3 class="text-lg font-medium text-gray-900">
										{character.name}
									</h3>
									<p class="text-sm text-gray-600">
										{character.data?.basicInfo?.class || 'Sem classe'} •
										{character.data?.basicInfo?.race || 'Sem raça'}
									</p>
								</div>
							</div>

							<!-- Stats & Actions -->
							<div class="flex items-center space-x-6">
								<div class="text-sm text-gray-600">
									<span class="font-medium">Jogador:</span>
									{character.data?.basicInfo?.playerName || 'Não informado'}
								</div>

								<div class="flex items-center space-x-3">
									<span
										class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {getLevelColor(
											character.data?.basicInfo?.currentLevel || 0
										)}"
									>
										Nível {character.data?.basicInfo?.currentLevel || 0}
									</span>
								</div>

								<!-- Actions -->
								<div class="flex space-x-2">
									<Button variant="ghost" size="sm" on:click={() => viewCharacter(character.id)}>
										Visualizar
									</Button>
									<Button variant="ghost" size="sm" on:click={() => confirmDelete(character)}>
										<svg
											class="h-4 w-4 text-red-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</Button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && characterToDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<div class="flex items-center">
				<div class="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
					<svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-medium text-gray-900">Excluir Personagem</h3>
					<p class="mt-1 text-sm text-gray-600">
						Tem certeza que deseja excluir <strong>{characterToDelete.name}</strong>? Esta ação não
						pode ser desfeita.
					</p>
				</div>
			</div>

			<div class="mt-6 flex space-x-3">
				<Button variant="ghost" on:click={cancelDelete} class="flex-1">Cancelar</Button>
				<Button variant="danger" on:click={handleDelete} class="flex-1">Excluir</Button>
			</div>
		</div>
	</div>
{/if}
