import React from "react";

interface TableProps {
  heading: string;
  data: Record<string, any>[]; // An array of objects
  vertical?: boolean; // New prop to enable vertical rendering
}

const DataTable: React.FC<TableProps> = ({ heading, data, vertical }) => {
  if (!data || data?.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">{heading}</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const tableHeaders = Object.keys(data[0] || {});

  return (
    <div className="mb-6 min-w-[80%] max-w-[80%]">
      <h3 className="text-lg font-bold mb-2">{heading}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          {vertical ? (
            <>
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Key
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableHeaders.map((key) => (
                  <tr key={key}>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {key}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-left">
                      {typeof data[0][key] === "object"
                        ? JSON.stringify(data[0][key], null, 2)
                        : data[0][key]?.toString() || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((key, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {typeof row[key] === "object"
                          ? JSON.stringify(row[key], null, 2)
                          : row[key]?.toString() || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default DataTable;
