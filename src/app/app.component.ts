import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { Book, BookData } from './book.interface';
import { filter } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sortTypes!: string[];

  constructor(private bookService: BooksService, private dialog: MatDialog, private _snackBar: MatSnackBar) { }

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

  column!: number | null;

  /**
   * Initializes the component by getting the books from the service.
   */
  ngOnInit(): void {
    this.books = [];
    this.sortTypes = ['Title', 'Date'];
    // Get the books from the service.
    this.bookService.getBooks();

    // Subscribe to the books$ observable and filter out any empty results.
    this.bookService.books$
      .pipe(
        // Filter the books to only those that have a length greater than 0.
        filter(books => books?.length > 0)
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

  public add = () => {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: {
        imageFile: '',
        title: '',
        purchaseLink: '',
        publishDate: '',
        edit: false
      }
    });

    dialogRef.componentInstance.onAdd.subscribe((newBook) => {
      this.bookHandler(newBook, undefined, dialogRef, false);
    });
  }

  removeBook = (book: Book) => {
    const index = this.books.findIndex(b => b.title === book.title);
    if (index >= 0) {
      this.books.splice(index, 1);
      this.openSnackBar(`${book.title} has been removed from your collection.`, 'warn')
    }
  }

  openSnackBar = (message: string, style: string) => {
    this._snackBar.open(message, undefined, {
      duration: 5000,
      panelClass: [style]
    });
  }

  editBook = (oldBbook: Book) => {
    const {
      imageUrl,
      title,
      purchaseLink,
      PublishDate,
    } = oldBbook;
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: {
        imageFile: imageUrl,
        title,
        purchaseLink,
        publishDate: PublishDate,
        edit: true
      }
    });
    dialogRef.componentInstance.onAdd.subscribe((newBook) => {
      this.bookHandler(newBook, oldBbook, dialogRef, true);
    });
  }

  private bookHandler(newBook: any, oldBbook: any, dialogRef: MatDialogRef<BookDialogComponent, any>, edit: boolean) {
    const { imageUrl, title, purchaseLink, publishDate } = newBook;
    const book = {
      imageUrl,
      title,
      purchaseLink,
      PublishDate: publishDate,
    };
    if (edit) {
      const index = this.books.findIndex(b => b.title === oldBbook.title);
      this.books[index] = book;
    }
    else {
      this.books.push(book);
    }
    this.openSnackBar(`${edit ? oldBbook.title : newBook.title} has been ${edit ? 'updated' : 'added'} to your collection.`, 'success');
    dialogRef.close();
  }
}

