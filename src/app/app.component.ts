import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { Book, BookData } from './book.interface';
import { filter, map, pipe, share } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sortTypes!: string[];

  constructor(private bookService: BooksService) { }

  /**
   * The books that are currently being displayed.
   */
  books!: Book[];

  /**
   * The sort order for the books.
   */
  sortBy: string = 'title';

  /**
   * The data for the books.
   */
  bookResponseData!: BookData;

  /**
   * Initializes the component by getting the books from the service.
   */
  ngOnInit(): void {
    this.sortTypes = ['Title', 'Date'];
    // Get the books from the service.
    this.bookService.getBooks();

    // Subscribe to the books$ observable and filter out any empty results.
    this.bookService.books$
      .pipe(
        // Filter the books to only those that have a length greater than 0.
        filter(books => books !== undefined)
      )
      .subscribe((books: Book[]) => {
        // Set the books and bookResponseData properties.
        this.books = books;
        this.bookResponseData = this.bookService.bookData;
      });
  }

  /**
   * Unsubscribes from the books$ observable when the component is destroyed.
   */
  ngOnDestroy(): void {
    // Unsubscribe from the books$ observable.
    this.bookService.books$.unsubscribe();
  }

  /**
   * Sorts the books by the specified sort order.
   * @param sortBy The sort order.
   */
  public sortBooks = (sortBy: string) => {
    // Sort the books by the specified sort order.
    this.bookService.getSortedBooks(sortBy);
  };

  public purchaseBook = (book: Book) => {
    window.open(book.purchaseLink, '_blank');
  }
}

