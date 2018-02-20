import * as React from 'react';
import { HubConnection } from '@aspnet/signalr-client';
import { RouteComponentProps } from 'react-router';
import { ICoin, BookType, IBook, IBookSummaryModel } from "./BookListType";
import { BookListForm } from "./BookListForm";
import { BookListRows } from "./BookListRows";
import { BookListRow } from "./BookListRow";
import update from "react-addons-update";

interface BookListState {
    coins: ICoin[];
    currency: ICoin;
    coin: ICoin;
    buys: IBook[];
    sells: IBook[];
    book: IBook;
    hubConnection: HubConnection;
}

export class BookList extends React.Component<RouteComponentProps<{}>, BookListState>{
    constructor() {
        super();

        this.state = {
            coins: [],
            currency: { id:0, name: '' },
            coin: { id:0, name: '' },
            buys: [],
            sells: [],
            book: { bookType: BookType.Buy, currencyId: 1, coinId: 2,price: 0, amount: 0 },
            hubConnection: new HubConnection('http://localhost:59389/book')
        }
    }

    // life cycle method
    componentDidMount() {
        // connect hub
        this.state.hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection :('));

        this.getCoins();
        this.getAllBooks();
        
        this.state.hubConnection
            .on('updateBook', (book: IBook) => {
                this.addBook(book);
                console.log(book);  
            });
    }

    // set recieved book
    private addBook = (book: IBook): void => {

        const maxLength = 5;
        let deleteCount = 0;

        if(book.currencyId !== this.state.currency.id || book.coinId !== this.state.coin.id)
            return;

        if (book.bookType == BookType.Buy) {

            let index = this.state.buys.findIndex(x => x.price === book.price);
            //console.log(ticker);
            if (index >= 0) {
                this.setState({
                    buys: update(
                        this.state.buys, {
                            [index]: {
                                price: { $set: book.price },
                                amount: { $set: book.amount },
                            }
                        }
                    )
                })
            } else {
                
                let min = Math.min.apply(Math, this.state.buys.map((o) => { return o.price; }));
                deleteCount = this.state.buys.length - maxLength >= 0 ? 1 : 0;
                
                if (deleteCount > 0 && book.price < min)
                return ;

                index = this.state.buys.findIndex(x => x.price == min);
                this.setState({
                    buys: update(
                        this.state.buys, {
                            $splice: [[index, deleteCount, book]]
                        }
                    )
                });

                this.setState({buys: this.state.buys.sort((a:IBook, b:IBook) => {
                    return b.price - a.price;
                })});
            }
        }
        else {
            let index = this.state.sells.findIndex(x => x.price === book.price);
            //console.log(ticker);
            if (index >= 0) {
                this.setState({
                    sells: update(
                        this.state.sells, {
                            [index]: {
                                price: { $set: book.price },
                                amount: { $set: book.amount },
                            }
                        }
                    )
                })

            } else {
                let max = Math.max.apply(Math, this.state.sells.map((o) => { return o.price; }));
                deleteCount = this.state.sells.length - maxLength >= 0 ? 1 : 0;

                if (deleteCount > 0 && book.price > max)
                    return ;

                index = this.state.sells.findIndex(x => x.price == max);
                this.setState({
                    sells: update(
                        this.state.sells, {
                            $splice: [[index, deleteCount, book]]
                        }
                    )
                });
                this.setState({sells: this.state.sells.sort((a:IBook, b:IBook) => {
                    return b.price - a.price;
                })});
            }
        }
    }

    private getAllBooks = () => {
        this.getBooks(BookType.Buy);
        this.getBooks(BookType.Sell);
    }

    // get books from api
    private getBooks = (bookType:BookType) => {
        const currencyId = this.state.book.currencyId;
        const coinId = this.state.book.coinId;

        fetch(`http://localhost:59389/api/book/summary?booktype=${bookType}&currencyId=${currencyId}&coinId=${coinId}`)
            .then(response => response.json() as Promise<IBook[]>)
            .then(data => {
                if(bookType === BookType.Buy){
                    this.setState({buys: data.sort((a:IBook, b:IBook) => {
                        return b.price - a.price;
                    }).slice(0,5)});
                }
                else{
                    this.setState({sells: data.sort((a:IBook, b:IBook) => {
                        return b.price - a.price;
                    }).slice(5)});
                }
            });
    }

    // get coins from api
    private getCoins = () => {
        fetch('http://localhost:59389/api/coin/all')
            .then(response => response.json() as Promise<ICoin[]>)
            .then(data => {
                this.setState({coins:data, currency:data[0], coin:data[1]});
            })
    };

    // set order form
    private bookSelectedHandler = (book: IBook): void => {
        // todo : set form
        this.setState({ book: book }, () => {
            //console.log(`selected: ${this.state.book}`);
        });
    }

    // post new book
    private bookSendedHandler = (book: IBook): void => {
        // remove update book method and call book post api
        this.setState({ book: book }, () => {
            const postData = {
                bookType: book.bookType,
                currencyId: book.currencyId,
                coinId: book.coinId,
                price: book.price,
                amount: book.amount,
                stock: book.amount,
                customerId: book.bookType === BookType.Buy ? 'edde753c-1382-40df-991d-0545dcb6176d' : '675df4e0-df67-4c8c-a6b4-3e959a7b5aec'
            };

            fetch('http://localhost:59389/api/book', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'Access-Control-Allow-Origin':'*'
                },
                method: 'post', 
                mode: 'cors',
                body: JSON.stringify(postData) 
            })
            .then(response => response.json() as Promise<IBook>)
            .then(data => console.log(data))
            .catch(err => console.log(err));
        });
    }

    private bookChangedHandler = (book:IBook):void =>{
        console.log(book);
        this.setState({book: book}, () => this.getAllBooks());
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <BookListForm onSendBook={this.bookSendedHandler} onChangeBook={this.bookChangedHandler} book={this.state.book} coins={this.state.coins} />
                    <div className="col-xs-7">
                        <div className="row">
                            <div className="col-xs-3"><span>Price</span></div>
                            <div className="col-xs-3"><span>Amount</span></div>
                            <div className="col-xs-1"><span></span></div>
                        </div>
                        <BookListRows books= {this.state.sells} bookSelectedHandler={this.bookSelectedHandler} />
                        <div className="row" ><hr className="col-xs-7" /></div>
                        <BookListRows books= {this.state.buys} bookSelectedHandler={this.bookSelectedHandler} />
                    </div>
                </div>
            </div>
        );
    }
}

