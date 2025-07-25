<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// Props do componente
	export let value: string;
	export let label: string;
	export let disabled: boolean = false;
	export let lazy: boolean = false; // Só renderiza quando ativo

	// Contexto do Tabs pai
	const tabsContext = getContext('tabs') as
		| { activeTab: import('svelte/store').Writable<string> }
		| undefined;
	const registerTab = getContext('registerTab') as (
		value: string,
		label: string,
		disabled: boolean
	) => void;

	if (!tabsContext || !registerTab) {
		throw new Error('TabPanel deve ser usado dentro de um componente Tabs');
	}

	const { activeTab } = tabsContext;

	// Registra esta tab no componente pai
	onMount(() => {
		registerTab(value, label, disabled);
	});

	// Controla se já foi renderizada (para lazy loading)
	let hasBeenActive = false;

	$: isActive = $activeTab === value;
	$: if (isActive) hasBeenActive = true;
	$: shouldRender = !lazy || hasBeenActive;
</script>

{#if isActive}
	<div
		role="tabpanel"
		id="tabpanel-{value}"
		aria-labelledby="tab-{value}"
		tabindex="0"
		class="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
		transition:fade={{ duration: 150 }}
	>
		{#if shouldRender}
			<slot />
		{/if}
	</div>
{/if}

<style>
	/* Garante que o painel possa receber foco */
	div[role='tabpanel'] {
		outline: none;
	}
</style>
