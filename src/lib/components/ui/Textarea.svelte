<script lang="ts">
	// Props do componente
	export let value: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let readonly: boolean = false;
	export let error: string | null = null;
	export let label: string = '';
	export let id: string = '';
	export let name: string = '';
	export let rows: number = 3;
	export let maxlength: number | undefined = undefined;
	export let fullWidth: boolean = true;
	export let resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';
	export let autoResize: boolean = false;

	// Classes CSS baseadas nas props
	$: baseClasses = `
		flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white
		placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
		focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
	`.trim();

	$: errorClasses = error ? 'border-red-500 focus-visible:ring-red-500' : '';
	$: widthClass = fullWidth ? 'w-full' : '';
	$: resizeClass =
		resize === 'none'
			? 'resize-none'
			: resize === 'vertical'
				? 'resize-y'
				: resize === 'horizontal'
					? 'resize-x'
					: 'resize';

	$: textareaClasses = `${baseClasses} ${errorClasses} ${widthClass} ${resizeClass}`;

	// Gera ID único se não fornecido
	$: textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

	// Contador de caracteres
	$: characterCount = value.length;
	$: isOverLimit = maxlength ? characterCount > maxlength : false;

	// Auto-resize functionality
	let textareaElement: HTMLTextAreaElement;

	const handleAutoResize = () => {
		if (autoResize && textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	};

	// Atualiza altura quando value muda
	$: if (autoResize && value !== undefined) {
		setTimeout(handleAutoResize, 0);
	}
</script>

<div class="space-y-2">
	{#if label}
		<label
			for={textareaId}
			class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<textarea
		bind:this={textareaElement}
		id={textareaId}
		{name}
		{placeholder}
		{disabled}
		{required}
		{readonly}
		{rows}
		{maxlength}
		class={textareaClasses}
		bind:value
		on:input={handleAutoResize}
		on:change
		on:focus
		on:blur
		on:keydown
		on:keyup
		on:keypress
		{...$$restProps}
	></textarea>

	<!-- Informações adicionais -->
	<div class="flex justify-between text-xs">
		<!-- Mensagem de erro -->
		{#if error}
			<p class="text-red-600">{error}</p>
		{:else}
			<div></div>
		{/if}

		<!-- Contador de caracteres -->
		{#if maxlength}
			<p class="text-gray-500 {isOverLimit ? 'text-red-600' : ''}">
				{characterCount}/{maxlength}
			</p>
		{/if}
	</div>
</div>

<style>
	/* Melhora o foco em mobile */
	textarea:focus {
		transform: none;
	}

	/* Suaviza transições */
	textarea {
		transition-property: border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
