This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Run the server

- Install Node.js (v20.12.2 recomanded)

```bash
# Check if Node.js is installed
$ node -v
v20.12.2
```

- Install Node.js libraries

```bash
$ cd <repo-dir>
$ npm i
```

- Run

```bash
$ npm run build
$ npm run start
```


### Open test web pages

Open [http://localhost:3000](http://localhost:3000) with your browser to see the test pages (sender or receiver).


### Sender : Send the number data into a room

Request the following HTTP GET request to the server (:3000)
```
GET /api/sendNumber?room=<room-name>&data=<number>
```

### Receiver : Join a room

- Connect to `ws://localhost:3001`

- Send the following JSON text
```json
{
    "type": "moveToRoom",
    "roomId": "<room-name-to-join>"
}
```

- Listen the following JSON text
```json
{
    "type": "numData",
    "data": 7 
}
```

## Receiver Example ESP32

See [esp32/README.md](https://github.com/kimhono97/oh_socket/blob/main/esp32/README.md)


## Learn More Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
