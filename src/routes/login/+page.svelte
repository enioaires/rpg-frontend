<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { authStore, isAuthenticated, isAuthLoading } from '$lib/stores/auth';
	import { loginSchema, type LoginFormData } from '$lib/types';
	import { logger } from '$lib/utils/logger';
	import { ROUTES } from '$lib/utils/constants';
	import { onMount } from 'svelte';

	// ==========================================
	// FORM STATE
	// ==========================================

	let formData: LoginFormData = {
		identifier: '',
		password: ''
	};

	let errors: Partial<Record<keyof LoginFormData, string>> = {};
	let isSubmitting = false;
	let showPassword = false;

	// ==========================================
	// REACTIVE STATEMENTS
	// ==========================================

	// Redireciona se já autenticado
	$: if ($isAuthenticated) {
		const redirectTo = $page.url.searchParams.get('redirect') || ROUTES.DASHBOARD;
		goto(redirectTo);
	}

	// Determina se form é válido
	$: isFormValid =
		formData.identifier.trim() !== '' &&
		formData.password !== '' &&
		Object.keys(errors).length === 0;

	// ==========================================
	// VALIDATION
	// ==========================================

	function validateField(field: keyof LoginFormData, value: string): void {
		try {
			if (field === 'identifier') {
				loginSchema.shape.identifier.parse(value);
			} else if (field === 'password') {
				loginSchema.shape.password.parse(value);
			}

			// Remove erro se validação passou
			delete errors[field];
			errors = { ...errors };
		} catch (error: any) {
			// Adiciona erro se validação falhou
			const message = error.errors?.[0]?.message || 'Campo inválido';
			errors = { ...errors, [field]: message };
		}
	}

	function validateForm(): boolean {
		try {
			loginSchema.parse(formData);
			errors = {};
			return true;
		} catch (error: any) {
			const newErrors: typeof errors = {};

			error.errors?.forEach((err: any) => {
				const field = err.path[0] as keyof LoginFormData;
				newErrors[field] = err.message;
			});

			errors = newErrors;
			return false;
		}
	}

	// ==========================================
	// EVENT HANDLERS
	// ==========================================

	function handleInput(field: keyof LoginFormData) {
		return (event: Event) => {
			const target = event.target as HTMLInputElement;
			formData[field] = target.value;

			// Valida em tempo real apenas se já houve erro
			if (errors[field]) {
				validateField(field, target.value);
			}
		};
	}

	function handleBlur(field: keyof LoginFormData) {
		return (event: Event) => {
			const target = event.target as HTMLInputElement;
			validateField(field, target.value);
		};
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (isSubmitting || !validateForm()) {
			return;
		}

		isSubmitting = true;

		try {
			logger.formSubmit('login', true, { identifier: formData.identifier });

			const success = await authStore.login(formData);

			if (success) {
				// Redireciona para página solicitada ou dashboard
				const redirectTo = $page.url.searchParams.get('redirect') || ROUTES.DASHBOARD;
				goto(redirectTo);
			}
		} catch (error: any) {
			logger.formSubmit('login', false, {
				identifier: formData.identifier,
				error: error.message
			});

			// Erro já tratado pelo auth store (toast)
		} finally {
			isSubmitting = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// ==========================================
	// LIFECYCLE
	// ==========================================

	onMount(() => {
		logger.pageView('/login');

		// Auto-focus no primeiro campo
		const firstInput = document.querySelector('input[name="identifier"]') as HTMLInputElement;
		firstInput?.focus();
	});
</script>

<!-- ==========================================
     PAGE METADATA
     ========================================== -->
<svelte:head>
	<title>Login - RPG Digital</title>
	<meta name="description" content="Entre na sua conta RPG Digital" />
</svelte:head>

<!-- ==========================================
     MAIN CONTENT
     ========================================== -->
<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>

			<h1 class="mb-2 text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>

			<p class="text-gray-600">Entre na sua conta para acessar seus personagens</p>
		</div>

		<!-- Form Card -->
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<!-- Form -->
			<form on:submit={handleSubmit} novalidate class="space-y-6">
				<!-- Identifier Field -->
				<div>
					<label for="identifier" class="mb-2 block text-sm font-medium text-gray-700">
						Username ou Email
					</label>

					<div class="relative">
						<input
							id="identifier"
							name="identifier"
							type="text"
							autocomplete="username"
							required
							value={formData.identifier}
							on:input={handleInput('identifier')}
							on:blur={handleBlur('identifier')}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							class:border-red-300={errors.identifier}
							class:focus:ring-red-500={errors.identifier}
							class:focus:border-red-500={errors.identifier}
							placeholder="Digite seu username ou email"
							disabled={isSubmitting || $isAuthLoading}
						/>

						<!-- Field Icon -->
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
					</div>

					<!-- Field Error -->
					{#if errors.identifier}
						<p class="mt-2 flex items-center text-sm text-red-600">
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							{errors.identifier}
						</p>
					{/if}
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-gray-700"> Senha </label>

					<div class="relative">
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							value={formData.password}
							on:input={handleInput('password')}
							on:blur={handleBlur('password')}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							class:border-red-300={errors.password}
							class:focus:ring-red-500={errors.password}
							class:focus:border-red-500={errors.password}
							placeholder="Digite sua senha"
							disabled={isSubmitting || $isAuthLoading}
						/>

						<!-- Toggle Password Button -->
						<button
							type="button"
							on:click={togglePasswordVisibility}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
							disabled={isSubmitting || $isAuthLoading}
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

					<!-- Field Error -->
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

				<!-- Submit Button -->
				<Button
					type="submit"
					variant="primary"
					size="lg"
					fullWidth
					loading={isSubmitting || $isAuthLoading}
					disabled={!isFormValid || isSubmitting || $isAuthLoading}
				>
					{#if isSubmitting || $isAuthLoading}
						Entrando...
					{:else}
						Entrar
					{/if}
				</Button>
			</form>

			<!-- Footer Links -->
			<div class="mt-6 space-y-4 text-center">
				<!-- Register Link -->
				<p class="text-sm text-gray-600">
					Não tem uma conta?
					<a
						href="/register"
						class="font-medium text-blue-600 transition-colors hover:text-blue-500"
					>
						Criar conta gratuita
					</a>
				</p>

				<!-- Forgot Password (futuro) -->
				<!-- 
        <p class="text-sm">
          <a 
            href="/forgot-password" 
            class="font-medium text-gray-600 hover:text-gray-500 transition-colors"
          >
            Esqueceu sua senha?
          </a>
        </p>
        -->
			</div>
		</div>

		<!-- Demo Credentials (desenvolvimento) -->
		{#if import.meta.env.DEV}
			<div class="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
				<h3 class="mb-2 text-sm font-medium text-yellow-800">Desenvolvimento</h3>
				<p class="text-xs text-yellow-700">
					Para teste rápido, use qualquer username/email e senha com pelo menos 6 caracteres
				</p>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Garantir que inputs funcionem bem no mobile */
	input {
		-webkit-appearance: none;
		appearance: none;
	}

	/* Smooth transitions */
	input,
	button {
		transition: all 0.2s ease;
	}

	/* Focus ring personalizado */
	input:focus {
		outline: none;
	}

	/* Hover states sutis */
	input:not(:disabled):hover {
		border-color: #9ca3af; /* gray-400 */
	}
</style>
