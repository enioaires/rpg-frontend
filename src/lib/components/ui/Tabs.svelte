<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	// Props do componente
	export let value: string = '';
	export let variant: 'default' | 'pills' | 'underline' = 'default';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let fullWidth: boolean = false;
	export let scrollable: boolean = true;

	const dispatch = createEventDispatcher<{
		change: { value: string; previousValue: string };
	}>();

	// Store para comunicação com TabPanel
	const activeTab = writable(value);
	const tabsContext = writable({ variant, size });

	// Disponibiliza contexto para os filhos
	setContext('tabs', { activeTab, tabsContext });

	// Lista de tabs registradas
	let tabs: Array<{ value: string; label: string; disabled?: boolean }> = [];

	// Função para registrar tabs (chamada pelos TabPanel)
	const registerTab = (tabValue: string, label: string, disabled = false) => {
		if (!tabs.find((t) => t.value === tabValue)) {
			tabs = [...tabs, { value: tabValue, label, disabled }];
		}
	};

	// Função para ativar tab
	const activateTab = (tabValue: string) => {
		const tab = tabs.find((t) => t.value === tabValue);
		if (tab && !tab.disabled && tabValue !== value) {
			const previousValue = value;
			value = tabValue;
			activeTab.set(tabValue);
			dispatch('change', { value: tabValue, previousValue });
		}
	};

	// Navegação por teclado
	const handleKeydown = (event: KeyboardEvent, tabValue: string) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			activateTab(tabValue);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			const currentIndex = tabs.findIndex((t) => t.value === value);
			const direction = event.key === 'ArrowRight' ? 1 : -1;
			let nextIndex = currentIndex + direction;

			// Loop na lista
			if (nextIndex >= tabs.length) nextIndex = 0;
			if (nextIndex < 0) nextIndex = tabs.length - 1;

			// Pula tabs desabilitadas
			while (tabs[nextIndex]?.disabled && nextIndex !== currentIndex) {
				nextIndex += direction;
				if (nextIndex >= tabs.length) nextIndex = 0;
				if (nextIndex < 0) nextIndex = tabs.length - 1;
			}

			if (!tabs[nextIndex]?.disabled) {
				activateTab(tabs[nextIndex].value);
				// Foca no próximo tab
				const nextButton = document.querySelector(
					`[data-tab="${tabs[nextIndex].value}"]`
				) as HTMLButtonElement;
				nextButton?.focus();
			}
		}
	};

	// Classes CSS baseadas nas props
	$: baseTabClasses =
		'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

	$: variantClasses = {
		default: {
			inactive: 'text-gray-500 hover:text-gray-700',
			active: 'bg-gray-100 text-gray-900 shadow-sm'
		},
		pills: {
			inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
			active: 'bg-blue-600 text-white'
		},
		underline: {
			inactive:
				'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300',
			active: 'text-blue-600 border-b-2 border-blue-600'
		}
	};

	$: sizeClasses = {
		sm: 'h-8 px-2 text-xs',
		md: 'h-9 px-3 text-sm',
		lg: 'h-10 px-4 text-base'
	};

	// Atualiza store quando value muda externamente
	$: activeTab.set(value);

	// Disponibiliza registerTab para os filhos
	setContext('registerTab', registerTab);
</script>

<div class="w-full">
	<!-- Tab Navigation -->
	<div
		class="flex {scrollable ? 'overflow-x-auto' : ''} {fullWidth ? 'w-full' : ''}"
		role="tablist"
		aria-orientation="horizontal"
	>
		<div
			class="flex {fullWidth ? 'w-full' : ''} {variant === 'underline'
				? 'border-b'
				: 'rounded-md bg-gray-100 p-1'}"
		>
			{#each tabs as tab (tab.value)}
				<button
					type="button"
					role="tab"
					data-tab={tab.value}
					class="{baseTabClasses} {sizeClasses[size]} {value === tab.value
						? variantClasses[variant].active
						: variantClasses[variant].inactive} {fullWidth ? 'flex-1' : ''}"
					aria-selected={value === tab.value}
					aria-controls="tabpanel-{tab.value}"
					disabled={tab.disabled}
					on:click={() => activateTab(tab.value)}
					on:keydown={(e) => handleKeydown(e, tab.value)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Tab Content -->
	<div class="mt-4">
		<slot />
	</div>
</div>

<style>
	/* Melhora o scroll horizontal em mobile */
	.overflow-x-auto {
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.overflow-x-auto::-webkit-scrollbar {
		display: none;
	}

	/* Transições suaves */
	button {
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
