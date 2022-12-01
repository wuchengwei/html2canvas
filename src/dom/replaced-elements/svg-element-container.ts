import {ElementContainer} from '../element-container';
import {parseBounds} from '../../css/layout/bounds';
import {Context} from '../../core/context';

export class SVGElementContainer extends ElementContainer {
    svg: string;
    intrinsicWidth: number;
    intrinsicHeight: number;

    constructor(context: Context, img: SVGSVGElement) {
        super(context, img);
        const s = new XMLSerializer();
        const bounds = parseBounds(context, img);
        img.setAttribute('width', `${bounds.width}px`);
        img.setAttribute('height', `${bounds.height}px`);
        // 以下设置margin的代码修复在svg元素被设置了margin的时候导致的截屏偏移问题
        img.style.margin = '0';
        img.style.marginTop = '0';
        img.style.marginBottom = '0';
        img.style.marginLeft = '0';
        img.style.marginRight = '0';
        // @ts-ignore
        img.style.marginInline = '0';
        img.style.marginInlineStart = '0';
        img.style.marginInlineEnd = '0';
        // @ts-ignore
        img.style.marginBlock = '0';
        img.style.marginBlockStart = '0';
        img.style.marginBlockEnd = '0';

        this.svg = `data:image/svg+xml,${encodeURIComponent(s.serializeToString(img))}`;
        this.intrinsicWidth = img.width.baseVal.value;
        this.intrinsicHeight = img.height.baseVal.value;

        this.context.cache.addImage(this.svg);
    }
}
