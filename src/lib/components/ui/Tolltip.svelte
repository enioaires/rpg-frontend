<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Props do componente
	export let content: string = '';
	export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
	export let trigger: 'hover' | 'click' | 'focus' | 'manual' = 'hover';
	export let disabled: boolean = false;
	export let delay: number = 300;
	export let offset: number = 8;
	export let maxWidth: string = '200px';
	export let theme: 'dark' | 'light' = 'dark';
	export let arrow: boolean = true;
	export let open: boolean = false;

	const dispatch = createEventDispatcher<{
		show: void;
		hide: void;
	}>();

	let tooltipElement: HTMLDivElement;
	let triggerElement: HTMLElement;
	let showTimeout: ReturnType<typeof setTimeout>;
	let hideTimeout: ReturnType<typeof setTimeout>;

	// Classes CSS baseadas nas props
	$: themeClasses = {
		dark: 'bg-gray-900 text-white border-gray-700',
		light: 'bg-white text-gray-900 border-gray-200 shadow-lg'
	};

	$: positionClasses = {
		top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
	};

	$: arrowClasses = {
		top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
		bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
		left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
		right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
	};

	$: arrowLightClasses = {
		top: 'border-t-white',
		bottom: 'border-b-white',
		left: 'border-l-white',
		right: 'border-r-white'
	};

	$: tooltipClasses = `
		absolute z-50 px-3 py-2 text-sm rounded-lg border pointer-events-none
		transition-opacity duration-200 ease-in-out
		${themeClasses[theme]}
		${positionClasses[position]}
		${open ? 'opacity-100' : 'opacity-0 invisible'}
	`.trim();

	// Gerenciamento de estado
	const show = () => {
		if (disabled) return;

		clearTimeout(hideTimeout);

		if (trigger === 'hover' && delay > 0) {
			showTimeout = setTimeout(() => {
				open = true;
				dispatch('show');
			}, delay);
		} else {
			open = true;
			dispatch('show');
		}
	};

	const hide = () => {
		clearTimeout(showTimeout);

		if (trigger === 'hover' && delay > 0) {
			hideTimeout = setTimeout(() => {
				open = false;
				dispatch('hide');
			}, 100); // Delay menor para esconder
		} else {
			open = false;
			dispatch('hide');
		}
	};

	const toggle = () => {
		if (open) {
			hide();
		} else {
			show();
		}
	};

	// Event handlers
	const handleMouseEnter = () => {
		if (trigger === 'hover') {
			show();
		}
	};

	const handleMouseLeave = () => {
		if (trigger === 'hover') {
			hide();
		}
	};

	const handleClick = () => {
		if (trigger === 'click') {
			toggle();
		}
	};

	const handleFocus = () => {
		if (trigger === 'focus') {
			show();
		}
	};

	const handleBlur = () => {
		if (trigger === 'focus') {
			hide();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && open) {
			hide();
		}
	};

	// Cleanup timers
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		clearTimeout(showTimeout);
		clearTimeout(hideTimeout);
	});
</script>

<!-- Wrapper container -->
<div class="relative inline-block">
	<!-- Trigger element -->
	<div
		bind:this={triggerElement}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		on:click={handleClick}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:keydown={handleKeydown}
		role={trigger === 'click' ? 'button' : undefined}
		tabindex={trigger === 'click' ? 0 : undefined}
		aria-describedby={open ? 'tooltip' : undefined}
	>
		<slot />
	</div>

	<!-- Tooltip -->
	{#if content}
		<div
			bind:this={tooltipElement}
			id="tooltip"
			role="tooltip"
			class={tooltipClasses}
			style="max-width: {maxWidth};"
		>
			{content}

			<!-- Arrow -->
			{#if arrow}
				<div
					class="absolute h-0 w-0 {arrowClasses[position]}"
					class:border-l-4={position === 'right'}
					class:border-r-4={position === 'left'}
					class:border-t-4={position === 'bottom'}
					class:border-b-4={position === 'top'}
					class:border-l-transparent={position === 'right'}
					class:border-r-transparent={position === 'left'}
					class:border-t-transparent={position === 'bottom'}
					class:border-b-transparent={position === 'top'}
					class:border-l-gray-900={position === 'right' && theme === 'dark'}
					class:border-r-gray-900={position === 'left' && theme === 'dark'}
					class:border-t-gray-900={position === 'bottom' && theme === 'dark'}
					class:border-b-gray-900={position === 'top' && theme === 'dark'}
					class:border-l-white={position === 'right' && theme === 'light'}
					class:border-r-white={position === 'left' && theme === 'light'}
					class:border-t-white={position === 'bottom' && theme === 'light'}
					class:border-b-white={position === 'top' && theme === 'light'}
				></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Transições suaves */
	div[role='tooltip'] {
		transition-property: opacity, visibility;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Melhora acessibilidade para triggers clicáveis */
	div[role='button']:focus-visible {
		outline: 2px solid rgb(59 130 246); /* blue-500 */
		outline-offset: 2px;
		border-radius: 4px;
	}

	/* Ajustes para quebra de texto */
	#tooltip {
		word-wrap: break-word;
		hyphens: auto;
	}

	/* Z-index para garantir que fique sobre outros elementos */
	div[role='tooltip'] {
		z-index: 9999;
	}
</style>
