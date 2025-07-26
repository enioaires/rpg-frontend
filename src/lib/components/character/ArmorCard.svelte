<!-- src/lib/components/character/ArmorCard.svelte -->
<script lang="ts">
	import type { CalculatedCharacter } from '$lib/types';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';

	export let character: CalculatedCharacter;

	// Extrai dados calculados - ESTRUTURA REAL
	$: armor = character.calculated.armor;

	// Calcula durabilidade
	$: durabilityPercentage = armor.durabilityPercentage;
	$: damaged = armor.vitalityTotal - armor.vitalityCurrent;

	// Determina status e cor - usa o status já calculado pelo backend
	$: statusText =
		armor.status === 'good' ? 'Excelente' : armor.status === 'damaged' ? 'Danificada' : 'Crítica';

	$: statusColor =
		armor.status === 'good' ? 'green' : armor.status === 'damaged' ? 'orange' : 'red';

	// Cor da barra de durabilidade - baseada no status do backend
	$: durabilityColor =
		armor.status === 'good' ? 'green' : armor.status === 'damaged' ? 'orange' : 'red';
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
				<svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Armadura</h3>
		</div>
		<span
			class="rounded-full px-3 py-1 text-sm font-medium"
			class:bg-green-100={statusColor === 'green'}
			class:text-green-700={statusColor === 'green'}
			class:bg-orange-100={statusColor === 'orange'}
			class:text-orange-700={statusColor === 'orange'}
			class:bg-red-100={statusColor === 'red'}
			class:text-red-700={statusColor === 'red'}
		>
			{statusText}
		</span>
	</div>

	{#if armor.description.trim()}
		<!-- Informações da armadura -->
		<div class="mb-4">
			<div class="flex items-start space-x-3">
				{#if armor.image}
					<img
						src={armor.image}
						alt={armor.description}
						class="h-16 w-16 rounded-lg object-cover"
					/>
				{:else}
					<div class="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
						<svg
							class="h-8 w-8 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
				{/if}
				<div class="flex-1">
					<h4 class="font-medium text-gray-900">{armor.description}</h4>
					<p class="text-sm text-gray-600">{armor.type}</p>
				</div>
			</div>
		</div>

		<!-- Durabilidade -->
		<div class="mb-6">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-medium text-gray-700">Durabilidade</span>
				<span class="text-sm text-gray-500">{armor.vitalityCurrent} / {armor.vitalityTotal}</span>
			</div>
			<ProgressBar value={durabilityPercentage} color={durabilityColor} size="lg" />
		</div>

		<!-- Grid de informações - Mobile First -->
		<div class="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<!-- Proteção Total -->
			<div class="text-center">
				<div class="text-2xl font-bold text-gray-900">{armor.vitalityTotal}</div>
				<div class="text-xs text-gray-500">Proteção Total</div>
			</div>

			<!-- Proteção Atual -->
			<div class="text-center">
				<div
					class="text-2xl font-bold"
					class:text-green-600={armor.status === 'good'}
					class:text-orange-600={armor.status === 'damaged'}
					class:text-red-600={armor.status === 'broken'}
				>
					{armor.vitalityCurrent}
				</div>
				<div class="text-xs text-gray-500">Proteção Atual</div>
			</div>

			<!-- Dano Acumulado -->
			<div class="text-center">
				<div class="text-2xl font-bold text-red-600">{damaged}</div>
				<div class="text-xs text-gray-500">Dano Sofrido</div>
			</div>

			<!-- Eficiência -->
			<div class="text-center">
				<div
					class="text-2xl font-bold"
					class:text-green-600={armor.status === 'good'}
					class:text-orange-600={armor.status === 'damaged'}
					class:text-red-600={armor.status === 'broken'}
				>
					{durabilityPercentage}%
				</div>
				<div class="text-xs text-gray-500">Eficiência</div>
			</div>
		</div>

		<!-- Observações (se houver) -->
		{#if armor.observations.trim()}
			<div class="mt-4 rounded-md bg-gray-50 p-3">
				<div class="text-xs text-gray-600">
					<strong>Observações:</strong>
					{armor.observations}
				</div>
			</div>
		{/if}
	{:else}
		<!-- Sem armadura -->
		<div class="py-8 text-center">
			<svg
				class="mx-auto mb-4 h-12 w-12 text-gray-300"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
				/>
			</svg>
			<h3 class="mb-2 text-lg font-medium text-gray-900">Sem Armadura</h3>
			<p class="text-gray-600">Este personagem não possui armadura equipada</p>
		</div>
	{/if}

	<!-- Informações técnicas -->
	<div class="mt-4 rounded-md bg-gray-50 p-3">
		<div class="text-xs text-gray-600">
			<strong>Sistema:</strong> Proteção absorve dano antes da vitalidade do personagem
		</div>
	</div>
</div>
