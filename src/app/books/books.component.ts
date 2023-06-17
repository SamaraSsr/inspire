import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Book, BookData } from '../book.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooksComponent {
  
  @Input() books!: Book[];
  @Input() sortTypes!: string[];
  @Input() sortBy!: string;
  @Input() bookResponse!: BookData;
  @Output() sortBooks = new EventEmitter();
  @Output() purchase = new EventEmitter();
  
  isDesktopView: boolean = true;
  
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isDesktopView = !result.matches;
    });
  }
}
