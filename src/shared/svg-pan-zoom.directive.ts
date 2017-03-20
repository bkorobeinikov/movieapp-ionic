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
    private panCenterStart: { x: number, y: number } = { x: 0, y: 0 };
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

        let svgScale = _.round(1 / (this.scale / this.originalScale), 2);

        //console.log('applyScale: ', svgScale, this.scale, this.originalScale);

        let original = {
            width: this.originalWidth,
            height: this.originalHeight,
        };

        let size = this.size = {
            width: _.round(this.originalWidth * svgScale, 0),
            height: _.round(this.originalHeight * svgScale)
        };

        let position = this.position = {
            x: _.round((original.width - size.width) * this.centerRatio.x, 0),
            y: _.round((original.height - size.height) * this.centerRatio.y, 0),
        };

        this.viewBox = `${position.x} ${position.y} ${size.width} ${size.height}`;
    }

    private attachEvents() {
        this.gesture = new Gesture(this.el.nativeElement);
        this.gesture.listen();
        // this.gesture.on('pinchstart', e => this.onPinchStart(e));
        // this.gesture.on('pinch', e => this.onPinch(e));
        // this.gesture.on('pinchend', e => this.onPinchEnd(e));
        this.gesture.on('doubletap', e => this.doubleTapEvent(e));
        //this.gesture.on('pan', e => this.panEvent(e));
    }

    private setCenter(event: any) {
        var offset = this.getGlobalOffset(this.el.nativeElement)

        this.centerStart = {
            x: Math.round(Math.max(event.center.x - offset.left, 0)),
            y: Math.round(Math.max(event.center.y - offset.top, 0))
        };

        this.panCenterStart = _.clone(this.centerStart);

        this.centerRatio = {
            x: _.round(Math.min((this.centerStart.x) / this.el.nativeElement.clientWidth, 1), 2),
            y: _.round(Math.min((this.centerStart.y) / this.el.nativeElement.clientHeight, 1), 2),
        }

        if (this.centerRatio.x <= .1)
            this.centerRatio.x = 0;
        else if (this.centerRatio.x >= .9)
            this.centerRatio.x = 1;
        if (this.centerRatio.y <= .1)
            this.centerRatio.y = 0;
        else if (this.centerRatio.y >= .9)
            this.centerRatio.y = 1;

        console.log('center: ', this.centerStart.x, this.centerStart.y, this.centerRatio);
    }

    private doubleTapEvent(event) {
        console.log('double-tap: ', event);

        this.setCenter(event);

        let scale = this.originalScale;
        if (this.scale < this.originalScale * 2) {
            scale = this.originalScale * 2;
        }

        this.animateScale(scale);
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