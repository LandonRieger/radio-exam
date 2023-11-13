<script>
    import { getContext } from "svelte";
	import { slide, fade } from 'svelte/transition';

    const { data, yScale, xScale } = getContext("LayerCake");
</script>

<g class="bar-group">
    {#each $data as series, i}
        {#if series.answered > 0}
            <rect
                transition:fade={{duration: 500}}
                class={series.percent >= 70
                    ? series.percent >= 80
                        ? "fill-[#57a653]"
                        : "fill-[#e6d250]"
                    : "fill-[#e0503a]"}
                data-id={i}
                x={$xScale(0)}
                y={$yScale(series.category)}
                height={$yScale.bandwidth()}
                width={$xScale(series.percent) > 0 ? $xScale(series.percent) : 0}>
            </rect>
        {/if}
    {/each}
</g>
