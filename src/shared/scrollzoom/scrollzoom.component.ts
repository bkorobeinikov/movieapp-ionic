import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation, ViewChild } from '@angular/core';

import { Gesture } from "ionic-angular";

export function isTrueProperty(val: any): boolean {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim();
        return (val === 'true' || val === 'on' || val === '');
    }
    return !!val;
};

interface Size {
    width: number;
    height: number;
}

/**
 * @name Scroll
 * @description
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places where you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
 * @usage
 * ```html
 * <ion-scroll scrollX="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollY="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollX="true" scrollY="true">
 * </ion-scroll>
 * ```
 * @demo /docs/v2/demos/src/scroll/
 */
@Component({
    selector: 'ion-scrollzoom',
    template:
    '<div class="scroll-content" #container>' +
    '<div class="scroll-zoom-wrapper" #content>' +
    '<ng-content></ng-content>' +
    '</div>' +
    '</div>',
    host: {
        '[class.scroll-x]': 'scrollX',
        '[class.scroll-y]': 'scrollY'
    },
})
export class Scroll {
    _scrollX: boolean = false;
    _scrollY: boolean = false;
    _zoom: boolean = false;
    _maxZoom: number = 1;

    @ViewChild("container") containerElement: ElementRef;
    @ViewChild("content") contentElement: ElementRef;

    /**
     * @input {boolean} If true, scrolling along the X axis is enabled.
     */
    @Input()
    get scrollX() {
        return this._scrollX;
    }
    set scrollX(val: any) {
        this._scrollX = isTrueProperty(val);
    }

    /**
     * @input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
     */
    @Input()
    get scrollY() {
        return this._scrollY;
    }
    set scrollY(val: any) {
        this._scrollY = isTrueProperty(val);
    }

    /**
     * @input {boolean} If true, zooming is enabled.
     */
    @Input()
    get zoom() {
        return this._zoom;
    }
    set zoom(val: any) {
        this._zoom = isTrueProperty(val);
    }

    /**
     * @input {number} Set the max zoom amount.
     */
    @Input()
    get maxZoom() {
        return this._maxZoom;
    }
    set maxZoom(val: any) {
        this._maxZoom = val;
    }

    private scale: number = 1;
    private minScale: number = 1;
    private maxScale: number = 1;

    private startScale: number = 1;
    private minScaleBounce: number = 0.2;
    private maxScaleBounce: number = 0.35;

    /**
     * @private
     */
    zoomDuration: number = 250;
    /**
     * @private
     */
    scrollElement: HTMLElement;

    private gesture: Gesture;

    private containerSize: Size;
    private originalContentSize: Size;
    private contentSize: Size;
    private contentPosition: { left: number, top: number };
    private centerStart: { x: number, y: number } = { x: 0, y: 0 };
    private panCenterStart: { x: number, y: number } = { x: 0, y: 0 };
    private centerRatio: { x: number, y: number } = { x: 0, y: 0 };

    constructor(private _elementRef: ElementRef) { }

    /**
     * @private
     */
    ngOnInit() {
        this.scrollElement = this._elementRef.nativeElement.children[0];
        this.attachEvents();
    }

    ngAfterViewInit() {
        var container = this.containerSize = this.getSize(this.containerElement);
        var content = this.originalContentSize = this.getScrollSize(this.contentElement);

        //console.log('container and content ', container, content);

        var scaleWidth = container.width / content.width;
        var scaleHeight = container.height / content.height;

        this.minScale = Math.min(scaleWidth, scaleHeight);
        this.scale = this.minScale;

        this.applyScale();
    }

    private applyScale() {
        let scale = this.scale;

        let oldContentSize = this.contentSize != null ? {
            width: this.contentSize.width,
            height: this.contentSize.height,
        } : null;

        let contentSize: Size = this.contentSize = {
            width: this.originalContentSize.width * scale,
            height: this.originalContentSize.height * scale
        };

        let position = this.contentPosition = {
            left: Math.max((this.containerSize.width - contentSize.width) / (2 * scale), 0),
            top: Math.max((this.containerSize.height - contentSize.height) / (2 * scale), 0)
        };

        var style = <any>this.contentElement.nativeElement.style;
        style['transform-origin'] = 'top left';
        style.transform = `scale(${this.scale}) translate(${position.left}px, ${position.top}px)`;

        // if (oldContentSize != null) {
        //     let scrollBy = {
        //         left: (contentSize.width - oldContentSize.width) / 2,
        //         top: (contentSize.height - oldContentSize.height) / 2
        //     };

        //     console.log('scrollBy:', scrollBy.left, scrollBy.top);

        //     this.scrollElement.scrollLeft = this.scrollElement.scrollLeft + scrollBy.left;
        //     this.scrollElement.scrollTop = this.scrollElement.scrollTop + scrollBy.top;
        // }

        this.scrollElement.scrollLeft = this.centerRatio.x * contentSize.width - this.centerStart.x;
        this.scrollElement.scrollTop = this.centerRatio.y * contentSize.height - this.centerStart.y;
    }

