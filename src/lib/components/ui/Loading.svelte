<script lang="ts">
	// Props do componente
	export let variant: 'spinner' | 'skeleton' | 'dots' | 'pulse' = 'spinner';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let text: string = '';
	export let fullWidth: boolean = false;
	export let fullScreen: boolean = false;
	export let lines: number = 3; // Para skeleton

	// Classes de tamanho para spinner
	$: spinnerSizes = {
		xs: 'h-3 w-3',
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
		xl: 'h-12 w-12'
	};

	// Classes de tamanho para texto
	$: textSizes = {
		xs: 'text-xs',
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	};
</script>

{#if fullScreen}
	<!-- Loading Full Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
		<div class="flex flex-col items-center space-y-2">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
			></div>
			{#if text}
				<p class="text-sm text-gray-600">{text}</p>
			{/if}
		</div>
	</div>
{:else if variant === 'spinner'}
	<!-- Spinner Loading -->
	<div class="flex items-center space-x-2 {fullWidth ? 'w-full justify-center' : ''}">
		<div
			class="{spinnerSizes[
				size
			]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
		></div>
		{#if text}
			<span class="{textSizes[size]} text-gray-600">{text}</span>
		{/if}
	</div>
{:else if variant === 'dots'}
	<!-- Dots Loading -->
	<div class="flex items-center space-x-1 {fullWidth ? 'w-full justify-center' : ''}">
		<div class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
		<div class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
		<div class="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
		{#if text}
			<span class="ml-2 {textSizes[size]} text-gray-600">{text}</span>
		{/if}
	</div>
{:else if variant === 'pulse'}
	<!-- Pulse Loading -->
	<div class="flex items-center space-x-2 {fullWidth ? 'w-full justify-center' : ''}">
		<div class="{spinnerSizes[size]} animate-pulse rounded-full bg-blue-600"></div>
		{#if text}
			<span class="{textSizes[size]} animate-pulse text-gray-600">{text}</span>
		{/if}
	</div>
{:else if variant === 'skeleton'}
	<!-- Skeleton Loading -->
	<div class="space-y-2 {fullWidth ? 'w-full' : ''}">
		{#each Array(lines) as _, i}
			<div
				class="h-4 animate-pulse rounded bg-gray-200"
				style="width: {i === lines - 1 ? '75%' : '100%'}"
			></div>
		{/each}
		{#if text}
			<p class="mt-2 {textSizes[size]} animate-pulse text-gray-400">{text}</p>
		{/if}
	</div>
{/if}

<style>
	/* Otimização das animações */
	@media (prefers-reduced-motion: reduce) {
		.animate-spin,
		.animate-bounce,
		.animate-pulse {
			animation: none;
		}
	}

	/* Animação customizada para dots */
	.animate-bounce {
		animation: bounce 1s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(-25%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
