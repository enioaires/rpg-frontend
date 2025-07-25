<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	// Props do componente
	export let value: string = ''; // URL da imagem atual
	export let label: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let error: string | null = null;
	export let accept: string = 'image/*';
	export let maxSize: number = 5 * 1024 * 1024; // 5MB padrão
	export let shape: 'square' | 'circle' | 'rectangle' = 'square';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let placeholder: string = 'Clique para selecionar uma imagem';
	export let id: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher<{
		change: { file: File | null; url: string };
		remove: void;
		error: { message: string };
	}>();

	let fileInput: HTMLInputElement;
	let isDragging = false;

	// Classes CSS baseadas nas props
	$: sizeClasses = {
		sm: 'w-20 h-20',
		md: 'w-32 h-32',
		lg: 'w-48 h-48',
		xl: 'w-64 h-64'
	};

	$: shapeClasses = {
		square: 'rounded-lg',
		circle: 'rounded-full',
		rectangle: 'rounded-lg aspect-video'
	};

	// Para rectangle, ajusta o height
	$: rectangleSizeClasses = {
		sm: 'w-32 h-18',
		md: 'w-48 h-32',
		lg: 'w-64 h-40',
		xl: 'w-80 h-48'
	};

	$: containerClasses = `
		relative border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100
		transition-colors cursor-pointer group
		${shape === 'rectangle' ? rectangleSizeClasses[size] : sizeClasses[size]}
		${shapeClasses[shape]}
		${isDragging ? 'border-blue-500 bg-blue-50' : ''}
		${disabled ? 'opacity-50 cursor-not-allowed hover:bg-gray-50' : ''}
		${error ? 'border-red-500' : ''}
	`.trim();

	// Gera ID único se não fornecido
	$: inputId = id || `image-upload-${Math.random().toString(36).substr(2, 9)}`;

	// Validação de arquivo
	const validateFile = (file: File): string | null => {
		// Verifica tipo
		if (!file.type.startsWith('image/')) {
			return 'Arquivo deve ser uma imagem';
		}

		// Verifica tamanho
		if (file.size > maxSize) {
			const sizeMB = Math.round(maxSize / (1024 * 1024));
			return `Arquivo deve ter menos de ${sizeMB}MB`;
		}

		return null;
	};

	// Processa arquivo selecionado
	const processFile = async (file: File) => {
		const validationError = validateFile(file);
		if (validationError) {
			dispatch('error', { message: validationError });
			return;
		}

		// Cria URL local para preview
		const url = URL.createObjectURL(file);
		value = url;

		dispatch('change', { file, url });
	};

	// Handlers
	const handleFileSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			processFile(file);
		}
	};

	const handleClick = () => {
		if (!disabled) {
			fileInput.click();
		}
	};

	const handleRemove = (event: Event) => {
		event.stopPropagation();

		// Revoga URL se existir
		if (value && value.startsWith('blob:')) {
			URL.revokeObjectURL(value);
		}

		value = '';
		fileInput.value = '';
		dispatch('remove');
		dispatch('change', { file: null, url: '' });
	};

	// Drag & Drop handlers
	const handleDragEnter = (event: DragEvent) => {
		event.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	};

	const handleDragLeave = (event: DragEvent) => {
		event.preventDefault();
		const currentTarget = event.currentTarget as HTMLElement;
		if (!event.relatedTarget || !currentTarget?.contains(event.relatedTarget as Node)) {
			isDragging = false;
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const files = event.dataTransfer?.files;
		const file = files?.[0];

		if (file) {
			processFile(file);
		}
	};

	// Cleanup URL quando component é destruído
	const cleanup = () => {
		if (value && value.startsWith('blob:')) {
			URL.revokeObjectURL(value);
		}
	};

	// Svelte lifecycle
	import { onDestroy } from 'svelte';
	onDestroy(cleanup);
</script>

<div class="space-y-2">
	{#if label}
		<label
			for={inputId}
			class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div
		class={containerClasses}
		on:click={handleClick}
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:dragover={handleDragOver}
		on:drop={handleDrop}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleClick();
			}
		}}
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-label={label || 'Upload de imagem'}
	>
		<!-- Input file oculto -->
		<input
			bind:this={fileInput}
			type="file"
			id={inputId}
			{name}
			{accept}
			{disabled}
			{required}
			class="sr-only"
			on:change={handleFileSelect}
			{...$$restProps}
		/>

		{#if value}
			<!-- Preview da imagem -->
			<div class="relative h-full w-full">
				<img src={value} alt="Preview" class="h-full w-full object-cover {shapeClasses[shape]}" />

				<!-- Overlay com botões -->
				<div
					class="bg-opacity-50 absolute inset-0 bg-black opacity-0 transition-opacity
					duration-200 group-hover:opacity-100 {shapeClasses[shape]} flex items-center justify-center"
				>
					<div class="flex space-x-2">
						<!-- Botão trocar -->
						<Button
							size="sm"
							variant="secondary"
							on:click={(e) => {
								e.stopPropagation();
								handleClick();
							}}
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</Button>

						<!-- Botão remover -->
						<Button size="sm" variant="danger" on:click={handleRemove}>
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
				</div>
			</div>
		{:else}
			<!-- Estado vazio -->
			<div class="flex flex-col items-center justify-center space-y-2 p-4 text-center">
				<!-- Ícone -->
				<svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>

				<!-- Texto -->
				<div class="text-sm text-gray-600">
					<p class="font-medium">{placeholder}</p>
					<p class="mt-1 text-xs text-gray-500">
						{isDragging ? 'Solte a imagem aqui' : 'ou arraste e solte'}
					</p>
				</div>

				<!-- Limite de tamanho -->
				<p class="text-xs text-gray-400">
					Máximo {Math.round(maxSize / (1024 * 1024))}MB
				</p>
			</div>
		{/if}

		<!-- Indicador de drag ativo -->
		{#if isDragging && !value}
			<div
				class="bg-opacity-20 absolute inset-0 border-2 border-blue-500 bg-blue-500
				{shapeClasses[shape]} flex items-center justify-center"
			>
				<div class="text-sm font-medium text-blue-700">Solte a imagem aqui</div>
			</div>
		{/if}
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>

<style>
	/* Remove estilos padrão do input file */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Melhora o foco para acessibilidade */
	div[role='button']:focus-visible {
		outline: 2px solid rgb(59 130 246); /* blue-500 */
		outline-offset: 2px;
	}

	/* Transições suaves */
	div {
		transition-property: border-color, background-color, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	/* Aspect ratio para rectangle */
	.aspect-video {
		aspect-ratio: 16 / 9;
	}

	/* Hover states melhorados */
	.group:hover .opacity-0 {
		opacity: 1;
	}
</style>
