<script lang="ts">
	// Props do componente
	export let title: string = '';
	export let description: string = '';
	export let required: boolean = false;
	export let collapsible: boolean = false;
	export let collapsed: boolean = false;
	export let variant: 'default' | 'bordered' | 'card' = 'default';
	export let spacing: 'compact' | 'normal' | 'relaxed' = 'normal';
	export let columns: 1 | 2 | 3 | 4 = 1;

	// Estado de colapso
	let isCollapsed = collapsed;

	// Classes CSS baseadas nas props
	$: variantClasses = {
		default: 'space-y-4',
		bordered: 'space-y-4 border-l-4 border-blue-200 pl-4',
		card: 'space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
	};

	$: spacingClasses = {
		compact: 'space-y-2',
		normal: 'space-y-4',
		relaxed: 'space-y-6'
	};

	$: columnClasses = {
		1: '',
		2: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
		3: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'
	};

	$: containerClasses = variant === 'card' ? variantClasses[variant] : spacingClasses[spacing];

	// Handler para toggle collapse
	const toggleCollapse = () => {
		if (collapsible) {
			isCollapsed = !isCollapsed;
		}
	};
</script>

<fieldset class={containerClasses}>
	<!-- Header do grupo -->
	{#if title || description}
		<legend class="sr-only">{title}</legend>

		<div class="space-y-2">
			{#if title}
				<div class="flex items-center justify-between">
					<h3
						class="text-base font-semibold text-gray-900 {collapsible
							? 'cursor-pointer select-none'
							: ''}"
						on:click={toggleCollapse}
						on:keydown={(e) => e.key === 'Enter' && toggleCollapse()}
						role={collapsible ? 'button' : undefined}
						tabindex={collapsible ? 0 : undefined}
						aria-expanded={collapsible ? !isCollapsed : undefined}
					>
						{title}
						{#if required}
							<span class="text-red-500">*</span>
						{/if}
					</h3>

					{#if collapsible}
						<button
							type="button"
							class="rounded text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							on:click={toggleCollapse}
							aria-label={isCollapsed ? 'Expandir seção' : 'Recolher seção'}
						>
							<svg
								class="h-5 w-5 transition-transform duration-200 {isCollapsed
									? 'rotate-0'
									: 'rotate-180'}"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			{#if description}
				<p class="text-sm text-gray-600">{description}</p>
			{/if}
		</div>
	{/if}

	<!-- Conteúdo do grupo -->
	{#if !collapsible || !isCollapsed}
		<div class={columns > 1 ? columnClasses[columns] : spacingClasses[spacing]}>
			<slot />
		</div>
	{/if}
</fieldset>

<style>
	/* Remove estilo padrão do fieldset */
	fieldset {
		border: none;
		margin: 0;
		padding: 0;
		min-width: 0;
	}

	/* Melhora acessibilidade */
	legend {
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

	/* Transições suaves */
	h3,
	button,
	svg {
		transition-property: color, transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
	}
</style>
