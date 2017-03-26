import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import X2JS from 'x2js';

export class BaseService {
    private headers: Headers;

    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'text/xml');
        this.headers.append('Access-Control-Allow-Origin', '*');
    }

    public getData<T>(url: string): Observable<T> {
        var a = this.http
            .get(url, {
                headers: this.headers
            })
            .map(res => {
                //console.log('service:response', res);
                var x2js = new X2JS();
                var text = res.text();
                var jsonObj: any = x2js.xml2js<any>(text);
                jsonObj = jsonObj[Object.keys(jsonObj)[0]];

                //console.log('service:response parsed', jsonObj);

                return jsonObj;
            })
            .catch(this.handleError);

        return a;
    }

    private handleError(error: Response | any) {
        console.error(error);
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}