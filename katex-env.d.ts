declare module 'katex/dist/contrib/auto-render' {
    import { KatexOptions } from 'katex';

    interface RenderMathInElementOptions extends KatexOptions {
        delimiters?: Array<{
            left: string;
            right: string;
            display: boolean;
        }>;
        ignoredTags?: string[];
        ignoredClasses?: string[];
        preProcess?: (math: string) => string;
    }

    function renderMathInElement(
        element: HTMLElement,
        options?: RenderMathInElementOptions
    ): void;

    export default renderMathInElement;
}