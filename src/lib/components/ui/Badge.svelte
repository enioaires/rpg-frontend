<script lang="ts">
	// Props do componente
	export let variant:
		| 'default'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'info'
		| 'outline' = 'default';
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
	export let rounded: boolean = false;
	export let removable: boolean = false;

	// Event dispatcher para remoção
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		remove: void;
	}>();

	const handleRemove = () => {
		dispatch('remove');
	};

	// Classes CSS baseadas nas props
	$: baseClasses =
		'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

	$: variantClasses = {
		default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
		secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700',
		success: 'bg-green-100 text-green-800 hover:bg-green-200',
		warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
		danger: 'bg-red-100 text-red-800 hover:bg-red-200',
		info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
		outline: 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
	};

	$: sizeClasses = {
		xs: 'px-1.5 py-0.5 text-xs',
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm',
		lg: 'px-3 py-1.5 text-sm'
	};

	$: roundedClass = rounded ? 'rounded-full' : 'rounded';

	$: badgeClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass}`;
</script>

<div class={badgeClasses}>
	<!-- Conteúdo do badge -->
	<slot />

	<!-- Botão de remoção -->
	{#if removable}
		<button
			type="button"
			class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:ring-1 focus:ring-white focus:outline-none focus:ring-inset"
			on:click={handleRemove}
			aria-label="Remover badge"
		>
			<svg
				class="h-3 w-3"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
				/>
			</svg>
		</button>
	{/if}
</div>

<style>
	/* Transições suaves */
	div {
		transition-property: color, background-color, border-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	/* Hover do botão de remoção */
	button:hover {
		transition: background-color 150ms ease-in-out;
	}
</style>
