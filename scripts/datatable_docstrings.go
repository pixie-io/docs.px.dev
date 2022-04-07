package main

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"sort"
	"strings"
)

type TableDescRow struct {
	Name string `json:"table_name"`
	Desc string `json:"table_desc"`
}

type TableSchemaRow struct {
	Table   string `json:"table_name"`
	Name    string `json:"column_name"`
	Type    string `json:"column_type"`
	Pattern string `json:"pattern_type"`
	Desc    string `json:"column_desc"`
}

type DataTable struct {
	Name string
	Desc string
	Cols []Column
}

type Column struct {
	Name    string
	Type    string
	Pattern string
	Desc    string
}

type Message struct {
	datatablesDocs []DataTable
}

func main() {
	f, err := os.Open("./schemas.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// The order of the px/schema output is not guaranteed.
	// So we read all the lines first before processing them.
	var table_lines []string
	var col_lines []string
	var l string

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		l = scanner.Text()
		if strings.Contains(l, "Table Descriptions") {
			table_lines = append(table_lines, l)
		} else if strings.Contains(l, "Table Schema") {
			col_lines = append(col_lines, l)
		} else {
			log.Fatal("Unrecognized line in schemas.txt")
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	var td TableDescRow
	var ts TableSchemaRow
	var table DataTable
	var col Column
	tables := []DataTable{}

	for _, l := range table_lines {
		json.Unmarshal([]byte(l), &td)
		table = DataTable{Name: td.Name, Desc: td.Desc, Cols: []Column{}}
		tables = append(tables, table)
	}

	for _, l := range col_lines {
		json.Unmarshal([]byte(l), &ts)
		for i := range tables {
			if tables[i].Name == string(ts.Table) {
				col = Column{Name: ts.Name, Type: ts.Type, Pattern: ts.Pattern, Desc: ts.Desc}
				tables[i].Cols = append(tables[i].Cols, col)
			}
		}
	}

	// Sort tables in alphabetical order.
	sort.Slice(tables[:], func(i, j int) bool {
		return tables[i].Name < tables[j].Name
	})

	//out := Message{datatablesDocs: tables}
	//fmt.Println(out)
	file, _ := json.MarshalIndent(tables, "", " ")
	_ = ioutil.WriteFile("../external/datatable_documentation.json", file, 0644)
}
