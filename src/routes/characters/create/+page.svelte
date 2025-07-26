<!-- src/routes/characters/create/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { createCharacter, isSavingCharacter, createEmptyCharacter } from '$lib/stores/characters';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { ROUTES } from '$lib/utils/constants';
	import type { CreateCharacterData } from '$lib/types';

	// Estado do formulário - MOBILE FIRST em etapas
	let currentStep = 0;
	let formData: CreateCharacterData = createEmptyCharacter();
	let errors: Record<string, string> = {};

	// 14 atributos do sistema RPG
	const attributeNames = [
		'agility',
		'charisma',
		'courage',
		'dexterity',
		'dodge',
		'strength',
		'intelligence',
		'initiative',
		'intimidate',
		'maneuver',
		'reflexes',
		'wisdom',
		'vigor',
		'willpower'
	] as const;

	// Labels em português
	const attributeLabels: Record<string, string> = {
		agility: 'Agilidade',
		charisma: 'Carisma',
		courage: 'Coragem',
		dexterity: 'Destreza',
		dodge: 'Esquiva',
		strength: 'Força',
		intelligence: 'Inteligência',
		initiative: 'Iniciativa',
		intimidate: 'Intimidar',
		maneuver: 'Manobra',
		reflexes: 'Reflexos',
		wisdom: 'Sabedoria',
		vigor: 'Vigor',
		willpower: 'Vontade'
	};

	// Configuração das etapas - SIMPLES
	const steps = [
		{
			title: 'Básico',
			description: 'Informações essenciais',
			icon: '👤'
		},
		{
			title: 'Atributos da Raça',
			description: 'Pontos raciais',
			icon: '🧬'
		},
		{
			title: 'Atributos da Classe',
			description: 'Pontos de classe',
			icon: '⚔️'
		},
		{
			title: 'Status',
			description: 'Vitalidade e Berkana',
			icon: '❤️'
		},
		{
			title: 'Finalizar',
			description: 'Revisar e criar',
			icon: '✅'
		}
	];

	// Validação por etapa
	function validateStep(step: number): boolean {
		errors = {};

		switch (step) {
			case 0: // Básico
				if (!formData.data.basicInfo.playerName.trim()) {
					errors.playerName = 'Nome do jogador obrigatório';
				}
				if (!formData.data.basicInfo.characterName.trim()) {
					errors.characterName = 'Nome do personagem obrigatório';
				}
				if (!formData.data.basicInfo.class.trim()) {
					errors.class = 'Classe obrigatória';
				}
				if (!formData.data.basicInfo.race.trim()) {
					errors.race = 'Raça obrigatória';
				}
				break;
		}

		return Object.keys(errors).length === 0;
	}

	// Navegação entre etapas
	function nextStep() {
		if (validateStep(currentStep)) {
			currentStep = Math.min(currentStep + 1, steps.length - 1);
		}
	}

	function prevStep() {
		currentStep = Math.max(currentStep - 1, 0);
	}

	// Sincroniza nome principal com nome do personagem
	$: if (formData.data.basicInfo.characterName) {
		formData.name = formData.data.basicInfo.characterName;
	}

	// Atualização de atributos
	function updateAttribute(
		type: 'race' | 'class',
		attr: keyof typeof attributeLabels,
		value: number
	) {
		// @ts-ignore - sabemos que attr existe
		formData.data.attributes[type][attr] = Math.max(0, value);
	}

	// Submissão do formulário
	async function handleSubmit() {
		if (!validateStep(currentStep)) return;

		const success = await createCharacter(formData);

		if (success) {
			goto(ROUTES.CHARACTER.LIST);
		}
	}

	// Voltar para lista
	function goBack() {
		goto(ROUTES.CHARACTER.LIST);
	}
</script>

<svelte:head>
	<title>Criar Personagem</title>
</svelte:head>

