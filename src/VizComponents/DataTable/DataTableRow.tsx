import * as React from "react";

import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/system";

const SubList = styled("ul")(() => ({
  listStyle: "none",
}));

const SubListItem = styled("li")(() => ({
  fontSize: "0.75rem",
  lineHeight: 1,
}));

interface DataTableRowProps {
  record: any;
  ix: number;
}
const DataTableRow = (props: DataTableRowProps) => {
  const { record } = props;
  return (
    <>
      {Object.values(record).map((v: any) =>
        Array.isArray(v) ? (
          <TableCell>
            <SubList>
              {v.map((s: any) => (
                <SubListItem>{JSON.stringify(s, null, 2)}</SubListItem>
              ))}
            </SubList>
          </TableCell>
        ) : (
          <TableCell>{v}</TableCell>
        )
      )}
    </>
  );
};

export default React.memo(DataTableRow);
