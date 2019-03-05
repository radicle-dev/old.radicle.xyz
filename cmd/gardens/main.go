package main

import (
	"bufio"
	"bytes"
	"flag"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"unicode/utf8"
)

var grasChars = []byte{'"', '.', ',', '\''}

type ctx struct {
	Gardens []string
}

func main() {
	var (
		gardensDir = flag.String("gardens.dir", "cmd/gardens/fixture", "Direcotry of gardens files")
	)
	flag.Parse()

	files, err := ioutil.ReadDir(*gardensDir)
	if err != nil {
		log.Fatal(err)
	}

	sort.Slice(files, func(i, j int) bool {
		return files[i].ModTime().Unix() < files[j].ModTime().Unix()
	})

	gardens := []string{}

	for _, f := range files {
		// if f.Size() > 168 {
		// 	continue
		// }

		if filepath.Ext(f.Name()) != ".txt" {
			continue
		}

		path := filepath.Join(*gardensDir, f.Name())
		buf, err := ioutil.ReadFile(path)
		if err != nil {
			log.Fatal(err)
		}

		isValid, err := isValidGarden(buf)
		if err != nil {
			log.Fatal(err)
		}
		if !isValid {
			continue
		}

		gardens = append(gardens, string(buf))
	}

	l := len(gardens)

	for i := 0; i < l; i++ {
		gardens = append(gardens, field)
	}

	t := template.Must(template.New("gardens").Parse(tpl))
	if err := t.ExecuteTemplate(os.Stdout, "index", gardens); err != nil {
		log.Fatal(err)
	}
}

const field = `x------------------x
\                  \
/                  /
\                  \
/                  /
\                  \
/                  /
x------------------x`

const tpl = `{{- define "index" }}<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Radicle</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      type="text/css"
      media="screen"
      href="css/styles.css"
    />
    <link rel="stylesheet" type="text/css" href="css/asciinema-player.css" />
    <link
      rel="stylesheet"
      type="text/css"
      href="css/asciinema-theme-blue.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="css/asciinema-theme-white.css"
    />
  </head>
  <body>
	<div class="gardens-content">
	{{- range . }}
		{{- template "garden" .}}
	{{- end }}
	</div>
  </body>
</html>
{{- end}}

{{- define "garden" }}
<pre>{{ . }}</pre>
{{- end }}
`

func isValidGarden(content []byte) (bool, error) {
	var (
		r     = bufio.NewReader(bytes.NewReader(content))
		valid = true
		lines = 0
	)

	for {
		if lines > 8 {
			valid = false
			break
		}

		line, _, err := r.ReadLine()
		if err != nil {
			if err == io.EOF {
				break
			}
			return false, err
		}

		if utf8.RuneCountInString(string(line)) > 20 {
			valid = false
			break
		}

		lines += 1
	}

	return valid, nil
}
