import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { HubConnection } from '@aspnet/signalr-client';

interface ChatState {
    nick: string | null,
    message: string,
    messages: string[],
    hubConnection: HubConnection,
}

export class Chat extends React.Component<RouteComponentProps<{}>, ChatState>{

    constructor(props: any) {
        super(props);

        this.state = {
            nick: '',
            message: '',
            messages: [],
            hubConnection: new HubConnection('/chat'),
        };
    }

    componentDidMount() {
        const nick = window.prompt('Your name:', 'John');

        //const hubConnection = new HubConnection('/chat');

        this.setState({ nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));
        });

        this.state.hubConnection
            .on('sendToAll', (nick, receivedMessage) => {
                const text = `${nick}: ${receivedMessage}`;
                const messages = this.state.messages.concat([text]);
                this.setState({ messages });
            });
    }

    sendMessage = () => {
        this.state.hubConnection
            .invoke('sendToAll', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({ message: '' });
    };

    render() {
        return (
            <div>
                <br />
                <input
                    type="text"
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                />

                <button onClick={this.sendMessage}>Send</button>

                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: 'block' }} key={index}> {message} </span>
                    ))}
                </div>
            </div>
        );
    }
}