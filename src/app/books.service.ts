import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, BookResponse, BookData } from './book.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(
    private http: HttpClient
  ) { }

  public books$ = new BehaviorSubject<Book[]>([]);
  public bookData!: BookData;

  private fetchBooks = () => this.http.get<BookResponse>('https://s3.amazonaws.com/api-fun/books.json').subscribe(res => {
    this.bookData = res.data;
    this.books$.next(res.data.books);
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
