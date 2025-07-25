<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props do componente
	export let value: number = 0;
	export let min: number = 0;
	export let max: number = 999;
	export let step: number = 1;
	export let label: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let error: string | null = null;
	export let placeholder: string = '0';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let fullWidth: boolean = true;
	export let showButtons: boolean = true;
	export let id: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher<{
		change: { value: number };
		increment: { value: number };
		decrement: { value: number };
	}>();

	// Gera ID único se não fornecido
	$: inputId = id || `number-input-${Math.random().toString(36).substr(2, 9)}`;

	// Classes CSS baseadas nas props
	$: sizeClasses = {
		sm: 'h-8 text-sm',
		md: 'h-10',
		lg: 'h-12 text-lg'
	};

	$: buttonSizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-10 h-10'
	};

	// Validação de limites
	$: isAtMin = value <= min;
	$: isAtMax = value >= max;

	// Classes para o container
	$: containerClasses = `
		inline-flex items-center rounded-md border border-gray-300 bg-white ring-offset-white
		focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
		${error ? 'border-red-500 focus-within:ring-red-500' : ''}
		${disabled ? 'opacity-50 cursor-not-allowed' : ''}
		${fullWidth ? 'w-full' : ''}
		${sizeClasses[size]}
	`.trim();

	// Classes para o input
	$: inputClasses = `
		flex-1 text-center border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0
		disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-500
	`.trim();

	// Classes para os botões
	$: buttonClasses = `
		inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset disabled:cursor-not-allowed
		disabled:opacity-50 disabled:hover:bg-transparent transition-colors
	`.trim();

	// Handlers
	const handleIncrement = () => {
		if (disabled || isAtMax) return;
		const newValue = Math.min(value + step, max);
		value = newValue;
		dispatch('change', { value: newValue });
		dispatch('increment', { value: newValue });
	};

	const handleDecrement = () => {
		if (disabled || isAtMin) return;
		const newValue = Math.max(value - step, min);
		value = newValue;
		dispatch('change', { value: newValue });
		dispatch('decrement', { value: newValue });
	};

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		let newValue = parseFloat(target.value) || 0;
		newValue = Math.max(min, Math.min(max, newValue));
		value = newValue;
		target.value = newValue.toString();
		dispatch('change', { value: newValue });
	};

	const handleKeydown = (event: KeyboardEvent) => {
		// Permite números, backspace, delete, setas, etc.
		const allowed = /[0-9]|Backspace|Delete|Tab|Escape|Enter|Home|End|Arrow/;
		if (!allowed.test(event.key)) {
			event.preventDefault();
		}

		// Atalhos de teclado
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			handleIncrement();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			handleDecrement();
		}
	};
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

	<div class={containerClasses}>
		<!-- Botão de decrementar -->
		{#if showButtons}
			<button
				type="button"
				class="{buttonClasses} {buttonSizeClasses[size]} rounded-l-md border-r border-gray-300"
				disabled={disabled || isAtMin}
				on:click={handleDecrement}
				aria-label="Diminuir valor"
			>
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
				</svg>
			</button>
		{/if}

		<!-- Input principal -->
		<input
			type="number"
			id={inputId}
			{name}
			{placeholder}
			{disabled}
			{required}
			{min}
			{max}
			{step}
			class={inputClasses}
			bind:value
			on:input={handleInput}
			on:keydown={handleKeydown}
			on:focus
			on:blur
			{...$$restProps}
		/>

		<!-- Botão de incrementar -->
		{#if showButtons}
			<button
				type="button"
				class="{buttonClasses} {buttonSizeClasses[size]} rounded-r-md border-l border-gray-300"
				disabled={disabled || isAtMax}
				on:click={handleIncrement}
				aria-label="Aumentar valor"
			>
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
			</button>
		{/if}
	</div>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>

<style>
	/* Remove spinner padrão do input number */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}

	/* Transições suaves */
	button {
		transition-property: color, background-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
