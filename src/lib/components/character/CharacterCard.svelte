<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Character } from '$lib/types/character';

	// Props do componente
	export let character: Character;
	export let selected: boolean = false;
	export let showActions: boolean = true;

	const dispatch = createEventDispatcher<{
		select: { character: Character };
		edit: { character: Character };
		delete: { character: Character };
	}>();

	// Dados extraídos do personagem
	$: basicInfo = character.data.basicInfo;
	$: level = basicInfo.currentLevel;
	$: xpProgress =
		basicInfo.nextLevelXp > 0 ? Math.round((basicInfo.currentXp / basicInfo.nextLevelXp) * 100) : 0;

	// Handlers dos eventos
	const handleSelect = () => {
		dispatch('select', { character });
	};

	const handleEdit = (e: Event) => {
		e.stopPropagation();
		dispatch('edit', { character });
	};

	const handleDelete = (e: Event) => {
		e.stopPropagation();
		dispatch('delete', { character });
	};
</script>

<Card
	variant="outlined"
	hover={true}
	clickable={true}
	class="transition-all duration-200 {selected ? 'border-blue-300 ring-2 ring-blue-500' : ''}"
	on:click={handleSelect}
>
	<div class="space-y-3">
		<!-- Header com foto e nome -->
		<div class="flex items-start space-x-3">
			<!-- Avatar/Foto -->
			<div class="flex-shrink-0">
				{#if basicInfo.characterImage}
					<img
						src={basicInfo.characterImage}
						alt={basicInfo.characterName}
						class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
					/>
				{:else}
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 ring-2 ring-gray-200"
					>
						<svg
							class="h-6 w-6 text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
				{/if}
			</div>

			<!-- Info principal -->
			<div class="min-w-0 flex-1">
				<h3 class="truncate text-sm font-semibold text-gray-900">
					{basicInfo.characterName || character.name}
				</h3>
				<p class="truncate text-xs text-gray-500">
					{basicInfo.playerName || 'Jogador não informado'}
				</p>

				<!-- Badges de classe e raça -->
				<div class="mt-1 flex space-x-1">
					{#if basicInfo.class}
						<Badge variant="info" size="xs">{basicInfo.class}</Badge>
					{/if}
					{#if basicInfo.race}
						<Badge variant="secondary" size="xs">{basicInfo.race}</Badge>
					{/if}
				</div>
			</div>

			<!-- Nível -->
			<div class="flex-shrink-0 text-right">
				<div class="text-lg font-bold text-gray-900">
					Nv. {level}
				</div>
				{#if basicInfo.virtuePoints > 0}
					<div class="text-xs text-amber-600">
						✨ {basicInfo.virtuePoints} VP
					</div>
				{/if}
			</div>
		</div>

		<!-- Progresso de XP -->
		{#if basicInfo.nextLevelXp > 0}
			<div class="space-y-1">
				<ProgressBar
					value={basicInfo.currentXp}
					max={basicInfo.nextLevelXp}
					size="sm"
					variant="info"
					showLabel={false}
				/>
				<div class="flex justify-between text-xs text-gray-500">
					<span>{basicInfo.currentXp} XP</span>
					<span>{xpProgress}%</span>
					<span>{basicInfo.nextLevelXp} XP</span>
				</div>
			</div>
		{/if}

		<!-- Informações adicionais -->
		<div class="grid grid-cols-2 gap-2 text-xs">
			{#if basicInfo.deity}
				<div class="text-gray-600">
					<span class="font-medium">Divindade:</span>
					{basicInfo.deity}
				</div>
			{/if}
			{#if basicInfo.homeland}
				<div class="text-gray-600">
					<span class="font-medium">Origem:</span>
					{basicInfo.homeland}
				</div>
			{/if}
			{#if basicInfo.alignment}
				<div class="text-gray-600">
					<span class="font-medium">Tendência:</span>
					{basicInfo.alignment}
				</div>
			{/if}
			<div class="text-gray-500">
				<span class="font-medium">Criado:</span>
				{new Date(character.createdAt).toLocaleDateString('pt-BR')}
			</div>
		</div>

		<!-- Ações -->
		{#if showActions}
			<div class="flex justify-end space-x-2 border-t border-gray-100 pt-2">
				<Button variant="ghost" size="sm" on:click={handleEdit} aria-label="Editar personagem">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</Button>

				<Button
					variant="ghost"
					size="sm"
					on:click={handleDelete}
					aria-label="Deletar personagem"
					class="text-red-600 hover:bg-red-50 hover:text-red-700"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</Button>
			</div>
		{/if}
	</div>
</Card>

<style>
	/* Animação sutil para seleção */
	:global(.character-card-selected) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
	}
</style>
