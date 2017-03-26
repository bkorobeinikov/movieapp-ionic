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

    constructor() {
    }

    ngOnInit() {
        jsbarcode(this.svg.nativeElement, this.data, {

        });
    }
}