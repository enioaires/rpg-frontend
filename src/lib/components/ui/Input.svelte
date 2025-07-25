<script lang="ts">
	// Props do componente
	export let type: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' = 'text';
	export let value: string | number = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let readonly: boolean = false;
	export let error: string | null = null;
	export let label: string = '';
	export let id: string = '';
	export let name: string = '';
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | string | undefined = undefined;
	export let fullWidth: boolean = true;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	// Classes CSS baseadas nas props
	$: baseClasses =
		'flex rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

	$: sizeClasses = {
		sm: 'h-8 text-sm',
		md: 'h-10',
		lg: 'h-12 text-lg'
	};

	$: errorClasses = error ? 'border-red-500 focus-visible:ring-red-500' : '';
	$: widthClass = fullWidth ? 'w-full' : '';

	$: inputClasses = `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${widthClass}`;

	// Gera ID único se não fornecido
	$: inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
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

	<input
		{type}
		id={inputId}
		{name}
		{placeholder}
		{disabled}
		{required}
		{readonly}
		{min}
		{max}
		{step}
		class={inputClasses}
		bind:value
		on:input
		on:change
		on:focus
		on:blur
		on:keydown
		on:keyup
		on:keypress
		{...$$restProps}
	/>

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{/if}
</div>

<style>
	/* Remove spinner dos inputs number no Chrome/Safari */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Remove spinner dos inputs number no Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	/* Melhora o foco em mobile */
	input:focus {
		transform: none;
	}
</style>
