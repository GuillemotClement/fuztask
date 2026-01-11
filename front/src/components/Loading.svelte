<script lang="ts">
    import { LoaderCircle } from "@lucide/svelte";

</script>

<div class="loading">
  <LoaderCircle size={24}/>
</div>

<style>
    @keyframes spin {
    from { transform: rotate(0deg);}
    to { transform: rotate(360deg);}
  }

  .loading :global(svg) {
    animation: spin 1s linear infinite;
  }
</style>