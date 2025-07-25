<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	// Props do componente
	export let open: boolean = false;
	export let title: string = '';
	export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
	export let closable: boolean = true;
	export let closeOnBackdrop: boolean = true;
	export let closeOnEscape: boolean = true;

	const dispatch = createEventDispatcher<{
		close: void;
		open: void;
	}>();

	// Classes CSS baseadas no tamanho
	$: sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full mx-4'
	};

	// Controle de escape key
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && closeOnEscape && open) {
			handleClose();
		}
	};

	// Função para fechar modal
	const handleClose = () => {
		if (closable) {
			open = false;
			dispatch('close');
		}
	};

	// Função para clique no backdrop
	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget && closeOnBackdrop) {
			handleClose();
		}
	};

	// Gerencia foco e scroll quando modal abre/fecha
	onMount(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			dispatch('open');
		}

		return () => {
			document.body.style.overflow = '';
		};
	});

	// Controla o scroll do body
	$: if (open) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = '';
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		on:click={handleBackdropClick}
		role="presentation"
	>
		<!-- Modal Container -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<!-- Modal Content -->
			<div
				class="relative w-full {sizeClasses[size]} rounded-lg border bg-white p-6 shadow-lg"
				transition:scale={{ duration: 150, start: 0.95 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? 'modal-title' : undefined}
			>
				<!-- Header -->
				{#if title || closable}
					<div class="mb-4 flex items-center justify-between">
						{#if title}
							<h2 id="modal-title" class="text-lg leading-none font-semibold tracking-tight">
								{title}
							</h2>
						{/if}

						{#if closable}
							<button
								type="button"
								class="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
								on:click={handleClose}
								aria-label="Fechar modal"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="h-4 w-4"
								>
									<path d="m15 18-6-6 6-6" />
									<path d="m9 6 6 6-6 6" />
								</svg>
							</button>
						{/if}
					</div>
				{/if}

				<!-- Content -->
				<div class="space-y-4">
					<slot {handleClose} />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Garante que o modal apareça sobre tudo */
	:global(body.modal-open) {
		overflow: hidden;
	}

	/* Melhora a performance das transições */
	div[role='dialog'] {
		will-change: transform;
	}
</style>
