<script lang="ts">
	// Props do componente
	export let value: number = 0;
	export let max: number = 100;
	export let min: number = 0;
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
	export let variant: 'default' | 'success' | 'warning' | 'danger' | 'info' = 'default';
	export let showLabel: boolean = false;
	export let showPercentage: boolean = false;
	export let label: string = '';
	export let animated: boolean = false;
	export let striped: boolean = false;

	// Calcula a porcentagem
	$: percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
	$: displayValue = Math.round(percentage);

	// Classes CSS baseadas nas props
	$: sizeClasses = {
		xs: 'h-1',
		sm: 'h-2',
		md: 'h-3',
		lg: 'h-4'
	};

	$: variantClasses = {
		default: 'bg-blue-600',
		success: 'bg-green-600',
		warning: 'bg-yellow-600',
		danger: 'bg-red-600',
		info: 'bg-cyan-600'
	};

	$: barClasses = `${variantClasses[variant]} ${animated ? 'transition-all duration-500 ease-in-out' : ''} ${striped ? 'bg-stripes' : ''}`;
</script>

<div class="w-full space-y-2">
	<!-- Label superior -->
	{#if showLabel && label}
		<div class="flex justify-between text-sm">
			<span class="font-medium text-gray-700">{label}</span>
			{#if showPercentage}
				<span class="text-gray-500">{displayValue}%</span>
			{/if}
		</div>
	{/if}

	<!-- Barra de progresso -->
	<div
		class="w-full overflow-hidden rounded-full bg-gray-200 {sizeClasses[size]}"
		role="progressbar"
		aria-valuenow={value}
		aria-valuemin={min}
		aria-valuemax={max}
		aria-label={label || `${displayValue}% completo`}
	>
		<div class="h-full rounded-full {barClasses}" style="width: {percentage}%"></div>
	</div>

	<!-- Label inferior com valores -->
	{#if showLabel && !label}
		<div class="flex justify-between text-xs text-gray-500">
			<span>{value}</span>
			<span>{max}</span>
		</div>
	{/if}
</div>

<style>
	/* Animação de listras */
	.bg-stripes {
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-size: 1rem 1rem;
	}

	/* Animação das listras */
	@keyframes stripes {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1rem 0;
		}
	}

	.bg-stripes {
		animation: stripes 1s linear infinite;
	}

	/* Pausa animação quando usuário prefere reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.bg-stripes {
			animation: none;
		}

		.transition-all {
			transition: none;
		}
	}
</style>
