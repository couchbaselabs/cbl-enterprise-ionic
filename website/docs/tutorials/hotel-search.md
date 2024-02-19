---
title: Hotel Search Tutorial
sidebar_label: Hotel Search
---

Learn how to build an Angular app with Capacitor that allows users to search and bookmark hotels using data loaded from a Couchbase Lite database. The complete reference app is [available here](https://github.com/ionic-team/demo-couchbaselite-hotels).

> Not an Angular developer? Couchbase Lite concepts and syntax are applicable to all web frameworks.

By completing this tutorial, you'll create an app that:
* Loads and stores data, including bookmarked hotels, in a Couchbase Lite database.
* Uses UI components from Ionic: search bar, bookmarks, icons, list items, and more.
* Runs on iOS, Android, and native Windows apps all from the same codebase.

## Setup

Begin by installing the Ionic CLI then creating an Ionic app:

```shell
npm install -g @ionic/cli
ionic start
```

In this tutorial, we'll choose the "tabs" starter template, but any template will suffice. Next, install Capacitor, Ionic's native runtime tool for building cross-platform web native apps:

```shell
# Add Capacitor along with iOS and Android native projects
ionic integrations enable capacitor
npx capacitor add ios
npx capacitor add android
```

## Integrate Couchbase Lite

With the application setup, it's time to add the Couchbase Lite solution:

```shell
npm install @ionic-enterprise/couchbase-lite
npx cap sync
```

Next, create a model class to represent `Hotel` data:

```typescript
// src/app/data/hotels.ts
export class Hotel {
  id?: number;
  name: string;
  address: string;
  phone: string;
  bookmarked: boolean = false;
}
```

It's recommended to create a service that encapsulates all Couchbase Lite functionality, so create it:

```shell
ionic generate service services/database
```

Within `database.service.ts`, import the Couchbase Lite integration and the new `Hotel` model:

```typescript
// src/app/services/database.service.ts
import { Injectable } from '@angular/core';
import {
  Database,
  DatabaseConfiguration,
  MutableDocument
} from '@ionic-enterprise/couchbase-lite';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService { }
```

Next, add some private variables to the beginning of the `DatabaseService` class. `database` will hold an open connection to the Couchbase Lite database so we can perform operations on it, `bookmarkDocument` will be used for allowing users to bookmark hotels, and the two `DOC_TYPE` constants will be used repeatably in database querying. 

```typescript
// src/app/services/database.service.ts
export class DatabaseService {
  private database: Database;
  private DOC_TYPE_HOTEL = "hotel";
  private DOC_TYPE_BOOKMARKED_HOTELS = "bookmarked_hotels";
  private bookmarkDocument: MutableDocument;
}
```

### Initialize the Database

Next, create an initialization function that will run every time the app loads, configuring the Couchbase Lite database.

```typescript
// src/app/services/database.service.ts
private async initializeDatabase() {
  await this.seedInitialData();
}
```

Next, create a function to seed the Couchbase database with hotel data. First, create then open the Couchbase Lite database. You can set an encryption key to encrypt the database with if you'd like, too. Give the database a name like "travel."

```typescript
// src/app/services/database.service.ts
private async seedInitialData() { 
  /* Note about encryption: In a real-world app, the encryption key should not be hardcoded like it is here. 
      One strategy is to auto generate a unique encryption key per user on initial app load, then store it securely in the device's keychain for later retrieval.
      Ionic's Identity Vault (https://ionic.io/docs/identity-vault) plugin is an option. Using IV’s storage API, you can ensure that the key cannot be read or accessed without the user being authenticated first. */
  let dc = new DatabaseConfiguration();
  dc.setEncryptionKey('8e31f8f6-60bd-482a-9c70-69855dd02c39');
  this.database = new Database("travel", dc);
  await this.database.open();
```

Finish up the `seedInitialData` function by inserting hotel data into the database if this is the first time the app has been loaded. Create a new `MutableDocument` for each hotel record, then insert it into the database.

```typescript
// src/app/services/database.service.ts, seedInitialData()
  const len = (await this.getAllHotels()).length;
  if (len === 0) {
    const hotelFile = await import("../data/hotels");

    for (let hotel of hotelFile.hotelData) {
      let doc = new MutableDocument()
        .setNumber('id', hotel.id)
        .setString('name', hotel.name)
        .setString('address', hotel.address)
        .setString('phone', hotel.phone)
        .setString('type', this.DOC_TYPE_HOTEL);
      
      this.database.save(doc);
    }
  }
}
```

Next, implement the `getAllHotels` helper function that returns all hotels from the database. The steps are the same for retrieving data from a Couchbase Lite database: create a query, execute it, then parse the results. `SELECT *` means select all records, `FROM _` means from the current database (Couchbase can query multiple databases at once, but since there is only one, `_` refers to the main one), `WHERE type = '${this.DOC_TYPE_HOTEL}'` means where the type property is equal to 'hotel' (database documents are either of type 'hotel' or 'bookmarked_hotels' in our dataset), and `ORDER BY name` means to return the results in ascending order using the hotel name property.

```typescript
// src/app/services/database.service.ts
private async getAllHotels() {
  const query = this.database.createQuery(`SELECT * FROM _ WHERE type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);
  const result = await query.execute();
  return await result.allResults();
}
```

### Display Hotel Data

With database setup in place, we can retrieve and display hotel data next. Create a public function that the UI will call, `getHotels`, that calls the above work we just created to initialize the Couchbase Lite database and return the list of all hotels.

```typescript
// src/app/services/database.service.ts
public async getHotels(): Promise<Hotel[]> {
  await this.initializeDatabase();

  return await this.retrieveHotelList();
}
```

Next, create a function that queries the database for all hotel records and transforms them into an array of `Hotel` objects. Since Couchbase can query multiple databases at once, the array format is a bit unique. Access each hotel record by using `hotelResults[key]["_"]`.


```typescript
// src/app/services/database.service.ts
private async retrieveHotelList(): Promise<Hotel[]> {
  // Get all hotels
  const hotelResults = this.getAllHotels();
  
  let hotelList: Hotel[] = [];
  for (let key in hotelResults) {
    // Couchbase can query multiple databases at once, so "_" is just this single database.
    // [ { "_": { id: "1", firstName: "Matt" } }, { "_": { id: "2", firstName: "Max" } }]
    let singleHotel = hotelResults[key]["_"] as Hotel;

    hotelList.push(singleHotel);
  }

  return hotelList;
}
```

We now have enough of the `DatabaseService` functionality built to be able to display hotels to the user. Open `tab1.page.ts` then import the `DatabaseService`. Retrieve the hotel data when the page first loads.

```typescript
// src/app/tab1/tab1.page.ts
import { Component } from '@angular/core';
import { Hotel } from '../models/hotel';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  hotels: Hotel[] = [];
  hotelsDisplayed: Hotel[] = [];

  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.hotels = await this.databaseService.getHotels();
    this.hotelsDisplayed = this.hotels;
  }
}
```

To display the hotels on the `tab1.page.html` page, use the `ion-list` component:

```html
<!-- src/app/tab1/tab1.page.html -->
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>Hotels</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Hotels</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-list>
    <ion-item *ngFor="let hotel of hotelsDisplayed;">
      <ion-label>
        <h2>{{ hotel.name }}</h2>
        <p>{{ hotel.address }}</p>
        <p>{{ hotel.phone }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</ion-content>
```

A list of all hotels are now displayed on the page.

## Search Hotels

Now that all hotels are displayed, we can build some interactive features such as search functionality. Open `database.service.ts` then create a `searchHotels` function. First, build a N1QL query that searches the Couchbase Lite database for hotels that match the provided hotel name the user types into a search bar. The query is similar to the one that retrieves all hotel data, except for the `LIKE` comparison operator which performs string wildcard pattern matching comparisons. In this case, we're searching broadly - any hotel name that includes any of the characters the user enters. `%` here will match zero or more characters.

Finally, return the list of filtered hotels back to the UI layer.

```typescript
// src/app/services/database.service.ts
public async searchHotels(name): Promise<Hotel[]> {
  const query = this.database.createQuery(
      `SELECT * FROM _ WHERE name LIKE '%${name}%' AND type = '${this.DOC_TYPE_HOTEL}' ORDER BY name`);
  const results = await (await query.execute()).allResults();

  let filteredHotels: Hotel[] = [];
  for (var key in results) {
    let singleHotel = results[key]["_"] as Hotel;

    filteredHotels.push(singleHotel);
  }

  return filteredHotels;
}
```

Over in `tab1.page.html`, add an `ion-searchbar` search bar component above the `ion-list`. The `ionChange` event fires each time the user enters new text into the search bar. 

```html
<!-- src/app/tab1/tab1.page.html -->
<ion-searchbar placeholder="Search Name..." 
               (ionChange)="searchQueryChanged($event.target.value)">
</ion-searchbar>
```

Within `searchQueryChanged`, pass along the hotel name string into the database service. Since `hotelsDisplayed` represents the array of filtered list of hotels to display to the end user, the UI will update automatically after each character is typed by the user.

```typescript
// src/app/tab1/tab1.page.ts
async searchQueryChanged(hotelName) {
  this.hotelsDisplayed = await this.databaseService.searchHotels(hotelName);
}
```

With this code in place, the user can successfully filter through hotels.

## Bookmark Hotels

The final feature we'll add is the ability to bookmark hotels that the user is interested in staying at. This includes saving the bookmark data in Couchbase Lite as well as offering the ability to toggle between all hotels and bookmarked hotels in the UI. 

### Retrieve Bookmark Data

First, add a call to `findOrCreateBookmarkDocument()` in the initialize method:

```typescript
// src/app/services/database.service.ts
private async initializeDatabase() {
  await this.seedInitialData();

  // Create the "bookmarked_hotels" document if it doesn't exist
  this.bookmarkDocument = await this.findOrCreateBookmarkDocument();
}
```

The bookmarked hotels will be stored in a Couchbase Lite document as an array of hotel ids. Next, implement the method which will retrieve the bookmark document or create it if it doesn't exist. 

```typescript
// src/app/services/database.service.ts
private async findOrCreateBookmarkDocument(): Promise<MutableDocument> {
  // Meta().id is a GUID like e15d1aa2-9be3-4e02-92d8-82bd9d05d8e3
  const bookmarkQuery = this.database.createQuery(
    `SELECT META().id AS id FROM _ WHERE type = '${this.DOC_TYPE_BOOKMARKED_HOTELS}'`);
  const resultSet = await bookmarkQuery.execute();
  const resultList = await resultSet.allResults();

  let mutableDocument: MutableDocument;
  if (resultList.length === 0) {
    mutableDocument = new MutableDocument()
            .setString("type", this.DOC_TYPE_BOOKMARKED_HOTELS)
            .setArray("hotels", new Array());
    this.database.save(mutableDocument);
  } else {
    const docId = resultList[0]["id"]; 
    const doc = await this.database.getDocument(docId);
    mutableDocument = MutableDocument.fromDocument(doc);
  }

  return mutableDocument;
}
```

Next, update the `retrieveHotelList()` method to toggle the `bookmarked` hotel property if the hotel's id is found in the bookmarked hotels document. The `bookmarked` boolean property determines whether to display the hotel as bookmarked in the UI. Here's the complete function:

```typescript
// src/app/services/database.service.ts
private async retrieveHotelList(): Promise<Hotel[]> {
  // Get all hotels
  const hotelResults = this.getAllHotels();

  // Get all bookmarked hotels
  let bookmarks = this.bookmarkDocument.getArray("hotels") as number[];
  
  let hotelList: Hotel[] = [];
  for (let key in hotelResults) {
    // Couchbase can query multiple databases at once, so "_" is just this single database.
    // [ { "_": { id: "1", name: "Matt" } }, { "_": { id: "2", name: "Max" } }]
    let singleHotel = hotelResults[key]["_"] as Hotel;

    // Set bookmark status
    singleHotel.bookmarked = bookmarks.includes(singleHotel.id);

    hotelList.push(singleHotel);
  }

  return hotelList;
}
```

Finally, update the UI to display each hotel's bookmark status. Show a transparent bookmark icon from Ionicons next to each hotel listing. If the hotel has been bookmarked, then show a red filled-in icon.

```html
<!-- src/app/tab1/tab1.page.html -->
<ion-list>
  <ion-item *ngFor="let hotel of hotelsDisplayed;">
    <ion-label>
      <h2>{{ hotel.name }}</h2>
      <p>{{ hotel.address }}</p>
      <p>{{ hotel.phone }}</p>
    </ion-label>
    <ion-icon *ngIf="!hotel.bookmarked" name="bookmark-outline" (click)="toggleBookmark(hotel)"></ion-icon>
    <ion-icon *ngIf="hotel.bookmarked" name="bookmark" color="danger" (click)="toggleBookmark(hotel)"></ion-icon>
  </ion-item>
</ion-list>
```

Now that bookmarked hotel data is being displayed, we can introduce more interactivity.

### Save Bookmarked Hotels

When the user taps on the bookmark icon next to a hotel entry, we need to update the Couchbase Lite database to reflect that state change. First, implement the toggle function to invert the hotel's bookmark status, then save the change using the database service: 

```typescript
// src/app/tab1/tab1.page.ts
async toggleBookmark(hotel) {
  hotel.bookmarked = !hotel.bookmarked;

  if (hotel.bookmarked) {
    await this.databaseService.bookmarkHotel(hotel.id);
  }
  else {
    await this.databaseService.unbookmarkHotel(hotel.id);
  }
}
```

Next, implement a function to apply the bookmark change to the Couchbase Lite database. Add the hotel id to the array of hotels that are bookmarked:

```typescript
// src/app/services/database.service.ts
public async bookmarkHotel(hotelId: number) {
  let hotelArray = this.bookmarkDocument.getArray("hotels") as number[];
  hotelArray.push(hotelId); 
  this.bookmarkDocument.setArray("hotels", hotelArray);

  this.database.save(this.bookmarkDocument);
}
```

### Remove Bookmark

If the user can bookmark a hotel, they should also be able to remove the bookmark. A similar implementation as bookmarking hotels, but instead of adding the hotel id, remove it from the bookmark array.

```typescript
// src/app/services/database.service.ts
public async unbookmarkHotel(hotelId: number) {
  let hotelArray = this.bookmarkDocument.getValue("hotels") as number[];
  hotelArray = hotelArray.filter(id => id !== hotelId);
  this.bookmarkDocument.setArray("hotels", hotelArray);

  this.database.save(this.bookmarkDocument);
}
```

### Filter by Bookmarked Hotels

The last feature to add is the ability to toggle between all hotels and only bookmarked hotels. Begin by creating a variable to hold the state of the bookmark filter toggle and default it to false.

```typescript
// src/app/tab1/tab1.page.ts
export class Tab1Page {
  toggleBookmarkFilter: boolean = false;
  // snip - other variables
```

Next, implement a function that toggles between bookmark states. Invert the bookmark filter property and check if it's `true`. If true, filter the hotel list for only those that have the `bookmarked` property set to true. Refresh the UI to reflect the updated hotel list.

```typescript
// src/app/tab1/tab1.page.ts
async toggleShowBookmarks() {
  this.toggleBookmarkFilter = !this.toggleBookmarkFilter;

  if (this.toggleBookmarkFilter) {
    const filtered = this.hotels.filter(h => h.bookmarked == true);
    this.hotelsDisplayed = filtered;
  }
  else {
    this.hotelsDisplayed = this.hotels;
  }
}
```

Finally, update the UI so that when a bookmark filter icon is tapped, the `toggleShowBookmarks()` function is called. Display the same bookmark icon also displayed next to each hotel entry.

```html
<!-- src/app/tab1/tab1.page.html -->
<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-buttons collapse="true" (click)="toggleShowBookmarks()" slot="end">
        <ion-button slot="end">
          <ion-icon *ngIf="toggleBookmarkFilter" name="bookmarks" size="large" color="danger"></ion-icon>
          <ion-icon *ngIf="!toggleBookmarkFilter" name="bookmarks-outline" size="large" color="danger"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title size="large">Hotels</ion-title>
    </ion-toolbar>
  </ion-header>
  <!-- snip -->
</ion-content>
```

## Wrap Up

That's it! You've built an Angular app that allows users to search and bookmark hotels using data loaded from a Couchbase Lite database. Happy app building!
