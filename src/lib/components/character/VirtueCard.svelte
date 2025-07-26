<!-- src/lib/components/character/VirtueCard.svelte - EDIÇÃO INLINE -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CalculatedCharacter } from '$lib/types';

	export let character: CalculatedCharacter;
	export let editable: boolean = true;

	const dispatch = createEventDispatcher<{
		updateVirtue: { points: number };
	}>();

	// Extrai dados
	$: basicInfo = character.data.basicInfo;
	let virtuePoints = basicInfo?.virtuePoints || 0;

	// Funções de edição rápida
	const adjustVirtue = (amount: number) => {
		const newValue = Math.max(0, virtuePoints + amount);
		virtuePoints = newValue;
		dispatch('updateVirtue', { points: newValue });
	};

	const setVirtue = (value: number) => {
		const newValue = Math.max(0, value);
		virtuePoints = newValue;
		dispatch('updateVirtue', { points: newValue });
	};

	// Input direto
	let editingVirtue = false;
	let tempVirtue = virtuePoints;

	const startEdit = () => {
		editingVirtue = true;
		tempVirtue = virtuePoints;
	};

	const confirmEdit = () => {
		setVirtue(tempVirtue);
		editingVirtue = false;
	};

	const cancelEdit = () => {
		editingVirtue = false;
		tempVirtue = virtuePoints;
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
				<svg class="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Pontos de Virtude</h3>
		</div>
		<span class="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
			{virtuePoints} VP
		</span>
	</div>

	<!-- Valor principal -->
	<div class="mb-6 text-center">
		<div class="mb-2 text-4xl font-bold text-yellow-600">{virtuePoints}</div>
		<div class="text-sm text-gray-600">Pontos Disponíveis</div>
	</div>

	<!-- CONTROLES DE EDIÇÃO RÁPIDA - Touch Friendly -->
	{#if editable}
		<div class="mb-4 rounded-lg bg-yellow-50 p-4">
			<div class="mb-3 text-sm font-medium text-gray-700">Usar/Ganhar Virtude</div>

			<!-- Botões de ajuste rápido -->
			<div class="mb-3 grid grid-cols-4 gap-2">
				<button
					on:click={() => adjustVirtue(-3)}
					class="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
				>
					-3
				</button>
				<button
					on:click={() => adjustVirtue(-1)}
					class="rounded-lg bg-red-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
				>
					-1
				</button>
				<button
					on:click={() => adjustVirtue(1)}
					class="rounded-lg bg-green-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
				>
					+1
				</button>
				<button
					on:click={() => adjustVirtue(3)}
					class="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
				>
					+3
				</button>
			</div>

			<!-- Ações especiais -->
			<div class="mb-3 grid grid-cols-2 gap-2">
				<button
					on:click={() => adjustVirtue(5)}
					class="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
				>
					+5 (Boa Ação)
				</button>
				<button
					on:click={() => setVirtue(0)}
					class="rounded-lg bg-gray-400 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500"
				>
					Zerar
				</button>
			</div>

			<!-- Input direto -->
			<div class="flex items-center space-x-2">
				<span class="text-sm text-gray-600">Valor exato:</span>
				{#if editingVirtue}
					<input
						type="number"
						bind:value={tempVirtue}
						on:blur={confirmEdit}
						on:keydown={(e) => e.key === 'Enter' && confirmEdit()}
						on:keydown={(e) => e.key === 'Escape' && cancelEdit()}
						class="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm"
						min="0"
						autofocus
					/>
					<button on:click={confirmEdit} class="text-sm text-green-600 hover:text-green-700">
						✓
					</button>
					<button on:click={cancelEdit} class="text-sm text-red-600 hover:text-red-700"> ✗ </button>
				{:else}
					<button
						on:click={startEdit}
						class="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
					>
						{virtuePoints}
					</button>
					<span class="text-xs text-gray-500">(clique para editar)</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Informações sobre Virtude -->
	<div class="space-y-3 text-sm">
		<div class="rounded-md bg-gray-50 p-3">
			<div class="mb-1 font-medium text-gray-700">Como Usar Pontos de Virtude:</div>
			<ul class="space-y-1 text-xs text-gray-600">
				<li>• <strong>1 VP:</strong> Re-rolar um teste</li>
				<li>• <strong>2 VP:</strong> +10 em um teste</li>
				<li>• <strong>3 VP:</strong> Evitar morte</li>
				<li>• <strong>5 VP:</strong> Ação heroica</li>
			</ul>
		</div>

		<div class="rounded-md bg-blue-50 p-3">
			<div class="mb-1 font-medium text-blue-700">Como Ganhar Virtude:</div>
			<ul class="space-y-1 text-xs text-blue-600">
				<li>• Atos nobres e heroicos</li>
				<li>• Salvar vidas inocentes</li>
				<li>• Sacrifício pelos companheiros</li>
				<li>• Decisões éticas difíceis</li>
			</ul>
		</div>
	</div>
</div>
