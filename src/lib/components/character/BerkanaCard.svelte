<!-- src/lib/components/character/BerkanaCard.svelte - EDIÇÃO INLINE -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CalculatedCharacter } from '$lib/types';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	export let character: CalculatedCharacter;
	export let editable: boolean = true;

	const dispatch = createEventDispatcher<{
		updateBerkana: { current: number };
	}>();

	// Extrai dados calculados - ESTRUTURA REAL
	$: berkana = character.calculated.berkana;
	$: maxMana = berkana.total;

	// EDITÁVEL: Berkana atual (começa com máximo)
	let currentMana = maxMana;
	$: percentage = Math.round((currentMana / maxMana) * 100);

	// Cor da barra baseada na porcentagem
	$: color =
		percentage >= 75 ? 'blue' : percentage >= 50 ? 'indigo' : percentage >= 25 ? 'purple' : 'pink';

	// Status textual
	$: status =
		percentage >= 75
			? 'Energizado'
			: percentage >= 50
				? 'Focado'
				: percentage >= 25
					? 'Cansado'
					: 'Exausto';

	// Funções de edição rápida
	const adjustBerkana = (amount: number) => {
		const newValue = Math.max(0, Math.min(maxMana, currentMana + amount));
		currentMana = newValue;
		dispatch('updateBerkana', { current: newValue });
	};

	const setBerkana = (value: number) => {
		const newValue = Math.max(0, Math.min(maxMana, value));
		currentMana = newValue;
		dispatch('updateBerkana', { current: newValue });
	};

	// Input direto
	let editingMana = false;
	let tempMana = currentMana;

	const startEdit = () => {
		editingMana = true;
		tempMana = currentMana;
	};

	const confirmEdit = () => {
		setBerkana(tempMana);
		editingMana = false;
	};

	const cancelEdit = () => {
		editingMana = false;
		tempMana = currentMana;
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
				<svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Berkana</h3>
		</div>
		<span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
			{status}
		</span>
	</div>

	<!-- Barra de progresso principal -->
	<div class="mb-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-sm font-medium text-gray-700">Pontos de Mana</span>
			<span class="text-sm text-gray-500">{currentMana} / {maxMana}</span>
		</div>
		<ProgressBar value={percentage} {color} size="lg" />
	</div>

	<!-- CONTROLES DE EDIÇÃO RÁPIDA - Touch Friendly -->
	{#if editable}
		<div class="mb-4 rounded-lg bg-blue-50 p-4">
			<div class="mb-3 text-sm font-medium text-gray-700">Usar Magia</div>

			<!-- Botões de gasto de mana -->
			<div class="mb-3 grid grid-cols-4 gap-2">
				<button
					on:click={() => adjustBerkana(-1)}
					class="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
				>
					-1
				</button>
				<button
					on:click={() => adjustBerkana(-5)}
					class="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
				>
					-5
				</button>
				<button
					on:click={() => adjustBerkana(-10)}
					class="rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
				>
					-10
				</button>
				<button
					on:click={() => adjustBerkana(-20)}
					class="rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
				>
					-20
				</button>
			</div>

			<!-- Recuperação -->
			<div class="mb-3 grid grid-cols-3 gap-2">
				<button
					on:click={() => adjustBerkana(5)}
					class="rounded-lg bg-green-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
				>
					+5
				</button>
				<button
					on:click={() => adjustBerkana(10)}
					class="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
				>
					+10
				</button>
				<button
					on:click={() => setBerkana(maxMana)}
					class="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200"
				>
					Recarregar
				</button>
			</div>

			<!-- Input direto -->
			<div class="flex items-center space-x-2">
				<span class="text-sm text-gray-600">Valor exato:</span>
				{#if editingMana}
					<input
						type="number"
						bind:value={tempMana}
						on:blur={confirmEdit}
						on:keydown={(e) => e.key === 'Enter' && confirmEdit()}
						on:keydown={(e) => e.key === 'Escape' && cancelEdit()}
						class="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm"
						min="0"
						max={maxMana}
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
						{currentMana}
					</button>
					<span class="text-xs text-gray-500">(clique para editar)</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Grid de informações - Mobile First -->
	<div class="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
		<!-- Total -->
		<div class="text-center">
			<div class="text-2xl font-bold text-gray-900">{maxMana}</div>
			<div class="text-xs text-gray-500">Total</div>
		</div>

		<!-- Atual -->
		<div class="text-center">
			<div
				class="text-2xl font-bold"
				class:text-pink-600={percentage < 25}
				class:text-purple-600={percentage >= 25 && percentage < 50}
				class:text-indigo-600={percentage >= 50 && percentage < 75}
				class:text-blue-600={percentage >= 75}
			>
				{currentMana}
			</div>
			<div class="text-xs text-gray-500">Atual</div>
		</div>

		<!-- Percentual -->
		<div class="col-span-2 text-center sm:col-span-1">
			<div
				class="text-2xl font-bold"
				class:text-pink-600={percentage < 25}
				class:text-purple-600={percentage >= 25 && percentage < 50}
				class:text-indigo-600={percentage >= 50 && percentage < 75}
				class:text-blue-600={percentage >= 75}
			>
				{percentage}%
			</div>
			<div class="text-xs text-gray-500">Energia</div>
		</div>
	</div>

	<!-- Composição detalhada -->
	<div class="mt-4 space-y-3">
		<div class="flex items-center justify-between border-b border-gray-100 py-2">
			<span class="text-sm text-gray-600">Base</span>
			<span class="font-mono text-sm text-gray-900">{berkana.base}</span>
		</div>
		<div class="flex items-center justify-between border-b border-gray-100 py-2">
			<span class="text-sm text-gray-600">Bônus de Nível</span>
			<span class="font-mono text-sm text-gray-900">+{berkana.levelBonus}</span>
		</div>
		<div class="flex items-center justify-between py-2 font-medium">
			<span class="text-sm text-gray-700">Total</span>
			<span class="font-mono text-sm text-gray-900">{maxMana}</span>
		</div>
	</div>

	<!-- Fórmula (para referência) -->
	<div class="mt-4 rounded-md bg-gray-50 p-3">
		<div class="text-xs text-gray-600">
			<strong>Cálculo:</strong>
			{berkana.base} base + ({character.data.basicInfo.currentLevel} × 10) bônus = {maxMana}
		</div>
	</div>
</div>