<!-- Layout Mobile First -->
<div class="mx-auto flex min-h-screen max-w-md flex-col bg-white">
	<!-- Header fixo -->
	<div class="sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
		<div class="mb-3 flex items-center justify-between">
			<button on:click={goBack} class="flex items-center text-gray-600 hover:text-gray-800">
				<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				Voltar
			</button>
			<span class="text-sm text-gray-500">{currentStep + 1}/{steps.length}</span>
		</div>

		<!-- Barra de progresso -->
		<div class="mb-3 h-2 w-full rounded-full bg-gray-200">
			<div
				class="h-2 rounded-full bg-blue-500 transition-all duration-300"
				style="width: {((currentStep + 1) / steps.length) * 100}%"
			></div>
		</div>

		<!-- Info da etapa atual -->
		<div class="flex items-center text-gray-600">
			<span class="mr-3 text-xl">{steps[currentStep].icon}</span>
			<div>
				<p class="font-medium text-gray-900">{steps[currentStep].title}</p>
				<p class="text-sm text-gray-500">{steps[currentStep].description}</p>
			</div>
		</div>
	</div>

	<!-- Conteúdo das etapas -->
	<div class="flex-1 space-y-4 p-4">
		<!-- ETAPA 0: BÁSICO -->
		{#if currentStep === 0}
			<div class="space-y-4">
				<Input
					label="Seu Nome"
					bind:value={formData.data.basicInfo.playerName}
					placeholder="Nome do jogador"
					required={true}
					error={errors.playerName}
				/>

				<Input
					label="Nome do Personagem"
					bind:value={formData.data.basicInfo.characterName}
					placeholder="Nome do seu personagem"
					required={true}
					error={errors.characterName}
				/>

				<div class="grid grid-cols-2 gap-3">
					<Input
						label="Classe"
						bind:value={formData.data.basicInfo.class}
						placeholder="Ex: Mago"
						required={true}
						error={errors.class}
					/>

					<Input
						label="Raça"
						bind:value={formData.data.basicInfo.race}
						placeholder="Ex: Elfo"
						required={true}
						error={errors.race}
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<Input
						label="Nível"
						type="number"
						bind:value={formData.data.basicInfo.currentLevel}
						placeholder="0"
						min={0}
					/>

					<Input
						label="Pontos de Virtude"
						type="number"
						bind:value={formData.data.basicInfo.virtuePoints}
						placeholder="0"
						min={0}
					/>
				</div>

				<div class="rounded-lg bg-blue-50 p-3">
					<p class="text-sm text-blue-700">
						💡 <strong>Dica:</strong> Você pode deixar campos opcionais em branco e preencher depois.
					</p>
				</div>
			</div>
		{/if}

		<!-- ETAPA 1: ATRIBUTOS DA RAÇA -->
		{#if currentStep === 1}
			<div class="space-y-4">
				<div class="rounded-lg bg-blue-50 p-3">
					<p class="text-sm text-blue-700">
						<strong>Atributos da Raça: {formData.data.basicInfo.race || 'sua raça'}</strong><br />
						Estes são os atributos naturais da raça. Digite 0 se não tiver pontos.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-3">
					{#each attributeNames as attr}
						<div class="space-y-1">
							<label class="block text-xs font-medium text-gray-600">
								{attributeLabels[attr]}
							</label>
							<input
								type="number"
								min="0"
								max="100"
								bind:value={formData.data.attributes.race[attr]}
								class="w-full rounded-lg border border-gray-300 p-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ETAPA 2: ATRIBUTOS DA CLASSE -->
		{#if currentStep === 2}
			<div class="space-y-4">
				<div class="rounded-lg bg-green-50 p-3">
					<p class="text-sm text-green-700">
						<strong>Atributos da Classe: {formData.data.basicInfo.class || 'sua classe'}</strong><br
						/>
						Estes são os atributos adquiridos pelo treinamento da classe.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-3">
					{#each attributeNames as attr}
						<div class="space-y-1">
							<label class="block text-xs font-medium text-gray-600">
								{attributeLabels[attr]}
							</label>
							<input
								type="number"
								min="0"
								max="100"
								bind:value={formData.data.attributes.class[attr]}
								class="w-full rounded-lg border border-gray-300 p-3 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ETAPA 3: STATUS -->
		{#if currentStep === 3}
			<div class="space-y-4">
				<div class="rounded-lg bg-red-50 p-3">
					<p class="text-sm text-red-700">
						<strong>Vitalidade e Berkana</strong><br />
						Configure os valores base do personagem.
					</p>
				</div>

				<div class="space-y-4">
					<h4 class="font-medium text-gray-700">Vitalidade Base</h4>
					<div class="grid grid-cols-2 gap-3">
						<Input
							label="Vitalidade da Raça"
							type="number"
							bind:value={formData.data.vitality.raceBase}
							placeholder="200"
							min={0}
						/>

						<Input
							label="Vitalidade da Classe"
							type="number"
							bind:value={formData.data.vitality.classBase}
							placeholder="150"
							min={0}
						/>
					</div>

					<Input
						label="Berkana Base"
						type="number"
						bind:value={formData.data.berkana.baseValue}
						placeholder="120"
						min={0}
					/>

					<div class="rounded-lg bg-gray-50 p-3">
						<p class="text-sm text-gray-600">
							<strong>Total de Vitalidade:</strong>
							{formData.data.vitality.raceBase + formData.data.vitality.classBase}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- ETAPA 4: FINALIZAR -->
		{#if currentStep === 4}
			<div class="space-y-4">
				<div class="rounded-lg bg-gray-50 p-4">
					<h3 class="mb-3 font-medium text-gray-900">Resumo do Personagem</h3>
					<div class="space-y-2 text-sm">
						<p><strong>Jogador:</strong> {formData.data.basicInfo.playerName}</p>
						<p><strong>Personagem:</strong> {formData.data.basicInfo.characterName}</p>
						<p><strong>Classe:</strong> {formData.data.basicInfo.class}</p>
						<p><strong>Raça:</strong> {formData.data.basicInfo.race}</p>
						<p><strong>Nível:</strong> {formData.data.basicInfo.currentLevel}</p>
						<p><strong>Pontos de Virtude:</strong> {formData.data.basicInfo.virtuePoints}</p>
					</div>
				</div>

				<div class="rounded-lg bg-blue-50 p-4">
					<h4 class="mb-2 font-medium text-blue-900">Status Base</h4>
					<div class="space-y-1 text-sm text-blue-700">
						<p>
							<strong>Vitalidade Total:</strong>
							{formData.data.vitality.raceBase + formData.data.vitality.classBase}
						</p>
						<p><strong>Berkana:</strong> {formData.data.berkana.baseValue}</p>
					</div>
				</div>

				<div class="rounded-lg bg-green-50 p-4">
					<p class="text-sm text-green-700">
						✅ <strong>Tudo pronto!</strong> Você poderá configurar armas, armadura e outros detalhes
						depois de criar o personagem.
					</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Botões de navegação -->
	<div class="sticky bottom-0 border-t border-gray-200 bg-white p-4">
		<div class="flex items-center justify-between">
			{#if currentStep > 0}
				<Button variant="ghost" on:click={prevStep} disabled={$isSavingCharacter}>
					<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Voltar
				</Button>
			{:else}
				<div></div>
			{/if}

			{#if currentStep < steps.length - 1}
				<Button variant="primary" on:click={nextStep}>
					Próximo
					<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7" />
					</svg>
				</Button>
			{:else}
				<Button
					variant="primary"
					on:click={handleSubmit}
					loading={$isSavingCharacter}
					disabled={$isSavingCharacter}
				>
					{$isSavingCharacter ? 'Criando...' : 'Criar Personagem'}
				</Button>
			{/if}
		</div>
	</div>
</div>
