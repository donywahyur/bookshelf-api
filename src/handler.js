const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {   
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const newBook = { name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished };
    books.push(newBook)
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;

}

const getAllBooksHandler = (request, h) => {
    const { name , reading , finished } = request.query;
    let book = books;

    if(name !== undefined){
        book = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
    }
    if(reading !== undefined){
        book = books.filter((n) => n.reading ===(parseInt(reading) === 1));
    }
    if(finished !== undefined){
        book = books.filter((n) => n.finished === (parseInt(finished) === 1));
    }

    const response = h.response({
        status: 'success',
        data: {
            "books": book
        }
    });
    response.code(200);
    return response;
}

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    let book = books.filter((n) => n.id === bookId)[0];


    if (book !== undefined) {
        return {
            query : "query",
            status: 'success',
            data: {
                "books": book
            }
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;


    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }


    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished,
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
}

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    books.splice(index, 1);
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
}




module.exports = {addBooksHandler , getAllBooksHandler, getBookByIdHandler , editBookByIdHandler , deleteBookByIdHandler};