# Multi language Nestjs microservices

## Requirements
- yarn | npm
- python3
- grpc_tools
- cargo
- docker
- golang

## Install
```
cd ./nestjsClientGrpc
yarn
cd ../nodeServerGrpc
yarn
```

## Generate python proto file
```
python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. proto/log.proto;
```

## Steps
- Start nestjs:
```
# Terminal 1
yarn --cwd ./nestjsClientGrpc start
# or
cd ./nestjsClientGrpc
yarn start
```

- Start node server:
```
# Terminal 2
yarn --cwd ./nodeServerGrpc start
# or
cd ./nodeServerGrpc
yarn start
```

- Start python server:
```
# Terminal 3
python3 ./python_grpc/server.py
```

- Start rust server:
```
# Terminal 4
cd rust_server_grpc
cargo run --bin server
```
- Run rabbitmq container:
```
# Terminal 5
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```
- Start golang worker:
```
# Terminal 6
cd go-rabbitmq
go run worker.go; 
```

## POST request
```
curl --request POST \
--url localhost:3001/add?querystring=query-data \
--header 'content-type: application/json' \
--data '{"data": [1,2,3,5,8]}'
```

## POST rust server
```
curl --request POST \
--url localhost:3001/fibonacci \
--header 'content-type: application/json' \
--data '{"number": 7}'
```