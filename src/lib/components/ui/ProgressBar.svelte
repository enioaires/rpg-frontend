<!-- src/lib/components/ui/ProgressBar.svelte -->
<script lang="ts">
	export let value: number = 0; // 0-100
	export let color: 'red' | 'yellow' | 'orange' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' =
		'blue';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	// Clamp value between 0 and 100
	$: clampedValue = Math.min(100, Math.max(0, value));

	// Size classes
	$: sizeClasses = {
		sm: 'h-2',
		md: 'h-3',
		lg: 'h-4'
	}[size];

	// Color classes for the progress bar
	$: colorClasses = {
		red: 'bg-red-500',
		yellow: 'bg-yellow-500',
		orange: 'bg-orange-500',
		green: 'bg-green-500',
		blue: 'bg-blue-500',
		indigo: 'bg-indigo-500',
		purple: 'bg-purple-500',
		pink: 'bg-pink-500'
	}[color];
</script>

<div class="w-full rounded-full bg-gray-200 {sizeClasses}">
	<div
		class="rounded-full transition-all duration-300 ease-in-out {sizeClasses} {colorClasses}"
		style="width: {clampedValue}%"
	></div>
</div>
