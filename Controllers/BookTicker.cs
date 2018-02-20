using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace react01 
{
    public class BookTicker : Hub<IBookHub>
    {
        //static HttpClient client = new HttpClient();
        public async Task AddBook(Book book)
        {
            await Clients.All.AddBook(book);
        }

        // flow : post to api => update booklist => response result
        // private async Task<string> CreateBook(string book)
        // {
        //     HttpResponseMessage response = await client.PostAsync("baseUrl/api/book", new StringContent(book, Encoding.UTF8, "application/json"));
        //     response.EnsureSuccessStatusCode();
        //     return await response.Content.ReadAsStringAsync();
        // }
    }                                                                                                                                                                             

    public interface IBookHub{
        Task AddBook(Book book);
    }

    public interface IBook
    {
        decimal Price { get; set; }
        decimal Amount { get; set; }
        BookType BookType { get; set; }
    }

    public class Book {
        public decimal Price {get;set;}
        public decimal Amount {get;set;}
        public BookType BookType {get;set;}
    }

    public enum BookType{
        Buy = 1,
        Sell,
    }
}