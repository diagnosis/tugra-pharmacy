package helper

import (
	"encoding/json"
	"net/http"

	"github.com/diagnosis/go-toolkit/errors"
)

func ParseReq(r *http.Request, req any) error {
	r.Body = http.MaxBytesReader(nil, r.Body, 1<<20)
	defer r.Body.Close()

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(req); err != nil {
		return errors.BadRequest("invalid request body", "json decode error", err)
	}
	return nil
}
