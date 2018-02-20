using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace react01 
{
    public class Chat : Hub
    {
        public async Task SendToAll(string name, string message)
        {
            await Clients.All.InvokeAsync("sendToAll", name, message);
        }
    }
}
