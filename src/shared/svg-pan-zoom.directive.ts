import { Directive, Input, ElementRef, OnInit, HostBinding, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: "[panZoom]"
})
export class SvgPanZoomDirective implements OnInit, OnChanges {

    @Input() originalWidth: number;
    @Input() originalHeight: number;

    @HostBinding("attr.viewBox") viewBox: string;

    private scale: number;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        console.log('pan-zoom directive init');

        this.scale = 1;

        this.applyScale();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.applyScale();
    }

    private applyScale() {
        let svgScale = 1 / this.scale;

        if (this.originalHeight == undefined || this.originalWidth == undefined)
            return;

        let original = {
            width: this.originalWidth,
            height: this.originalHeight,
        };

        let size = {
            width: this.originalWidth * svgScale,
            height: this.originalHeight * svgScale
        };

        let position = {
            x: Math.max((size.width - original.width) / 2, 0),
            y: Math.max((size.height - original.height) / 2, 0),
        };

        this.viewBox = `${position.x} ${position.y} ${size.width} ${size.height}`;
    }
}