package main

import (
	"fmt"
	"log"
	"time"

	"github.com/fatih/color"
	"golang.org/x/net/context"
	"google.golang.org/grpc"

	calculator "./calculator"
)

const server = "0.0.0.0:50051"

var (
	green = color.New(color.FgGreen).SprintFunc()
	red   = color.New(color.FgRed).SprintFunc()
)

func main() {
	fmt.Println("Connecting to server on:", server)

	connection, err := grpc.Dial(server, grpc.WithInsecure())
	if err != nil {
		log.Fatalln("Can't connect to server:", err)
	}
	defer connection.Close()

	i := calculator.NewOperationsClient(connection)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	// Array of float64 to call the Operations in JS
	input := [2]float64{8, 7}

	operations := map[string]func(context.Context, *calculator.Request, ...grpc.CallOption) (*calculator.Response, error){
		"addition":       i.Addition,
		"subtraction":    i.Subtraction,
		"multiplication": i.Multiplication,
		"division":       i.Division,
	}

	for name, operationFunc := range operations {
		operation, err := operationFunc(ctx, &calculator.Request{
			OperatorOne: input[0],
			OperatorTwo: input[1],
		})
		if err != nil {
			log.Println(err)
		}

		fmt.Printf("The %s of %s and %s results in: %s\n", green(name), green(input[0]), green(input[1]), green(operation.Result))
	}
}
