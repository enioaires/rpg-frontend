<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { createNewCharacter, isSaving } from '$lib/stores/characters';
	import { createEmptyCharacter } from '$lib/api/characters';
	import type { CreateCharacterData } from '$lib/types/character';

	// Props do componente
	export let open: boolean = false;

	const dispatch = createEventDispatcher<{
		close: void;
		created: { character: any };
	}>();

	// Dados do formulário
	let formData: CreateCharacterData = createEmptyCharacter();

	// Estado do formulário
	let errors: Record<string, string> = {};
	let isFormValid = false;

	// Validação em tempo real
	$: validateForm();

	function validateForm() {
		errors = {};

		// Nome do personagem é obrigatório
		if (!formData.name.trim()) {
			errors.name = 'Nome do personagem é obrigatório';
		}

		// Nome do jogador é obrigatório
		if (!formData.data.basicInfo.playerName.trim()) {
			errors.playerName = 'Nome do jogador é obrigatório';
		}

		// Nome do personagem (no basicInfo) é obrigatório
		if (!formData.data.basicInfo.characterName.trim()) {
			errors.characterName = 'Nome do personagem é obrigatório';
		}

		// Classe é obrigatória
		if (!formData.data.basicInfo.class.trim()) {
			errors.class = 'Classe é obrigatória';
		}

		// Raça é obrigatória
		if (!formData.data.basicInfo.race.trim()) {
			errors.race = 'Raça é obrigatória';
		}

		isFormValid = Object.keys(errors).length === 0;
	}

	// Sincroniza nome principal com nome do personagem
	$: if (formData.data.basicInfo.characterName) {
		formData.name = formData.data.basicInfo.characterName;
	}

	// Reset form quando modal abre
	$: if (open) {
		resetForm();
	}

	function resetForm() {
		formData = createEmptyCharacter();
		errors = {};
	}

	async function handleSubmit() {
		if (!isFormValid || $isSaving) return;

		const success = await createNewCharacter(formData);

		if (success) {
			dispatch('created', { character: formData });
			handleClose();
		}
	}

	function handleClose() {
		dispatch('close');
	}
</script>

<Modal {open} title="Criar Novo Personagem" size="lg" on:close={handleClose}>
	<div class="space-y-6">
		<!-- Informações básicas -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<!-- Nome do Jogador -->
			<Input
				label="Nome do Jogador"
				bind:value={formData.data.basicInfo.playerName}
				placeholder="Seu nome"
				required={true}
				error={errors.playerName}
			/>

			<!-- Nome do Personagem -->
			<Input
				label="Nome do Personagem"
				bind:value={formData.data.basicInfo.characterName}
				placeholder="Nome do seu personagem"
				required={true}
				error={errors.characterName}
			/>
		</div>

		<!-- Classe e Raça -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<!-- Classe -->
			<Input
				label="Classe"
				bind:value={formData.data.basicInfo.class}
				placeholder="Ex: Guerreiro, Mago, Ladino..."
				required={true}
				error={errors.class}
			/>

			<!-- Raça -->
			<Input
				label="Raça"
				bind:value={formData.data.basicInfo.race}
				placeholder="Ex: Humano, Elfo, Anão..."
				required={true}
				error={errors.race}
			/>
		</div>

		<!-- Informações opcionais -->
		<div class="space-y-4">
			<h3 class="text-sm font-medium text-gray-900">Informações Opcionais</h3>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<!-- Divindade -->
				<Input
					label="Divindade"
					bind:value={formData.data.basicInfo.deity}
					placeholder="Deus patrono (opcional)"
				/>

				<!-- Terra Natal -->
				<Input
					label="Terra Natal"
					bind:value={formData.data.basicInfo.homeland}
					placeholder="Local de origem (opcional)"
				/>

				<!-- Tendência -->
				<Input
					label="Tendência"
					bind:value={formData.data.basicInfo.alignment}
					placeholder="Ex: Leal e Bom (opcional)"
				/>

				<!-- Gênero -->
				<Input
					label="Gênero"
					bind:value={formData.data.basicInfo.gender}
					placeholder="Gênero (opcional)"
				/>
			</div>

			<!-- Características físicas -->
			<div class="grid grid-cols-3 gap-4">
				<Input
					label="Idade"
					type="number"
					bind:value={formData.data.basicInfo.age}
					placeholder="0"
					min={0}
				/>

				<Input
					label="Peso (kg)"
					type="number"
					bind:value={formData.data.basicInfo.weight}
					placeholder="0"
					min={0}
				/>

				<Input
					label="Altura (cm)"
					type="number"
					bind:value={formData.data.basicInfo.height}
					placeholder="0"
					min={0}
				/>
			</div>
		</div>

		<!-- Informações iniciais -->
		<div class="space-y-4">
			<h3 class="text-sm font-medium text-gray-900">Status Inicial</h3>

			<div class="grid grid-cols-2 gap-4">
				<!-- Pontos de Virtude -->
				<Input
					label="Pontos de Virtude"
					type="number"
					bind:value={formData.data.basicInfo.virtuePoints}
					placeholder="0"
					min={0}
				/>

				<!-- Nível inicial -->
				<Input
					label="Nível Inicial"
					type="number"
					bind:value={formData.data.basicInfo.currentLevel}
					placeholder="0"
					min={0}
				/>
			</div>
		</div>

		<!-- Nota explicativa -->
		<div class="rounded-md bg-blue-50 p-4">
			<div class="flex">
				<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="ml-3">
					<p class="text-sm text-blue-700">
						<strong>Dica:</strong> Você poderá configurar atributos, armas, armadura e outros detalhes
						após criar o personagem.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Botões -->
	<div class="flex justify-end space-x-3 border-t border-gray-200 pt-6">
		<Button variant="ghost" on:click={handleClose} disabled={$isSaving}>Cancelar</Button>

		<Button variant="primary" loading={$isSaving} disabled={!isFormValid} on:click={handleSubmit}>
			{$isSaving ? 'Criando...' : 'Criar Personagem'}
		</Button>
	</div>
</Modal>

<style>
	/* Melhora o visual dos campos obrigatórios */
	:global(.required-field label::after) {
		content: ' *';
		color: #ef4444;
	}
</style>
