import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Pagination from "@material-ui/lab/Pagination";
import React, { Fragment, useEffect, useState } from "react";
import StringUtils from "../utils/StringConvert";
import IconApp from "../common/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getColorCell } from "../common/colors";
import { grey } from "@material-ui/core/colors";

const StyledTableCell = withStyles((theme) => ({
  root: {
    border: `1px solid ${grey[300]}`,
  },
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  body: {
    fontSize: 14,
    textAlign: "center",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyle = makeStyles((theme) => ({
  box: {},
}));

const MTableMaterial = ({
  dataSource,
  fieldArray,
  addControlColumns,
  rowsPerPage,
  showSearch,
  addControlFirst,
  refresh,
  askAll,
  showIndex,
  multiColor,
}) => {
  const [state, setState] = useState({
    renderControl: null,
    percentW: 0,
    page: 1,
    dataShow: [],
    emptyRows: 0,
    count: 1,
    additionalFields: [],
    search: "",
    listComponentBody: [],
  });

  useEffect(() => {
    var additionalFields = [];
    if (addControlColumns) {
      addControlColumns.forEach((item) => {
        additionalFields.push(item.name);
      });
    }
    var colIndex = showIndex ? 1 : 0;
    var sumCols = additionalFields.length + fieldArray.length + colIndex;
    var w = Math.round(100 / sumCols);
    setState((pre) => ({
      ...pre,
      additionalFields: additionalFields,
      percentW: w,
    }));
  }, [addControlColumns, fieldArray, showIndex]);

  //pagination
  useEffect(() => {
    var mPerPage = rowsPerPage ? rowsPerPage : dataSource.length;
    var startIndex = (state.page - 1) * mPerPage;
    var endIndex = state.page * mPerPage;
    var dataFilter = dataSource.filter((item) => {
      if (state.search === "") return true;
      return fieldArray.find((f) => {
        return item[f].toUpperCase().includes(state.search.toUpperCase());
      });
    });
    var count = Math.ceil(dataFilter.length / rowsPerPage);
    var mDataShow = dataFilter.slice(startIndex, endIndex);

    setState((pre) => ({
      ...pre,
      dataShow: mDataShow,
      count: count,
    }));
  }, [dataSource, fieldArray, rowsPerPage, state.page, state.search]);

  const renderControl = (user, index) => {
    return addControlColumns.map((item, index) => item.component(user, index));
  };

  const handleChangePage = (e, newPage) => {
    setState((pre) => ({
      ...pre,
      page: newPage,
    }));
  };

  const handleChangeText = (e) => {
    setState((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Grid container spacing={2} direction="column">
        {/* Utils Bar */}
        <Grid item lg={12} md={12} sm={12}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid
              item
              lg={3}
              sm={refresh ? 10 : 12}
              xs={refresh ? 10 : 12}
              md={6}
              style={{ display: "flex" }}
            >
              {showSearch && (
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  name="search"
                  fullWidth
                  value={state.search}
                  onChange={handleChangeText}
                  label="Search"
                  variant="outlined"
                  holder="search"
                />
              )}
            </Grid>
            {refresh && (
              <Grid
                onClick={() => {
                  refresh();
                }}
                item
                style={{ display: "flex ", flexGrow: 2 }}
              >
                <IconButton color="secondary" variant="contained">
                  <FontAwesomeIcon icon={IconApp.SYNC} />
                </IconButton>
              </Grid>
            )}

            {askAll && (
              <Grid
                onClick={() => {
                  askAll();
                }}
                item
              >
                <Button color="secondary" variant="contained">
                  Ack all
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* table */}
      {/* <Grid item> */}
      <Box mt={2} overflow="auto">
        <Table style={{ border: "1px rgba(0,0,0,0.4) solid" }}>
          <TableHead>
            <StyledTableRow>
              {showIndex && (
                <StyledTableCell width={`${state.percentW}%`}>
                  #
                </StyledTableCell>
              )}
              {addControlFirst &&
                addControlFirst &&
                state.additionalFields &&
                state.additionalFields.map((field) => (
                  <StyledTableCell width={`${state.percentW}%`} key={field}>
                    {StringUtils.convertCamelToTextNormal(field)}
                  </StyledTableCell>
                ))}

              {fieldArray.map((item) => (
                <StyledTableCell width={`${state.percentW}%`} key={item}>
                  {StringUtils.convertCamelToTextNormal(item)}
                </StyledTableCell>
              ))}

              {!addControlFirst &&
                state.additionalFields &&
                state.additionalFields.map((item) => (
                  <StyledTableCell width={`${state.percentW}%`} key={item}>
                    {StringUtils.convertCamelToTextNormal(item)}
                  </StyledTableCell>
                ))}
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {state.dataShow &&
              state.dataShow.map((dataRow, index) => (
                <StyledTableRow
                  key={index}
                  style={{
                    backgroundColor: multiColor
                      ? getColorCell(dataRow.name)
                      : "white",
                  }}
                >
                  {showIndex && (
                    <StyledTableCell width={`${state.percentW}%`}>
                      {index + 1}
                    </StyledTableCell>
                  )}
                  {addControlFirst &&
                    state.additionalFields.map((f, index) => (
                      <StyledTableCell key={index}>
                        <Box
                          justifyContent="space-between"
                          alignContent="center"
                          alignItems="center"
                          display="flex"
                          flexDirection="row"
                          alignSelf="center"
                        >
                          {renderControl(dataRow)}
                        </Box>
                      </StyledTableCell>
                    ))}
                  {fieldArray.map((f) => (
                    <StyledTableCell size="small" key={f}>
                      {dataRow[f]}
                    </StyledTableCell>
                  ))}
                  {!addControlFirst &&
                    state.additionalFields &&
                    state.additionalFields.map((f, index) => (
                      <StyledTableCell key={index}>
                        <Box
                          justifyContent="space-between"
                          alignContent="center"
                          alignItems="center"
                          display="flex"
                          flexDirection="row"
                          alignSelf="center"
                        >
                          {renderControl(dataRow)}
                        </Box>
                      </StyledTableCell>
                    ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      {/* </Grid> */}

      {rowsPerPage && (
        <Box m={2}>
          <Pagination
            size="large"
            color="secondary"
            count={state.count}
            onChange={handleChangePage}
            variant="text"
          />
        </Box>
      )}
    </>
  );
};

export default MTableMaterial;
