import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent {
  title: string;
  purchaseLink: string;
  publishDate: string;
  imageFile: string;
  author: string;
  birthday: string;
  birthPlace: string;
  onAdd = new EventEmitter();
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageFile = data.imageFile || '';
    this.title = data.title || '';
    this.purchaseLink = data.purchaseLink || '';
    this.publishDate = data.publishDate || '';
    this.author = data.author || '';
    this.birthday = data.birthday || '';
    this.birthPlace = data.birthPlace || '';
    this.isEdit = data.edit || false;
  }
  addBook = (): void => {
    if (this.validateForm()) {
      const bookDetails = {
        imageUrl: this.imageFile,
        title: this.title,
        purchaseLink: this.purchaseLink,
        publishDate: this.publishDate,
      };
      this.onAdd.emit(bookDetails);
    }
  }

  validateForm(): boolean {
    if (!this.imageFile || !this.title || !this.purchaseLink || !this.publishDate) {
      return false;
    }
    return true;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageFile = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
