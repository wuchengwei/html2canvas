import {ElementContainer} from '../element-container';
import {parseTree} from '../node-parser';
import {Color, parseColor, COLORS, isTransparent} from '../../css/types/color';
import {Context} from '../../core/context';

export class IFrameElementContainer extends ElementContainer {
    src: string;
    width: number;
    height: number;
    tree?: ElementContainer;
    backgroundColor: Color;
    dataURL?: string;

    constructor(context: Context, iframe: HTMLIFrameElement) {
        super(context, iframe);
        this.src = iframe.src;
        if (iframe.dataset.dataURL) {
            this.dataURL = iframe.dataset.dataURL;
        }
        const iframeRect = iframe.getBoundingClientRect();
        this.width = iframeRect.width;
        this.height = iframeRect.height;
        this.backgroundColor = this.styles.backgroundColor;
        try {
            if (
                iframe.contentWindow &&
                iframe.contentWindow.document &&
                iframe.contentWindow.document.documentElement
            ) {
                this.tree = parseTree(context, iframe.contentWindow.document.documentElement);

                // http://www.w3.org/TR/css3-background/#special-backgrounds
                const documentBackgroundColor = iframe.contentWindow.document.documentElement
                    ? parseColor(
                          context,
                          getComputedStyle(iframe.contentWindow.document.documentElement).backgroundColor as string
                      )
                    : COLORS.TRANSPARENT;
                const bodyBackgroundColor = iframe.contentWindow.document.body
                    ? parseColor(
                          context,
                          getComputedStyle(iframe.contentWindow.document.body).backgroundColor as string
                      )
                    : COLORS.TRANSPARENT;

                this.backgroundColor = isTransparent(documentBackgroundColor)
                    ? isTransparent(bodyBackgroundColor)
                        ? this.styles.backgroundColor
                        : bodyBackgroundColor
                    : documentBackgroundColor;
            }
        } catch (e) {}
    }
}
