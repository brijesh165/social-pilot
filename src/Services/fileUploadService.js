import importCsv from '../Config/importCsv';
import Papa from "papaparse";

class FileUploadService {

    // checks for mandatory fields 
    checkMandatoryFields = (header) => {
        let foundMandatoryColumns = true;
        if (importCsv.mandatoryColumnNameInCsv.length > 0) {
            foundMandatoryColumns =
                importCsv.mandatoryColumnNameInCsv.every((columnName) => {
                    return header.includes(columnName);
                });
        }
        if (!foundMandatoryColumns) {
            return {
                isError: true,
                message: "Incorrect/Missing mandatory columns. Please refer to the instructions for correct format."
            }
        }
        return foundMandatoryColumns;
    };

    // checks for any mandatory fields are empty
    checkIsCellFieldsEmpty = (row) => {
        let isCellBlank = false;

        const tableRowHead = row[0];
        const tableRowArr = row.slice(1);

        const indexes = [];
        if (tableRowArr.length > 0) {
            tableRowHead.map((head, index) => {
                if (importCsv.noEmptyFieldInColumns.includes(head))
                    indexes.push(index);
            });
        }
        if (indexes && indexes.length > 0) {
            tableRowArr.map((row, i) => {
                indexes.map((index) => {
                    if (row[index] === "") {
                        isCellBlank = true;
                    }
                });
            });
        }
        if (isCellBlank) {
            return {
                isError: true,
                message: "Uploaded CSV file contains empty field(s)."
            }
        }
        return isCellBlank;
    };

    // Map data according to header
    mapTableRow = (tableRow) => {
        const tableRowHead = tableRow[0];
        const tableRowArr = tableRow.slice(1);

        const bulkLeadPayload = [];

        tableRowArr.map((row) => {
            const singleLeadRow = [];

            tableRowHead.map((head, index) => {
                const leadField = {
                    Attribute: head,
                    Value: row[index] || "-",
                };
                singleLeadRow.push(leadField);
            });

            if (importCsv.injectExtraValues && importCsv.injectExtraValues.length > 0) {
                importCsv.injectExtraValues.map((field) => {
                    const key = Object.keys(field)[0];
                    const value = field[key];
                    singleLeadRow.push({
                        Attribute: key,
                        Value: value,
                    });
                });
            }
            bulkLeadPayload.push(singleLeadRow);
        });

        return bulkLeadPayload;
    };

    // return all the data from the file
    bulkUpload = async (payload, callBack) => {
        let tableRow;
        await Papa.parse(payload, {
            complete: async (results) => {
                tableRow =
                    results && results.data && results.data.length > 0
                        ? results.data
                        : [];
                if (
                    !(
                        tableRow &&
                        tableRow.length > 0 &&
                        tableRow[tableRow.length - 1].length > 1
                    )
                ) {
                    tableRow.pop();
                }

                if (
                    tableRow &&
                    tableRow.length >= importCsv.maxRowsAllowed + 2
                ) {
                    return {
                        isError: true,
                        message: `Maximum ${importCsv.maxRowsAllowed} rows are allowed.`
                    }
                }
                if (
                    tableRow &&
                    tableRow.length >= 2 &&
                    tableRow.length <= importCsv.maxRowsAllowed + 2
                ) {
                    if (this.checkMandatoryFields(tableRow[0]) && !this.checkIsCellFieldsEmpty(tableRow)) {
                        //bind data
                        const response = this.mapTableRow(tableRow);
                        callBack(response);
                    } else {
                        callBack({ isError: true, message: "Incorrect/Missing mandatory columns or Uploaded CSV file contains empty field(s)." })
                    }
                } else {
                    callBack({
                        isError: true,
                        message: "No record(s) found in the file!"
                    })
                }
            },
        });
    }
}

export default FileUploadService;