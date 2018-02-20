export enum BookType {
    Buy = 1,
    Sell
}

export interface IBook {
    bookType: BookType;
    currencyId: number;
    coinId: number;
    price: number;
    amount: number;
    
};

export interface ICoin {
    id: number;
    name: string;
}

export interface IBookSummaryModel {
    bookType: BookType;
    currencyId: number;
    coinId: number;
    price: number;
    amount: number;
}
