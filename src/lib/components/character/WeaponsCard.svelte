<!-- src/lib/components/character/WeaponsCard.svelte - EDIÇÃO INLINE -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CalculatedCharacter, RPGWeapon } from '$lib/types';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	export let character: CalculatedCharacter;
	export let editable: boolean = true;

	const dispatch = createEventDispatcher<{
		updateWeapon: { slot: 'weapon1' | 'weapon2' | 'weapon3'; weapon: RPGWeapon };
	}>();

	// Extrai dados calculados
	$: weapons = character.calculated.weapons;
	$: weaponsList = [
		{ key: 'weapon1', weapon: weapons.weapon1 },
		{ key: 'weapon2', weapon: weapons.weapon2 },
		{ key: 'weapon3', weapon: weapons.weapon3 }
	];

	// Modal para edição de arma
	let editingWeapon: { slot: string; weapon: RPGWeapon } | null = null;
	let isModalOpen = false;

	// Função para determinar cor da porcentagem
	const getPercentageColor = (percentage: number) => {
		if (percentage >= 80) return 'green';
		if (percentage >= 60) return 'yellow';
		if (percentage >= 40) return 'orange';
		return 'red';
	};

	// Função para formatar dano
	const formatDamage = (damage: number) => {
		return damage > 0 ? `${damage}d6` : '0';
	};

	// Abrir modal de edição
	const editWeapon = (slot: string, weapon: RPGWeapon) => {
		editingWeapon = {
			slot,
			weapon: { ...weapon } // Cria cópia para edição
		};
		isModalOpen = true;
	};

	// Salvar arma editada
	const saveWeapon = () => {
		if (editingWeapon) {
			dispatch('updateWeapon', {
				slot: editingWeapon.slot as 'weapon1' | 'weapon2' | 'weapon3',
				weapon: editingWeapon.weapon
			});
		}
		closeModal();
	};

	// Fechar modal
	const closeModal = () => {
		editingWeapon = null;
		isModalOpen = false;
	};

	// Limpar arma (equipar slot vazio)
	const clearWeapon = (slot: string) => {
		const emptyWeapon: RPGWeapon = {
			name: '',
			image: '',
			percentage: 0,
			damage25: 0,
			damage50: 0,
			damage75: 0,
			damage100: 0,
			damageCritical: 0,
			observations: ''
		};

		dispatch('updateWeapon', {
			slot: slot as 'weapon1' | 'weapon2' | 'weapon3',
			weapon: emptyWeapon
		});
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
				<svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Arsenal</h3>
		</div>
		<span class="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
			{weaponsList.filter((w) => w.weapon.name.trim()).length} / 3
		</span>
	</div>

	<!-- Lista de armas -->
	<div class="space-y-4">
		{#each weaponsList as { key, weapon }, index}
			{#if weapon.name.trim()}
				<div class="rounded-lg border border-gray-200 p-4">
					<!-- Header da arma -->
					<div class="mb-3 flex items-start justify-between">
						<div class="flex flex-1 items-center space-x-3">
							{#if weapon.image}
								<img src={weapon.image} alt={weapon.name} class="h-8 w-8 rounded object-cover" />
							{:else}
								<div class="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
									<span class="text-xs font-bold text-gray-600">{index + 1}</span>
								</div>
							{/if}
							<div class="flex-1">
								<h4 class="font-medium text-gray-900">{weapon.name}</h4>
								<div class="text-sm text-gray-500">Slot {index + 1}</div>
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<div class="text-right">
								<div class="text-lg font-bold text-gray-900">{weapon.calculatedPercentage}%</div>
								<div class="text-xs text-gray-500">Chance</div>
							</div>
							{#if editable}
								<div class="flex flex-col space-y-1">
									<button
										on:click={() => editWeapon(key, weapon)}
										class="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
										title="Editar arma"
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
										on:click={() => clearWeapon(key)}
										class="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
										title="Remover arma"
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
							{/if}
						</div>
					</div>

					<!-- Barra de porcentagem -->
					<div class="mb-3">
						<ProgressBar
							value={weapon.calculatedPercentage}
							color={getPercentageColor(weapon.calculatedPercentage)}
							size="sm"
						/>
					</div>

					<!-- Grid de danos - Mobile First -->
					<div class="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
						<div class="text-center">
							<div class="mb-1 text-xs text-gray-500">25%</div>
							<div class="font-mono text-sm text-gray-900">{formatDamage(weapon.damage25)}</div>
						</div>
						<div class="text-center">
							<div class="mb-1 text-xs text-gray-500">50%</div>
							<div class="font-mono text-sm text-gray-900">{formatDamage(weapon.damage50)}</div>
						</div>
						<div class="text-center">
							<div class="mb-1 text-xs text-gray-500">75%</div>
							<div class="font-mono text-sm text-gray-900">{formatDamage(weapon.damage75)}</div>
						</div>
						<div class="text-center">
							<div class="mb-1 text-xs text-gray-500">100%</div>
							<div class="font-mono text-sm text-gray-900">{formatDamage(weapon.damage100)}</div>
						</div>
						<div class="text-center">
							<div class="mb-1 text-xs text-gray-500">Crítico</div>
							<div class="font-mono text-sm font-bold text-red-600">
								{formatDamage(weapon.damageCritical)}
							</div>
						</div>
					</div>

					<!-- Observações (se houver) -->
					{#if weapon.observations.trim()}
						<div class="mt-3 rounded-md bg-gray-50 p-3">
							<div class="text-xs text-gray-600">
								<strong>Observações:</strong>
								{weapon.observations}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Slot vazio -->
				<div class="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
					<div class="text-gray-400">
						<svg class="mx-auto mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						<div class="mb-2 text-sm">Slot {index + 1} vazio</div>
						{#if editable}
							<button
								on:click={() => editWeapon(key, weapon)}
								class="rounded-md bg-orange-100 px-3 py-1 text-xs text-orange-800 transition-colors hover:bg-orange-200"
							>
								Adicionar Arma
							</button>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<!-- MODAL DE EDIÇÃO - Touch Friendly -->
{#if isModalOpen && editingWeapon}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
		<div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold">Editar Arma</h3>
				<button on:click={closeModal} class="text-gray-500 hover:text-gray-700">
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="space-y-4">
				<!-- Nome -->
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Nome da Arma</label>
					<input
						type="text"
						bind:value={editingWeapon.weapon.name}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
						placeholder="Ex: Espada Longa"
					/>
				</div>

				<!-- Porcentagem -->
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Porcentagem Base</label>
					<input
						type="number"
						bind:value={editingWeapon.weapon.percentage}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
						min="0"
						max="100"
					/>
					<div class="mt-1 text-xs text-gray-500">
						Atual: {editingWeapon.weapon.percentage + character.data.basicInfo.currentLevel}%
					</div>
				</div>

				<!-- Danos -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Dano 25%</label>
						<input
							type="number"
							bind:value={editingWeapon.weapon.damage25}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
							min="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Dano 50%</label>
						<input
							type="number"
							bind:value={editingWeapon.weapon.damage50}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
							min="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Dano 75%</label>
						<input
							type="number"
							bind:value={editingWeapon.weapon.damage75}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
							min="0"
						/>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium text-gray-700">Dano 100%</label>
						<input
							type="number"
							bind:value={editingWeapon.weapon.damage100}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
							min="0"
						/>
					</div>
				</div>

				<!-- Dano Crítico -->
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Dano Crítico</label>
					<input
						type="number"
						bind:value={editingWeapon.weapon.damageCritical}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
						min="0"
					/>
				</div>

				<!-- Observações -->
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700">Observações</label>
					<textarea
						bind:value={editingWeapon.weapon.observations}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
						rows="3"
						placeholder="Propriedades especiais, notas..."
					></textarea>
				</div>
			</div>

			<!-- Botões -->
			<div class="mt-6 flex space-x-3">
				<button
					on:click={saveWeapon}
					class="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
				>
					Salvar
				</button>
				<button
					on:click={closeModal}
					class="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
				>
					Cancelar
				</button>
			</div>
		</div>
	</div>
{/if}
