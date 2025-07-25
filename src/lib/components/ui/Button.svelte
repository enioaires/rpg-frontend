<script lang="ts">
  // Props do componente
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let fullWidth: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  // Classes CSS baseadas nas props
  $: baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  $: variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-gray-500'
  };
  
  $: sizeClasses = {
    sm: 'h-8 rounded-md px-3 text-sm',
    md: 'h-10 rounded-md px-4 py-2',
    lg: 'h-12 rounded-md px-8 text-lg'
  };
  
  $: widthClass = fullWidth ? 'w-full' : '';
  
  $: buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`;
</script>

<button
  {type}
  class={buttonClasses}
  {disabled}
  on:click
  on:mouseenter
  on:mouseleave
  on:focus
  on:blur
  {...$$restProps}
>
  {#if loading}
    <svg
      class="mr-2 h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  {/if}
  
  <slot />
</button>

<style>
  /* Garantindo que o foco funcione bem no mobile */
  button:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  /* Loading state suave */
  button:disabled {
    cursor: not-allowed;
  }
</style>