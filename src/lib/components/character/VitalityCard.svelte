<!-- src/lib/components/character/VitalityCard.svelte - EDIÇÃO INLINE -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CalculatedCharacter } from '$lib/types';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	export let character: CalculatedCharacter;
	export let editable: boolean = true;

	const dispatch = createEventDispatcher<{
		updateVitality: { current: number };
	}>();

	// Extrai dados calculados - ESTRUTURA REAL
	$: vitality = character.calculated.vitality;
	$: maxHP = vitality.total;

	// EDITÁVEL: Vitalidade atual (começa com máximo)
	let currentHP = maxHP;
	$: percentage = Math.round((currentHP / maxHP) * 100);

	// Determina cor baseado na porcentagem
	$: color =
		percentage >= 75 ? 'green' : percentage >= 50 ? 'yellow' : percentage >= 25 ? 'orange' : 'red';

	// Status textual baseado nos níveis calculados
	$: status =
		currentHP >= vitality.levels.notable
			? 'Notável'
			: currentHP >= vitality.levels.injured
				? 'Ferido'
				: currentHP >= vitality.levels.severelyInjured
					? 'Gravemente Ferido'
					: currentHP >= vitality.levels.condemned
						? 'Condenado'
						: currentHP >= vitality.levels.incapacitated
							? 'Incapacitado'
							: 'Coma';

	// Níveis de vitalidade (do backend calculado)
	$: levels = vitality.levels;

	// Funções de edição rápida
	const adjustVitality = (amount: number) => {
		const newValue = Math.max(0, Math.min(maxHP, currentHP + amount));
		currentHP = newValue;
		dispatch('updateVitality', { current: newValue });
	};

	const setVitality = (value: number) => {
		const newValue = Math.max(0, Math.min(maxHP, value));
		currentHP = newValue;
		dispatch('updateVitality', { current: newValue });
	};

	// Input direto
	let editingHP = false;
	let tempHP = currentHP;

	const startEdit = () => {
		editingHP = true;
		tempHP = currentHP;
	};

	const confirmEdit = () => {
		setVitality(tempHP);
		editingHP = false;
	};

	const cancelEdit = () => {
		editingHP = false;
		tempHP = currentHP;
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
				<svg class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Vitalidade</h3>
		</div>
		<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
			{status}
		</span>
	</div>

	<!-- Barra de progresso principal -->
	<div class="mb-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-medium text-gray-700">Pontos de Vida</span>
			<span class="text-sm text-gray-500">{currentHP} / {maxHP}</span>
		</div>
		<ProgressBar value={percentage} {color} size="lg" />
	</div>

	<!-- CONTROLES DE EDIÇÃO RÁPIDA - Touch Friendly -->
	{#if editable}
		<div class="mb-4 rounded-lg bg-gray-50 p-4">
			<div class="mb-3 text-sm font-medium text-gray-700">Edição Rápida</div>

			<!-- Botões de ajuste rápido -->
			<div class="mb-3 grid grid-cols-4 gap-2">
				<button
					on:click={() => adjustVitality(-10)}
					class="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
				>
					-10
				</button>
				<button
					on:click={() => adjustVitality(-5)}
					class="rounded-lg bg-red-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
				>
					-5
				</button>
				<button
					on:click={() => adjustVitality(5)}
					class="rounded-lg bg-green-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
				>
					+5
				</button>
				<button
					on:click={() => adjustVitality(10)}
					class="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
				>
					+10
				</button>
			</div>

			<!-- Input direto ou clique para editar -->
			<div class="flex items-center space-x-2">
				<span class="text-sm text-gray-600">Valor exato:</span>
				{#if editingHP}
					<input
						type="number"
						bind:value={tempHP}
						on:blur={confirmEdit}
						on:keydown={(e) => e.key === 'Enter' && confirmEdit()}
						on:keydown={(e) => e.key === 'Escape' && cancelEdit()}
						class="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm"
						min="0"
						max={maxHP}
						autofocus
					/>
					<button on:click={confirmEdit} class="text-sm text-green-600 hover:text-green-700">
						✓
					</button>
					<button on:click={cancelEdit} class="text-sm text-red-600 hover:text-red-700"> ✗ </button>
				{:else}
					<button
						on:click={startEdit}
						class="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200"
					>
						{currentHP}
					</button>
					<span class="text-xs text-gray-500">(clique para editar)</span>
				{/if}
			</div>

			<!-- Botões de status rápido -->
			<div class="mt-3 grid grid-cols-2 gap-2">
				<button
					on:click={() => setVitality(maxHP)}
					class="rounded-lg bg-green-100 py-2 text-sm font-medium text-green-800 transition-colors hover:bg-green-200"
				>
					Vida Cheia
				</button>
				<button
					on:click={() => setVitality(0)}
					class="rounded-lg bg-red-100 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200"
				>
					Inconsciente
				</button>
			</div>
		</div>
	{/if}

	<!-- Grid de informações - Mobile First -->
	<div class="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
		<!-- Total -->
		<div class="text-center">
			<div class="text-2xl font-bold text-gray-900">{maxHP}</div>
			<div class="text-xs text-gray-500">Total</div>
		</div>

		<!-- Atual -->
		<div class="text-center">
			<div
				class="text-2xl font-bold"
				class:text-red-600={percentage < 50}
				class:text-yellow-600={percentage >= 50 && percentage < 75}
				class:text-green-600={percentage >= 75}
			>
				{currentHP}
			</div>
			<div class="text-xs text-gray-500">Atual</div>
		</div>

		<!-- Percentual -->
		<div class="col-span-2 text-center sm:col-span-1">
			<div
				class="text-2xl font-bold"
				class:text-red-600={percentage < 50}
				class:text-yellow-600={percentage >= 50 && percentage < 75}
				class:text-green-600={percentage >= 75}
			>
				{percentage}%
			</div>
			<div class="text-xs text-gray-500">Saúde</div>
		</div>
	</div>

	<!-- Níveis de ferimento (colapsível em mobile) -->
	<details class="mt-4">
		<summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
			Ver níveis de ferimento
		</summary>
		<div class="mt-3 space-y-2">
			{#each Object.entries(levels) as [level, value]}
				<div class="flex justify-between text-sm">
					<span class="text-gray-600 capitalize">
						{level === 'notable'
							? 'Notável'
							: level === 'injured'
								? 'Ferido'
								: level === 'severelyInjured'
									? 'Gravemente Ferido'
									: level === 'condemned'
										? 'Condenado'
										: level === 'incapacitated'
											? 'Incapacitado'
											: 'Coma'}
					</span>
					<span class="font-mono text-gray-900">{value}</span>
				</div>
			{/each}
		</div>
	</details>

	<!-- Info total -->
	<div class="mt-4 rounded-md bg-gray-50 p-3">
		<div class="text-xs text-gray-600">
			<strong>Total:</strong> Soma de todos os níveis de ferimento = {maxHP}
		</div>
	</div>
</div>
