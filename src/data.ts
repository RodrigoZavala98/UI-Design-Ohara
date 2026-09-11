/* Formato físico o digital del ejemplar */
export type Edition =
  | "Tapa blanda"
  | "Tapa dura"
  | "Edición de bolsillo"
  | "eBook"
  | "Audiolibro"
  | "CD"
  | "DVD";

export const EDITIONS: Edition[] = [
  "Tapa blanda",
  "Tapa dura",
  "Edición de bolsillo",
  "eBook",
  "Audiolibro",
  "CD",
  "DVD",
];

export const GENRES = [
  "Literatura",
  "Narrativa",
  "Ensayo",
  "Ciencia",
  "Historia",
  "Poesía",
  "Biografía",
  "Infantil",
];

export const LANGUAGES = [
  "Español",
  "Inglés",
  "Francés",
  "Italiano",
  "Portugués",
  "Alemán",
];

/* Frase o cita subrayada por el lector */
export type Quote = {
  id: string;
  text: string;
  page?: number;
};

/* Una sesión de lectura registrada en el historial */
export type ReadingEntry = {
  id: string;
  date: string;      /* ISO — yyyy-mm-dd */
  fromPage: number;
  toPage: number;
};

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
  edition: Edition;
  language: string;
  synopsis: string;
  review?: string;
  quotes: Quote[];
  /* Seguimiento de lectura */
  currentPage: number;
  readingLog: ReadingEntry[];
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
    currentPage: 471,
    readingLog: [
      { id: "r1", date: "2026-08-24", fromPage: 0,   toPage: 120 },
      { id: "r2", date: "2026-08-31", fromPage: 120, toPage: 288 },
      { id: "r3", date: "2026-09-07", fromPage: 288, toPage: 471 },
    ],
    rating: 5,
    read: true,
    color: "#5a7a5f",
    edition: "Tapa dura",
    language: "Español",
    synopsis:
      "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo mítico de Macondo, fundado por José Arcadio Buendía en medio de la ciénaga. Entre pergaminos indescifrables, guerras civiles, mariposas amarillas y amores imposibles, García Márquez levanta el retrato de una estirpe condenada a repetir sus nombres y sus errores hasta la última soledad.",
    review:
      "Lo releí después de diez años y el final me volvió a dejar sin aire. Es un libro que cambia según la edad con la que lo abras.",
    quotes: [
      {
        id: "q1",
        text: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.",
        page: 9,
      },
      {
        id: "q2",
        text: "Las estirpes condenadas a cien años de soledad no tenían una segunda oportunidad sobre la tierra.",
        page: 471,
      },
    ],
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
    currentPage: 502,
    readingLog: [
      { id: "r4", date: "2026-06-14", fromPage: 0,   toPage: 210 },
      { id: "r5", date: "2026-06-29", fromPage: 210, toPage: 502 },
    ],
    rating: 4,
    read: true,
    color: "#7a6a8a",
    edition: "Tapa blanda",
    language: "Italiano",
    synopsis:
      "Invierno de 1327. El franciscano Guillermo de Baskerville llega con su novicio Adso a una abadía benedictina del norte de Italia donde los monjes aparecen muertos en circunstancias que parecen seguir el orden del Apocalipsis. La investigación desciende hasta una biblioteca laberíntica que guarda un libro que nadie debería leer.",
    quotes: [
      {
        id: "q3",
        text: "Los libros no están hechos para que uno crea en ellos, sino para ser sometidos a examen.",
        page: 316,
      },
    ],
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
    currentPage: 498,
    readingLog: [
      { id: "r6", date: "2026-05-03", fromPage: 0,   toPage: 160 },
      { id: "r7", date: "2026-05-18", fromPage: 160, toPage: 498 },
    ],
    rating: 5,
    read: true,
    color: "#5a7a96",
    edition: "eBook",
    language: "Inglés",
    synopsis:
      "Un recorrido por los setenta mil años que separan a los primeros Homo sapiens de la sociedad global contemporánea. Harari organiza el relato en torno a tres grandes revoluciones —la cognitiva, la agrícola y la científica— y sostiene que lo que distingue a nuestra especie es la capacidad de creer colectivamente en ficciones: dioses, naciones, dinero y derechos.",
    review:
      "Discutible en varios tramos, pero la idea de las ficciones compartidas me reordenó la cabeza. Buen libro para subrayar y pelear con él.",
    quotes: [
      {
        id: "q4",
        text: "No hay dioses en el universo, ni naciones, ni dinero, ni derechos humanos, ni leyes, ni justicia fuera de la imaginación común de los seres humanos.",
        page: 34,
      },
    ],
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
    currentPage: 64,
    readingLog: [
      { id: "r8", date: "2026-09-02", fromPage: 0,  toPage: 38 },
      { id: "r9", date: "2026-09-08", fromPage: 38, toPage: 64 },
    ],
    rating: 4,
    read: false,
    color: "#4a7a7a",
    edition: "Edición de bolsillo",
    language: "Español",
    synopsis:
      "Hawking explica sin ecuaciones el origen y el destino del universo: el Big Bang, la expansión del espacio, los agujeros negros, la flecha del tiempo y la búsqueda de una teoría que reconcilie la relatividad general con la mecánica cuántica. Un intento de contar de dónde venimos usando el lenguaje de todos los días.",
    quotes: [],
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
    currentPage: 124,
    readingLog: [
      { id: "r10", date: "2026-07-11", fromPage: 0, toPage: 124 },
    ],
    rating: 5,
    read: true,
    color: "#8a6f5a",
    edition: "Tapa blanda",
    language: "Español",
    synopsis:
      "Juan Preciado viaja a Comala para cumplir la promesa hecha a su madre moribunda: encontrar a su padre, Pedro Páramo. Lo que halla es un pueblo de polvo habitado por murmullos, donde los vivos y los muertos comparten las mismas calles y el tiempo se ha detenido sobre la memoria de un cacique.",
    quotes: [
      {
        id: "q5",
        text: "Vine a Comala porque me dijeron que acá vivía mi padre, un tal Pedro Páramo.",
        page: 7,
      },
    ],
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
    currentPage: 635,
    readingLog: [
      { id: "r11", date: "2026-03-08", fromPage: 0,   toPage: 220 },
      { id: "r12", date: "2026-03-22", fromPage: 220, toPage: 430 },
      { id: "r13", date: "2026-04-05", fromPage: 430, toPage: 635 },
    ],
    rating: 5,
    read: true,
    color: "#7a9bb5",
    edition: "Tapa dura",
    language: "Español",
    synopsis:
      "Horacio Oliveira busca a la Maga por el París de los años cincuenta y, más tarde, se reencuentra consigo mismo en Buenos Aires. Cortázar propone dos lecturas posibles —del capítulo 1 al 56, o saltando según el tablero de dirección— y convierte la novela en un juego donde el lector decide el orden del mundo.",
    quotes: [
      {
        id: "q6",
        text: "¿Encontraría a la Maga? Tantas veces me había bastado asomarme, viniendo por la rue de Seine, al arco que da al Quai de Conti.",
        page: 15,
      },
    ],
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
    currentPage: 0,
    readingLog: [],
    rating: 4,
    read: false,
    color: "#4a7a7a",
    edition: "Audiolibro",
    language: "Inglés",
    synopsis:
      "La obra que fundó la biología moderna. Darwin reúne veinte años de observaciones —de los pinzones de las Galápagos a los palomos de cría— para sostener que las especies no son fijas, sino el resultado de la selección natural operando sobre la variación heredable a lo largo de un tiempo inmenso.",
    quotes: [],
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
    currentPage: 96,
    readingLog: [
      { id: "r14", date: "2026-08-19", fromPage: 0,  toPage: 52 },
      { id: "r15", date: "2026-08-20", fromPage: 52, toPage: 96 },
    ],
    rating: 5,
    read: true,
    color: "#8a6f5a",
    edition: "Edición de bolsillo",
    language: "Español",
    synopsis:
      "Veinte poemas de amor y una canción desesperada apareció cuando Neruda tenía diecinueve años y cambió para siempre la poesía amorosa en castellano. El cuerpo amado se confunde con el paisaje del sur de Chile: la lluvia, los pinos, el mar y la distancia que siempre acaba imponiéndose.",
    review:
      "El poema 20 lo sé de memoria desde la preparatoria. Vuelvo a este libro cada vez que necesito recordar cómo suena el español.",
    quotes: [
      {
        id: "q7",
        text: "Puedo escribir los versos más tristes esta noche.",
        page: 78,
      },
      {
        id: "q8",
        text: "Me gustas cuando callas porque estás como ausente.",
        page: 45,
      },
    ],
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
