import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe implements PipeTransform {
    transform(value: moment.Moment, format: string) {
        if (!moment.isMoment(value))
            value = moment(value);

        return value.format(format);
    }
}