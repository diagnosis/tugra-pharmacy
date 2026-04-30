package main

import (
	"fmt"

	"github.com/diagnosis/go-toolkit/secure"
)

func main() {
	h, _ := secure.HashPassword("Antalya1234")
	fmt.Println(h)
}
