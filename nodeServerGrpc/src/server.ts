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

const accumulate = (data: number[]) => {
    return (data || []).reduce((a, b) => Number(a) + Number(b));
}

// @ts-ignore
server.addService(appProto.app.AppController.service, {
    accumulate: (numberArray, callback) => {
        const response = accumulate(numberArray.request.data)

        callback(null, { sum: response });
    },
});

server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:50051");
server.start();
