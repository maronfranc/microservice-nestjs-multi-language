import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";

const PROTO_PATH = __dirname + "/app.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const appProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

interface ISendData {
    sum: number
}

interface IData {
    data: number[];
}   

const accumulate = (data: number[]): number => (data || []).reduce((a, b) => Number(a) + Number(b), 0);

// @ts-ignore
server.addService(appProto.app.AppController.service, {
    accumulate: (serverCall: grpc.ServerUnaryCall<IData>, callback: grpc.sendUnaryData<ISendData>) => {
        console.log("Received: ", serverCall.request.data);
        const response = accumulate(serverCall.request.data)
        console.log("Sending: ", response);
        callback(null, { sum: response });
    },
});

server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
