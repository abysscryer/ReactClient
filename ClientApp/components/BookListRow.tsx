import * as React from 'react';
import { IBook } from "./BookListType";

interface BookListRowProps {
    book: IBook;
    bookSelectedHandler(book:IBook):void;
}

export class BookListRow extends React.Component<BookListRowProps, {}>{
    render() {
        return (
            <ul className="row list-group">
                <li className="col-xs-3 list-group-item">{this.props.book.price}</li>
                <li className="col-xs-3 list-group-item">{this.props.book.amount}</li>
                <li className="col-xs-1 list-group-item"><button onClick={ e => this.props.bookSelectedHandler(this.props.book) }>?</button></li>
            </ul>
        )
    }
}