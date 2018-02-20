import * as React from 'react';
import { IBook } from "./BookListType";
import { BookListRow } from "./BookListRow";

interface BookListRowsProps {
    books: IBook[];
    bookSelectedHandler(book:IBook):void;
}

export class BookListRows extends React.Component<BookListRowsProps, {}>{
    render() {
        return (
            <div>
                <ul>
                    {this.props.books.map((book) => {
                        return <BookListRow key={book.price} book={book} bookSelectedHandler={this.props.bookSelectedHandler} />
                    })}
                </ul>
            </div>
        )
    }
}