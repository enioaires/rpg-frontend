<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import { authStore, isAuthenticated, isAuthLoading } from '$lib/stores/auth';
	import { logger } from '$lib/utils/logger';
	import { ROUTES } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	// ==========================================
	// FORM STATE - SIMPLES
	// ==========================================

	let username = '';
	let email = '';
	let name = '';
	let password = '';
	let confirmPassword = '';
	let errors: Record<string, string> = {};
	let isSubmitting = false;
	let showPassword = false;

	// ==========================================
	// REACTIVE - SIMPLES
	// ==========================================

	// Redireciona se já autenticado
	$: if ($isAuthenticated) {
		goto(ROUTES.DASHBOARD);
	}

	// Form válido
	$: isFormValid =
		username.trim() &&
		email.trim() &&
		name.trim() &&
		password &&
		confirmPassword &&
		password === confirmPassword &&
		Object.keys(errors).length === 0;

	// ==========================================
	// FUNCTIONS - SIMPLES
	// ==========================================

	function clearError(field: string) {
		delete errors[field];
		errors = { ...errors };
	}

	function setError(field: string, message: string) {
		errors = { ...errors, [field]: message };
	}

	function validateField(field: string, value: string) {
		clearError(field);

		if (field === 'username') {
			if (!value.trim()) setError(field, 'Username obrigatório');
			else if (value.length < 3) setError(field, 'Mínimo 3 caracteres');
			else if (!/^[a-zA-Z0-9_]+$/.test(value)) setError(field, 'Apenas letras, números e _');
		}

		if (field === 'email') {
			if (!value.trim()) setError(field, 'Email obrigatório');
			else if (!/\S+@\S+\.\S+/.test(value)) setError(field, 'Email inválido');
		}

		if (field === 'name') {
			if (!value.trim()) setError(field, 'Nome obrigatório');
			else if (value.length < 2) setError(field, 'Mínimo 2 caracteres');
		}

		if (field === 'password') {
			if (!value) setError(field, 'Senha obrigatória');
			else if (value.length < 6) setError(field, 'Mínimo 6 caracteres');
		}

		if (field === 'confirmPassword') {
			if (!value) setError(field, 'Confirmação obrigatória');
			else if (value !== password) setError(field, 'Senhas não coincidem');
		}
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (isSubmitting || !isFormValid) return;

		// Valida tudo
		validateField('username', username);
		validateField('email', email);
		validateField('name', name);
		validateField('password', password);
		validateField('confirmPassword', confirmPassword);

		if (Object.keys(errors).length > 0) return;

		isSubmitting = true;

		try {
			const success = await authStore.register({
				username: username.trim(),
				email: email.trim(),
				name: name.trim(),
				password
			});

			if (success) {
				goto(ROUTES.DASHBOARD);
			}
		} catch (error: any) {
			// Erro já tratado pelo store
		} finally {
			isSubmitting = false;
		}
	}

	// ==========================================
	// LIFECYCLE
	// ==========================================

	onMount(() => {
		logger.pageView('/register');
	});
</script>

<!-- ==========================================
     PAGE
     ========================================== -->
<svelte:head>
	<title>Criar Conta - RPG Digital</title>
</svelte:head>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600">
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
					/>
				</svg>
			</div>
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Criar conta</h1>
			<p class="text-gray-600">Junte-se ao RPG Digital</p>
		</div>

		<!-- Form -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<form on:submit={handleSubmit} class="space-y-6">
				<!-- Username -->
				<div>
					<label for="username" class="mb-2 block text-sm font-medium text-gray-700">
						Username
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						on:blur={() => validateField('username', username)}
						on:input={() => errors.username && clearError('username')}
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
						class:border-red-300={errors.username}
						class:focus:ring-red-500={errors.username}
						placeholder="Escolha um username"
						disabled={isSubmitting}
						required
					/>
					{#if errors.username}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.username}
						</p>
					{/if}
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-gray-700"> Email </label>
					<input
						id="email"
						type="email"
						bind:value={email}
						on:blur={() => validateField('email', email)}
						on:input={() => errors.email && clearError('email')}
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
						class:border-red-300={errors.email}
						class:focus:ring-red-500={errors.email}
						placeholder="seu@email.com"
						disabled={isSubmitting}
						required
					/>
					{#if errors.email}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.email}
						</p>
					{/if}
				</div>

				<!-- Name -->
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
						Nome Completo
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						on:blur={() => validateField('name', name)}
						on:input={() => errors.name && clearError('name')}
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
						class:border-red-300={errors.name}
						class:focus:ring-red-500={errors.name}
						placeholder="Seu nome completo"
						disabled={isSubmitting}
						required
					/>
					{#if errors.name}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.name}
						</p>
					{/if}
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700"> Senha </label>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							on:blur={() => validateField('password', password)}
							on:input={() => {
								if (errors.password) clearError('password');
								if (confirmPassword && errors.confirmPassword)
									validateField('confirmPassword', confirmPassword);
							}}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
							class:border-red-300={errors.password}
							class:focus:ring-red-500={errors.password}
							placeholder="Crie uma senha segura"
							disabled={isSubmitting}
							required
						/>
						<button
							type="button"
							on:click={() => (showPassword = !showPassword)}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
							disabled={isSubmitting}
						>
							{#if showPassword}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							{:else}
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							{/if}
						</button>
					</div>
					{#if errors.password}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.password}
						</p>
					{/if}
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">
						Confirmar Senha
					</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						on:blur={() => validateField('confirmPassword', confirmPassword)}
						on:input={() => errors.confirmPassword && clearError('confirmPassword')}
						class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500"
						class:border-red-300={errors.confirmPassword}
						class:focus:ring-red-500={errors.confirmPassword}
						placeholder="Digite a senha novamente"
						disabled={isSubmitting}
						required
					/>
					{#if errors.confirmPassword}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.confirmPassword}
						</p>
					{/if}
				</div>

				<!-- Submit -->
				<Button
					type="submit"
					variant="primary"
					size="lg"
					fullWidth
					loading={isSubmitting || $isAuthLoading}
					disabled={!isFormValid || isSubmitting || $isAuthLoading}
				>
					{#if isSubmitting || $isAuthLoading}
						Criando conta...
					{:else}
						Criar conta gratuita
					{/if}
				</Button>
			</form>

			<!-- Footer -->
			<div class="mt-6 text-center">
				<p class="text-sm text-gray-600">
					Já tem uma conta?
					<a
						href="/login"
						class="font-medium text-green-600 transition-colors hover:text-green-500"
					>
						Entrar
					</a>
				</p>
			</div>
		</div>
	</div>
</main>

<style>
	/* Mobile-first styles */
	input {
		-webkit-appearance: none;
		appearance: none;
	}

	input:focus {
		outline: none;
	}

	input:not(:disabled):hover {
		border-color: #9ca3af;
	}
</style>
