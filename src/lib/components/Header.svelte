<!-- src/lib/components/Header.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore, currentUser } from '$lib/stores/auth';
	import Button from './ui/Button.svelte';

	interface Props {
		title?: string;
		showNav?: boolean;
	}

	let { title = 'RPG Digital', showNav = true }: Props = $props();

	async function handleLogout() {
		await authStore.logout();
	}

	function isCurrentRoute(route: string): boolean {
		return $page.url.pathname === route || $page.url.pathname.startsWith(route);
	}

	const navItems = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/characters', label: 'Personagens' }
	];

	// Derived state para currentRoute checks
	const currentPath = $derived($page.url.pathname);
</script>

<header class="border-b bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<div class="flex items-center">
				<button
					on:click={() => goto('/dashboard')}
					class="flex items-center space-x-2 transition-opacity hover:opacity-80"
				>
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
						<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h1 class="text-xl font-bold text-gray-900">{title}</h1>
				</button>
			</div>

			<!-- Navigation (Desktop) -->
			{#if showNav}
				<nav class="hidden space-x-1 md:flex">
					{#each navItems as item}
						<a
							href={item.href}
							class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
							class:bg-blue-100={isCurrentRoute(item.href)}
							class:text-blue-700={isCurrentRoute(item.href)}
							class:text-gray-700={!isCurrentRoute(item.href)}
							class:hover:text-blue-600={!isCurrentRoute(item.href)}
							class:hover:bg-gray-100={!isCurrentRoute(item.href)}
						>
							{item.label}
						</a>
					{/each}
				</nav>
			{/if}

			<!-- User Menu -->
			<div class="flex items-center space-x-4">
				{#if $currentUser}
					<span class="hidden text-sm text-gray-600 sm:block">
						Olá, {$currentUser.name}
					</span>
				{/if}
				<Button variant="ghost" size="sm" on:click={handleLogout}>Sair</Button>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if showNav}
			<div class="border-t border-gray-200 md:hidden">
				<div class="space-y-1 px-2 pt-2 pb-3">
					{#each navItems as item}
						<a
							href={item.href}
							class="block rounded-lg px-3 py-2 text-sm font-medium"
							class:bg-blue-100={isCurrentRoute(item.href)}
							class:text-blue-700={isCurrentRoute(item.href)}
							class:text-gray-700={!isCurrentRoute(item.href)}
						>
							{item.label}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</header>
