import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, BookResponse, BookData } from './book.interface';
import { BehaviorSubject } from 'rxjs';
const ifServerFailData = {
  "data": {
    "author": "Roald Dahl",
    "birthday": "September 13, 1916",
    "birthPlace": "Cardiff, United Kingdom",
    "books": [
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91I2ywLs1YL.jpg",
        "title": "The BFG",
        "purchaseLink": "https://www.amazon.com/BFG-Roald-Dahl/dp/0142410381/",
        "PublishDate": "1982"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91C5S-RQeeL.jpg",
        "title": "The Witches",
        "purchaseLink": "https://www.amazon.com/Witches-Roald-Dahl/dp/014241011X/",
        "PublishDate": "1983"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/81Fe-GJQDuL.jpg",
        "title": "Charlie and the Chocolate Factory",
        "purchaseLink": "https://www.amazon.com/Charlie-Chocolate-Factory-Roald-Dahl/dp/0142410314/",
        "PublishDate": "1964"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91cYX8Th0VL.jpg",
        "title": "James and the Giant Peach",
        "purchaseLink": "https://www.amazon.com/James-Giant-Peach-Roald-Dahl/dp/0142410365/",
        "PublishDate": "1961"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/81LWiusthFL.jpg",
        "title": "Matilda",
        "purchaseLink": "https://www.amazon.com/Matilda-Roald-Dahl/dp/0142410373/",
        "PublishDate": "1988"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91VFZJOzyEL.jpg",
        "title": "The Enormous Crocodile",
        "purchaseLink": "https://www.amazon.com/Enormous-Crocodile-Roald-Dahl/dp/0140365567/",
        "PublishDate": "1978"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/81n7O4GGjeL.jpg",
        "title": "George's Marvelous Medicine",
        "purchaseLink": "https://www.amazon.com/Georges-Marvelous-Medicine-Roald-Dahl/dp/0142410357/",
        "PublishDate": "1981"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/81pbYE-DPIL.jpg",
        "title": "The Wonderful Story of Henry Sugar",
        "purchaseLink": "https://www.amazon.com/Wonderful-Story-Henry-Sugar/dp/0141304707/",
        "PublishDate": "1977"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91oa7T-wJ+L.jpg",
        "title": "Danny the Champion of the World",
        "purchaseLink": "https://www.amazon.com/Danny-Champion-World-Roald-Dahl/dp/0142410330/",
        "PublishDate": "1975"
      },
      {
        "imageUrl": "https://m.media-amazon.com/images/I/91TPctYVPZL.jpg",
        "title": "Charlie and the Great Glass Elevator",
        "purchaseLink": "https://www.amazon.com/Charlie-Great-Glass-Elevator-Roald/dp/0142410322/",
        "PublishDate": "1972"
      }
    ]
  },
  "status": "success"
}
@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(
    private http: HttpClient
  ) { }

  public books$ = new BehaviorSubject<Book[]>([]);
  public bookData!: BookData;

  private fetchBooks = () => this.http.get<BookResponse>('https://s3.amazonaws.com/api-fun/books.json').subscribe({
    next: (res) => {
      this.bookData = res.data;
      this.books$.next(res.data.books);
    },
    error: (error) => {
      console.error(error);
      this.bookData = ifServerFailData.data;
      this.books$.next(ifServerFailData.data.books);
    }
  })


  private buildSortedBooks = (sortBy: string): void => {
    this.books$.getValue()
      .sort((a, b) => {
        if (sortBy === "Title") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "Date") {
          return new Date(a.PublishDate).getTime() - new Date(b.PublishDate).getTime();
        }
        return -1;
      });
  }

  public getBooks = () => this.fetchBooks();

  public getSortedBooks = (sortBy: string) => this.buildSortedBooks(sortBy);

}
