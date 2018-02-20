import * as React from 'react';
import {ICoin, IBook, BookType } from "./BookListType";

interface BookListFormProps{
    coins: ICoin[];
    book: IBook;
    onSendBook(book: IBook):void;
    onChangeBook(book: IBook):void;
}

interface BookListFormState{
    price:any;
    amount:any;
    bookType: any;
    currencyId: number;
    coinId: number;
}

export class BookListForm extends React.Component<BookListFormProps, BookListFormState>{
    constructor(props:BookListFormProps){
        super(props);

        this.state = {
            price: this.props.book.price,
            amount: this.props.book.amount,
            bookType: BookType.Buy,
            currencyId: this.props.book.currencyId,
            coinId: this.props.book.coinId
        };
    }

    // life cycle method
    componentWillReceiveProps(props: BookListFormProps) {
        this.setState({
            price: props.book.price,
            amount: props.book.amount,
            bookType: props.book.bookType,
            currencyId: props.book.currencyId,
            coinId:props.book.coinId
        });
    }

    // send book
    private bookSendHandler = ():void => {
        let book : IBook = { 
            bookType: this.state.bookType,
            currencyId: this.state.currencyId,
            coinId: this.state.coinId,
            price: this.state.price,
            amount: this.state.amount,
        }

        this.props.onSendBook(book);
    }

    private handleCurrencyChange = (e:any):void => {
        this.setState({ currencyId: e.target.value }, () =>{
            this.props.onChangeBook({ 
                bookType: this.state.bookType,
                currencyId: this.state.currencyId,
                coinId: this.state.coinId,
                price: this.state.price,
                amount: this.state.amount,
            });
        });
    }

    private handleCoinChange = (e:any):void => {
        this.setState({ coinId: e.target.value }, ()=>{
            this.props.onChangeBook({ 
                bookType: this.state.bookType,
                currencyId: this.state.currencyId,
                coinId: this.state.coinId,
                price: this.state.price,
                amount: this.state.amount,
            });
        });
    }

    render(){
        return (
            <div className="col-xs-4 panel-body">
                <br />
                <label>Price: <input type="text" value={this.state.price} onChange={ e => this.setState({ price: e.target.value })} />
                <select value={this.state.currencyId} onChange={this.handleCurrencyChange}>
                    {this.props.coins.map((coin) => {
                        return <option key={coin.id} value={coin.id}>{coin.name}</option>
                    })}
                </select></label>
                <br />
                <label>Amount: <input type="text" value={this.state.amount} onChange={ e => this.setState({ amount: e.target.value })} />
                <select value={this.state.coinId} onChange={ this.handleCoinChange }>
                    {this.props.coins.map((coin) => {
                        return <option key={coin.id} value={coin.id}>{coin.name}</option>
                    })}
                </select></label>
                <br />
                <input type="radio" value={BookType.Buy} 
                    checked={this.state.bookType==BookType.Buy} 
                    onChange={e => this.setState({ bookType: e.target.value }) } /><label>buy</label>&nbsp;
                <input type="radio" value={BookType.Sell} 
                    checked={this.state.bookType==BookType.Sell} 
                    onChange={e => this.setState({ bookType: e.target.value }) } /><label>sell</label>&nbsp;
                <button onClick={e => this.bookSendHandler()}>Send</button>
            </div>
        )
    }
}