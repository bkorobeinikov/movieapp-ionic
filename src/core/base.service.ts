import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import X2JS from 'x2js';

import * as _ from 'lodash';

import { Store } from "@ngrx/store";
import { State } from "./../store/";
import * as selectors from './../store/selectors';

export class BaseService {
    private headers: Headers;

    constructor(
        private http: Http,
        protected store?: Store<State>) {

        this.headers = new Headers();
        this.headers.append('Content-Type', 'text/xml');
        this.headers.append('Access-Control-Allow-Origin', '*');
        console.log("base:service", store);
    }

    private makeOptions(options?: RequestOptionsArgs) {
        options = options != null ? _.clone<RequestOptionsArgs>(options) : {};
        if (options.headers) {
            this.headers.forEach((values, name) => {
                values.forEach(value => {
                    options.headers.append(name, value);
                });
            });
        } else {
            options.headers = this.headers;
        }

        return options;
    }

    protected postData<T>(url: string, body: any, options?: RequestOptionsArgs): Observable<T> {
        options = this.makeOptions(options);

        return this.store.select(selectors.getAccountAuthToken)
            .first().switchMap(authToken => {
                if (authToken)
                    options.headers.append("Auth-Token", authToken);

                return this.http.post(url, body, options)
                    .map(res => this.parseResponse(res))
                    .catch(this.handleError)
            });
    }

    protected getData<T>(url: string, options?: RequestOptionsArgs): Observable<T> {
        options = this.makeOptions(options);

        return this.store.select(selectors.getAccountAuthToken)
            .first().switchMap(authToken => {
                if (authToken)
                    options.headers.append("Auth-Token", authToken);

                return this.http.get(url, options)
                    .map(res => this.parseResponse(res))
                    .catch(this.handleError)
            });
    }

    private parseResponse(res: Response) {
        console.log("response", res);
        let contentType = res.headers.get("Content-Type");
        if (contentType.indexOf("application/json") > -1) {
            return res.json();
        } else if (
            contentType.indexOf("application/xml") > -1 ||
            contentType.indexOf("text/xml") > -1) {
            var x2js = new X2JS();
            var text = res.text();
            var jsonObj: any = x2js.xml2js<any>(text);
            jsonObj = jsonObj[Object.keys(jsonObj)[0]];

            return jsonObj;
        }

        throw new Error("Unsupported response content type - " + contentType);
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

    protected joinUrl(...parts: string[]) {
        return parts.join("");
    }
}