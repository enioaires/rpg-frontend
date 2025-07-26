<!-- src/routes/characters/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { charactersStore } from '$lib/stores/characters';
	import { toast } from 'svelte-sonner';
	import { logger } from '$lib/utils/logger';
	import CharacterHeader from '$lib/components/character/CharacterHeader.svelte';
	import AttributeCard from '$lib/components/character/AttributeCard.svelte';
	import VitalityCard from '$lib/components/character/VitalityCard.svelte';
	import BerkanaCard from '$lib/components/character/BerkanaCard.svelte';
	import WeaponsCard from '$lib/components/character/WeaponsCard.svelte';
	import ArmorCard from '$lib/components/character/ArmorCard.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import type { CalculatedCharacter } from '$lib/types';

	// Props da página
	$: characterId = parseInt($page.params.id);
	$: character = $charactersStore.currentCharacter;
	$: isLoading = $charactersStore.isLoadingCurrent;
	$: error = $charactersStore.error;

	// Debug - vamos ver o que temos
	$: if (character) {
		console.log('Character loaded:', character);
		console.log('Basic info:', character.data?.basicInfo);
		console.log('Calculated data:', character.calculated);
	}

	// Carrega personagem ao montar
	onMount(async () => {
		if (!characterId || isNaN(characterId)) {
			toast.error('ID do personagem inválido');
			goto('/characters');
			return;
		}

		try {
			await charactersStore.select(characterId);
		} catch (err) {
			logger.error('Erro ao carregar personagem', err, { characterId });
			toast.error('Erro ao carregar personagem');
			goto('/characters');
		}
	});

	// Handlers
	const handleBack = () => {
		goto('/characters');
	};

	const handleEdit = () => {
		goto(`/characters/${characterId}/edit`);
	};
</script>

<svelte:head>
	<title>{character?.data?.basicInfo?.characterName || 'Carregando...'} - RPG Ficha</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if isLoading}
		<div class="flex min-h-screen items-center justify-center">
			<LoadingSpinner size="lg" />
		</div>
	{:else if error}
		<div class="flex min-h-screen items-center justify-center p-4">
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div class="text-center">
					<svg
						class="mx-auto h-12 w-12 text-red-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 class="mt-4 text-lg font-medium text-gray-900">Erro ao carregar</h2>
					<p class="mt-2 text-sm text-gray-600">{error}</p>
					<button
						on:click={handleBack}
						class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Voltar
					</button>
				</div>
			</div>
		</div>
	{:else if character && character.data && character.calculated}
		<!-- Header da ficha -->
		<CharacterHeader {character} on:back={handleBack} on:edit={handleEdit} />

		<!-- Conteúdo principal -->
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="space-y-6">
				<!-- Linha 1: Vitalidade e Berkana -->
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<VitalityCard {character} />
					<BerkanaCard {character} />
				</div>

				<!-- Linha 2: Atributos -->
				<AttributeCard {character} />

				<!-- Linha 3: Armas -->
				<WeaponsCard {character} />

				<!-- Linha 4: Armadura -->
				<ArmorCard {character} />
			</div>
		</div>
	{:else}
		<div class="flex min-h-screen items-center justify-center p-4">
			<div class="text-center">
				<h2 class="text-lg font-medium text-gray-900">Personagem não encontrado</h2>
				<button
					on:click={handleBack}
					class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Voltar
				</button>
			</div>
		</div>
	{/if}
</div>
