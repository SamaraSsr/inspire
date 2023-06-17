import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book, BookData } from '../book.interface';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
})
export class BooksComponent {

  @Input() books!: Book[];
  @Input() bookResponse!: BookData;
  @Input() column!: number | null;
  @Output() purchase = new EventEmitter();
  @Output() remove = new EventEmitter();

  isDesktopView: boolean = true;

  constructor() { }

  ngOnInit() {
  }
}
