<!-- src/lib/components/character/CharacterHeader.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import type { CalculatedCharacter } from '$lib/types';

	// Props do componente
	export let character: CalculatedCharacter;
	export let showBackButton: boolean = true;
	export let showEditButton: boolean = true;

	const dispatch = createEventDispatcher<{
		back: void;
		edit: { character: CalculatedCharacter };
	}>();

	// Dados extraídos - COM PROTEÇÃO
	$: basicInfo = character?.data?.basicInfo;
	$: calculated = character?.calculated;
	$: level = basicInfo?.currentLevel || 1;
	// Removido xpProgress pois agora vem da API calculated

	const handleBack = () => {
		dispatch('back');
	};

	const handleEdit = () => {
		dispatch('edit', { character });
	};
</script>

<div class="border-b border-gray-200 bg-white">
	<!-- Barra de navegação -->
	<div class="flex items-center justify-between px-4 py-4 sm:px-6">
		<!-- Voltar -->
		{#if showBackButton}
			<button
				on:click={handleBack}
				class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				<span>Voltar</span>
			</button>
		{:else}
			<div></div>
		{/if}

		<!-- Editar -->
		{#if showEditButton}
			<button
				on:click={handleEdit}
				class="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
				<span>Editar</span>
			</button>
		{/if}
	</div>

	<!-- Header principal -->
	<div class="px-4 pb-6 sm:px-6">
		<div class="flex items-start space-x-4">
			<!-- Avatar -->
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
				<div class="mb-1 flex items-center space-x-3">
					<h1 class="truncate text-2xl font-bold text-gray-900">
						{basicInfo?.characterName || character.name || 'Sem nome'}
					</h1>
					<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
						Nível {level}
					</span>
				</div>

				<!-- Jogador -->
				<p class="mb-2 text-sm text-gray-600">
					Jogado por <span class="font-medium">{basicInfo?.playerName || 'Jogador'}</span>
				</p>

				<!-- Badges de informações - SIMPLIFICADOS -->
				<div class="mb-3 flex flex-wrap gap-2">
					{#if basicInfo?.class}
						<span class="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
							>{basicInfo.class}</span
						>
					{/if}
					{#if basicInfo?.race}
						<span class="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
							>{basicInfo.race}</span
						>
					{/if}
				</div>

				<!-- Experiência -->
				{#if calculated?.progression}
					<div class="space-y-1">
						<div class="flex items-center justify-between text-sm">
							<span class="font-medium text-gray-700">Experiência</span>
							<span class="text-gray-500"
								>{calculated.progression.xpCurrent} / {calculated.progression.xpForNext} XP</span
							>
						</div>
						<ProgressBar value={calculated.progression.xpProgress} color="blue" size="sm" />
					</div>
				{/if}
			</div>
		</div>

		<!-- Stats rápidos - Mobile First -->
		{#if calculated}
			<div class="mt-6 grid grid-cols-3 gap-4">
				<!-- Vitalidade -->
				<div class="rounded-lg bg-red-50 p-3 text-center">
					<div class="mb-1 text-xs text-red-600">Vitalidade</div>
					<div class="text-lg font-bold text-red-900">{calculated.vitality?.total || 0}</div>
				</div>

				<!-- Berkana -->
				<div class="rounded-lg bg-blue-50 p-3 text-center">
					<div class="mb-1 text-xs text-blue-600">Berkana</div>
					<div class="text-lg font-bold text-blue-900">{calculated.berkana?.total || 0}</div>
				</div>

				<!-- Pontos de Virtude -->
				<div class="rounded-lg bg-yellow-50 p-3 text-center">
					<div class="mb-1 text-xs text-yellow-600">Virtude</div>
					<div class="text-lg font-bold text-yellow-900">{basicInfo?.virtuePoints || 0}</div>
				</div>
			</div>

			<!-- Informações Pessoais Detalhadas -->
			<div class="mt-4 grid grid-cols-2 gap-3 text-sm">
				{#if basicInfo?.deity}
					<div class="flex justify-between">
						<span class="text-gray-600">Divindade:</span>
						<span class="font-medium">{basicInfo.deity}</span>
					</div>
				{/if}

				{#if basicInfo?.homeland}
					<div class="flex justify-between">
						<span class="text-gray-600">Terra Natal:</span>
						<span class="font-medium">{basicInfo.homeland}</span>
					</div>
				{/if}

				{#if basicInfo?.age && basicInfo.age > 0}
					<div class="flex justify-between">
						<span class="text-gray-600">Idade:</span>
						<span class="font-medium">{basicInfo.age} anos</span>
					</div>
				{/if}

				{#if basicInfo?.height && basicInfo.height > 0}
					<div class="flex justify-between">
						<span class="text-gray-600">Altura:</span>
						<span class="font-medium">{basicInfo.height} cm</span>
					</div>
				{/if}

				{#if basicInfo?.weight && basicInfo.weight > 0}
					<div class="flex justify-between">
						<span class="text-gray-600">Peso:</span>
						<span class="font-medium">{basicInfo.weight} kg</span>
					</div>
				{/if}

				{#if basicInfo?.alignment}
					<div class="flex justify-between">
						<span class="text-gray-600">Alinhamento:</span>
						<span class="font-medium">{basicInfo.alignment}</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
