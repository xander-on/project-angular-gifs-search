import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

    public gifList:Gif[] = []

    private _tagsHistory:string[] = [];
    private apiKey:string         = 'xyCIIKFbRy9m3Kb6NVrck1JIoKhHdMrK';
    private serviceUrl:string     = 'https://api.giphy.com/v1/gifs';

    constructor( private http:HttpClient ) {
        this.loadLocalStorage();
     }

    get tagsHistory(){
        return [...this._tagsHistory];
    }

    private organizeHistory( tag:string ){
        tag = tag.toLowerCase();

        if( this._tagsHistory.includes(tag) ){
            this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag );
        }

        this._tagsHistory.unshift( tag );
        this._tagsHistory = this.tagsHistory.splice(0, 10);
        this.saveLocalStorage();
    }


    private saveLocalStorage():void {
        localStorage.setItem('historyGifsSearch', JSON.stringify(this._tagsHistory) );
    }


    private loadLocalStorage():void{
        if( !localStorage.getItem('historyGifsSearch') ) return;

        this._tagsHistory = JSON.parse( localStorage.getItem('historyGifsSearch')! );

        if( this._tagsHistory.length === 0 ) return;

        this.searchTag( this._tagsHistory[0] );
    }


    searchTag( tag:string ):void {
        if( tag.length === 0 ) return;
        this.organizeHistory(tag);

        const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit',   '12')
            .set('q',       tag)

        this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
            .subscribe( resp => {
                this.gifList = resp.data;
                // console.log({gifs: this.gifList});
            });
    }

}
