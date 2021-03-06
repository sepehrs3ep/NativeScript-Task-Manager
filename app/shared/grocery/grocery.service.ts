import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { _throw } from 'rxjs/observable/throw';
import { Config } from "~/shared/config";
import { Grocery } from "~/shared/grocery/grocery";

@Injectable()

export class GroceryService {
	// baseUrl = Config.apiUrl + "appdata/" + Config.appKey + "/Groceries";
	baseWorkUrl = "http://192.168.1.40:8081/grocery/";
	baseHomeUrl = "http://192.168.43.243:8081/grocery/";
	baseAshkanUrl = "http://192.168.0.104:8081/grocery/"
	baseUrl = this.baseWorkUrl;
	//hello worlds for testing.
	constructor(private http: Http, private HTtp: HttpClient) { }


	load() {
		// Kinvey-specific syntax to sort the groceries by last modified time. Don’t worry about the details here.
		let params = new URLSearchParams();
		params.append("sort", "{\"_kmd.lmt\": 1}");

		return this.http.get(this.baseUrl, {
			headers: this.getCommonHeaders(),
			params: params
		})
			.map(res => res.json())
			.map(data => {
				let groceryList = Array<Grocery>();
				data.forEach((grocery) => {
					groceryList.push(new Grocery(grocery.id, grocery.name, grocery.date, grocery.descripton, grocery.number));

				});
				return groceryList;
			})
			.catch(this.handleErrors);
	}

	getCommonHeaders() {
		let headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", "Kinvey " + Config.token);
		return headers;
	}

	handleErrors(error: Response) {
		console.log(JSON.stringify(error.json()));
		console.log("it's come here!");
		return Observable.throw(error);
	}
	add(item: Grocery) {
		// this.baseUrl = "http://192.168.43.243:8081/grocery";
		return this.http.post(
			this.baseUrl,
			JSON.stringify(item),
			{ headers: this.getCommonHeaders() }
		)
			.map(res => res.json())
			/*map first convert to json then insetad of directly send the data of server send this data that declare it here*/
			/* .map(data => {
				return new Grocery(data.id, name, data.date, data.description, data.number);
			}) */
			.catch((error: any) => {
				if (error.status === 400) {
					return _throw(error.status);
				} else {
					this.handleErrors(error);
				}
			});
	}

	delete(id: string): Observable<any> {
		console.log(this.baseUrl + id);
		return this.http.delete(this.baseUrl + id)
			.map((id) => {
				return id
					;
			})
			.catch(this.handleErrors);
	}
	get(id: string): Observable<any> {
		// this.baseUrl = "http://192.168.43.243:8081/grocery/";
		return this.http.get(this.baseUrl + id)
			.map(res => res.json())
			/* .map(data => {
				return new Grocery(data.id, name);
			}) */
			.catch(this.handleErrors);
	}
	update(item: Grocery): Observable<any> {
		// this.baseUrl = "http://192.168.43.243:8081/grocery";
		return this.http.put(
			this.baseUrl,
			JSON.stringify(item),
			{ headers: this.getCommonHeaders() }
		)

			.map(res => res.json())
			/*map first convert to json then insetad of directly send the data of server send this data that declare it here*/
			/* 	.map(data => {
					return new Grocery(data.id, name, data.date, description, number);
				}) */
			.catch(this.handleErrors);

	}

	// return fetch(this.baseUrl + id, {
	// 	method: 'delete'
	// }).then(response =>
	// 	response.json().then(json => {
	// 		return json;
	// 	})
	// );
}
