<script lang="ts">
	// Props do componente
	export let variant: 'default' | 'outlined' | 'elevated' | 'filled' = 'default';
	export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
	export let hover: boolean = false;
	export let clickable: boolean = false;
	export let fullWidth: boolean = true;

	// Classes CSS baseadas nas props
	$: baseClasses = 'rounded-lg border transition-colors';

	$: variantClasses = {
		default: 'border-gray-200 bg-white',
		outlined: 'border-gray-300 bg-white',
		elevated: 'border-gray-200 bg-white shadow-md',
		filled: 'border-gray-100 bg-gray-50'
	};

	$: paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	$: interactionClasses = clickable
		? 'cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
		: hover
			? 'hover:bg-gray-50'
			: '';

	$: widthClass = fullWidth ? 'w-full' : '';

	$: cardClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactionClasses} ${widthClass}`;
</script>

<div
	class={cardClasses}
	role={clickable ? 'button' : undefined}
	tabindex={clickable ? 0 : undefined}
	on:click
	on:keydown
	on:mouseenter
	on:mouseleave
	on:focus
	on:blur
	{...$$restProps}
>
	<slot />
</div>

<style>
	/* Melhora a acessibilidade para cards clicáveis */
	div[role='button']:focus-visible {
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	/* Suaviza transições */
	div {
		transition-property: color, background-color, border-color, box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
</style>
