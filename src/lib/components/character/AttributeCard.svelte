<!-- src/lib/components/character/AttributeCard.svelte -->
<script lang="ts">
	import type { CalculatedCharacter } from '$lib/types';

	export let character: CalculatedCharacter;

	// Extrai dados calculados
	$: attributes = character.calculated.attributes;
	$: totals = attributes.totals;
	$: levelBonus = attributes.levelBonus;
	$: nextBonusAtLevel = attributes.nextBonusAtLevel;

	// Mapeamento de nomes bonitos
	const attributeNames: Record<string, string> = {
		agility: 'Agilidade',
		charisma: 'Carisma',
		courage: 'Coragem',
		dexterity: 'Destreza',
		dodge: 'Esquiva',
		strength: 'Força',
		intelligence: 'Inteligência',
		initiative: 'Iniciativa',
		intimidate: 'Intimidação',
		maneuver: 'Manobra',
		reflexes: 'Reflexos',
		wisdom: 'Sabedoria',
		vigor: 'Vigor',
		willpower: 'Força de Vontade'
	};

	// Icons para cada atributo - SIMPLIFICADOS
	const attributeIcons: Record<string, string> = {
		agility: '🏃',
		charisma: '💬',
		courage: '🛡️',
		dexterity: '🎯',
		dodge: '💨',
		strength: '💪',
		intelligence: '🧠',
		initiative: '⚡',
		intimidate: '😤',
		maneuver: '🤺',
		reflexes: '⚡',
		wisdom: '🦉',
		vigor: '❤️',
		willpower: '🧘'
	};

	// Agrupa atributos para display mobile
	$: attributeEntries = Object.entries(totals).map(([key, value]) => ({
		key,
		name: attributeNames[key] || key,
		value: value as number,
		icon: attributeIcons[key] || '⚡'
	}));

	// Calcula valores decompostos (para detalhes) - DADOS ORIGINAIS
	$: raceAttributes = character.data.attributes.race;
	$: classAttributes = character.data.attributes.class;
</script>

<div class="rounded-lg bg-white p-6 shadow-sm">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
				<svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z"
					/>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">Atributos</h3>
		</div>
		<div class="text-right">
			<div class="text-sm text-gray-500">Bônus de Nível</div>
			<div class="font-semibold text-green-600">+{levelBonus}</div>
		</div>
	</div>

	<!-- Grid de atributos - Mobile First, SEM EMOJI -->
	<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
		{#each attributeEntries as attr}
			<div
				class="rounded-lg border border-gray-200 p-3 text-center transition-colors hover:border-gray-300"
			>
				<div class="mb-1 text-xs font-medium text-gray-600">{attr.name}</div>
				<div class="text-xl font-bold text-gray-900">{attr.value}</div>
			</div>
		{/each}
	</div>

	<!-- Informações de progressão -->
	<div class="border-t border-gray-200 pt-4">
		<div class="flex items-center justify-between text-sm">
			<span class="text-gray-600">Próximo bônus no nível:</span>
			<span class="font-semibold text-gray-900">{nextBonusAtLevel}</span>
		</div>
	</div>

	<!-- Detalhamento (colapsível) -->
	<details class="mt-4">
		<summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
			Ver composição detalhada
		</summary>
		<div class="mt-4 space-y-3">
			{#each attributeEntries as attr}
				<div class="rounded-md bg-gray-50 p-3">
					<div class="mb-2 flex items-center space-x-2 font-medium text-gray-900">
						<span>{attr.name}</span>
					</div>
					<div class="grid grid-cols-3 gap-2 text-sm">
						<div class="text-center">
							<div class="text-xs text-gray-500">Raça</div>
							<div class="font-mono text-gray-700">{raceAttributes[attr.key] || 0}</div>
						</div>
						<div class="text-center">
							<div class="text-xs text-gray-500">Classe</div>
							<div class="font-mono text-gray-700">{classAttributes[attr.key] || 0}</div>
						</div>
						<div class="text-center">
							<div class="text-xs text-gray-500">Nível</div>
							<div class="font-mono text-gray-700">+{levelBonus}</div>
						</div>
					</div>
					<div class="mt-2 border-t border-gray-200 pt-2 text-center">
						<div class="text-xs text-gray-500">Total</div>
						<div class="font-bold text-gray-900">{attr.value}</div>
					</div>
				</div>
			{/each}
		</div>
	</details>

	<!-- Fórmula (para referência) -->
	<div class="mt-4 rounded-md bg-gray-50 p-3">
		<div class="text-xs text-gray-600">
			<strong>Cálculo:</strong> Raça + Classe + Bônus de Nível (+1 a cada 5 níveis)
		</div>
	</div>
</div>
