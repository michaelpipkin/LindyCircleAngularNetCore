import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TableSortService {

    constructor() { }

    sort(data: any[], col: string, sort: string) {
        var asc = Reflect.get(this, sort);
        Reflect.set(this, sort, !asc);
        data = data.sort(function (a: any, b: any) {
            if (asc)
                return (a[col] > b[col]) ? 1 : ((a[col] < b[col]) ? -1 : 0);
            else
                return (b[col] > a[col]) ? 1 : ((b[col] < a[col]) ? -1 : 0);
        });
        return data;
    }
}
