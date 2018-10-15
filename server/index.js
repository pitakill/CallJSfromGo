const PROTO = `${__dirname}/../calculator.proto`
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(
  PROTO,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
)

const address = '0.0.0.0:50051'

const calculator = grpc.loadPackageDefinition(packageDefinition).calculator

function Addition(call, callback) {
  const {operator_one, operator_two} = call.request
  const result = operator_one + operator_two
  console.log(`The addition input is: ${operator_one} and ${operator_two} results in ${result}`)
  callback(null, {result})
}

function Subtraction(call, callback) {
  const {operator_one, operator_two} = call.request
  const result = operator_one - operator_two
  console.log(`The subtraction input is: ${operator_one} and ${operator_two} results in ${result}`)
  callback(null, {result})
}

function Multiplication(call, callback) {
  const {operator_one, operator_two} = call.request
  const result = operator_one / operator_two
  console.log(`The multiplication input is: ${operator_one} and ${operator_two} results in ${result}`)
  callback(null, {result})
}

function Division(call, callback) {
  const {operator_one, operator_two} = call.request
  const result = operator_one / operator_two
  console.log(`The division input is: ${operator_one} and ${operator_two} results in ${result}`)
  callback(null, {result})
}

function main() {
  const server = new grpc.Server()
  server.addService(calculator.Operations.service, {
    Addition,
    Subtraction,
    Multiplication,
    Division
  })
  server.bind(address, grpc.ServerCredentials.createInsecure())
  server.start()
  console.log("Init gRPC server on:", address)
}

main()
