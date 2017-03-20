import { Directive, Input, ElementRef, OnInit, HostBinding, OnChanges, SimpleChanges } from '@angular/core';

import { Gesture } from "ionic-angular";

import _ from 'lodash';

@Directive({
    selector: "[panZoom]"
})
export class SvgPanZoomDirective implements OnInit, OnChanges {

    @Input() originalWidth: number;
    @Input() originalHeight: number;

    @HostBinding("attr.viewBox") viewBox: string;

    private gesture: any;

    private originalScale: number = 0;
    private scale: number = 1;

    private centerStart: { x: number, y: number } = { x: 0, y: 0 };
    //private panCenterStart: { x: number, y: number } = { x: 0, y: 0 };
    private panCenterStart: { x: number, y: number } = null;
    private centerRatio: { x: number, y: number } = { x: 1, y: 1 };

    private size: { width: number, height: number };
    private position: { x: number, y: number } = { x: 0, y: 0 };

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.attachEvents();

        this.applyScale();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.applyScale();
    }

    private applyScale() {

        if (this.originalHeight == undefined || this.originalWidth == undefined)
            return;

        if (this.originalScale == 0) {
            var scaleX = this.el.nativeElement.clientWidth / this.originalWidth;
            var scaleY = this.el.nativeElement.clientHeight / this.originalHeight;

            this.originalScale = _.round(Math.min(scaleX, scaleY), 2);
            this.scale = this.originalScale;
        }

        let humanScale = _.round(this.scale / this.originalScale, 2)
        let svgScale = _.round(1 / humanScale, 2);

        let original = {
            width: this.originalWidth,
            height: this.originalHeight,
        };

        let size = {
            width: _.round(original.width * svgScale, 0),
            height: _.round(original.height * svgScale, 0)
        };

        let maxPosition = {
            x: original.width - size.width,
            y: original.height - size.height,
        };
        let position = {
            x: _.round(maxPosition.x * this.centerRatio.x + this.centerStart.x),
            y: _.round(maxPosition.y * this.centerRatio.y + this.centerStart.y),
        };

        position.x = Math.min(Math.max(position.x, 0), maxPosition.x);
        position.y = Math.min(Math.max(position.y, 0), maxPosition.y);

        if (this.panCenterStart != null && _.isEqual(this.centerStart, this.panCenterStart)) {
            console.log('equal');
            if (position.x == maxPosition.x || position.x == 0)
                this.panCenterStart.x = position.x - (maxPosition.x * this.centerRatio.x);
            if (position.y == maxPosition.y || position.y == 0)
                this.panCenterStart.y = position.y - (maxPosition.y * this.centerRatio.y);
            
        }

        console.log('viewbox: ', position, maxPosition);

        this.size = size;
        this.position = position;

        this.viewBox = `${position.x} ${position.y} ${size.width} ${size.height}`;
    }

    private attachEvents() {
        this.gesture = new Gesture(this.el.nativeElement);
        this.gesture.listen();
        // this.gesture.on('pinchstart', e => this.onPinchStart(e));
        // this.gesture.on('pinch', e => this.onPinch(e));
        // this.gesture.on('pinchend', e => this.onPinchEnd(e));
        this.gesture.on('doubletap', e => this.doubleTapEvent(e));
        this.gesture.on('pan', e => this.panEvent(e));
    }

    private setCenter(event: any) {
        this.centerStart = this.getPointRelativeToSvgContent(event);
        this.panCenterStart = _.clone(this.centerStart);

        this.centerRatio = {
            x: _.round(Math.min((this.centerStart.x) / this.originalWidth, 1), 2),
            y: _.round(Math.min((this.centerStart.y) / this.originalHeight, 1), 2),
        }

        if (this.centerRatio.x <= .1)
            this.centerRatio.x = 0;
        else if (this.centerRatio.x >= .9)
            this.centerRatio.x = 1;

        if (this.centerRatio.y <= .1)
            this.centerRatio.y = 0;
        else if (this.centerRatio.y >= .9)
            this.centerRatio.y = 1;

        console.log('center: ', this.centerStart, this.scale, this.centerRatio);
    }

    private getPointRelativeToSvgContent(event: any) {
        var element = this.el.nativeElement;
        var elOffset = this.getGlobalOffset(element);

        let scale = this.scale;
        // because svg has inverse scale, this is needed to calculate point relative to actual svg content size
        let inverseScale = 1 / scale;

        let original = {
            width: this.originalWidth,
            height: this.originalHeight,
        };

        let position = _.clone(this.position);

        // svg centers content automatically, need to find this offset
        let svgAutoOffset = {
            x: (element.clientWidth - (original.width * scale)) / 2,
            y: (element.clientHeight - (original.height * scale)) / 2
        };
        svgAutoOffset.x = Math.max(Math.round(svgAutoOffset.x), 0);
        svgAutoOffset.y = Math.max(Math.round(svgAutoOffset.y), 0);

        // calculating actual point relative to svg content and not element dimensions
        let point = {
            x: (event.center.x - elOffset.left + position.x) * inverseScale - svgAutoOffset.x * inverseScale,
            y: (event.center.y - elOffset.top + position.y) * inverseScale - svgAutoOffset.y * inverseScale,
        };
        point.x = Math.round(Math.max(point.x, 0));
        point.y = Math.round(Math.max(point.y, 0));

        return point;
    }

    private doubleTapEvent(event) {
        //console.log('double-tap: ', event);

        this.setCenter(event);

        let scale = this.originalScale;
        if (this.scale < this.originalScale * 2) {
            scale = this.originalScale * 2;
        }

        this.animateScale(scale);
    }

    private panEvent(event) {
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;

        if (this.panCenterStart == null)
             this.panCenterStart = {x: 0, y: 0};

        // calculate center x,y since pan started
        const x = Math.floor(this.panCenterStart.x - deltaX);
        const y = Math.floor(this.panCenterStart.y - deltaY);

        this.centerStart.x = x;
        this.centerStart.y = y;

        if (event.isFinal) {
            // this.panCenterStart = null;
            this.panCenterStart.x = x;
            this.panCenterStart.y = y;
        }

        console.log('pan', deltaX, deltaY, this.centerStart, this.panCenterStart);

        this.applyScale();

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

    private getGlobalOffset(el: SVGElement | HTMLElement) {
        el = el.parentElement;

        var x = 0, y = 0
        while (el) {
            x += el.offsetLeft
            y += el.offsetTop
            el = <HTMLElement>el.offsetParent
        }

        return { left: x, top: y }
    }
}