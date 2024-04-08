import React, { PropsWithChildren } from "react";
import { Button } from "../../../atoms/button";
import { Paper } from "../../../atoms/paper";
import { Link } from "react-router-dom";

interface UnderConstructionProps {}

export const UnderConstruction = (
  _props: PropsWithChildren<UnderConstructionProps>
) => {
  return (
    <div className="flex w-full items-center justify-center px-4">
      <Paper className="my-8 max-w-lg py-4 px-6">
        <div className="text-md font-display font-semibold md:text-2xl">
          This page is under construction.
        </div>
        <Link to="/">
          <Button className="mt-2 w-fit text-sm">Go Home</Button>
        </Link>
      </Paper>
    </div>
  );
};
