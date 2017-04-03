import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import jsbarcode from 'jsbarcode';

@Component({
    selector: 'barcode',
    template: `
        <svg #svg></svg>
    `
})
export class BarcodeComponent implements OnInit {
    @ViewChild("svg") svg: ElementRef;

    @Input() data: string;
    @Input() format: string;
    @Input() width: number = 2;

    constructor() {
    }

    ngOnInit() {
        try {
            jsbarcode(this.svg.nativeElement, this.data, {
                format: this.format,
                width: this.width,
            });
        } catch (err) {
            console.error(err);
        }
    }
}