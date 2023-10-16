// support the http imports we need (but look them up from node_modules)

declare module "https://esm.sh/react@18.2.0" {
  import React from "react";

  export = React;
}

declare module "https://esm.sh/react-dom@18.2.0/client" {
  export * from "react-dom/client";
}
