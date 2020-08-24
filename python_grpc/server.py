import grpc
from concurrent import futures
import time

from proto import log_pb2
from proto import log_pb2_grpc

import log_service

class LogControllerServicer(log_pb2_grpc.LogControllerServicer):

    def SaveLog(self, request, context):
        response = log_pb2.ReturnMessage()
        response.msg = log_service.saveLog(request)
        print(response)
        return response


server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

log_pb2_grpc.add_LogControllerServicer_to_server(
        LogControllerServicer(), server)

print('Starting server. Listening on port 50052.')
server.add_insecure_port('[::]:50052')
server.start()

# since server.start() will not block,
# a sleep-loop is added to keep alive
try:
    while True:
        time.sleep(86400)
except KeyboardInterrupt:
    server.stop(0)