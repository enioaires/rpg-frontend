<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { CalculatedCharacter } from '$lib/types/character';

	// Props do componente
	export let character: CalculatedCharacter;
	export let showBackButton: boolean = true;
	export let showEditButton: boolean = true;

	const dispatch = createEventDispatcher<{
		back: void;
		edit: { character: CalculatedCharacter };
	}>();

	// Dados extraídos
	$: basicInfo = character.data.basicInfo;
	$: calculated = character.calculated;
	$: level = calculated.progression.currentLevel;
	$: xpProgress = calculated.progression.xpProgress;

	const handleBack = () => {
		dispatch('back');
	};

	const handleEdit = () => {
		dispatch('edit', { character });
	};
</script>

<div class="border-b border-gray-200 bg-white px-4 py-6 sm:px-6">
	<div class="flex items-center justify-between">
		<!-- Voltar -->
		{#if showBackButton}
			<Button variant="ghost" size="sm" on:click={handleBack} class="flex items-center space-x-1">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span>Voltar</span>
			</Button>
		{:else}
			<div></div>
		{/if}

		<!-- Editar -->
		{#if showEditButton}
			<Button variant="outline" size="sm" on:click={handleEdit} class="flex items-center space-x-1">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
				<span>Editar</span>
			</Button>
		{/if}
	</div>

	<!-- Header principal -->
	<div class="mt-4">
		<div class="flex items-start space-x-4">
			<!-- Avatar grande -->
			<div class="flex-shrink-0">
				{#if basicInfo.characterImage}
					<img
						src={basicInfo.characterImage}
						alt={basicInfo.characterName}
						class="h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white"
					/>
				{:else}
					<div
						class="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg ring-4 ring-white"
					>
						<svg
							class="h-10 w-10 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Informações principais -->
			<div class="min-w-0 flex-1">
				<!-- Nome e nível -->
				<div class="flex items-center space-x-3">
					<h1 class="truncate text-2xl font-bold text-gray-900">
						{basicInfo.characterName || character.name}
					</h1>
					<Badge variant="info" size="lg">
						Nível {level}
					</Badge>
				</div>

				<!-- Jogador -->
				<p class="mt-1 text-sm text-gray-600">
					Jogado por <span class="font-medium">{basicInfo.playerName}</span>
				</p>

				<!-- Badges de informações -->
				<div class="mt-2 flex flex-wrap gap-2">
					{#if basicInfo.class}
						<Badge variant="default">{basicInfo.class}</Badge>
					{/if}
					{#if basicInfo.race}
						<Badge variant="secondary">{basicInfo.race}</Badge>
					{/if}
					{#if basicInfo.deity}
						<Badge variant="outline">🙏 {basicInfo.deity}</Badge>
					{/if}
					{#if basicInfo.alignment}
						<Badge variant="outline">{basicInfo.alignment}</Badge>
					{/if}
					{#if basicInfo.virtuePoints > 0}
						<Badge variant="warning">✨ {basicInfo.virtuePoints} VP</Badge>
					{/if}
				</div>
			</div>
		</div>

		<!-- Progresso de XP -->
		{#if calculated.progression.xpForNext > 0}
			<div class="mt-4 space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-gray-700">Experiência</span>
					<span class="text-gray-500">
						{calculated.progression.xpCurrent} / {calculated.progression.xpForNext} XP
					</span>
				</div>

				<ProgressBar
					value={calculated.progression.xpCurrent}
					max={calculated.progression.xpForNext}
					size="md"
					variant="info"
					animated={true}
					showPercentage={true}
				/>

				<div class="flex justify-between text-xs text-gray-500">
					<span>Nível {level}</span>
					<span>{xpProgress}% para o próximo nível</span>
					<span>Nível {calculated.progression.nextLevel}</span>
				</div>
			</div>
		{/if}

		<!-- Status rápido -->
		<div class="mt-4 grid grid-cols-3 gap-4 text-center">
			<!-- Vitalidade -->
			<div class="rounded-lg bg-red-50 p-3">
				<div class="text-lg font-semibold text-red-700">
					{calculated.vitality.total}
				</div>
				<div class="text-xs text-red-600">Vitalidade</div>
			</div>

			<!-- Berkana -->
			<div class="rounded-lg bg-blue-50 p-3">
				<div class="text-lg font-semibold text-blue-700">
					{calculated.berkana.total}
				</div>
				<div class="text-xs text-blue-600">Berkana</div>
			</div>

			<!-- Atributo mais alto -->
			<div class="rounded-lg bg-green-50 p-3">
				{#if calculated.attributes.totals}
					{@const highestAttr = Object.entries(calculated.attributes.totals).reduce((a, b) =>
						a[1] > b[1] ? a : b
					)}
					<div class="text-lg font-semibold text-green-700">
						{highestAttr[1]}
					</div>
					<div class="text-xs text-green-600 capitalize">
						{highestAttr[0]}
					</div>
				{:else}
					<div class="text-lg font-semibold text-green-700">--</div>
					<div class="text-xs text-green-600">Atributo</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* Gradiente sutil no background */
	.bg-gradient-to-br {
		background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
	}
</style>
