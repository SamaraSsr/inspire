export interface BookResponse  {
    data: BookData
    status: string
  }
  
  export interface BookData {
    author: string
    birthday: string
    birthPlace: string
    books: Book[]
  }
  
  export interface Book {
    imageUrl: string
    title: string
    purchaseLink: string
    PublishDate: string
  }
  