    private attachEvents() {
        this.gesture = new Gesture(this.scrollElement);
        this.gesture.listen();
        this.gesture.on('pinchstart', e => this.onPinchStart(e));
        this.gesture.on('pinch', e => this.onPinch(e));
        this.gesture.on('pinchend', e => this.onPinchEnd(e));
        this.gesture.on('doubletap', e => this.doubleTapEvent(e));
        this.gesture.on('pan', e => this.panEvent(e));
    }

    private doubleTapEvent(event) {
        this.setCenter(event);

        let scale = this.scale >= 1 ? this.minScale : 1;
        if (scale > this.maxScale) {
            scale = this.maxScale;
        }

        this.animateScale(scale);
    }

    private onPinchStart(event: any) {
        //console.log('pinch-start', event, event.center.x, event.center.y);

        this.startScale = this.scale;
        this.setCenter(event);

        event.preventDefault();
    }

    private onPinchEnd(event: any) {
        if (this.scale > this.maxScale) {
            this.animateScale(this.maxScale);
        } else if (this.scale < this.minScale) {
            this.animateScale(this.minScale);
        }

        event.preventDefault();
    }

    /**
     * Animates to a certain scale (with ease)
     *
     * @param  {number} scale
     */
    private animateScale(scale: number) {
        this.scale += (scale - this.scale) / 5;

        if (Math.abs(this.scale - scale) <= 0.1) {
            this.scale = scale;
        }

        this.applyScale();

        if (Math.abs(this.scale - scale) > 0.1) {
            window.requestAnimationFrame(this.animateScale.bind(this, scale));
        } else {
            //this.checkScroll();
        }
    }

    private setCenter(event: any) {

        var offset = this.getGlobalOffset(this.scrollElement)
        //console.log('offset and event', offset, event);

        let contentSize = this.contentSize;
        let scale = this.scale;
        let position = this.contentPosition;

        this.centerStart = {
            x: Math.max(event.center.x - offset.left - position.left * scale, 0),
            y: Math.max(event.center.y - offset.top - position.top * scale, 0)
        };

        this.panCenterStart = {
            x: this.centerStart.x,
            y: this.centerStart.y,
        };

        this.centerRatio = {
            x: Math.min((this.centerStart.x + this.scrollElement.scrollLeft) / contentSize.width, 1),
            y: Math.min((this.centerStart.y + this.scrollElement.scrollTop) / contentSize.height, 1),
        }

        //console.log('center: ', this.centerStart.x, this.centerStart.y, this.centerRatio);
    }

    private onPinch(event: any) {
        //console.log('pinch', event.scale);
        let scale = this.startScale * event.scale;

        if (scale > this.maxScale) {
            scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
        } else if (scale < this.minScale) {
            scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
        }

        this.scale = scale;
        this.applyScale();

        event.preventDefault();
    }

    /**
     * @private
     * Add a scroll event handler to the scroll element if it exists.
     * @param {Function} handler  The scroll handler to add to the scroll element.
     * @returns {?Function} a function to remove the specified handler, otherwise
     * undefined if the scroll element doesn't exist.
     */
    addScrollEventListener(handler: any) {
        if (!this.scrollElement) { return; }

        this.scrollElement.addEventListener('scroll', handler);

        return () => {
            this.scrollElement.removeEventListener('scroll', handler);
        };
    }

    private getSize(el: ElementRef) {
        return {
            width: Math.ceil(el.nativeElement.offsetWidth) - 2,
            height: Math.ceil(el.nativeElement.offsetHeight) - 2,
        };
    }

    private getScrollSize(el: ElementRef) {
        return {
            width: Math.ceil(el.nativeElement.scrollWidth),
            height: Math.ceil(el.nativeElement.scrollHeight),
        };
    }


    private getGlobalOffset(el: HTMLElement) {
        var x = 0, y = 0
        while (el) {
            x += el.offsetLeft
            y += el.offsetTop
            el = <any>el.offsetParent
        }
        return { left: x, top: y }
    }

    private panEvent(event) {
        // calculate center x,y since pan started
        const x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
        const y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);

        this.centerStart.x = x;
        this.centerStart.y = y;

        if (event.isFinal) {
            this.panCenterStart.x = x;
            this.panCenterStart.y = y;
        }

        this.applyScale();
    }

}