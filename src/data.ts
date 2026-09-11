export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  cover: string;
  shelfId: string;
  pages: number;
  isbn: string;
  rating: number;
  read: boolean;
  color: string;
};

export type Shelf = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Loan = {
  id: string;
  bookId: string;
  borrower: string;
  lentDate: string;
  dueDate: string;
  returned: boolean;
  avatar: string;
};

export const shelves: Shelf[] = [
  { id: "s1", name: "Literatura",  icon: "📚", color: "#5a7a5f" },
  { id: "s2", name: "Ensayo",      icon: "🖊️",  color: "#5a7a96" },
  { id: "s3", name: "Ciencia",     icon: "🔬", color: "#4a7a7a" },
  { id: "s4", name: "Historia",    icon: "🏛️",  color: "#7a6a8a" },
  { id: "s5", name: "Poesía",      icon: "✨", color: "#8a6f5a" },
];

export const books: Book[] = [
  {
    id: "b1",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    year: 1967,
    genre: "Literatura",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop&auto=format",
    shelfId: "s1",
    pages: 471,
    isbn: "978-0-06-088328-7",
    rating: 5,
    read: true,
    color: "#5a7a5f",
  },
  {
    id: "b2",
    title: "El nombre de la rosa",
    author: "Umberto Eco",
    year: 1980,
    genre: "Literatura",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop&auto=format",
    shelfId: "s1",
    pages: 502,
    isbn: "978-0-15-144647-6",
    rating: 4,
    read: true,
    color: "#7a6a8a",
  },
  {
    id: "b3",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    year: 2011,
    genre: "Ensayo",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop&auto=format",
    shelfId: "s2",
    pages: 498,
    isbn: "978-0-06-231609-7",
    rating: 5,
    read: true,
    color: "#5a7a96",
  },
  {
    id: "b4",
    title: "Una breve historia del tiempo",
    author: "Stephen Hawking",
    year: 1988,
    genre: "Ciencia",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=280&fit=crop&auto=format",
    shelfId: "s3",
    pages: 212,
    isbn: "978-0-553-38016-3",
    rating: 4,
    read: false,
    color: "#4a7a7a",
  },
  {
    id: "b5",
    title: "Pedro Páramo",
    author: "Juan Rulfo",
    year: 1955,
    genre: "Literatura",
    cover: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=200&h=280&fit=crop&auto=format",
    shelfId: "s1",
    pages: 124,
    isbn: "978-0-8021-5016-9",
    rating: 5,
    read: true,
    color: "#8a6f5a",
  },
  {
    id: "b6",
    title: "Rayuela",
    author: "Julio Cortázar",
    year: 1963,
    genre: "Literatura",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&h=280&fit=crop&auto=format",
    shelfId: "s1",
    pages: 635,
    isbn: "978-0-394-72521-1",
    rating: 5,
    read: true,
    color: "#7a9bb5",
  },
  {
    id: "b7",
    title: "El origen de las especies",
    author: "Charles Darwin",
    year: 1859,
    genre: "Ciencia",
    cover: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=200&h=280&fit=crop&auto=format",
    shelfId: "s3",
    pages: 502,
    isbn: "978-0-14-043205-3",
    rating: 4,
    read: false,
    color: "#4a7a7a",
  },
  {
    id: "b8",
    title: "Veinte poemas de amor",
    author: "Pablo Neruda",
    year: 1924,
    genre: "Poesía",
    cover: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=200&h=280&fit=crop&auto=format",
    shelfId: "s5",
    pages: 96,
    isbn: "978-0-14-058625-2",
    rating: 5,
    read: true,
    color: "#8a6f5a",
  },
];

export const loans: Loan[] = [
  {
    id: "l1",
    bookId: "b1",
    borrower: "Sofía Mendoza",
    lentDate: "2026-08-10",
    dueDate: "2026-09-10",
    returned: false,
    avatar: "SM",
  },
  {
    id: "l2",
    bookId: "b3",
    borrower: "Carlos Vega",
    lentDate: "2026-07-20",
    dueDate: "2026-08-20",
    returned: false,
    avatar: "CV",
  },
  {
    id: "l3",
    bookId: "b6",
    borrower: "Lucía Reyes",
    lentDate: "2026-08-01",
    dueDate: "2026-09-01",
    returned: true,
    avatar: "LR",
  },
  {
    id: "l4",
    bookId: "b8",
    borrower: "Mateo Ruiz",
    lentDate: "2026-09-01",
    dueDate: "2026-10-01",
    returned: false,
    avatar: "MR",
  },
];
