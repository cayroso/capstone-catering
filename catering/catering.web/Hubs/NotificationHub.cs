using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace catering.web.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendMessage(MessageInfo info)
        {
            await Clients.User(info.ReceiverId).SendAsync("OnReceiveMessage", info.MessageType, info.Title, info.Content);
        }
    }


    public class MessageInfo
    {
        public string ReceiverId { get; set; }
        public string MessageType { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
