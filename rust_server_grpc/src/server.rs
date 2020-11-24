use tonic::{transport::Server, Request, Response, Status};
mod fibonacci {
    tonic::include_proto!("fibonacci");
}
use fibonacci::fibonacci_service_server::{FibonacciService, FibonacciServiceServer};
use fibonacci::{FibonacciResponse, NumberRequest};

fn calc_fibonacci(n: u32) -> u32 {
    match n {
        0 => 1,
        1 => 1,
        _ => calc_fibonacci(n - 1) + calc_fibonacci(n - 2),
    }
}

#[derive(Default)]
pub struct MyFibonacciService {}

#[tonic::async_trait]
impl FibonacciService for MyFibonacciService {
    async fn calc(
        &self,
        request: Request<NumberRequest>,
    ) -> Result<Response<FibonacciResponse>, Status> {
        let n: u32 = request.get_ref().number;

        Ok(Response::new(FibonacciResponse {
            fibonacci: calc_fibonacci(n),
        }))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "127.0.0.1:50053".parse().unwrap();
    println!("Server listening on {}", addr);
    let my_app = MyFibonacciService::default();
    Server::builder()
        .add_service(FibonacciServiceServer::new(my_app))
        .serve(addr)
        .await?;
    Ok(())
}
