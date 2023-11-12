<script>
    import { getContext } from "svelte";

    const { data, yScale, xScale } = getContext("LayerCake");
</script>

<g class="bar-group">
    {#each $data as series, i}
        {#if series.answered > 0}
            <rect
                class={series.percent >= 70
                    ? series.percent >= 80
                        ? "fill-[#57a653]"
                        : "fill-[#cc8b23]"
                    : "fill-[#c24036]"}
                data-id={i}
                x={$xScale(0)}
                y={$yScale(series.category)}
                height={$yScale.bandwidth()}
                width={$xScale(series.percent)}>
            </rect>
        {/if}
    {/each}
</g>
