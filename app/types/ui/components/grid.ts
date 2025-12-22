/**
 * Grid component types
 * @see app/components/shared/BaseGrid.vue
 */

/**
 * Available grid column configurations
 */
export type GridCols = 1 | 2 | 3 | 4 | 6 | 12

/**
 * Grid gap sizes mapped to spacing tokens
 */
export type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * BaseGrid component props
 */
export interface BaseGridProps {
    /** Number of columns at base (mobile) */
    cols?: GridCols
    /** Number of columns at md breakpoint */
    md?: GridCols
    /** Number of columns at lg breakpoint */
    lg?: GridCols
    /** Number of columns at xl breakpoint */
    xl?: GridCols
    /** Gap between items */
    gap?: GridGap
    /** Vertical alignment */
    align?: 'start' | 'center' | 'end' | 'stretch'
    /** HTML tag to render as */
    tag?: string
}
